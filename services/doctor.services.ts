import { doctors } from "@/data/doctor.data";
import { db } from "@/db/drizzle";
import { getArrayDifferences } from "@/db/helpers/array.helpers";
import { GenderEnum } from "@/db/schema/users";
import {
    departmentsTable,
    doctorAvailabilityTable,
    doctorDepartmentsTable,
    doctorsTable,
    usersTable,
} from "@/db/schemas";
import { hashOfPassword } from "@/lib/password.lib";
import { Department, DoctorPayload, DoctorT } from "@/types/doctor.types";
import { NewUserT } from "@/types/users.types";
import { and, desc, eq, ilike, SQL } from "drizzle-orm";

export const getAllDoctors = async (
    query: string,
    gender: GenderEnum,
    pageSize: number,
    pageIndex: number
) => {
    const limit = pageSize;
    const offset = (pageIndex - 1) * pageSize;

    const filters: SQL[] = [eq(usersTable.role, "doctor")];

    if (query) {
        const keyword = `%${query.trim()}%`;
        filters.push(
            // @ts-expect-error @ts-ignore
            or(
                ilike(usersTable.email, keyword),
                ilike(usersTable.firstName, keyword),
                ilike(usersTable.lastName, keyword)
            )
        );
    }

    if (gender) filters.push(eq(usersTable.gender, gender));

    return db
        .select()
        .from(usersTable)
        .where(and(...filters))
        .innerJoin(doctorsTable, eq(doctorsTable.userId, usersTable.id))
        .orderBy(desc(usersTable.created_at))
        .limit(limit)
        .offset(offset)
        .then((res) => {
            return res.map((u) => ({
                id: u.user.id,
                firstName: u.user.firstName,
                lastName: u.user.lastName,
                slug: u.user.slug,
                email: u.user.email,
                phone: u.user.phone,
                gender: u.user.gender,
                role: u.user.role,
                specialty: u.doctor.specialty,
                degree: u.doctor.degree,
                contactNumber: u.doctor.contactNumber,
                licenseNumber: u.doctor.licenseNumber,
                consultationFee: u.doctor.consultationFee,
            }));
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
    userWithDoctor: DoctorT,
    updateData: DoctorPayload
) => {
    // User
    const updatedUser = db
        .update(usersTable)
        .set({
            firstName: updateData.firstName,
            lastName: updateData.lastName,
            email: updateData.email,
            phone: updateData.phone,
            gender: updateData.gender as GenderEnum,
        })
        .where(eq(usersTable.id, userWithDoctor.id))
        .returning({
            id: usersTable.id,
            email: usersTable.email,
            firstName: usersTable.firstName,
            lastName: usersTable.lastName,
            phone: usersTable.phone,
            gender: usersTable.gender,
        })
        .then((res) => res[0]);

    // Doctor
    const updatedDoctor = await db
        .update(doctorsTable)
        .set({
            specialty: updateData.specialty,
            degree: updateData.degree,
            contactNumber: updateData.contactNumber,
            licenseNumber: updateData.licenseNumber,
            consultationFee: updateData.consultationFee,
        })
        .where(eq(doctorsTable.userId, userWithDoctor.id))
        .returning({
            userId: doctorsTable.userId,
            specialty: doctorsTable.specialty,
            degree: doctorsTable.degree,
            contactNumber: doctorsTable.contactNumber,
            licenseNumber: doctorsTable.licenseNumber,
            consultationFee: doctorsTable.consultationFee,
        })
        .then((res) => res[0]);

    // Departments
    const existingDepartmentsIds = await db
        .select()
        .from(doctorDepartmentsTable)
        .where(eq(doctorDepartmentsTable.doctorId, userWithDoctor.id))
        .then((res) => {
            return res.map((d) => d.departmentId);
        });
    const newDepartmentsIds = updateData.dpeartmentIds;
    const { newItems, removedItems } = getArrayDifferences(
        existingDepartmentsIds,
        newDepartmentsIds
    );
    Promise.all(
        removedItems.map((removeItem) => {
            return db
                .delete(doctorDepartmentsTable)
                .where(
                    and(
                        eq(doctorDepartmentsTable.departmentId, removeItem),
                        eq(doctorDepartmentsTable.doctorId, userWithDoctor.id)
                    )
                );
        })
    );
    await Promise.all(
        newItems.map((newItem) => {
            return db
                .insert(doctorDepartmentsTable)
                .values({
                    doctorId: userWithDoctor.id,
                    departmentId: newItem,
                })
                .returning({
                    doctorId: doctorDepartmentsTable.doctorId,
                    departmentId: doctorDepartmentsTable.departmentId,
                });
        })
    );

    // Doctor Availability
    const existingDoctorAvailability = await db
        .select()
        .from(doctorAvailabilityTable)
        .where(eq(doctorAvailabilityTable.doctorId, userWithDoctor.id))
        .then((res) => {
            return res.map((a) => a.dayOfWeek);
        });
    const newDoctorAvailability = updateData.doctorAvailability.map(
        (a) => a.dayOfWeek
    );
    const { newItems: newAvailabilities, removedItems: oldAvailabilities } =
        getArrayDifferences(existingDoctorAvailability, newDoctorAvailability);
    Promise.all(
        oldAvailabilities.map((_removeItem) => {
            return db
                .delete(doctorAvailabilityTable)
                .where(
                    and(
                        eq(doctorAvailabilityTable.dayOfWeek, _removeItem),
                        eq(doctorAvailabilityTable.doctorId, userWithDoctor.id)
                    )
                );
        })
    );
    await Promise.all(
        newAvailabilities.map((_newItem) => {
            const availability = updateData.doctorAvailability.filter(
                (n) => n.dayOfWeek === _newItem
            )[0];

            return db
                .insert(doctorAvailabilityTable)
                .values({
                    doctorId: userWithDoctor.id,
                    dayOfWeek: _newItem,
                    startTime: availability.startTime,
                    endTime: availability.endTime,
                    isAvailable: availability.isAvailable,
                })
                .returning({
                    doctorId: doctorAvailabilityTable.doctorId,
                    dayOfWeek: doctorAvailabilityTable.dayOfWeek,
                    startTime: doctorAvailabilityTable.startTime,
                    endTime: doctorAvailabilityTable.endTime,
                    isAvailable: doctorAvailabilityTable.isAvailable,
                });
        })
    );

    return {
        ...updatedUser,
        ...updatedDoctor,
    };
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
