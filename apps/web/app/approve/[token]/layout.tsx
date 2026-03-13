export const metadata = {
  title: "Purchase Approval — AgentForge",
};

export default function ApproveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
