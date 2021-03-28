export type Configuration = {
  database: DatabaseConfiguration;
  metalsAPI: MetalsApiConfiguration;
};

export type DatabaseConfiguration = {
  host: string;
  user: string;
  password: string;
  database: string;
};

export type MetalsApiConfiguration = {
  token: string;
  base: string;
  symbols: string[];
};
