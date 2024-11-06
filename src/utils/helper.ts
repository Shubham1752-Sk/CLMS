import bcrypt from "bcryptjs"

// helper function to salt and hassh the user passowrd
export function saltAndHashPassword(password: any) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

// Helper function to return the due date (14 days from the current date)
export function calculateDueDate(): Date {
    const currentDate = new Date();
    const dueDate = new Date(currentDate);

    // Add 14 days to the current date
    dueDate.setDate(currentDate.getDate() + 14);

    return dueDate;
}