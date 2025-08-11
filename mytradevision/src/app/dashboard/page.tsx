import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user) redirect("/login");
  return <DashboardClient />;
}