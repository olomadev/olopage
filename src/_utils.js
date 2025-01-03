/**
 * Php date function
 * 
 * Example Usage:
 * console.log(formatDate('Y-m-d H:i:s')); // 2025-01-02 12:34:56 (Example output)
 * console.log(formatDate('Y/m/d'));       // 2025/01/02
 * console.log(formatDate('H:i'));         // 12:34
 * console.log(formatDate('Y-W'));         // 2025-01
 */
export const formatDate = function (format, timestamp = new Date()) {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const map = {
      Y: date.getFullYear(),                      // 4-digit year
      y: String(date.getFullYear()).slice(-2),    // Last 2 digits of the year
      m: String(date.getMonth() + 1).padStart(2, '0'), // Month (01-12)
      d: String(date.getDate()).padStart(2, '0'), // Day (01-31)
      H: String(date.getHours()).padStart(2, '0'), // Hour (00-23)
      i: String(date.getMinutes()).padStart(2, '0'), // Minutes (00-59)
      s: String(date.getSeconds()).padStart(2, '0'), // Seconds (00-59)
      w: date.getDay(),                          // Day of the week (0-6, Sunday is 0)
      W: `0${Math.ceil((date.getDate() + new Date(date.getFullYear(), 0, 1).getDay()) / 7)}`.slice(-2), // ISO Week number
  };
  return format.replace(/Y|y|m|d|H|i|s|w|W/g, match => map[match]);
};

