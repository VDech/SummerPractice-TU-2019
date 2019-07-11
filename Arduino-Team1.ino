#include "Wire.h"
#include "OneButton.h"

OneButton button(PD2, true);
int btnPressed = 0;

void setup() {
  
  //Initialize button pin as an input
  button.attachClick(oneclick);
  button.attachDoubleClick(doubleclick);
  button.attachLongPressStop(longclick);

  //I2C
  Wire.begin(8);
  Wire.onRequest(requestEvent);

}

void loop() { button.tick(); }

void requestEvent() {

  //packeting the information in an array
  char arr[3] = {0};

  //read the input from potentiometer on pin A1
  int potentiometerValue = analogRead(A1);
  arr[0] = potentiometerValue & 0xFF;
  arr[1] = (potentiometerValue & 0x0300) >> 8; 

  //read the temperature on pin A3
  int temperatureValue = analogRead(A3);
  temperatureValue = map(temperatureValue*5, 12, 2590, 0, 120);
  temperatureValue = (temperatureValue+40)*2;
  arr[1] |= (temperatureValue & 0x03F) << 2;
  arr[2] = (temperatureValue & 0xC0) >> 6;

  //read the button
  arr[2] |= (btnPressed & 0x03) << 2;
  btnPressed = 0;

  //sent the information
  Wire.write(arr);

}

void oneclick() { btnPressed = 1; } //button click

void doubleclick() { btnPressed = 2; } //button double click

void longclick() { btnPressed = 3; } //button hold
