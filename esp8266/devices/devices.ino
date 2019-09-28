#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

const char* ssid = "Dung Tran";
const char* password = "99999999";
const char* mqttServer = "184.164.94.176";

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

void handleOn(int device) {
  switch (device) {
    case 1:
      digitalWrite(16, LOW);
      break;
    case 2:
      digitalWrite(15, LOW);
      break;
    case 3:
      digitalWrite(14, LOW);
      break;
  }
}

void handleOff(int device) {
  switch (device) {
    case 1:
      digitalWrite(16, HIGH);
      break;
    case 2:
      digitalWrite(15, HIGH);
      break;
    case 3:
      digitalWrite(14, HIGH);
      break;
  }
}

void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String type = topic;
  Serial.print(type);
  if (type == "devices") {
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, payload);
    String device = doc["device"];
    String state = doc["state"];
    state == "on" ? handleOn(device.toInt()) : handleOff(device.toInt());
    Serial.print("\n");
    Serial.print(device);
    Serial.print(": ");
    Serial.print(state);
  }
}

void reConnect() {
  while (!client.connected()) {
    Serial.print("\nConnect MQTT...");
    if (client.connect("esp8266_devices")) {
      client.subscribe("devices");
      Serial.print("connected");
    }
    else {
      Serial.print("fail, error: ");
      Serial.print(client.state());
      delay(1000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setupWifi();
  
  pinMode(16, OUTPUT);
  pinMode(15, OUTPUT);
  pinMode(14, OUTPUT);
  
  client.setServer(mqttServer, 1883);
  client.setCallback(mqttCallback);
}

void loop() {
  if (!client.connected()) reConnect();
  client.loop();
}
