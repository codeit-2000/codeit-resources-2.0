import React from "react";

import NavigationBar from "./NavigationBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <NavigationBar />
      <main className="md:ml-200">{children}</main>
    </div>
  );
}
