import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return <SignIn oidcPrompt="select_account" />;
}
