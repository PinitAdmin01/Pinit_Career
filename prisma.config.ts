import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://postgres@127.0.0.1:5433/postgres?schema=batch15_arch_test'
  }
});
