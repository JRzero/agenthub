import type { ReactNode } from "react";

export default function AssetOverviewLayout({ children }: { children: ReactNode }) {
  return (
    <div className="asset-overview-route">
      <style>{`
        @media (max-width: 639px) {
          .asset-overview-route section:first-of-type button {
            grid-template-columns: 28px minmax(98px, 1fr) minmax(72px, auto) 16px;
            gap: 8px;
            padding-left: 12px;
            padding-right: 12px;
          }

          .asset-overview-route section:first-of-type button > span:nth-of-type(2) {
            display: none;
          }

          .asset-overview-route section:first-of-type button > span:nth-of-type(3) {
            justify-self: end;
          }

          .asset-overview-route section:first-of-type button > span:nth-of-type(3) > span:last-child {
            width: 48px;
          }
        }
      `}</style>
      {children}
    </div>
  );
}
