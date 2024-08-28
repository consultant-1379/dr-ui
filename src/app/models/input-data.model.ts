/**
 * This is format of "input" data in
 * Application details
 * discovery and reconciliation inputs
 */
export interface InputData {
  name: string;
  mandatory?: boolean;
  helpMessage?: string;
  constraints?: {
    validValues?: string;  // won't be in MVP but will be in future
  }
}

