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

export function calculateDifferenceInDays(dueDate: Date): number {

    const current = new Date().getTime();
    const due = new Date(dueDate).getTime();

    // Calculate the difference in milliseconds
    const differenceInMillis = current - due;

    // Calculate the difference in days (1 day = 24 * 60 * 60 * 1000 ms)
    const differenceInDays = Math.ceil(differenceInMillis / (1000 * 60 * 60 * 24));
    // console.log('differenceInDays:', differenceInDays);

    // Return the difference in days, or 0 if the end date is earlier than the start date
    return differenceInDays > 0 ? differenceInDays : 0;
}

export function subDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
}

export function isAfter(date: Date, comparisonDate: Date): boolean {
    return date.getTime() > comparisonDate.getTime();
}
