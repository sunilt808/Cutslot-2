pipeline {
    agent any

    environment {
        PYTHON = "C:\\Users\\sunil\\AppData\\Local\\Programs\\Python\\Python312\\python.exe"
        NODE   = "C:\\Program Files\\nodejs\\node.exe"
        NPM    = "C:\\Program Files\\nodejs\\npm.cmd"
    }

    stages {

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

        stage('Check Python') {
            steps {
                bat '"%PYTHON%" --version'
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    bat '"%PYTHON%" -m pip install --upgrade pip'
                    bat '"%PYTHON%" -m pip install -r requirements.txt'
                }
            }
        }

        stage('Run Backend') {
            steps {
                dir('backend') {
                    bat '''
                    echo Starting FastAPI server...
                    start "" /B "%PYTHON%" -m uvicorn main:app --port 8000
                    timeout /t 5
                    echo Checking if backend is running...
                    netstat -ano | findstr :8000
                    '''
                }
            }
        }

        // ---------------- FRONTEND ----------------

        stage('Check Node') {
            steps {
                bat '"%NODE%" --version'
                bat '"%NPM%" --version'
            }
        }

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

    }

    post {
        success {
            echo '✅ FULL PIPELINE SUCCESS (Backend + Frontend)'
        }
        failure {
            echo '❌ PIPELINE FAILED'
        }
    }
}