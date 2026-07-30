import { Fragment, type ReactNode } from "react";

const INLINE_MARKDOWN_PATTERN =
  /(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\[[^\]\n]+\]\([^)]+\)|\*[^*\n]+\*|_[^_\n]+_)/g;

function safeLinkHref(value: string): string | null {
  const href = value.trim();
  if (
    href.startsWith("https://") ||
    href.startsWith("http://") ||
    href.startsWith("/") ||
    href.startsWith("#")
  ) {
    return href;
  }
  return null;
}

function renderInlineMarkdown(
  value: string,
  keyPrefix: string,
): ReactNode[] {
  return value
    .split(INLINE_MARKDOWN_PATTERN)
    .filter(Boolean)
    .map((token, index) => {
      const key = `${keyPrefix}-${index}`;
      if (token.startsWith("`") && token.endsWith("`")) {
        return (
          <code
            key={key}
            className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-[0.92em] dark:bg-white/10"
          >
            {token.slice(1, -1)}
          </code>
        );
      }
      if (
        (token.startsWith("**") && token.endsWith("**")) ||
        (token.startsWith("__") && token.endsWith("__"))
      ) {
        return (
          <strong key={key} className="font-semibold text-inherit">
            {renderInlineMarkdown(token.slice(2, -2), `${key}-strong`)}
          </strong>
        );
      }
      if (token.startsWith("~~") && token.endsWith("~~")) {
        return <del key={key}>{token.slice(2, -2)}</del>;
      }
      if (
        (token.startsWith("*") && token.endsWith("*")) ||
        (token.startsWith("_") && token.endsWith("_"))
      ) {
        return <em key={key}>{token.slice(1, -1)}</em>;
      }
      if (token.startsWith("[")) {
        const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        const href = link ? safeLinkHref(link[2]) : null;
        if (link && href) {
          return (
            <a
              key={key}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
              className="font-medium text-primary underline decoration-primary/35 underline-offset-2 hover:decoration-primary"
            >
              {link[1]}
            </a>
          );
        }
      }
      return <Fragment key={key}>{token}</Fragment>;
    });
}

function isBlockStart(line: string): boolean {
  return (
    /^#{1,6}\s+/.test(line) ||
    /^```/.test(line) ||
    /^>\s?/.test(line) ||
    /^[-*+]\s+/.test(line) ||
    /^\d+[.)]\s+/.test(line) ||
    /^(\*{3,}|-{3,}|_{3,})\s*$/.test(line)
  );
}

export function MarkdownContent({
  content,
  className = "",
}: {
  content: string;
  className?: string;
}) {
  const lines = content.replace(/\r\n?/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    const fence = line.match(/^```([\w-]*)\s*$/);
    if (fence) {
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !/^```\s*$/.test(lines[index])) {
        codeLines.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      blocks.push(
        <pre
          key={`code-${index}`}
          className="overflow-x-auto rounded-lg bg-slate-950 px-4 py-3 text-xs leading-5 text-slate-100"
        >
          <code data-language={fence[1] || undefined}>
            {codeLines.join("\n")}
          </code>
        </pre>,
      );
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const headingClass =
        level <= 2
          ? "text-base font-semibold"
          : "text-sm font-semibold";
      const children = renderInlineMarkdown(
        heading[2],
        `heading-${index}`,
      );
      blocks.push(
        level === 1 ? (
          <h1 key={`heading-${index}`} className={headingClass}>
            {children}
          </h1>
        ) : level === 2 ? (
          <h2 key={`heading-${index}`} className={headingClass}>
            {children}
          </h2>
        ) : (
          <h3 key={`heading-${index}`} className={headingClass}>
            {children}
          </h3>
        ),
      );
      index += 1;
      continue;
    }

    if (/^(\*{3,}|-{3,}|_{3,})\s*$/.test(line)) {
      blocks.push(<hr key={`rule-${index}`} className="border-border" />);
      index += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quoteLines: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quoteLines.push(lines[index].replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push(
        <blockquote
          key={`quote-${index}`}
          className="border-l-2 border-primary/40 pl-3 text-text-muted"
        >
          {renderInlineMarkdown(quoteLines.join("\n"), `quote-${index}`)}
        </blockquote>,
      );
      continue;
    }

    const unordered = line.match(/^[-*+]\s+(.+)$/);
    if (unordered) {
      const items: string[] = [];
      while (index < lines.length) {
        const item = lines[index].match(/^[-*+]\s+(.+)$/);
        if (!item) break;
        items.push(item[1]);
        index += 1;
      }
      blocks.push(
        <ul
          key={`unordered-${index}`}
          className="list-disc space-y-1 pl-5 marker:text-text-muted"
        >
          {items.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`}>
              {renderInlineMarkdown(
                item,
                `unordered-${index}-${itemIndex}`,
              )}
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    const ordered = line.match(/^(\d+)[.)]\s+(.+)$/);
    if (ordered) {
      const start = Number(ordered[1]);
      const items: string[] = [];
      while (index < lines.length) {
        const item = lines[index].match(/^\d+[.)]\s+(.+)$/);
        if (!item) break;
        items.push(item[1]);
        index += 1;
      }
      blocks.push(
        <ol
          key={`ordered-${index}`}
          start={start}
          className="list-decimal space-y-1 pl-5 marker:text-text-muted"
        >
          {items.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`}>
              {renderInlineMarkdown(item, `ordered-${index}-${itemIndex}`)}
            </li>
          ))}
        </ol>,
      );
      continue;
    }

    const paragraph: string[] = [line];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !isBlockStart(lines[index])
    ) {
      paragraph.push(lines[index]);
      index += 1;
    }
    blocks.push(
      <p
        key={`paragraph-${index}`}
        className="whitespace-pre-wrap [overflow-wrap:anywhere]"
      >
        {renderInlineMarkdown(paragraph.join("\n"), `paragraph-${index}`)}
      </p>,
    );
  }

  return (
    <div className={`space-y-3 leading-6 ${className}`.trim()}>{blocks}</div>
  );
}
