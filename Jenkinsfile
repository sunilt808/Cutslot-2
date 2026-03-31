pipeline {
    agent any

    stages {
        stage('Check Files') {
            steps {
                bat 'dir'
            }
        }

        stage('Check Python') {
            steps {
                bat 'C:\\Users\\sunil\\AppData\\Local\\Programs\\Python\\Python312\\python.exe --version'
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    bat 'C:\\Users\\sunil\\AppData\\Local\\Programs\\Python\\Python312\\python.exe -m pip install -r requirements.txt'
                }
            }
        }
    }
}