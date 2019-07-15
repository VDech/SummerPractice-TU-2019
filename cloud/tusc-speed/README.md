# TU Summer Camp Sample Project

[![Build Status](https://travis-ci.org/tusummercamp/sample.svg?branch=master)](https://travis-ci.org/tusummercamp/sample)

The following project should serve as a sample blueprint for creating AWS Lambda-compatible Java-based projects.

# Development Environment Setup

Follow the instructions here: https://docs.aws.amazon.com/lambda/latest/dg/java-create-jar-pkg-maven-and-eclipse.html

Use the following artifact information:
* Group Id: com.visteoncloud
* Artifact Id: tusc-sample
* Version: 0.0.1-SNAPSHOT
* Packaging: jar
* Name: tusc-sample

# Maven Dependencies
You will need the following Maven dependencies

### aws-lambda-java-core
* Group Id: com.amazonaws
* Artifact Id: aws-lambda-java-core
* Version: 1.1.0

### aws-lambda-java-events
* Group Id: com.amazonaws
* Artifact Id: aws-lambda-java-events
* Version: 2.2.6

### maven-shade-plugin
* Group Id: org.apache.maven.plugins
* Artifact Id: maven-shade-plugin
* Version: 2.3

# Building Deployment package

### From terminal

Execute `mvn package shade:shade`. This will create a JAR artifact `./target/tusc-sample-0.0.1.jar`

### From Eclipse
You will need to create a `shaded` package that is ready for deployment.
Create a new Maven build with `package shade:shade` goal.

# Deploy using AWS SAM (Serverless Aplication Model)

```bash
# Create package
sam package \
    --template-file template.yaml \
    --output-template-file packaged.yaml \
    --s3-bucket your-s3-bucket

# Deploy package
sam deploy \
    --template-file packaged.yaml \
    --stack-name tusc-sample \
    --capabilities CAPABILITY_IAM
```

# Userful articles
* https://willhamill.com/2016/12/12/aws-api-gateway-lambda-proxy-request-and-response-objects
* https://docs.aws.amazon.com/lambda/latest/dg/java-create-jar-pkg-maven-and-eclipse.html
* https://docs.aws.amazon.com/lambda/latest/dg/java-handler-using-predefined-interfaces.html
* https://github.com/aws-samples/aws-sam-java-rest
