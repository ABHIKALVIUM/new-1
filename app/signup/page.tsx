import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { SignupForm } from "@/components/signup-form"

export default async function SignupPage() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground mt-2">Sign up to start managing your tasks</p>
        </div>
        <SignupForm />
      </div>
    </main>
  )
}

