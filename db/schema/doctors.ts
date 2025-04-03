import { decimal, pgTable, varchar } from "drizzle-orm/pg-core";

import { users } from "./users";
import { departments } from "./departments";
import { timestamps } from "../helpers/columns.helpers";

export const doctors = pgTable("doctor", {
    userId: varchar("user_id", { length: 255 })
        .primaryKey()
        .references(() => users.id),
    specialty: varchar("specialty", { length: 255 }).notNull(),
    degree: varchar("degree", { length: 255 }).notNull(),
    contactNumber: varchar("contact_number", { length: 255 }).notNull(),
    licenseNumber: varchar("license_number", { length: 255 })
        .notNull()
        .unique(),
    consultationFee: decimal("consultation_fee").notNull(),
    departmentId: varchar("department_id").references(() => departments.id),
    ...timestamps,
});
