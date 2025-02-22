"use client";

import dynamic from "next/dynamic";
const PelangganDataTable = dynamic(() => import("@/screen/pelanggan"), {
  ssr: false,
  loading: () => <p>Loading..</p>,
});

export default function DashboardPage() {
  return (
    <div className="flex min-h-svh flex-col p-6 md:p-10">
      <PelangganDataTable />
    </div>
  );
}
