export const formatDate = (date: Date) => {
  const formattedDate = date.toLocaleDateString('th-GB', {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
  
  return formattedDate;
}