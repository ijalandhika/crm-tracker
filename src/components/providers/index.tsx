"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export default function RootProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        color="#fffd00"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
}
