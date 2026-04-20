import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return <SignUp oidcPrompt="select_account" />;
}
