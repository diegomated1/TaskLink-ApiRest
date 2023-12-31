pipeline {
    agent{ 
        node {
            label 'docker-agent-node'
        }
    }
    triggers {
        GenericTrigger(
            genericVariables: [
                [key: 'ref', value: '$.ref']
            ],
            token: env.GIT_ACTION_TOKEN,

            silentResponse: false,

            shouldNotFlatten: false,

            regexpFilterText: '$ref',
            regexpFilterExpression: '^refs/heads/test'
        )
    }
    stages {
        stage('Build') {
            steps {
                echo "Building.."
                sh 'npm install jest supertest'
            }
        }
        stage('Test') {
            steps {
                echo "Testing.."
                sh 'npm test'
            }
        }
        stage('Merge') {
            steps {
                echo "Testing.."
                sshagent(credentials : ['GIT_SSH']) {
                    sh "git remote set-url origin git@github.com:diegomated1/TaskLink-ApiRest.git"
                    sh "git fetch origin main"
                    sh "git fetch origin test"
                    sh "git checkout -f main"
                    sh "git merge origin/test"
                    sh "git push origin main"
                }
            }
        }
        stage('Package') {
            steps {
                echo "Login.."
                withCredentials([usernamePassword(credentialsId: 'DOCKER_CREDENTIALS', passwordVariable: 'password', usernameVariable: 'username')]) {
                    sh "docker login -u $username -p $password"
                }
                echo "Building.."
                script {
                    def customImage = docker.build("diegomated1/tasklink-apirest:${env.BUILD_ID}")
                    customImage.push()
                }
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploy....'
                script {
                    def cmStop = "docker rm -f TaskLinkApiRest 2> /dev/null || true"
                    def cmRm = "docker stop -f TaskLinkApiRest 2> /dev/null || true"
                    def cmRun = "docker run --name TaskLinkApiRest -p 127.0.0.1:3000:${env.API_HTTP_PORT} --env ENVIRONMENT=production --env GOOGLE_API_ROUTE_URL=${env.GOOGLE_API_ROUTE_URL} --env GOOGLE_API_MAPS_URL=${env.GOOGLE_API_MAPS_URL} --env GOOGLE_API_KEY=${env.GOOGLE_API_KEY} --env API_HTTP_PORT=${env.API_HTTP_PORT} --env JWT_SECRET=${env.JWT_SECRET} --env POSTGRES_CONECTIONSTRING=${env.POSTGRES_CONECTIONSTRING} --restart=always -d diegomated1/tasklink-apirest:${env.BUILD_ID}"
                    sshagent(credentials : ['API_VM']) {
                        sh "ssh -o StrictHostKeyChecking=no azureuser@tasklink.eastus.cloudapp.azure.com uptime"
                        sh "ssh -v azureuser@tasklink.eastus.cloudapp.azure.com '${cmStop} && ${cmRm} && ${cmRun}'"
                    }
                }
            }
        }
    }
}