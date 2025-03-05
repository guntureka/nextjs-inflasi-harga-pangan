import { getUserByID } from "@/actions/user";
import { CreateUserForm } from "@/components/dashboard/user/create-user-form";
import { UpdateUserForm } from "@/components/dashboard/user/update-user-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await getUserByID(id);

  return (
    <div className="flex w-full flex-col gap-10">
      <div className="relative">
        <Link href="/dashboard/users">
          <ArrowLeft />
        </Link>
      </div>
      <div className="flex w-full flex-col items-center justify-center">
        <div className="w-full max-w-screen-lg">
          <UpdateUserForm user={user} />
        </div>
      </div>
    </div>
  );
}
