export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="px-8 sm:px-12 max-w-7xl mx-auto">{children}</div>;
}
