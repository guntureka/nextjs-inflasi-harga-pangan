import { CreateUserForm } from "@/components/dashboard/user/create-user-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex w-full flex-col gap-10">
      <div className="relative">
        <Link href="/dashboard/users">
          <ArrowLeft />
        </Link>
      </div>
      <div className="flex w-full flex-col items-center justify-center">
        <div className="w-full max-w-screen-lg">
          <CreateUserForm />
        </div>
      </div>
    </div>
  );
}
