export const getNameFromEmail = (email: string): string => {
  if (!email) return "Пользователь";
  const namePart = email.split("@")[0];
  return namePart.charAt(0).toUpperCase() + namePart.slice(1).toLowerCase();
};
