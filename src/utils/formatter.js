// src/utils/formatter.js

// Seconds ko 00:00 configuration counter strings
export const formatPomodoroTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Date standard formatting conversion rule logic
export const formatDateString = (dateObj) => {
  if (!dateObj) return '';
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(dateObj).toLocaleDateString('en-IN', options);
};

// Long text blocks line clamps boundary string helper
export const truncateText = (text, maxLength = 60) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
