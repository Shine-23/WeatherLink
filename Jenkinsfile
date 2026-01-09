pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Create backend .env') {
      steps {
        withCredentials([string(credentialsId: 'WEATHERLINK_ENV', variable: 'ENV_FILE')]) {
          bat '''
            powershell -NoProfile -Command ^
              "$envContent = $env:ENV_FILE; " ^
              "Set-Content -Path backend\\.env -Value $envContent -Encoding UTF8"
          '''
        }
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
        bat 'if exist backend\\dist rmdir /S /Q backend\\dist'
        bat 'xcopy frontend\\dist backend\\dist /E /I /Y'
      }
    }

    stage('Archive Build') {
      steps {
        archiveArtifacts artifacts: 'backend/dist/**', fingerprint: true
      }
    }

    // Optional: sanity check start (only if your app can run in CI)
    // stage('Start Backend Smoke Test') {
    //   steps {
    //     dir('backend') {
    //       bat 'node -v'
    //       bat 'npm start'
    //     }
    //   }
    // }
  }
}
