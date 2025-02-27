export type Pelanggan = {
  id: string;
  nama: string;
  bidang_usaha: string;
  is_active: boolean;
  logo?: string;
  alamat?: string;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
};

export type Rows = {
  id: string;
  name: string;
};

export type List = {
  rows: Rows[];
  message: string;
};

export type ContactPelanggan = {
  id: string;
  name: string;
  phone: string;
  email: string;
  is_active?: boolean;
};
