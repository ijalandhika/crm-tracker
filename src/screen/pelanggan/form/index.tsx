"use client";

import type React from "react";

import { useState, useTransition } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { formSchema } from "./form";
import { Button } from "@/components/ui/button";
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
import type { List, Rows } from "../types";
import { AddNewPelanggan } from "./actions";
import { GetCities } from "../actions";
import { convertFileToBase64 } from "@/lib/image";
import { useRouter } from "next/navigation";

interface CustomerFormProps {
  provinces: List;
}

export default function CustomerForm({ provinces }: CustomerFormProps) {
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
        }

        form.reset();
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
    <Form {...form} key="detail-form">
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
                    <SelectValue placeholder="Select a province" />
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
                    <SelectValue placeholder="Select a city" />
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

        <Button
          type="submit"
          className="w-full"
          disabled={isLoadCity || isProcessing}
          isLoading={isLoadCity || isProcessing}
        >
          Proses
        </Button>
      </form>
    </Form>
  );
}
