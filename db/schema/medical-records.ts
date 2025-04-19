import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { patients } from "./patients";
import { doctors } from "./doctors";
import { timestamps } from "../helpers/columns.helpers";
import { generateUniqueString } from "../helpers/slug.helpers";

export const medicalRecords = pgTable("medical_record", {
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
    diagnosis: text("diagnosis").notNull(),
    treatment: text("treatment").notNull(),
    prescription: text("prescription"),
    date: timestamp("date").defaultNow().notNull(),
    ...timestamps,
});
