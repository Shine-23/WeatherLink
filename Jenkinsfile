pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('LS (root)') {
      steps {
        sh 'pwd && ls -la'
      }
    }

    stage('LS (frontend)') {
      steps {
        sh 'ls -la frontend || true'
      }
    }

    stage('LS (backend)') {
      steps {
        sh 'ls -la backend || true'
      }
    }
  }
}
