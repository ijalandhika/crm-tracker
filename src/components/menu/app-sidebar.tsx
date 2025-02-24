import * as React from "react";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { GenerateMenu } from "./menu";
import { headers } from "next/headers";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const heads = await headers();
  const fullUrl = heads.get("x-url");
  const pathname = fullUrl?.replace(/^https?:\/\/[^\/]+/, "");

  const menu = await GenerateMenu();
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-4">
          <Image
            src="/images/logofront.png"
            alt="Next.js"
            width={120}
            height={40}
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* We create a SidebarGroup for each parent. */}
        {menu.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
