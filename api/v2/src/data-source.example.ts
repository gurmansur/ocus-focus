import { DataSource, DataSourceOptions } from 'typeorm';

export const appDataSource = new DataSource({
  type: 'mysql',
  host: '<database-host>',
  port: 1234, // replace with your database port
  username: '<database-username>',
  password: '<database-password>',
  database: '<database-name>',
  entities: ['**/*.entity*{.js,.ts}'],
  migrations: [__dirname + '/migrations/*{.js,.ts}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
} as DataSourceOptions);
