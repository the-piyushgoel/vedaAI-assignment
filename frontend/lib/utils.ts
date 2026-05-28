export function cn(...inputs: (string | undefined | null | boolean | { [key: string]: boolean })[]): string {
  const classes: string[] = [];
  
  for (const item of inputs) {
    if (!item) continue;
    if (typeof item === 'string') {
      classes.push(item);
    } else if (typeof item === 'object') {
      for (const key in item) {
        if (item[key]) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(' ');
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
}
