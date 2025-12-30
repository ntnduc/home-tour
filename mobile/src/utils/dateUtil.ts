export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const getCurrentDate = () => {
  return new Date();
};

export const getNextMonth = (dateTime?: Date) => {
  const now = dateTime ? new Date(dateTime) : getCurrentDate();
  const currentMonth = now.getMonth() + 1;

  return currentMonth === 12 ? 1 : currentMonth + 1;
};

export const getNextMonthDate = (dateTime?: Date) => {
  const now = dateTime ? new Date(dateTime) : getCurrentDate();
  now.setMonth(now.getMonth() + 1);
  return now;
};
