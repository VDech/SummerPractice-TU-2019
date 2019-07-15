package com.visteoncloud.tusc.sample;

import com.amazonaws.services.lambda.runtime.LambdaLogger;

public class TestLogger implements LambdaLogger {

	public void log(String string) {
		System.out.println(string);
	}

}
