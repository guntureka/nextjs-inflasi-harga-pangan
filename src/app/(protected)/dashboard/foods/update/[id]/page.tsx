import { getFoodByID } from "@/actions/food";
import { UpdateFoodForm } from "@/components/dashboard/food/update-food-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const food = await getFoodByID(id);

  return (
    <div className="flex w-full flex-col gap-10">
      <div className="relative">
        <Link href="/dashboard/foods">
          <ArrowLeft />
        </Link>
      </div>
      <div className="flex w-full flex-col items-center justify-center">
        <div className="w-full max-w-screen-lg">
          <UpdateFoodForm food={food} />
        </div>
      </div>
    </div>
  );
}
