import json, math, time, asyncio, websockets, datetime, requests

# ====================================
# CONFIGURATION
# ====================================
SERVER_URL = "ws://127.0.0.1:8080"
SPEED_URL ='https://32mo5c9zs2.execute-api.us-east-1.amazonaws.com/Prod/data'
TEMP_URL ='https://i90jji9q5j.execute-api.us-east-1.amazonaws.com/Prod/data'
ODO_URL ='https://g9eyv3jby5.execute-api.us-east-1.amazonaws.com/Prod/data'
SEND_PERIOD = 30

temp = []
odo = []
speed = []
lastSend = 0

def resample_data(data):
    result_array = []
    temp_array = []
    for time, value in data:
        if len(temp_array) > 0 and int(temp_array[-1][0]) != int(time):
            times, values = list(zip(*temp_array))
            average_value = math.floor(sum(values) / len(values) * 100) / 100
            result_array.append({ "time": int(time), "value": average_value })
            temp_array = []
        else:
            temp_array.append((time, value))
    print(result_array)
    return result_array

def flush():
    global lastSend, temp, odo, speed
    now = time.time()

    if abs(lastSend - now) > SEND_PERIOD:
        try:
            requests.post(SPEED_URL, data=json.dumps(resample_data(speed)))
            requests.post(TEMP_URL, data=json.dumps(resample_data(temp)))
            requests.post(ODO_URL, data=json.dumps(resample_data(odo)))
            lastSend = now
            temp = []
            odo = []
            speed = []
            print('Data sent')
        except Exception as e:
            print(str(e))
        
def parse_message(msg):
    data = msg.split('|')
    speed.append((time.time(), float(data[1])))
    temp.append((time.time(), float(data[17])))
    odo.append((time.time(), float(data[7])))
    flush()

async def handler():
    global SERVER_URL
    async with websockets.connect(SERVER_URL) as websocket:
        while True:
            msg = await websocket.recv()
            parse_message(msg)

asyncio.get_event_loop().run_until_complete(handler())
