import { CreateFoodPriceForm } from "@/components/dashboard/foodPrice/create-food-price-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex w-full flex-col gap-10">
      <div className="relative">
        <Link href="/dashboard/food-prices">
          <ArrowLeft />
        </Link>
      </div>
      <div className="flex w-full flex-col items-center justify-center">
        <div className="w-full max-w-screen-lg">
          <CreateFoodPriceForm />
        </div>
      </div>
    </div>
  );
}
