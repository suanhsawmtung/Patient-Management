import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

export default defineConfig({
    dialect: "postgresql",
    schema: "./db/schema",
    out: "./migrations",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
