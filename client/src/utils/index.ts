export const formatDate = (date: Date) => {
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });

  return formattedDate;
};

export const formatDateToAgo = (date: Date): string => {
  const currentTimestamp: number = Math.floor(Date.now() / 1000);
  const timestamp: number = Math.floor(date.getTime() / 1000);
  const timeDifference: number = currentTimestamp - timestamp;

  if (timeDifference < 60) {
    return "just now";
  } else if (timeDifference < 60 * 60) {
    const minutesAgo: number = Math.floor(timeDifference / 60);
    return `${minutesAgo} minute${minutesAgo === 1 ? "" : "s"} ago`;
  } else if (timeDifference < 24 * 60 * 60) {
    const hoursAgo: number = Math.floor(timeDifference / (60 * 60));
    return `${hoursAgo} hour${hoursAgo === 1 ? "" : "s"} ago`;
  } else if (timeDifference < 30 * 24 * 60 * 60) {
    const daysAgo: number = Math.floor(timeDifference / (24 * 60 * 60));
    return `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`;
  } else if (timeDifference < 12 * 30 * 24 * 60 * 60) {
    const monthsAgo: number = Math.floor(timeDifference / (30 * 24 * 60 * 60));
    return `${monthsAgo} month${monthsAgo === 1 ? "" : "s"} ago`;
  } else {
    const yearsAgo: number = Math.floor(
      timeDifference / (12 * 30 * 24 * 60 * 60),
    );
    return `${yearsAgo} year${yearsAgo === 1 ? "" : "s"} ago`;
  }
};
