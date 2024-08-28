import { JobExecutionOptions } from "./job-execution-options.model"

export interface ExecutionJob {
  name?: string
  description?: string
  featurePackId?: string
  featurePackName?: string
  applicationId?: string
  applicationName?: string
  applicationJobName?: string
  inputs?: Inputs
  executionOptions?: JobExecutionOptions;
}

export interface Inputs {
  [x: string]: string
}