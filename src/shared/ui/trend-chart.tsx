"use client";

import { useEffect, useRef } from "react";

export interface TrendSeries {
  label: string;
  color: string;
  values: number[];
}

export function TrendChart({
  labels,
  series,
  ariaLabel,
}: {
  labels: string[];
  series: TrendSeries[];
  ariaLabel: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, rect.width, rect.height);

      const styles = getComputedStyle(document.documentElement);
      const border = styles.getPropertyValue("--color-border").trim() || "#e3e6ee";
      const muted = styles.getPropertyValue("--color-text-muted").trim() || "#697085";
      const padding = { left: 42, right: 16, top: 16, bottom: 30 };
      const width = rect.width - padding.left - padding.right;
      const height = rect.height - padding.top - padding.bottom;
      const maximum = Math.max(...series.flatMap((item) => item.values), 1);
      const roundedMax = Math.ceil(maximum / 1000) * 1000 || maximum;

      context.font = "11px ui-sans-serif, system-ui";
      context.lineWidth = 1;
      for (let index = 0; index <= 4; index += 1) {
        const y = padding.top + (height * index) / 4;
        context.strokeStyle = border;
        context.beginPath();
        context.moveTo(padding.left, y);
        context.lineTo(rect.width - padding.right, y);
        context.stroke();
        context.fillStyle = muted;
        const value = Math.round(roundedMax * (1 - index / 4));
        context.fillText(value >= 1000 ? `${Math.round(value / 1000)}K` : String(value), 4, y + 4);
      }

      series.forEach((item) => {
        context.strokeStyle = item.color;
        context.lineWidth = 2;
        context.lineJoin = "round";
        context.lineCap = "round";
        context.beginPath();
        item.values.forEach((value, index) => {
          const x = padding.left + (width * index) / Math.max(item.values.length - 1, 1);
          const y = padding.top + height - (value / roundedMax) * height;
          if (index === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        });
        context.stroke();
      });

      context.fillStyle = muted;
      const ticks = [0, Math.floor((labels.length - 1) / 2), labels.length - 1];
      ticks.forEach((index) => {
        const x = padding.left + (width * index) / Math.max(labels.length - 1, 1);
        context.fillText(labels[index] || "", Math.max(0, x - 14), rect.height - 8);
      });
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [labels, series]);

  return <canvas ref={canvasRef} className="h-64 w-full" role="img" aria-label={ariaLabel} />;
}
