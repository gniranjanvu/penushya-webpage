/**
 * Formats a date string for short display (Month Year)
 * @param dateString - ISO date string
 * @returns Formatted date string like "Jan 2024"
 */
export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
};

/**
 * Formats a date string for full display (Month Day, Year)
 * @param dateString - ISO date string or undefined
 * @returns Formatted date string like "January 15, 2024" or fallback message
 */
export const formatDateLong = (dateString?: string): string => {
  if (!dateString) return 'Date not available';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

/**
 * Formats a date string for publication display (Month Year)
 * @param dateString - ISO date string or undefined
 * @returns Formatted date string like "January 2024" or fallback message
 */
export const formatPublicationDate = (dateString?: string): string => {
  if (!dateString) return 'Date not available';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  });
};
