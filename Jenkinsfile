pipeline {
  agent any
  
  tools {
    nodejs 'node22.20'
  }
  
  stages {
    stage('git clone') {
      steps {
        git branch: 'main', 
            credentialsId: 'github_credentials', 
            url: 'https://github.com/Shine-23/WeatherLink.git'
      }
    }
    stage('Frontend - Install Dependencies'){
        steps {
            sh '''
                cd frontend
                npm install
            '''
        }
     }
     stage('Frontend - Build') {
        steps {
            sh '''
              cd frontend
              npm run build
            '''
        }
     }
     stage('Backend - Install Dependencies'){
         steps {
             sh '''
                cd backend
                npm install
             '''
         }
     }
  }
}
