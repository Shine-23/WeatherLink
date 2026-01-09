pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Show folders') {
      steps {
        bat 'dir'
        bat 'dir backend'
        bat 'dir frontend'
      }
    }

    stage('Check Node & NPM') {
      steps {
        bat 'node -v'
        bat 'npm -v'
      }
    }
  }
}
