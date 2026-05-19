const pad = (value) => String(value).padStart(2, '0');

export const toDateTimeLocalValue = (date = new Date()) => {
  const local = new Date(date);

  return [
    local.getFullYear(),
    pad(local.getMonth() + 1),
    pad(local.getDate()),
  ].join('-') + `T${pad(local.getHours())}:${pad(local.getMinutes())}`;
};

export const calculateRentalHours = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return 0;
  }

  return Math.ceil((end - start) / (1000 * 60 * 60));
};

export const formatDateTime = (date) =>
  date
    ? new Date(date).toLocaleString('en-PK', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : '';
