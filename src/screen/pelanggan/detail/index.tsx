"use client";

import { useState, useTransition } from "react";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./form";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { List, Rows } from "../types";
import { GetCities } from "../actions";
import { EditPelanggan } from "./actions";

export interface DetailPelangganProps {
  customer_data: {
    nama: string;
    bidang_usaha: string;
    is_active: boolean;
    logo: string;
    alamat: string;
    provinces: Rows | Rows[];
    cities: Rows | Rows[];
    operators: Rows | Rows[];
  };
  provinces: List;
  selectedCities: List;
  pelanggan_id: string;
}

const DetailPelanggan = ({
  customer_data,
  provinces,
  selectedCities,
  pelanggan_id,
}: DetailPelangganProps) => {
  const router = useRouter();

  const [isLoadCity, startIsLoadCity] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, startIsProcessing] = useTransition();
  const [cities, setCities] = useState<Rows[]>(selectedCities?.rows);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    setMessage(null);
    startIsProcessing(() => {
      EditPelanggan(values, pelanggan_id).then((result) => {
        if (result.error) {
          setMessage(result.message);
        }

        form.reset();
        router.push("/dashboard/pelanggan");
      });
    });
  };

  async function onChangeProvince(province_id: string) {
    startIsLoadCity(() => {
      GetCities(province_id).then((result) => {
        if (result.error) {
          console.log(result.error.message);
          return;
        }

        setCities(result?.rows);
      });
    });
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: customer_data?.nama ?? "",
      business: customer_data?.bidang_usaha ?? "",
      province: (customer_data?.provinces as Rows)?.id ?? "",
      city: (customer_data?.cities as Rows)?.id ?? "",
      address: customer_data?.alamat,
      logo: customer_data?.logo ?? undefined,
      is_active: customer_data.is_active ?? false,
    },
  });
  return (
    <Form {...form}>
      <div className="flex flex-col items-center text-center">
        <p className="text-balance text-red-500">{message}</p>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Pelanggan</FormLabel>
              <FormControl>
                <Input placeholder="Input Nama Pelanggan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Business Field */}
        <FormField
          control={form.control}
          name="business"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bidang Usaha</FormLabel>
              <FormControl>
                <Input placeholder="Input Bidang Usaha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Provinsi</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? provinces.rows.find(
                              (province) => province.id === field.value
                            )?.name
                          : "Pilih Provinsi"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Cari Provinsi..." />
                      <CommandList>
                        <CommandEmpty>Provinsi tidak ditemukan.</CommandEmpty>
                        <CommandGroup>
                          {provinces.rows.map((province) => (
                            <CommandItem
                              value={province.name}
                              key={province.id}
                              onSelect={() => {
                                form.setValue("province", province.id);
                                onChangeProvince(province.id);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  province.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {province.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Kota</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? cities?.find((city) => city.id === field.value)
                              ?.name || "Pilih Kota"
                          : "Pilih Kota"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Cari Kota..." />
                      <CommandList>
                        <CommandEmpty>Kota tidak ditemukan.</CommandEmpty>
                        <CommandGroup>
                          {cities?.map((city) => (
                            <CommandItem
                              value={city.name}
                              key={city.id}
                              onSelect={() => {
                                form.setValue("city", city.id);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  city.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {city.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Status</FormLabel>
                <FormDescription>Apakah pelanggan ini aktif?</FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Masukkan alamat pelanggan"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isLoadCity || isProcessing}
            isLoading={isLoadCity || isProcessing}
          >
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default DetailPelanggan;
