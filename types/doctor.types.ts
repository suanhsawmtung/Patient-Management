import { DoctorFormSchema } from "@/validations/doctor.validations";
import { z } from "zod";

export type DoctorFormSchemaType = z.infer<typeof DoctorFormSchema>;

export interface Department {
    id: string;
    name: string;
    slug: string;
    description: string;
}

export interface Availability {
    doctorId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
}

export interface DoctorT {
    id: string;
    firstName: string;
    lastName: string;
    slug: string;
    email: string;
    phone: string;
    role: "doctor";
    gender: "male" | "female" | "other";
    createdAt: string; // ISO date string
    userId: string;
    specialty: string;
    degree: string;
    contactNumber: string;
    licenseNumber: string;
    consultationFee: string;
    departments: Department[];
    availability: Availability[];
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
    doctorAvailability: Availability[];
}
