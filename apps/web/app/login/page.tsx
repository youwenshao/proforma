import { LoginMarketingPanel } from "@/components/auth/login-marketing-panel";

export default function LoginPage() {
  return (
    <main className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden bg-muted/20 px-6 py-10 text-foreground">
      <LoginMarketingPanel />
    </main>
  );
}
