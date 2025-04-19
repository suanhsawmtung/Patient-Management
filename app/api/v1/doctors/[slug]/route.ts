import { getDoctor, updateDoctor } from "@/services/doctor.services";
import { catchError } from "@/services/error.services";
import { DoctorPayload } from "@/types/doctor.types";

/**
 * Get doctor by slug.
 *
 * @param {Request} req - The incoming request.
 * @param {{ params: { slug: string } }} context - The route parameters.
 * @returns {Promise<Response>} - The response containing the doctor or an error message.
 */
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

    const { data: userWithDoctor, error } = await getDoctor(slug);

    if (error) {
        return Response.json(
            {
                success: false,
                message: error.message,
                data: null,
            },
            { status: error.status || 400 }
        );
    }

    return Response.json({
        message: "Successfully get a doctor.",
        success: true,
        data: userWithDoctor,
    });
};

/**
 * Update a doctor by slug.
 *
 * @param {Request} req - The incoming HTTP request containing updated doctor data.
 * @param {{ params: { slug: string } }} context - The route parameters.
 * @returns {Promise<Response>} - A response indicating success or failure of the update.
 *
 * @typedef {Object} DoctorPayload
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} phone
 * @property {string} gender
 * @property {string} contactNumber
 * @property {string} specialty
 * @property {string} degree
 * @property {string} licenseNumber
 * @property {string} consultationFee
 * @property {string[]} dpeartmentIds
 * @property {Availability[]} doctorAvailability
 */
export const PUT = async (
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) => {
    try {
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

        const { data: userWithDoctor, error } = await getDoctor(slug);
        if (error || !userWithDoctor) {
            return Response.json(
                {
                    success: false,
                    message: error?.message,
                    data: null,
                },
                { status: error?.status || 400 }
            );
        }

        const entity: DoctorPayload = await req.json();

        const data = await updateDoctor(userWithDoctor, entity);

        return Response.json({
            message: "Successfully updated a doctor.",
            success: true,
            data,
        });
    } catch (error) {
        return catchError(error);
    }
};

// partial edit | finding usecase
export const PATCH = async () => {};
