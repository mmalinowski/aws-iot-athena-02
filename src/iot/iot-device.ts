import { mqtt } from "aws-iot-device-sdk-v2";
import { Payload, Sensor } from "./types";
import { createMqttConnection } from "../utils/mqtt";
import { CronJob } from "cron";

export class ThingConnection {
  private topic: string;

  private clientConnection: mqtt.MqttClientConnection;

  constructor(certDir: string, endpoint: string, deviceGroup: string, readonly thingId: string) {
    this.topic = `devices/${deviceGroup}/${this.thingId}`;
    this.clientConnection = this.setupMqttConnection(certDir, endpoint);
  }

  private setupMqttConnection = (certDir: string, endpoint: string) =>
    createMqttConnection(
      endpoint,
      this.thingId,
      `./root-ca.crt`,
      `${certDir}/${this.thingId}/cert.pem`,
      `${certDir}/${this.thingId}/private.key`
    );

  connect = async () => {
    await this.clientConnection.connect();
    console.log(`Thing ${this.thingId} connected succesfully`);
  };

  publish = async (payload: string) => {
    console.debug(`Thing ${this.thingId} is publishing results: ${payload}`);
    return this.clientConnection.publish(this.topic, payload, mqtt.QoS.AtLeastOnce);
  };
}

export class MeteoStation {
  constructor(private readonly connection: ThingConnection, private readonly sensors: Sensor[]) {}

  start = async () => {
    await this.connection.connect();
    this.createScheduler().start();
  };

  private createScheduler = () =>
    new CronJob("0 */5 * * * *", async () => {
      await this.publishCurrentValues();
    });

  private publishCurrentValues = async () => {
    const payload: Payload = {
      deviceId: this.connection.thingId,
      timestamp: new Date().getTime(),
      values: this.sensors.map((sample) => {
        return {
          name: sample.name,
          unit: sample.unit,
          value: sample.value,
        };
      }),
    };
    return this.connection.publish(JSON.stringify(payload));
  };
}
