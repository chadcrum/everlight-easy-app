export interface LightSequence {
  id: string;
  colorMode: string;
  pattern: string[];
  effects: unknown[];
  alias?: string;
  groups?: string[];
  lastChanged?: string;
}

export interface LightSubmission {
  effects: unknown[];
  pattern: string[];
  colorMode: string;
}