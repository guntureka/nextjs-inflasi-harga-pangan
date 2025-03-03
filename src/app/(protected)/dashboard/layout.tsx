import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex flex-col">
      <h1>Layout</h1>
      {children}
    </div>
  );
}
