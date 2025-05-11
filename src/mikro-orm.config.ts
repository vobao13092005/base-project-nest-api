import { defineConfig, EntityCaseNamingStrategy, LoadStrategy } from "@mikro-orm/core";
import { Migrator } from "@mikro-orm/migrations";
import { MikroOrmModuleSyncOptions } from "@mikro-orm/nestjs";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { SeedManager } from "@mikro-orm/seeder";

const mikroConfig: MikroOrmModuleSyncOptions = {
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  dbName: 'BaseProject',
  schema: 'public',
  user: 'postgres',
  password: 'uoc_j_toi_co_mot_con_meo',
  host: 'localhost',
  port: 1309,
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