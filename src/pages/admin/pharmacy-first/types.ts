// src/services/types.ts
export type ServiceKey =
  | "soreThroat"
  | "impetigo"
  | "sinusitis"
  | "uti"
  | "shingles"
  | "aom"
  | "insectBite";

export type FlowNode = {
  id: string;
  question: string;
  description?: string;
  options: {
    label: string;
    nextId?: string;
    outcome?: string;
    danger?: boolean;
  }[];
};

export type ServiceDefinition = {
  key: ServiceKey;
  title: string; // used in UI cards
  subtitle: string; // used in UI cards
  ageBands: string[]; // displayed in Age step
  startId: string; // should be "age" for all
  flow: Record<string, FlowNode>;
};
