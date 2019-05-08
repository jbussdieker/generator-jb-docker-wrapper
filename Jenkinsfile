#!groovy
def getImage() {
  docker.image('node:12')
}

node {
  stage('clone') {
    cleanWs()
    checkout scm
  }

  stage('setup') {
    image.inside {
      echo "Ready"
    }
  }

  stage('npm install') {
    image.inside {
      withEnv(["HOME=${pwd()}"]) {
        sh 'npm install'
      }
    }
  }

  stage('npm test') {
    image.inside {
      sh 'npm test'
    }
  }

  if (env.TAG_NAME) {
    stage('npm publish') {
      image.inside {
        withEnv(["HOME=${pwd()}"]) {
          withCredentials([string(credentialsId: 'npm', variable: 'NPM_TOKEN')]) {
            sh 'echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc'
            sh "npm publish"
          }
        }
      }
    }
  }
}
