import { CreateFoodPriceInflationForm } from "@/components/dashboard/foodPriceInflation/create-food-price-inflation-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex w-full flex-col gap-10">
      <div className="relative">
        <Link href="/dashboard/food-price-inflations">
          <ArrowLeft />
        </Link>
      </div>
      <div className="flex w-full flex-col items-center justify-center">
        <div className="w-full max-w-screen-lg">
          <CreateFoodPriceInflationForm />
        </div>
      </div>
    </div>
  );
}
