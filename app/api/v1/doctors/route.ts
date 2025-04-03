import { createDoctor } from "@/services/doctor.services";
import { DoctorPayload } from "@/types/doctor.types";
import { validateDoctorData } from "@/validations/doctor.validations";

// get all
export const GET = async () => {
    // Implementation for GET
};

// create
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
        console.error("Unexpected error:", error);
        return Response.json(
            {
                success: false,
                message: "An unexpected error occurred",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
};
