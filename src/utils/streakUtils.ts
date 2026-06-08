export function calculateStreak(completedDates: string[]): number {
  if (!completedDates.length) return 0;
  
  // Sort unique dates
  const dates = [...new Set(completedDates)].sort();
  let streak = 0;
  
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const lastDate = new Date(dates[dates.length - 1]);
  lastDate.setHours(12, 0, 0, 0);

  const diffToLast = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffToLast > 1) {
    return 0; // Streak broken
  }

  // Count backwards
  for (let i = dates.length - 1; i >= 0; i--) {
    if (i === dates.length - 1) {
      streak++;
    } else {
      const current = new Date(dates[i]);
      current.setHours(12, 0, 0, 0);
      const prev = new Date(dates[i + 1]);
      prev.setHours(12, 0, 0, 0);
      
      const diffDays = Math.round((prev.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else if (diffDays > 1) {
        break;
      }
    }
  }

  return streak;
}
