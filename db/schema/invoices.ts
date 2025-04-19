import { sql } from "drizzle-orm";
import {
    decimal,
    pgEnum,
    pgTable,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";
import { patients } from "./patients";
import { appointments } from "./appointments";
import { timestamps } from "../helpers/columns.helpers";
import { generateUniqueString } from "../helpers/slug.helpers";

export const invoiceStatusEnum = pgEnum("invoice_status", [
    "paid",
    "unpaid",
    "partial",
]);

export const invoices = pgTable("invoice", {
    id: varchar("id", { length: 255 })
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    slug: varchar().$default(() => generateUniqueString(16)),
    patientId: varchar("patient_id")
        .references(() => patients.userId)
        .notNull(),
    appointmentId: varchar("appointment_id").references(() => appointments.id),
    amount: decimal("amount").notNull(),
    status: invoiceStatusEnum("status").notNull().default("unpaid"),
    issuedAt: timestamp("issued_at").defaultNow().notNull(),
    dueDate: timestamp("due_date").notNull(),
    paidAt: timestamp("paid_at"),
    ...timestamps,
});
