import { getCountryByID } from "@/actions/country";
import { UpdateCountryForm } from "@/components/dashboard/country/update-country-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const country = await getCountryByID(id);

  return (
    <div className="flex w-full flex-col gap-10">
      <div className="relative">
        <Link href="/dashboard/countries">
          <ArrowLeft />
        </Link>
      </div>
      <div className="flex w-full flex-col items-center justify-center">
        <div className="w-full max-w-screen-lg">
          <UpdateCountryForm country={country} />
        </div>
      </div>
    </div>
  );
}
