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
     stage('Copy Frontend Build to Backend') {
      steps {
        sh '''
          rm -rf backend/public
          mkdir -p backend/public
          cp -r frontend/dist/* backend/public/
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
