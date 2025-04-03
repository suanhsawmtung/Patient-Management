import { doctors } from "@/data/doctor.data";
import { db } from "@/db/drizzle";
import { doctorDepartmentsTable, doctorsTable, usersTable } from "@/db/schemas";
import { hashOfPassword } from "@/lib/password.lib";
import {
    DoctorFormSchemaType,
    DoctorPayload,
    DoctorType,
} from "@/types/doctor.types";
import { NewUserT } from "@/types/users.types";

export const getAllDoctors = async (): Promise<DoctorType[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(doctors);
        }, 1500);
    });
};

export const getDoctor = async (id: string): Promise<DoctorType> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(doctors.filter((doctor) => doctor.id === id)[0]);
        }, 1500);
    });
};

export const createDoctor = async (entity: DoctorPayload) => {
    try {
        const user = await db
            .insert(usersTable)
            .values({
                firstName: entity.firstName,
                passwordHash: hashOfPassword,
                lastName: entity.lastName,
                email: entity.email,
                role: "doctor",
                gender: entity.gender,
                phone: entity.phone,
            } as NewUserT)
            .returning({
                id: usersTable.id,
                firstName: usersTable.firstName,
                lastName: usersTable.lastName,
                email: usersTable.email,
                phone: usersTable.phone,
                gender: usersTable.gender,
                role: usersTable.role,
            })
            .then((u) => u[0]);

        const doctor = await db
            .insert(doctorsTable)
            .values({
                userId: user.id,
                specialty: entity.specialty,
                degree: entity.degree,
                contactNumber: entity.contactNumber,
                licenseNumber: entity.licenseNumber,
                consultationFee: entity.consultationFee,
            })
            .returning({
                userId: doctorsTable.userId,
                specialty: doctorsTable.specialty,
                degree: doctorsTable.degree,
                contactNumber: doctorsTable.contactNumber,
                licenseNumber: doctorsTable.licenseNumber,
                consultationFee: doctorsTable.consultationFee,
            })
            .then((d) => d[0]);

        const doctorDepartmentValues = entity.dpeartmentIds.map(
            (departmentId) => ({
                doctorId: doctor.userId,
                departmentId,
            })
        );

        await db.insert(doctorDepartmentsTable).values(doctorDepartmentValues);

        return { success: true, data: { ...user, doctor } };
    } catch (error) {
        console.error("Error creating doctor:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
};

export const updateDoctor = async (
    id: string,
    updateData: DoctorFormSchemaType
) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const indx = doctors.findIndex((doctor) => doctor.id === id);

            if (indx === -1) {
                reject(new Error("Doctor not found"));
                return;
            }

            doctors[indx] = { ...doctors[indx], ...updateData };
            resolve({ ...doctors[indx], ...updateData });
        }, 1500);
    });
};

export const deleteDoctor = async (id: string) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const indx = doctors.findIndex((doctor) => doctor.id === id);

            if (indx === -1) {
                reject(new Error("Doctor not found"));
                return;
            }

            const deletedDoctor = doctors.splice(indx, 1)[0]; // Remove and store deleted doctor
            resolve(deletedDoctor); // Return the deleted doctor object
        }, 1500);
    });
};
