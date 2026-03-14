import { Config } from "@application/config/environment";

export function makeConfig(): Config {
  const config = new Config();
  return config;
}