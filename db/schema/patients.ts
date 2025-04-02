import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { users } from "./users";
import { timestamps } from "../helpers/columns.helpers";

export const patients = pgTable("patient", {
    userId: varchar("user_id", { length: 255 })
        .primaryKey()
        .references(() => users.id),
    dateOfBirth: timestamp("date_of_birth").notNull(),
    bloodGroup: varchar("blood_group", { length: 5 }),
    insuranceInfo: text("insurance_info"),
    address: text("address"),
    ...timestamps,
});
