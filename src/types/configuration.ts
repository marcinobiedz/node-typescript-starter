export type Configuration = {
    database: DatabaseConfiguration
}

export type DatabaseConfiguration = {
    user: string,
    password: string
    database: string
}