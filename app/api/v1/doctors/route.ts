import { GenderEnum } from "@/db/schema/users";
import { createDoctor, getAllDoctors } from "@/services/doctor.services";
import { catchError } from "@/services/error.services";
import { DoctorPayload } from "@/types/doctor.types";
import { validateDoctorData } from "@/validations/doctor.validations";
import { NextRequest } from "next/server";

/**
 * Get All
 *
 * @param request
 * @returns {Promise<Doctor[]>} - A list of doctors.
 *
 * @property {string} [query] - Search keyword for name/email.
 * @property {'male' | 'female'} [gender] - Gender filter.
 * @property {number} [pageSize] - Number of results per page.
 * @property {number} [pageIndex] - Page number (zero-based).
 */
export const GET = async (request: NextRequest) => {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get("query");
        const gender = searchParams.get("gender") as GenderEnum;
        const pageSize = Number(searchParams.get("pageSize") ?? 10);
        const pageIndex = Number(searchParams.get("pageIndex") ?? 1);

        const allowedGenderParams: GenderEnum[] = ["male", "female"];
        if (gender && !allowedGenderParams.includes(gender)) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid gender parameter",
                    error: "Invalid gender parameter",
                },
                { status: 400 }
            );
        }

        const data = await getAllDoctors(
            query as string,
            gender,
            pageSize,
            pageIndex
        );

        return Response.json(
            {
                message: "Successfully fetched data",
                success: true,
                data,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return catchError(error);
    }
};

/**
 * Create
 *
 * @param {Request} req - The incoming HTTP request.
 * @returns {Promise<Response>} - The server response.
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
export const POST = async (req: Request) => {
    try {
        const entity: DoctorPayload = await req.json();

        const validationResult = await validateDoctorData(entity);

        if (!validationResult.isValid) {
            return Response.json(
                {
                    success: false,
                    message:
                        validationResult?.error?.message ||
                        "Something Went Wrong !",
                    error: validationResult?.error?.details || null,
                },
                { status: 400 }
            );
        }

        const result = await createDoctor(entity);

        if (!result.success) {
            return Response.json(
                {
                    success: false,
                    message: "Failed to create doctor",
                    error: result.error,
                },
                { status: 500 }
            );
        }

        return Response.json({
            success: true,
            message: "Doctor created Successfully",
            data: result.data,
        });
    } catch (error) {
        return catchError(error);
    }
};
