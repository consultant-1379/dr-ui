export interface JobReconcileObjects {
  objectId: string,
  inputs?: object,
  filters?: [object]
}

export interface JobReconcileData {
  name?: string,
  description?: string,
  inputs: object,
  objects: JobReconcileObjects[]
}

export interface JobReconcileAllData {
  name?: string,
  description?: string,
  inputs: object
}