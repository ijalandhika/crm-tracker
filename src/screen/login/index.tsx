import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Form from "./form";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form />
          <div className="relative hidden bg-muted md:block">
            <Image
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              src="/images/crm.png"
              alt="Next.js logo"
              width={383}
              height={514}
              priority
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
