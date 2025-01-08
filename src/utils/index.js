/**
 * Php date function
 * 
 * Example Usage:
 * console.log(formatDate('Y-m-d H:i:s')); // 2025-01-02 12:34:56 (Example output)
 * console.log(formatDate('Y/m/d'));       // 2025/01/02
 * console.log(formatDate('H:i'));         // 12:34
 * console.log(formatDate('Y-W'));         // 2025-01
 */
export const formatDate = function (format, timestamp = new Date(), locale = "en") {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const dayOfWeek = (date.getDay() === 0) ? 7 : date.getDay();  // 0 => 7 dönüşümü yapılır (Pazar: 7)
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(((date - startOfYear) / (24 * 60 * 60 * 1000) + startOfYear.getDay() + 1) / 7);
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sepr', 'Oct', 'Nov', 'Dec'];
  let days = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];
  const map = {
      F: months[date.getMonth()],              // Full month name (e.g., "March")
      j: date.getDate(),                       // Day of the month (1-31)
      Y: date.getFullYear(),                   // 4-digit year (e.g., "2025")
      m: String(date.getMonth() + 1).padStart(2, '0'), // Month (01-12)
      d: String(date.getDate()).padStart(2, '0'), // Day (01-31)
      g: date.getHours() % 12 || 12,           // Hour (12-hour format, 1-12)
      H: String(date.getHours()).padStart(2, '0'), // Hour (24-hour format, 00-23)
      i: String(date.getMinutes()).padStart(2, '0'), // Minutes (00-59)
      s: String(date.getSeconds()).padStart(2, '0'), // Seconds (00-59)
      a: date.getHours() < 12 ? 'am' : 'pm',   // AM/PM (lowercase)
      w: dayOfWeek,                            // Day of the week (1-7, Monday is 1)
      W: String(weekNumber).padStart(2, '0'),   // ISO Week number (01-53)
      l: days[date.getDay()],                  // Full day name (e.g., "Monday")
      D: days[date.getDay()].slice(0, 3),       // Abbreviated day name (e.g., "Mon")
  };
  return format.replace(/F|j|Y|YY|m|d|g|H|i|s|a|w|W|l|D/g, match => map[match] || match);
};

/**
 * Generate uuid
 */
export const generateUid = function(uppercase = false) {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    let uuid = v.toString(16);
    return (uppercase) ? uuid.toUpperCase() : uuid;
  });
}
/**
 * Check url is valid
 */
export const isValidURL = function(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}
/**
 * Returns to base url of backend api
 */
export const getApiUrl = function(suffix) {
  const baseUrl = import.meta.env.VITE_API_URL
  if (suffix) {
    return baseUrl.replace(/^\/+|\/+$/g, "") + "/" + suffix.replace(/^\/+|\/+$/g, "")  
  }
  return baseUrl.replace(/^\/+|\/+$/g, "")
}
/**
 * Returns to base url of frontent app
 */
export const getFrontendUrl = function(suffix) {
  const baseUrl = import.meta.env.VITE_FRONTEND_URL
  if (suffix) {
    return baseUrl.replace(/^\/+|\/+$/g, "") + "/" + suffix.replace(/^\/+|\/+$/g, "")  
  }
  return baseUrl.replace(/^\/+|\/+$/g, "")
}
/**
 * Block editor default blocktools
 */
export const blockTools = function() {
  return [
    {
      name: "paragraph",
      tools: [
        {
          title: "Default",
          name: "default",
          icon: '<svg class="w-4 h-4 md:w-6 md:h-6" xmlns="http://www.w3.org/2000/svg" width="48" height="48"  viewBox="0 0 48 48"><path fill="currentColor" d="M33.52 13.16a13.63 13.63 0 0 0-.19 2.24v2.45l-.15.14h-.92l-.16-.13a16 16 0 0 0-.17-2.2A1 1 0 0 0 31 15h-4.76v12.39a32.3 32.3 0 0 0 .19 4.54.65.65 0 0 0 .5.55c.15 0 .72.08 1.71.14l.15.15v1l-.15.15c-1-.06-2.47-.09-4.51-.09s-3.59 0-4.51.09l-.13-.14v-1l.14-.15c1-.06 1.57-.11 1.72-.14a.65.65 0 0 0 .5-.55 34 34 0 0 0 .15-4.62V19c0-2.41 0-3.77-.05-4.07h-2.07a14.74 14.74 0 0 0-3.06.16.66.66 0 0 0-.33.22 3.28 3.28 0 0 0-.22.94c-.06.52-.11 1.05-.13 1.6L16 18h-.93l-.16-.14v-2.51a18.58 18.58 0 0 0-.17-2.18l.13-.15c.58.1 2.67.15 6.3.15h5.93q5 0 6.3-.15Z"/></svg>',
          command: (editor) => {
            editor.chain().focus().setVariant("default").run();
          },
          isActiveTest: (editor) => editor.isActive({ variant: "default" }),
        },
        {
          title: "Large",
          name: "large",
          icon: '<svg class="w-4 h-4 md:w-6 md:h-6" xmlns="http://www.w3.org/2000/svg" width="48" height="48"  viewBox="0 0 48 48"><path fill="currentColor" d="M41.37 6.12a27.85 27.85 0 0 0-.35 4L41 14.56l-.26.26h-1.69l-.29-.23a31.65 31.65 0 0 0-.29-4 1.83 1.83 0 0 0-1.69-1.24c-.35-.05-2-.08-5-.08h-3.49c0 .62-.05 3.06-.05 7.33v15a59.2 59.2 0 0 0 .34 8.18 1.14 1.14 0 0 0 .89 1 30 30 0 0 0 3.09.27l.26.26v1.77l-.26.26q-2.61-.16-8.12-.16t-8.12.16l-.24-.24v-1.8l.26-.26a29.7 29.7 0 0 0 3.09-.27 1.13 1.13 0 0 0 .89-1 58.62 58.62 0 0 0 .35-8.18v-15q0-6.51-.08-7.33h-3.77a27.11 27.11 0 0 0-5.51.29 1.12 1.12 0 0 0-.58.4 5.32 5.32 0 0 0-.4 1.69c-.12.93-.2 1.89-.24 2.87l-.26.26H8.17l-.29-.26L7.82 10a30.21 30.21 0 0 0-.31-3.93l.24-.26q1.54.25 11.33.26h10.68q9 0 11.34-.26Z"/></svg>',
          command: (editor) => {
            editor.chain().focus().setVariant("large").run();
          },
          isActiveTest: (editor) => editor.isActive({ variant: "large" }),
        },
      ],
    },
  ]
}