export const catchError = (error: Error | unknown, customMessage?: string) => {
    console.error(customMessage || "Unexpected error:", error);
    return Response.json(
        {
            success: false,
            message: customMessage || "An unexpected error occurred",
            error: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
    );
};
