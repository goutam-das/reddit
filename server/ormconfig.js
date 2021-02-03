module.exports = {
  host: process.env.DB_HOST,
  type: 'postgres',
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    'build/**/**.entity.js',
  ],
  migrations: [
    'build/database/migrations/*.js',
  ],
  cli: {
    migrationsDir: 'build/database/migrations',
  },
  synchronize: true,
  logging: true
};