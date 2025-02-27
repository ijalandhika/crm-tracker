import { Separator } from "@/components/ui/separator";
import CustomerForm from "@/screen/pelanggan/form";
import { GetProvinces } from "@/screen/pelanggan/actions";

export default async function CustomerFormPage() {
  const provinces = await GetProvinces();
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Registrasi Pelanggan</h1>
          <p className="text-muted-foreground">
            Mohon input informasi pelanggan
          </p>
        </div>
        <Separator />
        <CustomerForm provinces={provinces} />
      </div>
    </div>
  );
}
