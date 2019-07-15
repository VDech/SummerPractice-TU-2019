package com.visteoncloud.tusc.sample;

import com.amazonaws.services.lambda.runtime.ClientContext;
import com.amazonaws.services.lambda.runtime.CognitoIdentity;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;

public class TestLambdaContext implements Context {

	public String getAwsRequestId() {
		// TODO Auto-generated method stub
		return null;
	}

	public String getLogGroupName() {
		// TODO Auto-generated method stub
		return null;
	}

	public String getLogStreamName() {
		// TODO Auto-generated method stub
		return null;
	}

	public String getFunctionName() {
		// TODO Auto-generated method stub
		return null;
	}

	public String getFunctionVersion() {
		// TODO Auto-generated method stub
		return null;
	}

	public String getInvokedFunctionArn() {
		// TODO Auto-generated method stub
		return null;
	}

	public CognitoIdentity getIdentity() {
		// TODO Auto-generated method stub
		return null;
	}

	public ClientContext getClientContext() {
		// TODO Auto-generated method stub
		return null;
	}

	public int getRemainingTimeInMillis() {
		// TODO Auto-generated method stub
		return 0;
	}

	public int getMemoryLimitInMB() {
		// TODO Auto-generated method stub
		return 0;
	}

	public LambdaLogger getLogger() {
		return new TestLogger();
	}

}
