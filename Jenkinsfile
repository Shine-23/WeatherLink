pipeline {
  agent any
  
  tools {
    nodejs 'node22.20'
  }

  environment {
    DOCKER_IMAGE   = 'weatherlink-jenkins-local'
    CONTAINER_NAME = 'weatherlink-container'
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
    stage('Docker image build'){
        steps{
          sh 'docker build -t $DOCKER_IMAGE:$BUILD_NUMBER .'
        }
    }
    stage('Docker old container remove'){
        steps{
          sh 'docker rm -f $CONTAINER_NAME || true'
        }
    }
    stage('Docker new container run'){
        steps{
          sh 'docker run -d -p 5000:5000 --name=$CONTAINER_NAME $DOCKER_IMAGE:$BUILD_NUMBER'
        }
    }
  }
}
