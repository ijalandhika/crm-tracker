"use client";

import { lazy, Suspense, useCallback, useState, useEffect } from "react";
import { GetPelanggan } from "./actions";
import { InitLoading } from "./loading";
import { useRouter } from "next/navigation";
import PelangganDataTable from "./data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Label } from "@radix-ui/react-label";

const postsPerPage = 10;

export default function Pelanggan() {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const onPreviousPage = useCallback(() => {
    setCurrentPage((prev) => prev - 1);
  }, []);

  const onNextPage = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  const onChangeQuery = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
    },
    []
  );

  const PelangganComponent = lazy(() =>
    GetPelanggan(currentPage, postsPerPage, query).then((data) => ({
      default: () => (
        <PelangganDataTable
          isMobile={isMobile}
          rows={data.rows}
          totalPages={data.totalPages}
          currentPage={currentPage}
          onNextPage={onNextPage}
          onPreviousPage={onPreviousPage}
        />
      ),
    }))
  );

  return (
    <>
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Cari berdasarkan nama..."
          className="max-w-sm"
          onChange={onChangeQuery}
        />
        <Button onClick={() => router.push("/dashboard/pelanggan/tambah")}>
          <PlusIcon className="h-4 w-4" />
          <Label className="hidden md:block">Tambah Pelanggan</Label>
        </Button>
      </div>
      <Suspense fallback={<InitLoading />}>
        <PelangganComponent />
      </Suspense>
    </>
  );
}
