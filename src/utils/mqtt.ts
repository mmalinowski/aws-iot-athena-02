import { iot, mqtt } from "aws-iot-device-sdk-v2";

export const createMqttConnection = (
  endpoint: string,
  clientId: string,
  rootCaPath: string,
  certFilePath: string,
  keyFilePath: string
): mqtt.MqttClientConnection => {
  console.log(`Creating a new mTLS connection to ${endpoint} for client=${clientId}`);

  const mtlsBuilder = iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(certFilePath, keyFilePath);

  mtlsBuilder.with_endpoint(endpoint);
  mtlsBuilder.with_certificate_authority_from_path(undefined, rootCaPath);
  mtlsBuilder.with_clean_session(false);
  mtlsBuilder.with_client_id(clientId);

  return new mqtt.MqttClient().new_connection(mtlsBuilder.build());
};
