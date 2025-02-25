"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { validate as isUUID } from "uuid";

const CRMBreadcrumb = () => {
  const pathname = usePathname();
  const pathParts = pathname.split("/");

  let url = "";

  return (
    <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {pathParts?.map((e, i) => {
            if (!e) return null;
            url += `/${e}`;
            return (
              <Fragment key={e}>
                <BreadcrumbItem className="hidden md:block">
                  {i < pathParts.length - 1 ? (
                    <Link href={url} className="capitalize">
                      {e}
                    </Link>
                  ) : (
                    <BreadcrumbPage className="capitalize">
                      {isUUID(e) ? "Detail" : e}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {i === pathParts.length - 1 ? null : (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
};

export default CRMBreadcrumb;
