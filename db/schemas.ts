import { users } from "./schema/users";
import { accountants } from "./schema/accountants";
import { appointments } from "./schema/appointments";
import { departments } from "./schema/departments";
import { doctors } from "./schema/doctors";
import { doctorDepartments } from "./schema/doctor-departments";
import { patients } from "./schema/patients";
import { invoices } from "./schema/invoices";
import { receptionists } from "./schema/receptionists";
import { medicalRecords } from "./schema/medical-records";
import { notifications } from "./schema/notifications";
import { doctorAvailability } from "./schema/doctor-availability";

export {
    users as usersTable,
    accountants as accountantsTable,
    appointments as appointmentsTable,
    departments as departmentsTable,
    doctors as doctorsTable,
    doctorDepartments as doctorDepartmentsTable,
    patients as patientsTable,
    invoices as invoicesTable,
    receptionists as receptionistsTable,
    medicalRecords as medicalRecordsTable,
    notifications as notificationsTable,
    doctorAvailability as doctorAvailabilityTable,
};
