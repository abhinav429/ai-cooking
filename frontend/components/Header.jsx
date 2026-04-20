import React from "react";
import { Cookie, Refrigerator, Sparkles } from "lucide-react";
import Link from "next/link";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import AuthNavButtons from "@/components/AuthNavButtons";
import HowToCookModal from "./HowToCookModal";
import PricingModal from "./PricingModal";
import Image from "next/image";
import { checkUser } from "@/lib/checkUser";
import { Badge } from "./ui/badge";
import UserDropdown from "./UserDropdown";
import { SITE_NAME } from "@/lib/site";

export default async function Header() {
  const user = await checkUser();

  return (
    <header className="fixed top-0 w-full border-b border-border bg-background/80 backdrop-blur-md z-50 supports-backdrop-filter:bg-background/60">
      <div className="w-full px-4">
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-5 md:gap-8 lg:gap-10">
            <Link
              href={user ? "/dashboard" : "/"}
              className="group flex shrink-0 items-center gap-2"
            >
              <Image
                src="/logo-mark.svg"
                alt={`${SITE_NAME} logo`}
                width={44}
                height={44}
                className="h-11 w-11"
                unoptimized
              />
            </Link>

            <div className="hidden min-w-0 items-center gap-6 text-sm font-medium text-muted-foreground md:flex lg:gap-8">
              <Link
                href="/recipes"
                className="flex items-center gap-1.5 transition-colors hover:text-orange-600"
              >
                <Cookie className="h-4 w-4 shrink-0" />
                My Recipes
              </Link>
              <Link
                href="/pantry"
                className="flex items-center gap-1.5 transition-colors hover:text-orange-600"
              >
                <Refrigerator className="h-4 w-4 shrink-0" />
                My Pantry
              </Link>
            </div>
          </div>

          <div className="flex shrink-0 items-center space-x-3 sm:space-x-4">
            <HowToCookModal />

            <ClerkLoading>
              <div
                className="h-9 w-28 rounded-full bg-muted/80 animate-pulse"
                aria-hidden
              />
            </ClerkLoading>
            <ClerkLoaded>
              <SignedIn>
                {user && (
                  <PricingModal subscriptionTier={user.subscriptionTier}>
                    <Badge
                      variant="outline"
                      className={`flex h-8 px-3 gap-1.5 rounded-full text-xs font-semibold transition-all ${
                        user.subscriptionTier === "pro"
                          ? "bg-linear-to-r from-orange-600 to-amber-500 text-white border-none shadow-sm"
                          : "bg-muted/50 text-muted-foreground border-border cursor-pointer hover:bg-muted hover:border-border"
                      }`}
                    >
                      <Sparkles
                        className={`h-3 w-3 ${
                          user.subscriptionTier === "pro"
                            ? "text-white fill-white/20"
                            : "text-muted-foreground"
                        }`}
                      />
                      <span>
                        {user.subscriptionTier === "pro"
                          ? "Pro Chef"
                          : "Free Plan"}
                      </span>
                    </Badge>
                  </PricingModal>
                )}

                <UserDropdown />
              </SignedIn>

              <SignedOut>
                <AuthNavButtons />
              </SignedOut>
            </ClerkLoaded>
          </div>
        </nav>
      </div>
    </header>
  );
}
