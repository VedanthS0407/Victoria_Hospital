pipeline {
  agent any

  environment {
    SONARQUBE = 'MySonarQube'
  }

  stages {

    stage('Build') {
      steps {
        bat 'npm install'
      }
    }

    stage('Test') {
      steps {
        bat 'npm test'
      }
    }

    stage('Code Quality') {
      steps {
        withSonarQubeEnv("${SONARQUBE}") {
          bat '"C:\\sonar-scanner-5.0.1.3006-windows\\bin\\sonar-scanner.bat"'
        }
      }
    }

    stage('Security Scan') {
      environment {
        SNYK_TOKEN = credentials('snyk-token')
      }
      steps {
        bat '''
          npm install -g snyk
          snyk auth %SNYK_TOKEN%
          snyk test || exit 0
        '''
      }
    }

    stage('Deploy to Test Environment') {
      steps {
        bat 'start "" /B cmd /c "node server.js"'
        sleep(time: 5, unit: 'SECONDS')
      }
    }

    stage('Release') {
      steps {
        bat '''
          git config --global user.email "vedanthsuddula@gmail.com"
          git config --global user.name "VedanthS0407"
          git tag -a v1.0.%BUILD_NUMBER% -m "Release v1.0.%BUILD_NUMBER%"
          git push origin v1.0.%BUILD_NUMBER%
        '''
      }
    }

    stage('Monitoring & Alerts') {
      steps {
        bat 'curl -f http://localhost:9000/health || echo Health check failed'
      }
    }
  }
}
