import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return <div className="flex h-screen justify-center items-center">
    <SignIn appearance={{
        variables: {
            colorPrimary: '#0f172a'
        }
    }} />
  </div>;
}