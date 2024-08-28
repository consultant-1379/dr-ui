export interface InputConfigurationDetails {
  id: number | string;
  name: string;
  description: string;
  inputs: InputConfigValue[];
}

export interface InputConfigValue {
  name: string;
  value?: string | number | boolean;
  pickList?: Array<string | number | boolean>;
}