import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

import { users } from "./users";
import { timestamps } from "../helpers/columns.helpers";

export const receptionists = pgTable("receptionist", {
    userId: varchar("user_id", { length: 255 })
        .primaryKey()
        .references(() => users.id),
    shiftStart: timestamp("shift_start").notNull(),
    shiftEnd: timestamp("shift_end").notNull(),
    ...timestamps,
});
