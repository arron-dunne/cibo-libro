import React from 'react';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed inset-0 -z-20 bg-red-200" />
      {children}
    </>
  );
}
