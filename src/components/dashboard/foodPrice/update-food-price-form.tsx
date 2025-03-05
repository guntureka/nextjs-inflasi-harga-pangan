"use client";

import { useSession } from "@/components/session-provider";
import { formatFieldLabel, parseStringToFloat, useShowToast } from "@/lib/helper-function";
import { cn } from "@/lib/utils";
import { FoodPriceSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { Textarea } from "@/components/ui/textarea";
import { createFood, getFoods } from "@/actions/food";
import { country, food, foodPrice, user } from "@/db/schema";
import { getUsers } from "@/actions/user";
import { getCountries } from "@/actions/country";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
import { createFoodPrice, updateFoodPriceByID } from "@/actions/foodPrice";

const MONTHS = [
  { id: "01", name: "January" },
  { id: "02", name: "February" },
  { id: "03", name: "March" },
  { id: "04", name: "April" },
  { id: "05", name: "May" },
  { id: "06", name: "June" },
  { id: "07", name: "July" },
  { id: "08", name: "August" },
  { id: "09", name: "September" },
  { id: "10", name: "October" },
  { id: "11", name: "November" },
  { id: "12", name: "December" },
];

const startYear = getYear(new Date()) - 100;
const endYear = getYear(new Date());

const YEARS = Array.from({ length: endYear - startYear + 1 }, (_, i) => endYear - i);

type FormValues = z.infer<typeof FoodPriceSchema>;

interface UpdateFoodPriceFormProps {
  foodPrice: typeof foodPrice.$inferSelect;
}

export function UpdateFoodPriceForm({ foodPrice }: UpdateFoodPriceFormProps) {
  const [pending, setPending] = React.useState(false);
  const [foods, setFoods] = React.useState<(typeof food.$inferSelect | null)[]>([]);
  const [countries, setCountries] = React.useState<(typeof country.$inferSelect | null)[]>([]);
  const [date, setDate] = React.useState<Date>(new Date());

  const { showErrorToast, showSuccessToast } = useShowToast();

  const session = useSession();

  React.useEffect(() => {
    async function fetchData() {
      setPending(true);
      try {
        const [foodData, countryData] = await Promise.all([getFoods(), getCountries()]);
        setFoods(foodData);
        setCountries(countryData);
      } catch (error) {
        showErrorToast("Failed to fetch data");
      } finally {
        setPending(false);
      }
    }

    if (!foods.length || !countries.length) {
      fetchData();
    }
  }, [foods, countries]);

  const form = useForm<FormValues>({
    resolver: zodResolver(FoodPriceSchema),
    defaultValues: {
      open: foodPrice.open?.toString() ?? "",
      low: foodPrice.low?.toString() ?? "",
      high: foodPrice.high?.toString() ?? "",
      close: foodPrice.close?.toString() ?? "",
      date: foodPrice.date ?? new Date(),
      month: foodPrice.month,
      year: foodPrice.year,
      countryId: foodPrice.countryId,
      foodId: foodPrice.foodId,
      updatedById: session?.user.id,
    },
  });

  const onSubmit = async (values: FormValues) => {
    console.log(values);
    setPending(true);

    try {
      const result = await updateFoodPriceByID(foodPrice.id, {
        ...values,
        open: values.open ? parseStringToFloat(values?.open) : undefined,
        low: values.low ? parseStringToFloat(values?.low) : undefined,
        high: values.high ? parseStringToFloat(values?.high) : undefined,
        close: values.close ? parseStringToFloat(values?.close) : undefined,
      });

      if (!result) showErrorToast("Something went wrong!");

      showSuccessToast("Food Price has been updated.");

      form.reset();
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : "Unknown Error");
    } finally {
      setPending(false);
    }
  };

  const onMonthChange = (month: string) => {
    const newDate = setMonth(
      date,
      MONTHS.findIndex((v) => v.name == month)
    );

    setDate(newDate);
  };

  const onYearChange = (year: string) => {
    const newDate = setYear(date, parseInt(year));

    setDate(newDate);
  };

  const onDateChange = (date?: Date) => {
    if (!date) return;

    form.setValue("date", date);
    form.setValue("year", getYear(date).toString());
    form.setValue("month", MONTHS[getMonth(date)].id);
    form.trigger("date");
  };

  const fields = Object.keys(FoodPriceSchema.shape) as Array<keyof FormValues>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6")}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Update Food Price</h1>
        </div>

        <FormField
          control={form.control}
          name={"countryId"}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold capitalize">Country</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.length > 0 &&
                      countries
                        .filter((v) => v != null)
                        .map((v) => (
                          <SelectItem key={v.id} value={v.id} className="capitalize">
                            {`${v.name} (${v.currency})`}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"foodId"}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold capitalize">Food</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select food" />
                  </SelectTrigger>
                  <SelectContent>
                    {foods.length > 0 &&
                      foods
                        .filter((v) => v != null)
                        .map((v) => (
                          <SelectItem key={v.id} value={v.id} className="capitalize">
                            {v?.name ?? "-"}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="date"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="font-semibold capitalize">Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? format(field.value, "dd/MM/yyyy") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <div className="flex w-full gap-2 p-4">
                    <Select onValueChange={onMonthChange} value={MONTHS[getMonth(date)].name}>
                      <SelectTrigger>
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((v, i) => (
                          <SelectItem key={i} value={v.name}>
                            {v.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select onValueChange={onYearChange} value={getYear(date).toString()}>
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {YEARS.map((v, i) => (
                          <SelectItem key={i} value={v.toString()}>
                            {v}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={onDateChange}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                    month={date}
                    onMonthChange={setDate}
                    className="w-full"
                    // month={date}
                  />
                </PopoverContent>
              </Popover>
              {/* <FormDescription>Your date of birth is used to calculate your age.</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="year"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold capitalize">Year</FormLabel>
              <FormControl>
                <Input type={"text"} placeholder={`Enter year`} {...field} autoComplete="on" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"month"}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold capitalize">Month</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.length > 0 &&
                      MONTHS.filter((v) => v != null).map((v) => (
                        <SelectItem key={v.id} value={v.id} className="capitalize">
                          {v.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {fields
          .filter(
            (field) =>
              field != "createdById" &&
              field != "updatedById" &&
              field != "date" &&
              field != "year" &&
              field != "month" &&
              field != "countryId" &&
              field != "foodId"
          )
          .map((field) => (
            <FormField
              control={form.control}
              key={field}
              name={field}
              render={({ field: fieldProps }) => (
                <FormItem>
                  <FormLabel className="font-semibold capitalize">{formatFieldLabel(field)}</FormLabel>
                  <FormControl>
                    <Input
                      type={"number"}
                      placeholder={`Enter ${formatFieldLabel(field)}`}
                      {...fieldProps}
                      autoComplete="on"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

        <LoadingButton pending={pending}>Update</LoadingButton>
      </form>
    </Form>
  );
}
