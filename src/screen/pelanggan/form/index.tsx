"use client";

import type React from "react";

import { useState, useTransition } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
// import { cn } from "@/lib/utils";
import { formSchema } from "./form";
import { Button } from "@/components/ui/button";
// import { Check, ChevronsUpDown } from "lucide-react";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { List, Rows, SalesGroup } from "../types";
import { AddNewPelanggan } from "./actions";
import { GetCities } from "../actions";
import { convertFileToBase64 } from "@/lib/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

interface CustomerFormProps {
  provinces: List;
  sales?: SalesGroup[];
}

export default function CustomerForm({ provinces, sales }: CustomerFormProps) {
  const router = useRouter();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLoadCity, startIsLoadCity] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, startIsProcessing] = useTransition();
  const [cities, setCities] = useState<Rows[]>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      business: "",
      province: "",
      city: "",
      address: "",
      logo: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setMessage(null);
    startIsProcessing(() => {
      AddNewPelanggan(values).then((result) => {
        if (result.error) {
          setMessage(result.message);
          return;
        }

        form.reset();
        toast.success("Berhasil", {
          description: "Berhasil tambah data pelanggan",
        });
        router.push("/dashboard/pelanggan");
      });
    });
  }

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
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input placeholder="PT. Kreatif" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="business"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bidang Usaha</FormLabel>
              <FormControl>
                <Input placeholder="Manufaktur" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const imageBase64 = await convertFileToBase64(file);
                        field.onChange(imageBase64);
                        setLogoPreview(imageBase64 as string);
                      }
                    }}
                    className="cursor-pointer"
                  />
                  {logoPreview && (
                    <div className="relative h-40 w-40">
                      <Image
                        src={logoPreview || "/images/logofront.png"}
                        alt="Logo preview"
                        fill
                        className="rounded-lg object-contain"
                      />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="province"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provinsi</FormLabel>
              <Select
                onValueChange={(e) => {
                  onChangeProvince(e);
                  field.onChange(e);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih provinsi" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {provinces?.rows?.map((province) => (
                    <SelectItem key={province.id} value={province.id}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kota</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kota" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cities?.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {sales && sales?.length > 0 && (
          <FormField
            control={form.control}
            name="sales_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sales</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Piih Sales" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sales?.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea placeholder="Jl. Margonda Raya" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Link
            href="/dashboard/pelanggan"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mr-4"
          >
            Kembali
          </Link>
          <Button
            type="submit"
            disabled={isLoadCity || isProcessing}
            isLoading={isLoadCity || isProcessing}
          >
            Proses
          </Button>
        </div>
      </form>
    </Form>
  );
}
