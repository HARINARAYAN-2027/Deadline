// src/services/calendarService.js
export const getCalendarEventsMatrix = async () => {
  return [
    { id: 1, day: 23, name: "Data Structures Assignment Due", time: "11:59 PM", type: "academic" },
    { id: 2, day: 24, name: "DBMS Project Report Deadline", time: "05:00 PM", type: "academic" }
  ];
};