export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  let day = Math.floor(diff / oneDay);
  
  // Cap at 365 to handle leap years gracefully with our 365-day lectionary dataset
  return Math.min(day, 365);
}
