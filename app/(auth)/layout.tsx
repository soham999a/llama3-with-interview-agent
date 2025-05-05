import { ReactNode } from "react";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { isAuthenticated } from "@/lib/actions/auth.server";
import "./auth-styles.css";

// Create a separate component for the layout content
function AuthLayoutContent({ children }: { children: ReactNode }) {
  return (
    <div className="auth-layout">
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Interview Agent Logo"
            width={38}
            height={32}
          />
          <h2 className="text-primary-100">Interview Agent</h2>
        </Link>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-screen bg-gradient-to-l from-primary-200/5 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-screen bg-gradient-to-t from-primary-200/5 to-transparent pointer-events-none"></div>

      {children}
    </div>
  );
}

// Main layout component
const AuthLayout = async ({ children }: { children: ReactNode }) => {
  try {
    const isUserAuthenticated = await isAuthenticated();
    if (isUserAuthenticated) {
      // Use a more gentle redirect approach to prevent Edge throttling
      redirect("/");
    }
  } catch (error) {
    console.error("Auth layout error:", error);
    // Continue rendering the auth page if there's an error
  }

  return <AuthLayoutContent>{children}</AuthLayoutContent>;
};

export default AuthLayout;
