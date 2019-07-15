package com.visteoncloud.tusc.sample;

import java.util.List;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.BatchWriteItemOutcome;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.ItemCollection;
import com.amazonaws.services.dynamodbv2.document.QueryOutcome;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.TableWriteItems;
import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;
import com.amazonaws.services.dynamodbv2.document.utils.NameMap;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;
import com.amazonaws.services.dynamodbv2.model.WriteRequest;


public class DBClient {
	
	AmazonDynamoDB client;
    DynamoDB dynamoDB;
	String tableName;

	public DBClient() {
		System.out.println("Creating DynamoDB connection");
		client = AmazonDynamoDBClientBuilder.defaultClient();
		dynamoDB = new DynamoDB(client);
		tableName = System.getenv("DYNAMODB_TABLE");
		System.out.println("Connected to DB");
	}
	
	public void createItems(String user, HashMap<BigInteger, Float> data) {
		
		// create ArrayList<Item> to hold data we are going to insert in the DB
		ArrayList<Item> items = new ArrayList<Item>();
		
		// iterate over the data
		Iterator<Entry<BigInteger, Float>> it = data.entrySet().iterator();
		while (it.hasNext()) {
			Entry<BigInteger, Float> entry = it.next();
			Item item = new Item();
			item.withPrimaryKey("User", user, "Time", entry.getKey());
			item.withNumber("Value", entry.getValue());
			items.add(item);
		}
		
		ArrayList<ArrayList<Item>> resultingArray = new ArrayList<>();
		ArrayList<Item> temp = new ArrayList<>();
		
		for (Item item : items) {
			temp.add(item);
			if (temp.size() >= 25) {
				resultingArray.add(temp);
				temp = new ArrayList<>();
			}
		}
		if(temp.size()>0) {
		resultingArray.add(temp);
		}
		
		for (ArrayList<Item> item : resultingArray) {
			doWrite(item);
		}
		
	}
	
	private void doWrite(ArrayList<Item> items) {
		
		System.out.println("Writing "+ items.size() + " elements");
		
		// create write items
		TableWriteItems writeItems = new TableWriteItems(tableName).withItemsToPut(items);
		
		// do the write	
		BatchWriteItemOutcome outcome = dynamoDB.batchWriteItem(writeItems);
		do {
			
			Map<String, List<WriteRequest>> unprocessedItems = outcome.getUnprocessedItems();
			if (outcome.getUnprocessedItems().size() == 0) {
				System.out.println("All items have been written");
			} else {
				System.out.println("Writing unprocessed items");
				outcome = dynamoDB.batchWriteItemUnprocessed(unprocessedItems);
			}
			
		} while (outcome.getUnprocessedItems().size() > 0);
	}

	public HashMap<BigInteger, Float> getItems(String user, BigInteger from, BigInteger to) {

		Table table = dynamoDB.getTable(tableName);
		long startDate = new Date(from.longValue() * 1000).getTime() / 1000;
		long endDate = new Date(to.longValue() * 1000).getTime() / 1000;

		QuerySpec query = new QuerySpec();
		query.withProjectionExpression("#k_time, #k_value");
		query.withKeyConditionExpression("#k_user = :v_user and #k_time >= :v_start");
		query.withNameMap(new NameMap()
			.with("#k_user", "User")
			.with("#k_time", "Time")
			.with("#k_value", "Value"));
		query.withValueMap(new ValueMap()
			.withString(":v_user", user)
			.withNumber(":v_start", startDate));

		// echo parameters
		System.out.println("Start date: " + startDate);
		System.out.println("End date: " + endDate);

		// execute query
		ItemCollection<QueryOutcome> items = table.query(query);
		
		// process results
		HashMap<BigInteger, Float> returnValue = new HashMap<BigInteger, Float>();
		Iterator<Item> it = items.iterator();
		while(it.hasNext()) {
			Item item = it.next();
			BigInteger time = item.getBigInteger("Time");
			if (time.longValue() < endDate) {
				returnValue.put(time, item.getFloat("Value"));
			}
		}

		return returnValue;

	}
	
}