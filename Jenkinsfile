pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('List root directory') {
      steps {
        powershell 'ls'
      }
    }

    stage('List frontend folder') {
      steps {
        powershell 'ls frontend'
      }
    }

    stage('List backend folder') {
      steps {
        powershell 'ls backend'
      }
    }
  }
}
