import { Suspense, type ReactNode } from "react";

function AuthFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas text-sm text-text-muted">
      正在加载身份页面…
    </main>
  );
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<AuthFallback />}>{children}</Suspense>;
}
