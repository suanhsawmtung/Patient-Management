import { sql } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { patients } from "./patients";
import { doctors } from "./doctors";
import { timestamps } from "../helpers/columns.helpers";
import { generateUniqueString } from "../helpers/slug.helpers";

export const appointmentStatusEnum = pgEnum("appointment_status", [
    "scheduled",
    "completed",
    "canceled",
    "rescheduled",
]);

export const appointments = pgTable("appointment", {
    id: varchar("id", { length: 255 })
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    slug: varchar().$default(() => generateUniqueString(16)),
    patientId: varchar("patient_id")
        .references(() => patients.userId)
        .notNull(),
    doctorId: varchar("doctor_id")
        .references(() => doctors.userId)
        .notNull(),
    date: timestamp("date").notNull(),
    status: appointmentStatusEnum("status").notNull().default("scheduled"),
    notes: text("notes"),
    ...timestamps,
});
