import { pgTable, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { timestamps } from "../helpers/columns.helpers";

export const accountants = pgTable("accountant", {
    userId: varchar("user_id", { length: 255 })
        .primaryKey()
        .references(() => users.id),
    certificationNumber: varchar("certification_number", {
        length: 255,
    }).notNull(),
    ...timestamps,
});
