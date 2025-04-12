// src/utils/dateUtils.js
import { format, parseISO, isAfter, isBefore } from "date-fns";

export const formatSlotTime = (isoString) => {
  if (!isoString) return "N/A";
  try {
    return format(parseISO(isoString), "MMM dd, yyyy h:mm a");
  } catch {
    return "Invalid date";
  }
};

export const isSlotActive = (slot) => {
  const now = new Date();
  const start = parseISO(slot.start);
  const end = parseISO(slot.end);
  return isAfter(now, start) && isBefore(now, end);
};
