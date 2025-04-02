import { integer, pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";

import { doctors } from "./doctors";

export const doctorAvailability = pgTable(
    "doctor_availability",
    {
        doctorId: varchar("doctor_id")
            .references(() => doctors.userId)
            .notNull(),
        dayOfWeek: integer("day_of_week").notNull(), // 0 (Sunday) to 6 (Saturday)
        startTime: varchar("start_time", { length: 5 }).notNull(), // HH:MM format
        endTime: varchar("end_time", { length: 5 }).notNull(),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.doctorId, table.dayOfWeek] }),
    })
);
