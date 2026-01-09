pipeline {
  agent any

  environment {
    PORT = "5000"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Backend Deps') {
      steps {
        dir('backend') {
          bat 'npm ci'
        }
      }
    }

    stage('Install Frontend Deps') {
      steps {
        dir('frontend') {
          bat 'npm ci'
        }
      }
    }

    stage('Build Frontend') {
      steps {
        dir('frontend') {
          bat 'npm run build'
        }
      }
    }

    stage('Copy dist to backend') {
      steps {
        // Windows copy
        bat 'if exist backend\\dist rmdir /S /Q backend\\dist'
        bat 'xcopy frontend\\dist backend\\dist /E /I /Y'
      }
    }

    stage('Archive Build') {
      steps {
        archiveArtifacts artifacts: 'backend/dist/**', fingerprint: true
      }
    }
  }
}
