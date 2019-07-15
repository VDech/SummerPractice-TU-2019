package com.visteoncloud.tusc.sample;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import javax.net.ssl.HttpsURLConnection;

public class RealClient {

	private final String USER_AGENT = "Mozilla/5.0";
	public static void postit() throws Exception {
		RealClient http = new RealClient();
		System.out.println("Testing 2 - Send Http POST request");
		http.sendPost();
	}
	
	private void sendPost() throws Exception {
		String url = "https://i90jji9q5j.execute-api.us-east-1.amazonaws.com/Prod/data";
		URL obj = new URL(url);
		HttpsURLConnection connection = (HttpsURLConnection) obj.openConnection();
		
		//request header
		connection.setRequestMethod("POST");
		connection.setRequestProperty("User-Agent",USER_AGENT);
		connection.setRequestProperty("Accept-Language","en-US,en;q=0.5");
		
		//sending request
		connection.setDoOutput(true);
		DataOutputStream wr = new DataOutputStream(connection.getOutputStream());
		wr.flush();
		wr.close();
		
		
	}
	
}
