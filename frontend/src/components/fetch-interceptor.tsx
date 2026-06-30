"use client";

import { useEffect } from "react";

if (typeof window !== "undefined") {
  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    let url = typeof input === "string" ? input : input instanceof URL ? input.toString() : (input as Request).url;
    
    // Fallback to localhost if environment variable is not defined
    let apiBase = process.env.NEXT_PUBLIC_API_URL;
    if (!apiBase) {
      if (typeof window !== "undefined") {
        const hostname = window.location.hostname;
        if (hostname !== "localhost" && hostname !== "127.0.0.1") {
          apiBase = "https://lomax-backend.onrender.com";
        }
      }
    }
    if (!apiBase) {
      apiBase = "http://localhost:5000";
    }
    
    // Normalize apiBase to not end with /api or trailing slash since startsWith replacement matches host only
    if (apiBase.endsWith("/api")) {
      apiBase = apiBase.slice(0, -4);
    }
    if (apiBase.endsWith("/")) {
      apiBase = apiBase.slice(0, -1);
    }
    
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
