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
        IMAGE_TAG = "v${BUILD_NUMBER}"
        FULL_IMAGE = "${HARBOR_IMAGE}:${IMAGE_TAG}"
    }

    stages {
        stage('Checkout') {
            steps {
                container('git') {
                    checkout scm
                }
            }
        }

        stage('Inject .env') {
            steps {
                container('kaniko') {
                    sh """
                    echo "[INFO] Injecting .env"
                    cat <<EOF > \$WORKSPACE/guardians/.env
VITE_API_BASE_URL=http://192.168.0.11:30090
EOF
                    """
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
                        git clone --single-branch --branch dev https://${GIT_USER}:${GIT_TOKEN}@github.com/BeeGuardians/Guardians-Infra.git infra

                        echo "[PATCH] Updating frontend deployment.yaml image tag"
                        sed -i "s|image: .*|image: ${FULL_IMAGE}|" infra/cloud-cluster/frontend/deployment.yaml

                        cd infra
                        git config user.email "ci-bot@example.com"
                        git config user.name "CI Bot"
                        git add cloud-cluster/frontend/deployment.yaml
                        git commit -m "release : update frontend image to ${FULL_IMAGE}" || echo "No changes to commit"
                        git push https://${GIT_USER}:${GIT_TOKEN}@github.com/BeeGuardians/Guardians-Infra.git dev
                        """
                    }
                }
            }
        }
    }
}
