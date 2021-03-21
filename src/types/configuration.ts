export type Configuration = {
  database: DatabaseConfiguration;
  metalsAPI: MetalsApiConfiguration;
};

export type DatabaseConfiguration = {
  user: string;
  password: string;
  database: string;
};

export type MetalsApiConfiguration = {
  base: string;
  symbols: string[];
};
