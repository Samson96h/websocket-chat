import * as path from 'path';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import * as ENTITIES from 'src/database/entities';

const envFile = path.resolve(__dirname, '.env');

dotenv.config({ path: envFile });

// Фильтруем только функции (классы сущностей)
const entities = Object.values(ENTITIES).filter(
  (entity) => typeof entity === 'function'
);

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: entities,
  migrationsTableName: 'mindgrid_migrations',
  migrations: [path.join(__dirname, 'src/database/migrations/*.{ts,js}')],
  synchronize: false,
  logging: true,
});
