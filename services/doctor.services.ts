import { doctors } from "@/data/doctor.data";
import { db } from "@/db/drizzle";
import {
    departmentsTable,
    doctorAvailabilityTable,
    doctorDepartmentsTable,
    doctorsTable,
    usersTable,
} from "@/db/schemas";
import { hashOfPassword } from "@/lib/password.lib";
import {
    Department,
    DoctorFormSchemaType,
    DoctorPayload,
    DoctorT,
} from "@/types/doctor.types";
import { NewUserT } from "@/types/users.types";
import { eq } from "drizzle-orm";

export const getAllDoctors = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(doctors);
        }, 1500);
    });
};

export const getDoctor = async (
    slug: string
): Promise<{
    data: DoctorT | null;
    error: { message?: string; status?: number } | null;
}> => {
    const error: { message?: string; status?: number } = {};

    const doctorResult = await db
        .select({
            user: {
                id: usersTable.id,
                firstName: usersTable.firstName,
                lastName: usersTable.lastName,
                slug: usersTable.slug,
                email: usersTable.email,
                phone: usersTable.phone,
                role: usersTable.role,
                gender: usersTable.gender,
                createdAt: usersTable.created_at,
            },
            doctor: {
                userId: doctorsTable.userId,
                specialty: doctorsTable.specialty,
                degree: doctorsTable.degree,
                contactNumber: doctorsTable.contactNumber,
                licenseNumber: doctorsTable.licenseNumber,
                consultationFee: doctorsTable.consultationFee,
            },
        })
        .from(usersTable)
        .where(eq(usersTable.slug, slug))
        .innerJoin(doctorsTable, eq(doctorsTable.userId, usersTable.id))
        .then((d) => d[0] || null);

    if (!doctorResult) {
        error["message"] = "Doctor not found";
        error["status"] = 404;

        return {
            data: null,
            error,
        };
    }

    const departments = await getDepartmentsByDoctor(
        doctorResult.doctor.userId
    );

    const availability = await getDoctorAvailability(
        doctorResult.doctor.userId
    );

    const userWithDoctor = {
        ...doctorResult.user,
        ...doctorResult.doctor,
        departments,
        availability,
    };

    return {
        // @ts-expect-error @ts-ignore
        data: userWithDoctor,
        error: null,
    };
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
        const departments = await db
            .insert(doctorDepartmentsTable)
            .values(doctorDepartmentValues);

        const doctorAvailabilityValues = entity.doctorAvailability.map(
            (availability) => ({
                doctorId: doctor.userId,
                dayOfWeek: availability.dayOfWeek,
                startTime: availability.startTime,
                endTime: availability.endTime,
                isAvailable: availability.isAvailable || true,
            })
        );
        const availability = await db
            .insert(doctorAvailabilityTable)
            .values(doctorAvailabilityValues);

        return {
            success: true,
            data: {
                ...user,
                doctor: {
                    ...doctor,
                    departments,
                    availability,
                },
            },
        };
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

export const getDepartmentsByDoctor = async (
    doctorId: string
): Promise<Department[]> => {
    // @ts-expect-error @ts-ignore
    return db
        .select({
            id: departmentsTable.id,
            name: departmentsTable.name,
            slug: departmentsTable.slug,
            description: departmentsTable.description,
        })
        .from(doctorDepartmentsTable)
        .innerJoin(
            departmentsTable,
            eq(departmentsTable.id, doctorDepartmentsTable.departmentId)
        )
        .where(eq(doctorDepartmentsTable.doctorId, doctorId));
};

export const getDoctorAvailability = async (doctorId: string) => {
    return db
        .select({
            doctorId: doctorAvailabilityTable.doctorId,
            dayOfWeek: doctorAvailabilityTable.dayOfWeek,
            startTime: doctorAvailabilityTable.startTime,
            endTime: doctorAvailabilityTable.endTime,
            isAvailable: doctorAvailabilityTable.isAvailable,
        })
        .from(doctorAvailabilityTable)
        .where(eq(doctorAvailabilityTable.doctorId, doctorId));
};
