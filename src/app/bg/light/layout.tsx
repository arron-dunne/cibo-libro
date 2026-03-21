import React from 'react';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed inset-0 -z-20 bg-white" />
      <div className="fixed -inset-70 -z-10 w-200 h-150 bg-red-50 rounded-full blur-3xl" />
      {children}
    </>
  );
}
