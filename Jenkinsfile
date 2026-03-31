pipeline {
    agent any

    environment {
        PYTHON = "C:\\Users\\sunil\\AppData\\Local\\Programs\\Python\\Python312\\python.exe"
        NODE   = "C:\\Program Files\\nodejs\\node.exe"
        NPM    = "C:\\Program Files\\nodejs\\npm.cmd"
    }

    stages {

        // ---------------- CHECKOUT ----------------
        stage('Checkout Code') {
            steps {
                git branch: 'old-stable', url: 'https://github.com/sunilt808/Cutslot-2'
            }
        }

        stage('Check Files') {
            steps {
                bat 'dir'
            }
        }

        // ---------------- BACKEND ----------------

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    bat '"%PYTHON%" -m pip install --upgrade pip'
                    bat '"%PYTHON%" -m pip install -r requirements.txt'
                }
            }
        }

        // ---------------- TESTING ----------------

        stage('Run Backend Tests') {
            steps {
                dir('backend') {
                    bat '''
                    echo Installing pytest...
                    "%PYTHON%" -m pip install pytest

                    echo Running tests...
                    "%PYTHON%" -m pytest

                    if %ERRORLEVEL% EQU 5 (
                        echo No tests found, continuing...
                        exit /b 0
                    )
                    '''
                }
            }
        }

        // ---------------- FRONTEND ----------------

        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    bat '"%NPM%" install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat '"%NPM%" run build'
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

    // ---------------- POST ----------------

    post {
        success {
            echo '✅ PIPELINE SUCCESS (Tested + Built + Deployed)'
        }
        failure {
            echo '❌ PIPELINE FAILED'
        }
        always {
            echo '📦 Pipeline finished'
        }
    }
}