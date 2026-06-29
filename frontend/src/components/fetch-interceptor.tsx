"use client";

import { useEffect } from "react";

if (typeof window !== "undefined") {
  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    let url = typeof input === "string" ? input : input instanceof URL ? input.toString() : (input as Request).url;
    
    // Fallback to localhost if environment variable is not defined
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    
    if (url.startsWith("http://localhost:5000")) {
      const newUrl = url.replace("http://localhost:5000", apiBase);
      if (input instanceof Request) {
        input = new Request(newUrl, input);
      } else {
        input = newUrl;
      }
    }
    
    return originalFetch(input, init);
  };
}

export function FetchInterceptor() {
  // Empty component to trigger early module import on client side
  return null;
}
