import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ContactPelanggan } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface DataTableProps {
  isMobile?: boolean;
  contactData: ContactPelanggan[];
  onStatusChange: (id: string, status: boolean) => void;
}
const ContactPelangganDataTable = ({
  isMobile,
  contactData,
  onStatusChange,
}: DataTableProps) => {
  if (contactData?.length === 0) {
    return (
      <div className="rounded-md border p-4 text-center">
        <p>Belum ada data.</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="grid gap-4">
        {contactData.map((v) => (
          <Card key={v.id}>
            <CardContent className="p-4">
              <div className="flex justify-between py-2 border-b last:border-0">
                <div>
                  <span className="font-bold">{v.name}</span>
                </div>
                <div>
                  <Select
                    defaultValue={v.is_active ? "1" : "0"}
                    onValueChange={(value) =>
                      onStatusChange(v.id, value === "1")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Pilih status"
                        className="w-12"
                      />
                    </SelectTrigger>
                    <SelectContent className="items-center">
                      <SelectItem value={"1"} key={1}>
                        <Badge>Aktif</Badge>
                      </SelectItem>
                      <SelectItem value={"0"} key={0}>
                        <Badge variant="destructive">Tidak Aktif</Badge>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col space-y-1.5 mt-4">
                <span className="font-bold">No. Telp</span>
                <span className="text-muted-foreground">{v.phone}</span>
              </div>

              <div className="flex flex-col space-y-1.5 mt-4">
                <span className="font-bold">Email</span>
                <span className="text-muted-foreground">{v.email}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-primary">
            <TableHead className="text-white text-center">Nama</TableHead>
            <TableHead className="text-white text-center">No. Telp</TableHead>
            <TableHead className="text-white text-center">Email</TableHead>
            <TableHead className="text-center text-white">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contactData.map((v) => (
            <TableRow key={v.id}>
              <TableCell className="text-center">{v.name}</TableCell>
              <TableCell className="text-center">{v.phone}</TableCell>
              <TableCell className="text-center">{v.email}</TableCell>
              <TableCell className="items-center">
                <Select
                  defaultValue={v.is_active ? "1" : "0"}
                  onValueChange={(value) => onStatusChange(v.id, value === "1")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" className="w-12" />
                  </SelectTrigger>
                  <SelectContent className="items-center">
                    <SelectItem value={"1"} key={1}>
                      <Badge>Aktif</Badge>
                    </SelectItem>
                    <SelectItem value={"0"} key={0}>
                      <Badge variant="destructive">Tidak Aktif</Badge>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContactPelangganDataTable;
