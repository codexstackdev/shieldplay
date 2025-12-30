"use client";

import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();
  return (
    <div className="min-h-svh flex items-center justify-center bg-linear-to-br from-background to-muted p-6">
      <div className="max-w-md w-full text-center">
        <div className="relative mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-muted shadow-inner">
          <span className="text-6xl font-black text-primary/80">🚫</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight">
          Unauthorized
        </h1>

        <p className="mt-3 text-muted-foreground">
          Whoa there! This area is off-limits.  
          Looks like you don’t have permission to be here.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
          onClick={() => router.replace("/")}
            className="rounded-xl border px-5 py-2.5 text-sm font-semibold hover:bg-accent transition"
          >
            Go Back
          </button>

          <button
          onClick={() => router.replace("/rip/auth")}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
          >
            Login
          </button>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Error 401 · Access Denied
        </p>
      </div>
    </div>
  );
}
