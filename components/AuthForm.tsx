"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import FormField from "./FormField";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;

        toast.loading("Creating your account...");

        // Use the client-side signUp function from auth.client.js
        const result = await import("@/lib/actions/auth.client.js").then(
          (module) => module.signUp(name!, email, password)
        );

        toast.dismiss();

        if (!result.success) {
          toast.error(result.error || "Sign up failed. Please try again.");
          return;
        }

        toast.success("Account created successfully!");
        // No need to redirect here as the signUp function handles it
      } else {
        const { email, password } = data;

        toast.loading("Signing you in...");

        // Use the client-side signIn function from auth.client.js
        const result = await import("@/lib/actions/auth.client.js").then(
          (module) => module.signIn(email, password)
        );

        toast.dismiss();

        if (!result.success) {
          toast.error(result.error || "Sign in failed. Please try again.");
          return;
        }

        toast.success("Signed in successfully!");
        // No need to redirect here as the signIn function handles it
      }
    } catch (error) {
      toast.dismiss();
      console.error("Authentication error:", error);
      toast.error(
        `There was an error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <div className="auth-container">
      <div className="w-full max-w-md">
        {/* Header with logo */}
        <div className="auth-header">
          <div className="auth-logo-container">
            <div className="auth-logo-bg">
              <Image
                src="/logo.svg"
                alt="logo"
                height={36}
                width={36}
                className="h-9 w-9"
              />
            </div>
            <h1 className="auth-title">LLAMA3 INTERVIEW</h1>
          </div>
          <p className="auth-subtitle">
            Practice job interviews with AI-powered feedback
          </p>
        </div>

        {/* Auth Card */}
        <div className="auth-card">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {isSignIn ? "Welcome Back" : "Create an Account"}
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
              {!isSignIn && (
                <FormField
                  control={form.control}
                  name="name"
                  label="Full Name"
                  placeholder="Enter your full name"
                  type="text"
                />
              )}

              <FormField
                control={form.control}
                name="email"
                label="Email Address"
                placeholder="Enter your email address"
                type="email"
              />

              <FormField
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter your password"
                type="password"
              />

              <Button className="auth-button" type="submit">
                {isSignIn ? "Sign In" : "Create an Account"}
              </Button>
            </form>
          </Form>

          <div className="auth-footer">
            <p className="text-gray-600">
              {isSignIn
                ? "Don't have an account yet?"
                : "Already have an account?"}
              <Link
                href={!isSignIn ? "/sign-in" : "/sign-up"}
                className="auth-link"
              >
                {!isSignIn ? "Sign In" : "Sign Up"}
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2023 LLAMA3 Interview Agent. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
