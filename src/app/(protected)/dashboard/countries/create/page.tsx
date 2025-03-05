import { CreateCountryForm } from "@/components/dashboard/country/create-country-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex w-full flex-col gap-10">
      <div className="relative">
        <Link href="/dashboard/countries">
          <ArrowLeft />
        </Link>
      </div>
      <div className="flex w-full flex-col items-center justify-center">
        <div className="w-full max-w-screen-lg">
          <CreateCountryForm />
        </div>
      </div>
    </div>
  );
}
