import { db } from "@/db/drizzle";
import { doctorsTable, usersTable } from "@/db/schemas";
import { flatternFieldErrors } from "@/lib/error.lib";
import { hashOfPassword } from "@/lib/password.lib";
import { DoctorPayload } from "@/types/doctor.types";
import { eq } from "drizzle-orm";
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
    available_days: z.array(z.string()),
    slots_time: z.string().min(2, {
        message: "Last name must be at least 2 characters.",
    }),
    available_time_from: z.string().min(2, {
        message: "Last name must be at least 2 characters.",
    }),
    available_time_to: z.string().min(2, {
        message: "Last name must be at least 2 characters.",
    }),
});

export const doctorValidationSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    gender: z.enum(["male", "female", "other"]),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    specialty: z.string().min(2, "Specialty must be at least 2 characters"),
    degree: z.string().min(2, "Degree must be at least 2 characters"),
    contactNumber: z
        .string()
        .min(10, "Contact number must be at least 10 characters"),
    licenseNumber: z
        .string()
        .min(5, "License number must be at least 5 characters"),
    consultationFee: z.number().positive("Consultation fee must be positive"),
    dpeartmentIds: z
        .array(z.string())
        .min(1, "At least one department is required"),
});

export const validateDoctorData = async (
    entity: DoctorPayload
): Promise<{
    error?: {
        message: string;
        details?: unknown;
    };
    isValid: boolean;
}> => {
    // Validate schema
    const validationResult = doctorValidationSchema.safeParse({
        ...entity,
        password: hashOfPassword,
    });

    if (!validationResult.success) {
        return {
            isValid: false,
            error: {
                message: "Validation failed",
                details: flatternFieldErrors(
                    validationResult.error.formErrors.fieldErrors
                ),
            },
        };
    }

    if (entity?.dpeartmentIds.length === 0) {
        return {
            isValid: false,
            error: {
                message: "At least one department is required",
            },
        };
    }

    const duplicateUser = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, entity.email))
        .then((u) => u[0]);

    if (duplicateUser) {
        return {
            isValid: false,
            error: {
                message: "Duplicate Email",
            },
        };
    }

    const duplicateLicenceNumber = await db
        .select()
        .from(doctorsTable)
        .where(eq(doctorsTable.licenseNumber, entity.licenseNumber))
        .then((d) => d[0]);

    if (duplicateLicenceNumber) {
        return {
            isValid: false,
            error: {
                message: "Duplicate License",
            },
        };
    }

    return { isValid: true };
};
