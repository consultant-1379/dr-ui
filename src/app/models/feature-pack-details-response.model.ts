import { Application } from "./application.model";
import { Asset } from "./asset.model";
import { InputConfiguration } from "./input-configuration.model";
import { Listener } from "./listener.model";

export interface FeaturePackDetailsResponse {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  modifiedAt: string;
  applications: Application[];
  listeners: Listener[];
  inputs: InputConfiguration[];
  assets: Asset[];
}