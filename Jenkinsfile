pipeline {
    options {
        skipDefaultCheckout()
    }

    agent {
        kubernetes {
            yaml """
apiVersion: v1
kind: Pod
metadata:
  labels:
    app: jenkins-kaniko
spec:
  containers:
  - name: git
    image: alpine/git:latest
    command: ['sleep']
    args: ['infinity']
    resources:
      requests:
        cpu: "100m"
        memory: "128Mi"
      limits:
        cpu: "500m"
        memory: "1024Mi"
    volumeMounts:
    - mountPath: "/home/jenkins/agent"
      name: workspace-volume

  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    command: ['sleep']
    args: ['infinity']
    resources:
      requests:
        cpu: "500m"
        memory: "512Mi"
      limits:
        cpu: "4000m"
        memory: "4096Mi"
    volumeMounts:
    - mountPath: "/kaniko/.docker"
      name: docker-config
    - mountPath: "/home/jenkins/agent"
      name: workspace-volume

  volumes:
  - name: docker-config
    secret:
      secretName: harbor-secret
      items:
      - key: .dockerconfigjson
        path: config.json
  - name: workspace-volume
    emptyDir: {}
"""
        }
    }

    environment {
        HARBOR_HOST = "harbor.example.com:31443"
        HARBOR_IMAGE = "${HARBOR_HOST}/guardians/frontend"
    }

    stages {
        stage('Notify Start') {
            steps {
                script {
                    slackSend color: '#439FE0', message: ":rocket: *Frontend Build Started* for `${env.JOB_NAME}` <${env.BUILD_URL}|#${env.BUILD_NUMBER}>"
                }
            }
        }

        stage('Checkout') {
            steps {
                container('git') {
                    checkout scm
                    script {
                        sh "git config --global --add safe.directory ${env.WORKSPACE}"
                        IMAGE_TAG = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                        FULL_IMAGE = "${HARBOR_IMAGE}:${IMAGE_TAG}"
                        DEPLOY_PATH = env.BRANCH_NAME == "main" ?
                            "cloud-cluster/frontend/deployment.yaml" :
                            "cloud-cluster/frontend/deployment-dev.yaml"
                        VITE_API_BASE_URL = env.BRANCH_NAME == "main" ?
                            "https://bee-guardians.com" :
                            "https://dev.bee-guardians.com"
                        echo "Docker Image Tag: ${IMAGE_TAG}"
                        echo "Deployment YAML Path: ${DEPLOY_PATH}"
                        echo "VITE_API_BASE_URL: ${VITE_API_BASE_URL}"
                    }
                }
            }
        }

        stage('Inject .env') {
            steps {
                container('kaniko') {
                    script {
                        sh """
                        echo "[INFO] Injecting .env"
                        echo "VITE_API_BASE_URL=${VITE_API_BASE_URL}" > \$WORKSPACE/guardians/.env
                        """
                    }
                }
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                container('kaniko') {
                    sh """
                    echo "[START] Kaniko Build & Push"
                    /kaniko/executor \
                      --context=$WORKSPACE/guardians \
                      --dockerfile=$WORKSPACE/guardians/Dockerfile \
                      --destination=${FULL_IMAGE} \
                      --insecure \
                      --skip-tls-verify \
                      --push-retry=3
                    echo "[SUCCESS] Docker Image pushed to ${FULL_IMAGE}"
                    """
                }
            }
        }

        stage('Update Deployment YAML in Infra Repo') {
            steps {
                container('git') {
                    withCredentials([usernamePassword(
                        credentialsId: 'github-token',
                        usernameVariable: 'GIT_USER',
                        passwordVariable: 'GIT_TOKEN'
                    )]) {
                        sh """
                        echo "[CLONE] Guardians-Infra"
                        git clone --single-branch --branch dev-v2 https://${GIT_USER}:${GIT_TOKEN}@github.com/BeeGuardians/Guardians-Infra.git infra

                        echo "[PATCH] Updating frontend deployment.yaml image tag"
                        sed -i "s|image: .*|image: ${FULL_IMAGE}|" infra/${DEPLOY_PATH}

                        cd infra
                        git config user.email "ci-bot@example.com"
                        git config user.name "CI Bot"
                        git add ${DEPLOY_PATH}
                        git commit -m "release : update frontend image to guardians/frontend:${IMAGE_TAG}" || echo "No changes to commit"
                        git push https://${GIT_USER}:${GIT_TOKEN}@github.com/BeeGuardians/Guardians-Infra.git dev-v2
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            slackSend color: 'good', message: ":white_check_mark: *Frontend Build Success* for `${env.JOB_NAME}` <${env.BUILD_URL}|#${env.BUILD_NUMBER}> :tada:"
        }
        failure {
            slackSend color: 'danger', message: ":x: *Frontend Build Failed* for `${env.JOB_NAME}` <${env.BUILD_URL}|#${env.BUILD_NUMBER}>"
        }
        unstable {
            slackSend color: 'warning', message: ":warning: *Frontend Build Unstable* for `${env.JOB_NAME}` <${env.BUILD_URL}|#${env.BUILD_NUMBER}>"
        }
    }
}
