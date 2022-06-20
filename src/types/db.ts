export interface DB {
  query: any;
}

export interface QueryConfig {
  text: string;
  values?: string[];
}
