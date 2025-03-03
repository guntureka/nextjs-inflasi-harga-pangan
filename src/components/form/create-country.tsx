import { CountrySchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormValues = z.infer<typeof CountrySchema>;

export function CreateCountryForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(CountrySchema),
    defaultValues: {
      name: "",
      iso3Code: "",
      currency: "",
      geojsonUrl: undefined,
    },
  });
}
