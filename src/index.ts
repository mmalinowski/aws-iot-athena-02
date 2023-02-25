import { MeteoStation, ThingConnection } from "./iot/iot-device";
import { Sensor } from "./iot/types";

const ENDPOINT = "xxxx-ats.iot.eu-west-1.amazonaws.com";
const THING_GROUP = "meteo-station";
const CERT_DIR = "./cert";

const THERMOMETER = "Temp";
const BAROMETER = "Bar";
const HUMIDITY = "Humidity";

const createMeteoStation = (thingId: string, sensors: Sensor[]) => {
  const connection = new ThingConnection(`${CERT_DIR}/${THING_GROUP}`, ENDPOINT, THING_GROUP, thingId);
  return new MeteoStation(connection, sensors);
};

const thing1 = createMeteoStation("meteo-001", [
  new Sensor(THERMOMETER, "C", 0, 30),
  new Sensor(BAROMETER, "mb", 900, 1100),
  new Sensor(HUMIDITY, "%", 20, 100),
]);
const thing2 = createMeteoStation("meteo-002", [
  new Sensor(THERMOMETER, "F", 32, 100),
  new Sensor(BAROMETER, "mmHg", 675, 825),
  new Sensor(HUMIDITY, "%", 20, 100),
]);

thing1.start().then(() => console.log("Thing1 started"));
thing2.start().then(() => console.log("Thing2 started"));
