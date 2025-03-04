import { CreateCountryForm } from "@/components/form/create-country";
import { createCountry, getCountries } from "@/lib/actions/countries";

export default async function Page() {
  return (
    <div className="w-full px-4 flex flex-col items-center">
      <h1>Home</h1>
      <CreateCountryForm />
    </div>
  );
}
