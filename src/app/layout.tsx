import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentHub",
  description: "Agent 资产构建与发行平台",
};

function ThemeScript() {
  const script = `(function(){try{var raw=localStorage.getItem('linkyun-theme');var saved=raw?JSON.parse(raw):null;var mode=saved&&(saved.mode==='light'||saved.mode==='dark'||saved.mode==='system')?saved.mode:'light';var dark=mode==='dark'||(mode==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',dark);}catch(e){document.documentElement.classList.remove('dark');}})();`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeScript />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
