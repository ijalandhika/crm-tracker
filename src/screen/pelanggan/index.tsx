"use client";

import { lazy, Suspense, useCallback, useState, useEffect } from "react";
import { GetPelanggan } from "./actions";
import { InitLoading } from "./loading";
import PelangganDataTable from "./data-table";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";

const postsPerPage = 10;

export default function Pelanggan() {
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
        <Link
          href="/dashboard/pelanggan/tambah"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ml-2 cursor-pointer"
        >
          <PlusIcon className="h-4 w-4" />
          <Label className="hidden md:block">Tambah Pelanggan</Label>
        </Link>
      </div>
      <Suspense fallback={<InitLoading />}>
        <PelangganComponent />
      </Suspense>
    </>
  );
}
