export const isCanadianPhone = (phone = "") => /^\+1\s?\d{3}-\d{3}-\d{4}$/.test(phone);
