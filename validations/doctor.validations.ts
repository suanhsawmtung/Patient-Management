import { z } from "zod";

export const DoctorFormSchema = z.object({
    firstName: z.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
        message: "Last name must be at least 2 characters.",
    }),
    email: z.string().min(2, {
        message: "First name must be at least 2 characters.",
    }),
    contact_no: z.string().min(2, {
        message: "Last name must be at least 2 characters.",
    }),
    title: z.string().min(2, {
        message: "Last name must be at least 2 characters.",
    }),
    degree: z.string().min(2, {
        message: "Last name must be at least 2 characters.",
    }),
    department: z.string().min(2, {
        message: "First name must be at least 2 characters.",
    }),
    fees: z.string().min(2, {
        message: "Last name must be at least 2 characters.",
    }),
    experience: z.string().min(2, {
        message: "Last name must be at least 2 characters.",
    }),
    available_days: z.array( z.string()),
    slots_time: z.string().min(2, {
        message: "Last name must be at least 2 characters.",
    }),
    available_time_from: z.string().min(2, {
        message: "Last name must be at least 2 characters.",
    }),
    available_time_to: z.string().min(2, {
        message: "Last name must be at least 2 characters.",
    }),
})