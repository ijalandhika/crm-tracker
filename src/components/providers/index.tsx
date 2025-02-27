"use client";

import { AppProgressProvider as ProgressProvider } from "@bprogress/next";

export default function RootProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProgressProvider
      height="4px"
      color="#004098"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
}
