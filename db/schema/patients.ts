import {
    decimal,
    pgTable,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";

import { users } from "./users";
import { timestamps } from "../helpers/columns.helpers";

export const patients = pgTable("patient", {
    userId: varchar("user_id", { length: 255 })
        .primaryKey()
        .references(() => users.id),
    dateOfBirth: timestamp("date_of_birth").notNull(),
    bloodGroup: varchar("blood_group", { length: 5 }),
    insuranceInfo: text("insurance_info"),
    address1: text("address1").notNull(),
    address2: text("address2"),
    height: decimal("height").notNull(),
    weight: decimal("weight").notNull(),
    alergy: varchar("alergy", { length: 255 }).notNull(),
    diet: varchar("diet", { length: 255 }).notNull(),
    ...timestamps,
});
