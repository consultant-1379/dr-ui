import { InputConfiguration } from "./input-configuration.model";
import { Application } from "./application.model";
import { Listener } from "./listener.model";
import { Asset } from "./asset.model";

export interface FeaturePack {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  modifiedAt: string;
  applications?: Application[];
  listeners?: Listener[];
  inputs?: InputConfiguration[];
  assets?: Asset[];
}
