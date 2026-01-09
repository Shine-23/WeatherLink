pipeline {
  agent any

 stages {
    stage('Checkout') {
      steps {
        checkout scm
        sh 'pwd && ls -la'
      }
    }

    stage('Frontend - Install') {
      steps {
        sh '''
          cd frontend
          npm ci
        '''
      }
    }

    stage('Frontend - Build') {
      steps {
        sh '''
          cd frontend
          npm run build
          ls -la
          ls -la dist || true
        '''
      }
    }

    stage('Backend - Prepare public') {
      steps {
        sh '''
          mkdir -p backend/public
          rm -rf backend/public/*
          cp -r frontend/dist/* backend/public/
          echo "Copied frontend/dist -> backend/public"
          ls -la backend/public
        '''
      }
    }

    stage('Backend - Install') {
      steps {
        sh '''
          cd backend
          npm ci
        '''
      }
    }

    stage('Backend - Test (optional)') {
      steps {
        sh '''
          cd backend
          if [ -f package.json ]; then
            npm test --silent || true
          fi
        '''
      }
    }
  }
}
