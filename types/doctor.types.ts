import { DoctorFormSchema } from "@/validations/doctor.validations";
import { z } from "zod";

export type DoctorFormSchemaType = z.infer<typeof DoctorFormSchema>;

export interface DoctorType {
    id: string;
    title: string;
    firstName: string;
    lastName: string;
    department: string;
    contact_no: string;
    email: string;
    degree: string;
    pending_appointment: number;
    complete_appointment: number;
    fees: string;
    experience: string;
    available_days: string[];
    slots_time: string;
    available_time_from: string;
    available_time_to: string;
    created_at: string;
    updated_at: string;
}

export interface DoctorPayload {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;

    contactNumber: string;
    specialty: string;
    degree: string;
    licenseNumber: string;
    consultationFee: string;

    dpeartmentIds: string[];
}
