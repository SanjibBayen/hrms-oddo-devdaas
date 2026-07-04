export const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateRequired = (val: any) => {
  if (val === undefined || val === null) return false;
  if (typeof val === "string") return val.trim().length > 0;
  return true;
};
