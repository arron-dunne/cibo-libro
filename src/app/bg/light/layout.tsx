import React from 'react';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed inset-0 -z-20 bg-[#FFEEE3]" />
      {/* <div className="fixed inset-0 -z-20 bg-linear-to-br from-orange-100 to-rose-50" /> */}
      {/* <div className="fixed -inset-70 -z-10 w-200 h-150 bg-rose-100 rounded-full blur-3xl" /> */}
      {children}
    </>
  );
}
