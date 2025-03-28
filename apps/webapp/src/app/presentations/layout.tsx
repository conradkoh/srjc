export default function PresentationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-muted/20 min-h-screen">{children}</div>;
}
