export interface Application {
  id: string;
  name: string;
  description: string;
  jobs?: any[];
}

export interface ApplicationJob {
  name?: string;
  description?: string;
  discover?: any;
  reconcile?: any;
  api?: ApplicationJobApi;
}

export interface ApplicationJobApi {
  properties: [ApplicationProperty];
}

export interface ApplicationProperty {
  name: string;
}
