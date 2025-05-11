rm -rf src/migrations/
npx mikro-orm migration:fresh
npx mikro-orm migration:create
npx mikro-orm migration:fresh
npx mikro-orm seeder:run