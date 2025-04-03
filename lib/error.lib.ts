export const flatternFieldErrors = (errors: {
    [key: string]: string[] | string;
}): { [key: string]: string } => {
    const flatErrors: { [key: string]: string } = {};

    for (const field in errors) {
        if (errors.hasOwnProperty(field)) {
            const errorMessages = errors[field];
            if (Array.isArray(errorMessages)) {
                flatErrors[field] = errorMessages.join(", ");
            }
        }
    }

    return flatErrors;
};
