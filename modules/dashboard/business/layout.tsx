export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-dvh bg-neutral-50 p-6">
      {children}
    </main>
  );
}
