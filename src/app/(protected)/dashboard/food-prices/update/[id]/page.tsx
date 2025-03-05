import { getFoodPriceByID } from "@/actions/foodPrice";
import { UpdateFoodPriceForm } from "@/components/dashboard/foodPrice/update-food-price-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const foodPrice = await getFoodPriceByID(id);

  return (
    <div className="flex w-full flex-col gap-10">
      <div className="relative">
        <Link href="/dashboard/food-prices">
          <ArrowLeft />
        </Link>
      </div>
      <div className="flex w-full flex-col items-center justify-center">
        <div className="w-full max-w-screen-lg">
          <UpdateFoodPriceForm foodPrice={foodPrice} />
        </div>
      </div>
    </div>
  );
}
