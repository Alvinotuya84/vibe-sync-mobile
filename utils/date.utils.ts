import { createNumberArray } from "./array.utils";

export function getYear18YearsAgo(): number {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const year18YearsAgo = currentYear - 18;
  return year18YearsAgo;
}

function isLeapYear(year: number): boolean {
  // Leap year is divisible by 4, but not divisible by 100 unless it's also divisible by 400.
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export const monthsWithNames = [
  { month: 0, name: "Jan" },
  { month: 1, name: "Feb" },
  { month: 2, name: "Mar" },
  { month: 3, name: "Apr" },
  { month: 4, name: "May" },
  { month: 5, name: "Jun" },
  { month: 6, name: "Jul" },
  { month: 7, name: "Aug" },
  { month: 8, name: "Sep" },
  { month: 9, name: "Oct" },
  { month: 10, name: "Nov" },
  { month: 11, name: "Dec" },
];

export function getDaysInMonth(year: number, month: number) {
  if (month < 0 || month > 12) {
    throw new Error("Invalid month. Month should be between 1 and 12.");
  }

  const daysInMonth = [
    31, // January
    isLeapYear(year) ? 29 : 28, // February (leap year check)
    31, // March
    30, // April
    31, // May
    30, // June
    31, // July
    31, // August
    30, // September
    31, // October
    30, // November
    31, // December
  ];

  return createNumberArray(1, daysInMonth[month]);
}

export function formatDateWithoutDay(date: Date) {
  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

// export function formatDate(date: Date): string {
//     const day = date.getDate();
//     const month = date.getMonth() + 1; // Months are zero-indexed, so we add 1
//     const year = date.getFullYear();

//     // Pad the day and month with leading zeros if needed
//     const formattedDay = day < 10 ? `0${day}` : `${day}`;
//     const formattedMonth = month < 10 ? `0${month}` : `${month}`;

//     return `${formattedDay}/${formattedMonth}/${year}`;
// }

enum DateFormat {
  DDMMYYYY = "DD/MM/YYYY",
  MMDDYYYY = "MM/DD/YYYY",
  YYYYMMDD = "YYYY-MM-DD",
  D_MMM_YYYY = "D MMM YYYY",
  HHmm = "HH:mm",
  hhmmA = "hh:mm A",
  MMMM_YYYY_hh_mm_A = "MMMM YYYY, hh:mm A",
}
export function getYearYearsAgo(yearsAgo: number): number {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const targetYear = currentYear - yearsAgo;
  return targetYear;
}

export function formatDate(
  date: Date,
  format: DateFormat = DateFormat.YYYYMMDD
): string {
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-indexed, so we add 1
  const year = date.getFullYear();

  // Pad the day, month, and year with leading zeros if needed
  const formattedDay = day < 10 ? `0${day}` : `${day}`;
  const formattedMonth = month < 10 ? `0${month}` : `${month}`;
  const formattedYear = `${year}`;

  let formattedDate = format
    .replace("DD", formattedDay)
    .replace("MM", formattedMonth)
    .replace("YYYY", formattedYear)
    .replace("YY", formattedYear.slice(-2))
    .replace("D", day.toString())
    .replace("MMM", getShortMonthName(month))
    .replace("MMMM", getFullMonthName(month))
    .replace("HH", get24HourFormat(date))
    .replace("hh", get12HourFormat(date))
    .replace("mm", getMinutes(date))
    .replace("ss", getSeconds(date))
    .replace("A", getAMPM(date))
    .replace("a", getAMPM(date).toLowerCase());

  return formattedDate;
}

function getShortMonthName(month: number): string {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return monthNames[month - 1];
}

function getFullMonthName(month: number): string {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[month - 1];
}

function get12HourFormat(date: Date): string {
  return (date.getHours() % 12 || 12).toString().padStart(2, "0");
}

function get24HourFormat(date: Date): string {
  return date.getHours().toString().padStart(2, "0");
}

function getMinutes(date: Date): string {
  return date.getMinutes().toString().padStart(2, "0");
}

function getSeconds(date: Date): string {
  return date.getSeconds().toString().padStart(2, "0");
}

function getAMPM(date: Date): string {
  return date.getHours() >= 12 ? "PM" : "AM";
}

export function format12HourTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const hours12 = hours % 12 || 12;
  const minutesPadded = minutes.toString().padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";

  return `${hours12}:${minutesPadded} ${ampm}`;
}

export function formatDateFromString(
  dateString: string,
  format: DateFormat = DateFormat.YYYYMMDD
): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }

  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-indexed, so we add 1
  const year = date.getFullYear();

  // Pad the day, month, and year with leading zeros if needed
  const formattedDay = day < 10 ? `0${day}` : `${day}`;
  const formattedMonth = month < 10 ? `0${month}` : `${month}`;
  const formattedYear = `${year}`;

  let formattedDate = format
    .replace("DD", formattedDay)
    .replace("MM", formattedMonth)
    .replace("YYYY", formattedYear)
    .replace("YY", formattedYear.slice(-2))
    .replace("D", day.toString())
    .replace("MMM", getShortMonthName(month))
    .replace("MMMM", getFullMonthName(month))
    .replace("HH", get24HourFormat(date))
    .replace("hh", get12HourFormat(date))
    .replace("mm", getMinutes(date))
    .replace("ss", getSeconds(date))
    .replace("A", getAMPM(date))
    .replace("a", getAMPM(date).toLowerCase());

  return formattedDate;
}

export function formatDateAlt(
  inputDate: string | number | Date,
  format: string = "MMM dd yyyy"
): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
  };

  const date = new Date(inputDate);
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  // Custom format based on the provided format argument
  const customFormattedDate = format
    .replace("yyyy", date.getFullYear().toString())
    .replace("MMM", formattedDate.slice(0, 3))
    .replace("dd", formattedDate.slice(4, 6))
    .replace("hh", formattedDate.slice(7, 9))
    .replace("mm", formattedDate.slice(10, 12))
    .replace("ss", formattedDate.slice(13, 15));

  return customFormattedDate;
}
