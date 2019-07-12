import threading, asyncio, websockets, time, smbus

# Global stop flag
stopFlag = False


"""
DataWorker thread responsible for data generation.
"""
class DataWorker (threading.Thread):
    
    # Constructor
    def __init__(self):
        threading.Thread.__init__(self)
        self.data = ''
        self.lastData = ''
    
            
    def i2c_handler(self):
        address=0x08
        bus=smbus.SMBus(1)
        while True:
            time.sleep(0.5)
            try:
                data = bus.read_i2c_block_data(address,99,3)
                #print('Data0 {}, Data1 {},Data2 {}'.format(data[0], data[1], data[2]))
                #print('Speed ', self.transformSpeed(data))
                #print('Temp', self.transformTemp(data))
                #print('Button',(data[2]&0xC)>>2)
                speed = int(self.transformSpeed(data))
                temp = self.transformTemp(data)
                button = (data[2]&0xC)>>2
                self.data = currentData = str("Speed|"+str(speed)+'|Temp|'+str(temp)+'|Button|'+str(button))
                
            except IOError as e:
                error = e

    
    def transformSpeed(self, data):
        number=data[0]+((data[1]&0x03)<<8)
        speed=number/3.93
        return round(speed)

    def transformTemp(self, data):
        temp=float(((((data[1]&0xFC)>>2)|((data[2]&0x3)<<6))*0.5))-40.0
        return temp

    
    # Generate data
    def run(self):
        self.i2c_handler()
        # t1 = threading.Thread(target=i2c_handler)
        # t1.start()
    
    # Data getter
    def get(self):
        return self.data


"""
MessagingWorker thread responsible for sending
messages over websockets.
"""
class MessagingWorker (threading.Thread):
    
    # Constructor
    def __init__(self, interval=0.05):
        threading.Thread.__init__(self)
        self.interval = interval
        self.connected = set()

    # Send data on predefined intervals
    def run(self):
        while not stopFlag:
            data = dataWorker.get()
            self.broadcast(data)
            time.sleep(self.interval)

    # Websockets handler
    async def handler(self, websocket, path):
        print("Client connected")
        self.connected.add(websocket)
        try:
            await websocket.recv()
        except websockets.exceptions.ConnectionClosed:
            pass
        finally:
            self.connected.remove(websocket)

    # Broadcast to all clients
    def broadcast(self, data):
        for websocket in self.connected.copy():
            print("Sending data: %s" % data)
            coro = websocket.send(data)
            future = asyncio.run_coroutine_threadsafe(coro, loop)

            
if __name__ == "__main__":
    
    print('Data publisher')
    dataWorker = DataWorker()
    messagingWorker = MessagingWorker()

    try:
        # Create data and messaging threads
        dataWorker.start()
        messagingWorker.start()

        # Create server
        ws_server = websockets.serve(messagingWorker.handler, '0.0.0.0', 8080)

        # Create async loop
        loop = asyncio.get_event_loop()
        loop.run_until_complete(ws_server)
        loop.run_forever()

    except KeyboardInterrupt:
        stopFlag = True

        # Close async loop
        loop.stop()
        loop.close()
        print("Exiting program...")