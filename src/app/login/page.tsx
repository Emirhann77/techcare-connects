import type { Metadata } from "next";
import AuthScreen from "@/components/AuthScreen";

export const metadata: Metadata = {
  title: "Sign in · TechCare Connects",
  description: "Sign in to TechCare Connects.",
};

export default function LoginPage() {
  return <AuthScreen mode="login" />;
}
