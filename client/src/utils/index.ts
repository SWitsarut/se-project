export const formatDate = (date: Date) => {
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
  
  return formattedDate;
}

export const BASE_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";