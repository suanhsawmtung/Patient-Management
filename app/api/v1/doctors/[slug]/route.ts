import { getDoctor } from "@/services/doctor.services";

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

// edit
export const PUT = async () => {};

// partial edit
export const PATCH = async () => {};
