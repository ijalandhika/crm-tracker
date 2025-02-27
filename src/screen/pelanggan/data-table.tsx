import { Pelanggan } from "./types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface PelangganDataTableProps {
  rows: Pelanggan[];
  totalPages: number;
  currentPage: number;
  isMobile?: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

const PelangganDataTable = ({
  rows,
  totalPages,
  currentPage,
  isMobile,
  onNextPage,
  onPreviousPage,
}: PelangganDataTableProps) => {
  return (
    <>
      {isMobile ? (
        <div className="grid gap-4">
          {rows?.map((customer) => (
            <Card key={customer.id}>
              <Link href={`/dashboard/pelanggan/${customer.id}`}>
                <CardContent className="p-4">
                  <div className="flex justify-between py-2 border-b last:border-0">
                    <Image
                      src={customer?.logo ?? "/images/logofront.png"}
                      width={50}
                      height={50}
                      alt={customer.nama}
                    />
                    <span className="font-medium">
                      {customer.is_active ? (
                        <Badge>Aktif</Badge>
                      ) : (
                        <Badge variant="destructive">Tidak Aktif</Badge>
                      )}
                    </span>
                  </div>
                  <div className="flex flex-col space-y-1.5 mt-4">
                    <span className="font-bold">Nama Pelanggan</span>
                    <span className="text-muted-foreground">
                      {customer.nama}
                    </span>
                  </div>
                  <div className="flex flex-col space-y-1.5 mt-4">
                    <span className="font-bold">Bidang Usaha</span>
                    <span className="text-muted-foreground">
                      {customer.bidang_usaha}
                    </span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary">
                <TableHead className="text-white text-left">Logo</TableHead>
                <TableHead className="text-white text-center">
                  Nama Pelanggan
                </TableHead>
                <TableHead className="text-white text-center">
                  Bidang Usaha
                </TableHead>
                <TableHead className="text-center text-white">Status</TableHead>
                <TableHead className="text-center text-white">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows?.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Image
                      src={customer?.logo ?? "/images/logofront.png"}
                      width={50}
                      height={50}
                      alt={customer.nama}
                    />
                  </TableCell>
                  <TableCell className="text-center">{customer.nama}</TableCell>
                  <TableCell className="text-center">
                    {customer.bidang_usaha}
                  </TableCell>
                  <TableCell className="text-center">
                    {customer.is_active ? (
                      <Badge>Aktif</Badge>
                    ) : (
                      <Badge variant="destructive">Tidak Aktif</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Link href={`/dashboard/pelanggan/${customer.id}`}>
                      Lihat Detail
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default PelangganDataTable;
