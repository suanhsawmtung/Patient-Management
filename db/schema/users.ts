import { pgTable, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { timestamps } from "../helpers/columns.helpers";
import { generateUniqueString } from "../helpers/slug.helpers";

export const roleEnum = pgEnum("role", [
    "admin",
    "accountant",
    "doctor",
    "patient",
    "receptionist",
]);

export const genderEnum = pgEnum("gender", ["male", "female", "other"]);

export const users = pgTable("user", {
    id: varchar("id", { length: 255 })
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    email: varchar("email", { length: 255 }).notNull().unique(),
    slug: varchar().$default(() => generateUniqueString(16)),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    role: roleEnum("role").notNull(),
    gender: genderEnum("gender").notNull(),
    image: varchar("image"),
    ...timestamps,
});
