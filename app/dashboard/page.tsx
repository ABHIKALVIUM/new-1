import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { TaskDashboard } from "@/components/task-dashboard"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  return <TaskDashboard userId={session.userId} />
}

