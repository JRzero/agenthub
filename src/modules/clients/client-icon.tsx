import {
  Code,
  DesktopTower,
  DeviceMobile,
  Globe,
} from "@phosphor-icons/react";

export function ClientIcon({
  type,
  size = 20,
}: {
  type: string;
  size?: number;
}) {
  if (type.includes("local") || type.includes("desktop")) {
    return <DesktopTower size={size} />;
  }
  if (type.includes("mobile")) return <DeviceMobile size={size} />;
  if (type.includes("api") || type.includes("sdk")) {
    return <Code size={size} />;
  }
  return <Globe size={size} />;
}
