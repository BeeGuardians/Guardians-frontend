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
        cpu: "200m"
        memory: "256Mi"
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
        cpu: "1000m"
        memory: "2048Mi"
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
        HARBOR_HOST = "harbor.example.com:30443"
        HARBOR_IMAGE = "${HARBOR_HOST}/guardians/frontend"
    }

    stages {
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
                      --skip-tls-verify
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
                        git clone --single-branch --branch ${BRANCH_NAME} https://${GIT_USER}:${GIT_TOKEN}@github.com/BeeGuardians/Guardians-Infra.git infra

                        echo "[PATCH] Updating frontend deployment.yaml image tag"
                        sed -i "s|image: .*|image: ${FULL_IMAGE}|" infra/${DEPLOY_PATH}

                        cd infra
                        git config user.email "ci-bot@example.com"
                        git config user.name "CI Bot"
                        git add ${DEPLOY_PATH}
                        git commit -m "release : update frontend image to guardians/frontend:${IMAGE_TAG}" || echo "No changes to commit"
                        git push https://${GIT_USER}:${GIT_TOKEN}@github.com/BeeGuardians/Guardians-Infra.git ${BRANCH_NAME}
                        """
                    }
                }
            }
        }
    }
}
