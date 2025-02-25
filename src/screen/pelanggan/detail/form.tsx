import * as z from "zod";

export const formSchema = z.object({
  name: z.string().min(2, "Minimal 2 karakter"),
  business: z.string().min(2, "Minimal 2 karakter"),
  logo: z.any(),
  is_active: z.boolean(),
  province: z.string().min(1, "Wajib mengisi provinsi"),
  city: z.string().min(1, "Wajib mengisi kota"),
  address: z.string().min(5, "Minimal 5 karakter"),
});
