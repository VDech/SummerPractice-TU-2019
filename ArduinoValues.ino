#include <Wire.h>

struct Button {
  int pin;
  byte value;
};

struct Potentiometer {
  int pin;
  int value;
};

struct {
  Potentiometer y = {A2, 0};
  Potentiometer x = {A3, 0};
  Button btn = {2, 0};
}joystick;

struct NTC {
  int pin;
  float value;
  float addedResistance;
};

struct {
  byte type = 0;
  byte gear = 0;
}transmission;

Button btn_engineType = {3, 0};
Button btn_metricSystem = {4, 0};
Button btn_transmissionType = {5, 0};

Potentiometer pot_rpm = {A6, 0};

NTC engineTemperature = {A1, 0, 2000.0};
NTC outdoorTemperature = {A0, 0, 100000.0};

int getGear(){
  joystick.y.value = analogRead(joystick.y.pin);
  joystick.x.value = analogRead(joystick.x.pin);
  joystick.btn.value = digitalRead(joystick.btn.pin);
  
  transmission.gear = 0;
  
  if(joystick.x.value > 400 && joystick.x.value < 600) {
    if(joystick.y.value < 400) {
      transmission.gear = 3;
    }
    else if(joystick.y.value > 600) {
      transmission.gear = 4;
    }
  }
  else if(joystick.y.value < 400) {
    if(joystick.x.value < 400) {
      transmission.gear = 1;
    }
    else if(joystick.x.value > 600) {
      transmission.gear = 5;
    }
  }
  else if(joystick.y.value > 600) {
    if(joystick.x.value < 400) {
      transmission.gear = 2;
    }
    else if(joystick.x.value > 600) {
      transmission.gear = 6;
    }
  }
  else if(joystick.x.value < 400 || joystick.x.value > 600) {
    if(joystick.y.value > 400 && joystick.y.value < 600) {
      transmission.gear = 0;
    }
  }
  
  if(joystick.btn.value == 0) {
        transmission.gear = 7;
  }
  return transmission.gear;
}

int readEngineButton() {
  if(digitalRead(btn_engineType.pin) == 1) {
    btn_engineType.value = !btn_engineType.value;
  }

  return btn_engineType.value;
}

int readMetricButton() {
  if(digitalRead(btn_metricSystem.pin) == 1) {
    btn_metricSystem.value = !btn_metricSystem.value;
  }
  return btn_metricSystem.value;
}

int readTransmissionButton() {
  if(digitalRead(btn_transmissionType.pin) == 1) {
    btn_transmissionType.value = !btn_transmissionType.value;
  }
  return btn_transmissionType.value;
}


int getRPM() {
 // if(btn_engineType.value == 0) {
    pot_rpm.value = analogRead(pot_rpm.pin);// * 5.8651;
    return pot_rpm.value;
    }
//  else {
//    pot_rpm.value = analogRead(pot_rpm.pin) * 7.3313;
//  }
//}

float logR2, R2;
float c1 = 1.009249522e-03, c2 = 2.378405444e-04, c3 = 2.019202697e-07;

int readEngineTemp() {
  
  engineTemperature.value = analogRead(engineTemperature.pin);

  R2 = engineTemperature.addedResistance * (1023.0 / (float)engineTemperature.value - 1.0);
  logR2 = log(R2);
  engineTemperature.value = (1.0 / (c1 + c2*logR2 + c3*logR2*logR2*logR2)) - 273.15;
  //int decEngineTemp = (int)engineTemperature.value;
  return engineTemperature.value;
}

int readOutdoorTemp(){
  outdoorTemperature.value = analogRead(outdoorTemperature.pin);
  
  R2 = outdoorTemperature.addedResistance * (1023.0 / (float)outdoorTemperature.value - 1.0);
  logR2 = log(R2);
  outdoorTemperature.value = (1.0 / (c1 + c2*logR2 + c3*logR2*logR2*logR2)) - 273.15;
  //int decOutdoorTemp = (int)(outdoorTemperature.value);
  return outdoorTemperature.value;
}

void setup() {
  pinMode(A1, INPUT);
  pinMode(joystick.x.pin, INPUT);
  pinMode(joystick.y.pin, INPUT);
  pinMode(joystick.btn.pin, INPUT);

  pinMode(btn_engineType.pin, INPUT);
  pinMode(btn_metricSystem.pin, INPUT);
  pinMode(btn_transmissionType.pin, INPUT);

  pinMode(pot_rpm.pin, INPUT);

  pinMode(engineTemperature.pin, INPUT);
  pinMode(outdoorTemperature.pin, INPUT);
  
   //I2C
  Wire.begin(0x08);
 // Wire.onRequest(requestEvent);
  
  //test output
  Serial.begin(9600);
}


unsigned long tick = 0;
void loop() {
  Serial.println(readEngineTemp());
  //  Wire.beginTransmission(0x01);
    Wire.onRequest(requestEvent);
  //  Wire.endTransmission();

   /* Serial.println(getRPM());
    Serial.println(readOutdoorTemp());
    Serial.println(readEngineTemp());
    Serial.println(getGear());

    Serial.println(readEngineButton());
    Serial.println(readMetricButton());
    Serial.println(readTransmissionButton());*/
    
    //TODO: Pack and send the data every 50 miliseconds 
   }

void requestEvent(){
  
  char arr[5] ;
  testFunc(arr);
  Serial.print(".");
  //Send data
  int sizeOfArr = sizeof(arr);
  Wire.write(arr, sizeOfArr);

}

void testFunc (char arr[]){
  //Read and save RPM
  arr[0] = getRPM()&0xFF;
  arr[1] = (getRPM()&0x0300) >> 8;

  //Read, convert and save temperatures - CHANGE 20 TO RET VALUE
  arr[1] |= (81 & 0x03F) << 2;
  arr[2]  = (81 & 0x3C0) >> 6;

//  Serial.println((arr[1]&0xFC)>>2) | ((arr[2]&0xF)<<6);

  arr[2] |= (69 & 0x0F) << 4;
  arr[3]  = (69 & 0x3F0) >> 4;

  //Read and save buttons
  arr[3] |= (readEngineButton() & 0x01) << 6;
  arr[3] |= (readMetricButton() & 0x01) << 7;
  arr[4]  = (readTransmissionButton() & 0x01);

  //Read and save gear
  arr[4] |= (getGear() & 0x07) << 1;
}
