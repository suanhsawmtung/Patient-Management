import { config } from "dotenv";

export const configEnv = () => config({ path: ".env" });

export const env = {
    DATABASE_URL: process.env.DATABASE_URL || "",
    DEMO_PASSWORD_HASH: process.env.DEMO_PASSWORD_HASH || "",
    APP_ENV: process.env.APP_ENV || "local",
    JWT_SECRET: process.env.JWT_SECRET || "private-secret-key",
    JWT_EXPIRY: process.env.JWT_EXPIRY || "1d",
};

export const isProduction = () => env.APP_ENV === "production";
