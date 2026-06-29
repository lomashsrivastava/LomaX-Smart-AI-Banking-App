"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AccountNewRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/customers/register");
  }, [router]);
  return (
    <div className="flex items-center justify-center min-h-[400px] text-slate-400 animate-pulse">
      Redirecting to Customer Registration...
    </div>
  );
}
