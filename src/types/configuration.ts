export type Config = {
  database: DatabaseConfig;
  metalsAPI: MetalsApiConfig;
};

export type DatabaseConfig = {
  user: string;
  database: string;
};

export type MetalsApiConfig = {
  base: string;
  symbols: string[];
};

export type DatabaseInnerConfig = DatabaseConfig & {
  password: string;
  host: string;
};

export type MetalsApiInnerConfig = MetalsApiConfig & {
  token: string;
};
