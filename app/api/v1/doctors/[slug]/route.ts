import { db } from "@/db/drizzle";
import {
    departmentsTable,
    doctorAvailabilityTable,
    doctorDepartmentsTable,
    doctorsTable,
    usersTable,
} from "@/db/schemas";
import { eq } from "drizzle-orm";

// get by slug
export const GET = async (
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) => {
    const slug = (await params)?.slug;

    if (!slug) {
        return Response.json(
            {
                message: "No Slug Provided",
                success: false,
                data: null,
            },
            { status: 400 }
        );
    }

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
        .innerJoin(doctorsTable, eq(doctorsTable.userId, usersTable.id));

    if (!doctorResult.length) {
        return Response.json(
            {
                success: false,
                message: "Doctor not found",
                data: null,
            },
            { status: 404 }
        );
    }

    const departments = await db
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
        .where(
            eq(doctorDepartmentsTable.doctorId, doctorResult[0].doctor.userId)
        );

    const availability = await db
        .select()
        .from(doctorAvailabilityTable)
        .where(
            eq(doctorAvailabilityTable.doctorId, doctorResult[0].doctor.userId)
        );

    const userWithDoctor = {
        ...doctorResult[0].user,
        ...doctorResult[0].doctor,
        departments,
        availability,
    };

    if (!userWithDoctor) {
        return Response.json(
            {
                success: false,
                message: "Doctor not found",
                data: null,
            },
            { status: 404 }
        );
    }

    return Response.json({
        message: "Successfully get a doctor.",
        success: true,
        data: userWithDoctor,
    });
};

// edit
export const PUT = async () => {};

// partial edit
export const PATCH = async () => {};
