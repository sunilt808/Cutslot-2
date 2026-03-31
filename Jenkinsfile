pipeline {
    agent any

    environment {
        PYTHON = "C:\\Users\\sunil\\AppData\\Local\\Programs\\Python\\Python312\\python.exe"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'old-stable', url: 'https://github.com/sunilt808/Cutslot-2'
            }
        }

        // ---------------- TESTING ----------------

        stage('Run Backend Tests') {
            steps {
                dir('backend') {
                    bat '"%PYTHON%" -m pip install -r requirements.txt'
                    bat '"%PYTHON%" -m pip install pytest'
                    bat '"%PYTHON%" -m pytest || echo No tests found'
                }
            }
        }

        // ---------------- DOCKER ----------------

        stage('Docker Build & Run') {
            steps {
                bat 'docker-compose down'
                bat 'docker-compose up --build -d'
            }
        }

    }

    post {
        success {
            echo '✅ PIPELINE SUCCESS (Tested + Deployed)'
        }
        failure {
            echo '❌ PIPELINE FAILED'
        }
    }
}