import {
    boolean,
    integer,
    pgTable,
    primaryKey,
    varchar,
} from "drizzle-orm/pg-core";

import { doctors } from "./doctors";
import { timestamps } from "../helpers/columns.helpers";

export const doctorAvailability = pgTable(
    "doctor_availability",
    {
        doctorId: varchar("doctor_id")
            .references(() => doctors.userId)
            .notNull(),
        dayOfWeek: integer("day_of_week").notNull(),
        startTime: varchar("start_time", { length: 255 }).notNull(),
        endTime: varchar("end_time", { length: 255 }).notNull(),
        isAvailable: boolean("is_available").default(true),
        ...timestamps,
    },
    (table) => ({
        pk: primaryKey({ columns: [table.doctorId, table.dayOfWeek] }),
    })
);
