#include <ESP8266WiFi.h>
#include <PubSubClient.h> // https://github.com/knolleary/pubsubclient
#include <ArduinoJson.h> // https://github.com/bblanchon/ArduinoJson

const char* ssid = "ssid_wifi";
const char* password = "password_wifi";
const char* mqttServer = "ip_address_mqtt_server";

int pins[] = {16, 15, 12};
int states[] = {0, 0, 0};

WiFiClient espClient;
PubSubClient client(espClient);

void setupWifi() {
  Serial.print("\nConnect WIFI...");
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }

  Serial.print("connected");
  Serial.print("\n");
  Serial.print(WiFi.localIP());
}

void mqttCallback(char* topic, byte* payload, unsigned int length) {

}

void reConnect() {
  while (!client.connected()) {
    Serial.print("\nConnect MQTT...");
    if (client.connect("esp8266_buttons")) {
      client.subscribe("devices");
      Serial.print("connected");
    }
    else {
      Serial.print("fail, error: ");
      Serial.print(client.state());
      delay(3000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setupWifi();

  pinMode(pins[0], INPUT_PULLUP);
  pinMode(pins[1], INPUT_PULLUP);
  pinMode(pins[2], INPUT_PULLUP);

  client.setServer(mqttServer, 1883);
  client.setCallback(mqttCallback);
}

void loop() {
  if (!client.connected()) reConnect();

  client.loop();

  if (digitalRead(pins[0]) == LOW) {
    if (states[0] == 0) {
      states[0] = 1;
      client.publish("control", "{\"device\": \"1\", \"state\": \"on\"}");
      Serial.print("\nON");
    }
  }
  else if (digitalRead(pins[0]) == HIGH) {
    if (states[0] == 1) {
      states[0] = 0;
      client.publish("control", "{\"device\": \"1\", \"state\": \"off\"}");
      Serial.print("\nOFF");
    }
  }

  if (digitalRead(pins[1]) == LOW) {
    if (states[1] == 0) {
      states[1] = 1;
      client.publish("control", "{\"device\": \"2\", \"state\": \"on\"}");
      Serial.print("\nON");
    }
  }
  else if (digitalRead(pins[1]) == HIGH) {
    if (states[1] == 1) {
      states[1] = 0;
      client.publish("control", "{\"device\": \"2\", \"state\": \"off\"}");
      Serial.print("\nOFF");
    }
  }

  if (digitalRead(pins[2]) == LOW) {
    if (states[2] == 0) {
      states[2] = 1;
      client.publish("control", "{\"device\": \"3\", \"state\": \"on\"}");
      Serial.print("\nON");
    }
  }
  else if (digitalRead(pins[2]) == HIGH) {
    if (states[2] == 1) {
      states[2] = 0;
      client.publish("control", "{\"device\": \"3\", \"state\": \"off\"}");
      Serial.print("\nOFF");
    }
  }
}
