import { pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { doctors } from "./doctors";
import { departments } from "./departments";
import { timestamps } from "../helpers/columns.helpers";

export const doctorDepartments = pgTable(
    "doctor_departments",
    {
        doctorId: varchar("doctor_id", { length: 255 })
            .notNull()
            .references(() => doctors.userId),
        departmentId: varchar("department_id", { length: 255 })
            .notNull()
            .references(() => departments.id),
        ...timestamps,
    },
    (t) => [primaryKey({ columns: [t.doctorId, t.departmentId] })]
);
