// This file configures how the Prisma CLI reads the schema,
// migrations folder and database connection.
//
// We import "dotenv/config" so environment variables from .env
// are loaded before Prisma reads DATABASE_URL.
import "dotenv/config"

import { defineConfig, env } from "prisma/config"

export default defineConfig({
  // Location of the Prisma schema file.
  schema: "prisma/schema.prisma",

  // Location where Prisma migrations will be created.
  migrations: {
    path: "prisma/migrations",
  },

  // Database connection used by Prisma CLI commands.
  // Using Prisma's env() helper avoids direct process.env access here.
  datasource: {
    url: env("DATABASE_URL"),
  },
})