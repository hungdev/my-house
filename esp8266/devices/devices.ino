#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

const char* ssid = "ssid_wifi";
const char* password = "password_wifi";
const char* mqtt_server = "mqtt_server";

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

void callback(char* topic, byte* payload, unsigned int length) {
  String type = topic;

  if (type == "devices") {
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, payload);
    String device = doc["device"];
    String state = doc["state"];

    state == "on" ? handleOn(device.toInt()) : handleOff(device.toInt());
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

  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) reConnect();

  client.loop();
}
