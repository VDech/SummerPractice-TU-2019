package com.visteoncloud.tusc.sample;

import org.json.JSONObject;
import java.util.HashMap;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;

public class LambdaTester {

	public static void main(String[] args) {
		long now = 1562741850;
		// create handler
		LambdaHandler handler = new LambdaHandler();
		
		System.out.println("/////////////////////////////////////////////////");
		APIGatewayProxyRequestEvent request1 = new APIGatewayProxyRequestEvent();
		request1.setHttpMethod("post");
		request1.setBody("[{\"time\":4685655744,\"value\":42},{\"time\":322832013794,\"value\":42},{\"time\":624539459013,\"value\":42},{\"time\":28317056778,\"value\":42},{\"time\":1059595124718,\"value\":42},{\"time\":1213319712840,\"value\":42},{\"time\":1150834120834,\"value\":42},{\"time\":149662890326,\"value\":42},{\"time\":1070252606357,\"value\":42},{\"time\":200038904191,\"value\":42},{\"time\":1441268786976,\"value\":42},{\"time\":1398298239153,\"value\":42},{\"time\":1046666958476,\"value\":42},{\"time\":1158960987377,\"value\":42},{\"time\":652179075791,\"value\":42},{\"time\":784657391186,\"value\":42},{\"time\":1429924553417,\"value\":42},{\"time\":223354279277,\"value\":42},{\"time\":99247135447,\"value\":42},{\"time\":117623835455,\"value\":42},{\"time\":963948476091,\"value\":42},{\"time\":718273020505,\"value\":42},{\"time\":1176023285670,\"value\":42},{\"time\":1197668721020,\"value\":42},{\"time\":1419899608778,\"value\":42},{\"time\":706895956096,\"value\":42}]");
		APIGatewayProxyResponseEvent response1 = handler.handleRequest(request1, new TestLambdaContext());
		System.out.println(response1.getStatusCode() + ": " + response1.getBody());
		
		System.out.println("/////////////////////////////////////////////////");
		APIGatewayProxyRequestEvent request2 = new APIGatewayProxyRequestEvent();
		request2.setHttpMethod("post");
		request2.setBody("{\"time\": " + now + ", \"value\": 42.23}");
		APIGatewayProxyResponseEvent response2 = handler.handleRequest(request2, new TestLambdaContext());
		System.out.println(response2.getStatusCode() + ": " + response2.getBody());
		
		System.out.println("/////////////////////////////////////////////////");
		APIGatewayProxyRequestEvent request3 = new APIGatewayProxyRequestEvent();
		request3.setHttpMethod("post");
		request3.setBody("[{\"value\": 42.23}]");
		APIGatewayProxyResponseEvent response3 = handler.handleRequest(request3, new TestLambdaContext());
		System.out.println(response3.getStatusCode() + ": " + response3.getBody());
		
		System.out.println("/////////////////////////////////////////////////");
		APIGatewayProxyRequestEvent request4 = new APIGatewayProxyRequestEvent();
		request4.setHttpMethod("post");
		request4.setBody("[{\"time\": " + now + "}]");
		APIGatewayProxyResponseEvent response4 = handler.handleRequest(request4, new TestLambdaContext());
		System.out.println(response4.getStatusCode() + ": " + response4.getBody());
		
		System.out.println("/////////////////////////////////////////////////");
		APIGatewayProxyRequestEvent request5 = new APIGatewayProxyRequestEvent();
		request5.setHttpMethod("get");
		HashMap<String, String> qsp = new HashMap<String, String>();
		qsp.put("from", String.valueOf(now - 3600));
		qsp.put("to", String.valueOf(now + 1));
		request5.setQueryStringParameters(qsp);
		APIGatewayProxyResponseEvent response5 = handler.handleRequest(request5, new TestLambdaContext());
		System.out.println(response5.getStatusCode() + ": " + response5.getBody());
	}
}