import ContactPelangganDataTable from "./contact-data-table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { kontakFormSchema } from "@/screen/pelanggan/detail/form";
import { Dispatch, SetStateAction, useState } from "react";
import { type ContactPelanggan } from "../types";

interface ContactPelangganProps {
  contacts: ContactPelanggan[];
  setContacts: Dispatch<SetStateAction<ContactPelanggan[]>>;
}

const ContactPelanggan = ({ contacts, setContacts }: ContactPelangganProps) => {
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const onShowHideModal = () => {
    setOpen((prev) => !prev);
  };

  const kontakForm = useForm<z.infer<typeof kontakFormSchema>>({
    resolver: zodResolver(kontakFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
  });

  const onChangeStatus = (id: string, status: boolean) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === id ? { ...contact, is_active: status } : { ...contact }
      )
    );
  };

  const onAddAccount = (data: z.infer<typeof kontakFormSchema>) => {
    setIsProcessing(true);
    setTimeout(() => {
      setContacts([...contacts, { ...data, id: uuidv4(), is_active: true }]);
      kontakForm.reset();
      setOpen(false);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Kontak Pelanggan</h2>
          <p className="text-sm text-muted-foreground">
            Contact person pelanggan
          </p>
        </div>
        <div>
          <Dialog open={open} onOpenChange={onShowHideModal}>
            <DialogTrigger asChild>
              <Button type="button">
                <PlusIcon className="h-4 w-4" />
                Tambah kontak
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah kontak pelanggan</DialogTitle>
                <Separator />
                <Form {...kontakForm} key="kontak-form">
                  <div className="space-y-4">
                    <FormField
                      control={kontakForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nama kontak"
                              {...field}
                              autoComplete="off"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={kontakForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nomor HP</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="No. Telp"
                              {...field}
                              autoComplete="off"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={kontakForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Email"
                              {...field}
                              autoComplete="off"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      onClick={kontakForm.handleSubmit(onAddAccount)}
                      isLoading={isProcessing}
                      disabled={isProcessing}
                    >
                      Tambah
                    </Button>
                  </div>
                </Form>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <ContactPelangganDataTable
        contactData={contacts}
        onStatusChange={onChangeStatus}
      />
    </div>
  );
};

export default ContactPelanggan;
