import { AppSidebar } from "@/components/menu/app-sidebar";
import CRMBreadcrumb from "@/components/menu/breadcrumb";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function CRMLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <CRMBreadcrumb />
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
