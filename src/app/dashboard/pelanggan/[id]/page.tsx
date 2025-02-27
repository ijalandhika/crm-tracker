import { Separator } from "@/components/ui/separator";
import DetailPelanggan from "@/screen/pelanggan/detail";
import { GetCities, GetProvinces } from "@/screen/pelanggan/actions";
import { redirect } from "next/navigation";
import { Rows } from "@/screen/pelanggan/types";
import {
  GetKontakPelanggan,
  GetPelangganByID,
} from "@/screen/pelanggan/detail/actions";

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DetailPage({ params }: DetailPageProps) {
  const provinces = await GetProvinces();

  const id = (await params).id;

  const { data, error } = await GetPelangganByID(id);

  if (error || !data) {
    return redirect("/dashboard/pelanggan");
  }

  // @ts-expect-error there are some tricky since return from supabase type is array instead of single
  const cities = await GetCities((data.provinces as Rows).id);

  const kontak = await GetKontakPelanggan(id);

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Informasi Pelanggan</h1>
          <p className="text-muted-foreground">Detail informasi pelanggan</p>
        </div>
        <Separator />
        <DetailPelanggan
          customer_data={data}
          provinces={provinces}
          selectedCities={cities}
          pelanggan_id={id}
          kontak={kontak}
        />
      </div>
    </div>
  );
}
