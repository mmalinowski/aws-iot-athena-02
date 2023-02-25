export class Sensor {
  constructor(public readonly name: string, public readonly unit: string, private readonly min: number, private readonly max: number) {}

  get value() {
    return Math.floor(Math.random() * (this.max - this.min + 1) + this.min);
  }
}

export interface Payload {
  deviceId: string;
  timestamp: number;
  values: Partial<Sensor>[];
}
