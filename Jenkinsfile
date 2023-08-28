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
                    sh "git remote set-url origin git@github.com:diegomated1/git@github.com:diegomated1/TaskLink-ApiRest.gitt"
                    sh "git fetch origin main"
                    sh "git fetch origin test"
                    sh "git checkout main"
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
                    def customImage = docker.build("diegomated1/TaskLinkApiRest:${env.BUILD_ID}")
                    customImage.push()
                }
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploy....'
                sshagent(credentials : ['API_VM']) {
                    sh "ssh -o StrictHostKeyChecking=no tasklink-admin@tasklink.bucaramanga.upb.edu.co uptime"
                    sh """
                        ssh -v tasklink-admin@tasklink.bucaramanga.upb.edu.co \
                        docker stop TaskLinkApiRest && \
                        docker rm TaskLinkApiRest && \
                        docker run --name TaskLinkApiRest -p 127.0.0.1:${env.API_HTTP_PORT}:${env.API_HTTP_PORT} --env ENVIORENT="production" --env API_HTTP_PORT=${env.API_HTTP_PORT} --env JWT_SECRET=${env.JWT_SECRET} --env POSTGRES_CONECTIONSTRING=${env.POSTGRES_CONECTIONSTRING} --restart=always -d diegomated1/TaskLinkApiRest:${env.BUILD_ID}
                    """
                }
            }
        }
    }
}