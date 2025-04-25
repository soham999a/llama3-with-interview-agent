import { ReactNode } from "react";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { isAuthenticated } from "@/lib/actions/auth.action";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (isUserAuthenticated) redirect("/");

  return (
    <div className="auth-layout">
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Interview Agent Logo" width={38} height={32} />
          <h2 className="text-primary-100">Interview Agent</h2>
        </Link>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-screen bg-gradient-to-l from-primary-200/5 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-screen bg-gradient-to-t from-primary-200/5 to-transparent pointer-events-none"></div>

      {children}
    </div>
  );
};

export default AuthLayout;
