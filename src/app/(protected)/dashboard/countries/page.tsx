import { createCountry, getCountries } from "@/lib/actions/countries";

export default async function Page() {
  const countryDatas = await getCountries();
  return (
    <div>
      <h1>Home</h1>
      <pre>{JSON.stringify(countryDatas, null, 2)}</pre>
    </div>
  );
}
