import { NotificationProvider } from "@/context/NotificationContext";
import { CustomerShell } from "./customer-shell";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <CustomerShell>{children}</CustomerShell>
    </NotificationProvider>
  );
}
