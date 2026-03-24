#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_BME680.h>
/* CONFIGURAÇÕES */
constexpr const char* WIFI_SSID     = "hermenegildowilson7";
constexpr const char* WIFI_PASSWORD = "wilsonPanzo";
constexpr const char* API_URL = "http://10.47.103.236:3000/sensors/register/reading";
constexpr const char* SENSOR_CODE = "esp32_01";
constexpr uint8_t I2C_SDA = 18;
constexpr uint8_t I2C_SCL = 19;

/* OBJETO GLOBAL */
Adafruit_BME680 bme;
struct SensorData {
  float temperature;
  float humidity;
  float pressure;
  float airQuality;
};

/* FUNÇÕES */
void connectWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Conectando ao Wi-Fi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi conectado");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
}
bool initBME680() {
  Wire.begin(I2C_SDA, I2C_SCL);

  if (!bme.begin()) {
    Serial.println("Erro: BME680 não detectado.");
    return false;
  }

  bme.setTemperatureOversampling(BME680_OS_8X);
  bme.setHumidityOversampling(BME680_OS_2X);
  bme.setPressureOversampling(BME680_OS_4X);
  bme.setIIRFilterSize(BME680_FILTER_SIZE_3);
  bme.setGasHeater(320, 150);

  Serial.println("BME680 inicializado com sucesso.");
  return true;
}
bool readSensors(SensorData& data) {
  if (!bme.performReading()) {
    Serial.println("Erro ao ler BME680.");
    return false;
  }

  data.temperature = bme.temperature;
  data.humidity    = bme.humidity;
  data.pressure    = bme.pressure / 100.0;
  data.airQuality  = bme.gas_resistance / 1000.0;

  return true;
}

void sendDataToServer(const SensorData& data) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Wi-Fi desconectado. Dados não enviados.");
    return;
  }

  HTTPClient http;
  http.begin(API_URL);
  http.addHeader("Content-Type", "application/json");

  String payload = "{";
  payload += "\"sensor_code\":\"" + String(SENSOR_CODE) + "\",";
  payload += "\"temperature\":" + String(data.temperature, 2) + ",";
  payload += "\"humidity\":"    + String(data.humidity, 2) + ",";
  payload += "\"pressure\":"    + String(data.pressure, 2) + ",";
  payload += "\"air_quality\":" + String(data.airQuality, 2);
  payload += "}";

  int responseCode = http.POST(payload);

  Serial.print("HTTP Response: ");
  Serial.println(responseCode);

  http.end();
}

/* SETUP */

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("Inicializando sistema...");

  initBME680();
  connectWiFi();
}

/* LOOP */
void loop() {
  SensorData data;

  if (readSensors(data)) {
    sendDataToServer(data);
    Serial.println("Dados enviados (modo teste: 5s fixos).");
  }

  delay(6000);  // 6 segundos
}