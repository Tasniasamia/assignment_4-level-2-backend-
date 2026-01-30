// export function parseSetCookie(setCookieString: string|undefined) {
//     if (!setCookieString) return null;
  
//     const parts = setCookieString.split(";").map(p => p.trim()) || [];

    
    
//     // Name and value
//     const nameValue = parts[0].split("=");
//     const name = nameValue[0];
//     const value = nameValue.slice(1).join("="); // in case value has '='
  
//     // Options
//     const options: Record<string, string | boolean> = {};
//     parts.slice(1).forEach(part => {
//       const [key, val] = part.split("=");
//       if (val === undefined) {
//         // flags like HttpOnly, Secure
//         options[key.toLowerCase()] = true;
//       } else {
//         options[key.toLowerCase()] = val;
//       }
//     });
  
//     return { name, value, options };

//   }

export function parseSetCookie(setCookieString: string | undefined) {
    if (!setCookieString) return null;
  
    // Split and trim, ensure at least one element
    const parts: string[] = setCookieString.split(";").map(p => p.trim());
    if (!parts[0]) return null; // 🔹 parts[0] undefined হলে exit
  
    // Name and value (safe)
    const [namePart, ...rest] = parts[0].split("=");
    if (!namePart) return null;
  
    const name = namePart;
    const value = rest.join("="); // in case value has '='
  
    // Options
    const options: Record<string, string | boolean> = {};
    parts.slice(1).forEach(part => {
      if (!part) return; // skip empty
      const [key, val] = part.split("=");
      if (!key) return;
      if (val === undefined) {
        options[key.toLowerCase()] = true;
      } else {
        options[key.toLowerCase()] = val;
      }
    });
  
    return { name, value, options };
  }
  