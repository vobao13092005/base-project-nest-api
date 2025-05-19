import { defineConfig, EntityCaseNamingStrategy } from "@mikro-orm/core";
import { Migrator } from "@mikro-orm/migrations";
import { MySqlDriver } from "@mikro-orm/mysql";
import { MikroOrmModuleSyncOptions } from "@mikro-orm/nestjs";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { SeedManager } from "@mikro-orm/seeder";

const mikroConfig: MikroOrmModuleSyncOptions = {
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  dbName: 'BaseProject',
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  schema: "public",
  port: 5432,
  namingStrategy: EntityCaseNamingStrategy,
  driver: PostgreSqlDriver,
  seeder: {
    path: './src/seeders',
    glob: '!(*.d).{js,ts}',
    emit: 'ts',
    fileName: (className: string) => className,
  },
  extensions: [Migrator, SeedManager],
}

export default defineConfig(mikroConfig);