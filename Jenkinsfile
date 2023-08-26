pipeline {
    agent{ 
        node {
            label 'docker-agent-node'
        }
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
                    sh "git remote set-url origin git@github.com:diegomated1/test2.git"
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
                sshagent(credentials : ['SSH_MAIN_MACHINE']) {
                    sh "ssh -o StrictHostKeyChecking=no tasklink-admin@tasklink.bucaramanga.upb.edu.co uptime"
                    sh """
                        ssh -v tasklink-admin@tasklink.bucaramanga.upb.edu.co \
                        docker stop TaskLinkApiRest && \
                        docker rm TaskLinkApiRest && \
                        docker run --name TaskLinkApiRest -p 0.0.0.0:${env.API_HTTP_PORT}:${env.API_HTTP_PORT} --env ENVIORENT="production" --env API_HTTP_PORT=${env.API_HTTP_PORT} --env JWT_SECRET=${env.JWT_SECRET} --env POSTGRES_CONECTIONSTRING=${env.POSTGRES_CONECTIONSTRING} --restart=always -d diegomated1/TaskLinkApiRest:${env.BUILD_ID}
                    """
                }
            }
        }
    }
}