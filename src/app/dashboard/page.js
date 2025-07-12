// app/dashboard/page.js

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }
  
  const role = session.user?.role || 'student';
  redirect(`/${role}/notifications?redirected=true`);
}