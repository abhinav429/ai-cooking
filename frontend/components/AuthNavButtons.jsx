"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

/**
 * Return URL after sign-in / sign-up. Landing page sends users to the dashboard;
 * all other routes return to the same path (e.g. /pantry after auth).
 */
function useAfterAuthUrl() {
  const pathname = usePathname() || "/";
  if (pathname === "/") return "/dashboard";
  return pathname;
}

/**
 * Redirect mode avoids Clerk's sign-in modal, which cannot open when a session
 * already exists (single-session apps) and triggers cannot_render_single_session_enabled.
 */
export default function AuthNavButtons() {
  const fallbackRedirectUrl = useAfterAuthUrl();

  return (
    <>
      <SignInButton mode="redirect" fallbackRedirectUrl={fallbackRedirectUrl}>
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-orange-600 hover:bg-orange-50 font-medium"
        >
          Sign In
        </Button>
      </SignInButton>
      <SignUpButton mode="redirect" fallbackRedirectUrl={fallbackRedirectUrl}>
        <Button variant="primary" className="rounded-full px-6">
          Get Started
        </Button>
      </SignUpButton>
    </>
  );
}

export function PricingSubscribeSignInButton() {
  const fallbackRedirectUrl = useAfterAuthUrl();

  return (
    <SignInButton mode="redirect" fallbackRedirectUrl={fallbackRedirectUrl}>
      <Button variant="primary" className="w-full">
        Login to Subscribe
      </Button>
    </SignInButton>
  );
}
