import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const styles = readFileSync(
  join(process.cwd(), "src/modules/landing/public-landing-page.module.css"),
  "utf8",
);

describe("AgentHub public landing typography", () => {
  it("scopes the approved system body and display stacks to the landing root", () => {
    expect(styles).toContain(
      '--font-body: -apple-system, BlinkMacSystemFont, "SF Pro Text", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;',
    );
    expect(styles).toContain(
      '--font-display: "SF Pro Display", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;',
    );
    expect(styles).toMatch(/\.site\s*\{[\s\S]*font-family: var\(--font-body\);/);
    expect(styles).toMatch(/\.hero h1[\s\S]*font-family: var\(--font-display\);/);
  });

  it("keeps Chinese display type below black weight with restrained tracking", () => {
    expect(styles).toMatch(/\.hero h1 \{[^}]*font-weight: 820;[^}]*letter-spacing: -\.06em;[^}]*line-height: 1\.04;/);
    expect(styles).toMatch(/\.assetIntro h2,[^{]*\{[^}]*font-weight: 800;[^}]*letter-spacing: -\.045em;[^}]*line-height: 1\.05;/);
    expect(styles).toMatch(/@media \(max-width: 780px\)[\s\S]*\.hero h1 \{[^}]*font-weight: 820;[^}]*line-height: 1\.06;[^}]*letter-spacing: -\.055em;/);
    expect(styles).not.toContain("font-weight: 900");
    expect(styles).not.toContain('font-family: Arial, "PingFang SC", "Microsoft YaHei", sans-serif;');
  });

  it("preserves the captured full-page reference proportions without leaking outside landing", () => {
    expect(styles).toMatch(/\.hero \{[^}]*width: 100%;[^}]*height: 100svh;[^}]*min-height: 734px;[^}]*border-radius: 0 0 14px 14px;/);
    expect(styles).toMatch(/\.scenarioSection \{[^}]*grid-template-columns: 230px minmax\(0, 1fr\);[^}]*min-height: 280px;/);
    expect(styles).toMatch(/\.intentSection \{[^}]*display: block;[^}]*min-height: 500px;[^}]*padding: 82px var\(--page-gutter\) 42px;/);
    expect(styles).toMatch(/\.intentIntro h2 \{[^}]*display: flex;[^}]*max-width: 960px;[^}]*gap: \.14em;[^}]*line-height: 1\.18;/);
    expect(styles).toMatch(/\.intentPanel \{[^}]*width: min\(680px, 100%\);[^}]*margin: 54px auto 0;/);
    expect(styles).toMatch(/\.footer \{[^}]*min-height: 70px;/);
    expect(styles).toMatch(/@media \(max-width: 780px\)[\s\S]*\.nav \{ display: none; \}/);
    expect(styles).toMatch(/@media \(max-width: 780px\)[\s\S]*\.hero \{[^}]*min-height: 760px;[^}]*border-radius: 0;/);
    expect(styles).not.toContain(".heroTrail");
    expect(styles).not.toContain(".heroPortraitLower");
    expect(styles).not.toContain(".heroPortraitFar");
    expect(styles).not.toContain(".heroAtmosphere");
    expect(styles).toMatch(/\.heroPortraits \{[\s\S]*inset: 0;[\s\S]*overflow: hidden;[\s\S]*pointer-events: none;/);
    expect(styles).toMatch(/\.heroRoleStage \{[^}]*top: 50%;[^}]*right: 5vw;[^}]*width: clamp\(1024px, 80vw, 1600px\);[^}]*aspect-ratio: 1449 \/ 1086;[^}]*transform: translateY\(-50%\);/);
    expect(styles).toMatch(/\.heroRoleCard \{[^}]*aspect-ratio: 2 \/ 3;[^}]*transform: rotateZ\(2deg\);/);
    expect(styles).toMatch(/\.heroRoleCard\[data-tone="near"\] \{[^}]*filter: brightness\(\.84\);/);
    expect(styles).toMatch(/\.heroRoleCard\[data-tone="outer"\] \{[^}]*filter: brightness\(\.66\);/);
    expect(styles).not.toMatch(/\.heroRoleCard\[data-tone="(?:near|outer)"\][^}]*transform:/);
    expect(styles).not.toMatch(/\.heroRoleCard \{[^}]*skew/);
    expect(styles).not.toMatch(/\.heroRoleCard[^}]*\{[^}]*(?:perspective|rotateX|rotateY|scaleX|scaleY|matrix)\(/);
    expect(styles).toMatch(/\.heroRoleFrame \{[^}]*overflow: hidden;[^}]*border-radius: 18px;[^}]*transform: skewX\(-8deg\);/);
    expect(styles).toMatch(/\.heroRoleImage \{[^}]*inset: 0 -10%;[^}]*background: #000;[^}]*transform: skewX\(8deg\) scale\(1\.03\);/);
    expect(styles).toMatch(/\.heroRoleImage img \{[^}]*width: 100%;[^}]*height: 100%;[^}]*object-fit: contain;[^}]*transform: translate\(var\(--hero-subject-offset-x\), var\(--hero-subject-offset-y\)\) scale\(var\(--hero-subject-scale\)\);/);
    expect(styles).toMatch(/\.heroRoleCard\[data-hero-role-main="true"\] \.heroRoleImage img \{[^}]*object-fit: contain;/);
    expect(styles).toMatch(/@media \(max-width: 780px\)[\s\S]*\.heroRoleFrame \{[^}]*transform: skewX\(-5deg\);[^}]*\}[\s\S]*\.heroRoleImage \{[^}]*transform: skewX\(5deg\) scale\(1\.03\);/);
    expect(styles).not.toContain("--hero-image-scale");
    expect(styles).not.toMatch(/\.heroRole(?:Card|Frame|Image)[^}]*\{[^}]*(?:perspective|rotateX|rotateY|scaleX|scaleY|matrix)\(/);
    expect(styles).toMatch(/\.heroRoleCard\[data-hero-role-slot="main"\] \{[^}]*top: 15%;[^}]*left: 58%;[^}]*width: 30%;/);
    expect(styles).not.toMatch(/\.heroRoleCard\[data-hero-role-slot="[^"]+"\] \{[^}]*height:/);
    expect(styles).toMatch(/@media \(max-width: 780px\)[\s\S]*\.heroRoleStage \{[^}]*top: 430px;[^}]*right: -44px;[^}]*width: 540px;[^}]*aspect-ratio: 1449 \/ 1086;[^}]*transform: none;/);
    expect(styles).toMatch(/@media \(max-width: 780px\)[\s\S]*\.heroRoleCard\[data-hero-role-slot="main"\] \{[^}]*top: 14%;[^}]*left: 58%;[^}]*width: 34%;/);
    expect(styles).not.toContain(".heroPortraitCollage");
    expect(styles).not.toContain(".heroPortraitPlane");
    expect(styles).not.toContain(".heroPortraitCard");
    expect(styles).not.toContain(".heroPortraitMain");
    expect(styles).not.toContain("perspective:");
    expect(styles).not.toContain("rotateX(");
    expect(styles).not.toContain("rotateY(");
    expect(styles).not.toContain("translateZ(");
  });

  it("keeps the role showcase compact across desktop and mobile", () => {
    expect(styles).toMatch(/\.assetCarousel \{[^}]*min-height: 476px;/);
    expect(styles).toMatch(/\.assetLayer \{[^}]*height: 450px;/);
    expect(styles).toMatch(/\.assetCard \{[^}]*width: 280px;[^}]*height: 410px;[^}]*overflow: hidden;[^}]*border-radius: 18px;/);
    expect(styles).toMatch(/\.assetCard img \{[^}]*border-radius: inherit;[^}]*object-fit: cover;/);
    expect(styles).toMatch(/\.sideSelect \{[^}]*border-radius: inherit;/);
    expect(styles).toMatch(/\.assetCardCopy \{[^}]*overflow: hidden;[^}]*border-radius: 0 0 18px 18px;/);
    expect(styles).toMatch(/\.assetCardCopy \{[^}]*min-height: 116px;[^}]*padding: 16px 20px 14px;[^}]*linear-gradient\(to bottom, rgb\(5 6 4 \/ 0%\) 0,[^}]*rgb\(5 6 4 \/ 90%\) 100%\);[^}]*text-shadow: 0 1px 12px rgb\(0 0 0 \/ 90%\);/);
    expect(styles).not.toMatch(/\.assetCardCopy \{[^}]*background: rgb\(5 6 4 \/ 88%\);/);
    expect(styles).toMatch(/\.assetTitleLine \{[^}]*display: block;[^}]*white-space: nowrap;/);
    expect(styles).not.toContain(".assetCurrent");
    expect(styles).toMatch(/@media \(max-width: 780px\)[\s\S]*\.assetCarousel \{[^}]*min-height: 350px;/);
    expect(styles).toMatch(/@media \(max-width: 780px\)[\s\S]*\.assetCard \{[^}]*width: min\(212px, calc\(100vw - 134px\)\);[^}]*height: 300px;[^}]*border-radius: 14px;/);
    expect(styles).toMatch(/@media \(max-width: 780px\)[\s\S]*\.assetCardCopy \{[^}]*min-height: 84px;[^}]*border-radius: 0 0 14px 14px;[^}]*padding: 10px 14px 11px;[^}]*linear-gradient\(to bottom, rgb\(5 6 4 \/ 0%\) 0,[^}]*rgb\(5 6 4 \/ 90%\) 100%\);/);
  });

  it("uses one page rhythm without restoring deleted hero content", () => {
    expect(styles).toContain("--content-max: 1320px;");
    expect(styles).toContain("--page-gutter: max(40px, calc((100vw - var(--content-max)) / 2));");
    expect(styles).toMatch(/\.assetSection \{[^}]*margin-top: -20px;[^}]*padding: 84px 0 64px var\(--page-gutter\);/);
    expect(styles).toMatch(/\.flowSection \{[^}]*margin-top: 0;[^}]*border-top: 1px solid var\(--section-line\);/);
    expect(styles).toMatch(/\.flowHeading \{[^}]*left: var\(--page-gutter\);/);
    expect(styles).toMatch(/\.heroCta, \.primaryButton \{[^}]*min-height: 48px;/);
    expect(styles).toMatch(/@media \(max-width: 780px\)[\s\S]*\.intentSection \{[^}]*min-height: 560px;[^}]*padding: 72px var\(--page-gutter\) 40px;/);
    expect(styles).toMatch(/@media \(max-width: 780px\)[\s\S]*\.intentIntro h2 \{[^}]*max-width: 322px;[^}]*gap: \.12em;[^}]*line-height: 1\.2;/);
    expect(styles).toMatch(/@media \(max-width: 780px\)[\s\S]*\.intentPanel \{[^}]*margin-top: 48px;/);
    expect(styles).toMatch(/@media \(max-width: 780px\)[\s\S]*\.intentSuggestions \{[^}]*margin-top: 26px;/);
    expect(styles).not.toContain(".intentMeta");
    expect(styles).not.toContain(".heroTrail");
    expect(styles).not.toContain(".assetCurrent");
  });

  it("keeps the enlarged Hero CTA with one concise proof rail", () => {
    expect(styles).toMatch(/\.heroCta \{[^}]*min-width: 148px;[^}]*min-height: 52px;[^}]*margin-top: 22px;[^}]*padding: 0 26px;[^}]*font-size: 14px;/);
    expect(styles).toMatch(/\.heroStatus \{[^}]*margin-top: 32px;/);
    expect(styles).not.toContain(".heroStats");
    expect(styles).toMatch(/@media \(max-width: 780px\)[\s\S]*\.heroCta \{[^}]*min-width: 126px;[^}]*min-height: 48px;[^}]*margin-top: 20px;[^}]*padding: 0 22px;[^}]*font-size: 13px;/);
    expect(styles).toMatch(/@media \(max-width: 780px\)[\s\S]*\.heroStatus \{[^}]*margin-top: 24px;/);
  });

  it("keeps fluorescent primary-action labels dark in every interaction state", () => {
    expect(styles).toMatch(/\.nav a:hover \{ color: var\(--lime\); \}/);
    expect(styles).not.toContain(".nav a:hover, .loginLink:hover");
    expect(styles).toMatch(/\.loginLink:hover, \.loginLink:focus-visible, \.loginLink:active \{ color: #070806; \}/);
    expect(styles).toMatch(/\.heroCta:hover, \.heroCta:focus-visible, \.heroCta:active,[\s\S]*\.primaryButton:hover, \.primaryButton:focus-visible, \.primaryButton:active \{ color: #050604; \}/);
  });

  it("keeps inactive creation steps readable without flattening the active hierarchy", () => {
    expect(styles).toMatch(/\.stepButton, \.stepButtonActive \{[^}]*opacity: \.8;/);
    expect(styles).toMatch(/\.stepButtonActive \{ opacity: 1;/);
    expect(styles).toMatch(/\.stepButton:hover, \.stepButton:focus-visible \{ opacity: 1; \}/);
    expect(styles).toMatch(/@media \(max-width: 780px\)[\s\S]*\.stepButton \{ opacity: \.8; \}/);
    expect(styles).not.toMatch(/\.stepButton, \.stepButtonActive \{[^}]*opacity: \.(?:34|38);/);
  });

  it("extends compact landing controls to practical hit areas without resizing their visuals", () => {
    expect(styles).toMatch(/\.loginLink::after \{[^}]*inset: -2px 0;/);
    expect(styles).toMatch(/\.assetProgress button::before \{[^}]*inset: -12px 0;/);
    expect(styles).toMatch(/\.intentSuggestions button::before \{[^}]*inset: -7px 0;/);
    expect(styles).toMatch(/\.footer nav a::after \{[^}]*inset: -14px 0;/);
    expect(styles).toMatch(/\.footer > \.brand::after \{[^}]*inset: -10px 0;/);
    expect(styles).toMatch(/@media \(max-width: 780px\)[\s\S]*\.assetProgress \{[^}]*gap: 10px;[^}]*\}[\s\S]*\.assetProgress button::before \{[^}]*right: -5px;[^}]*left: -5px;/);
  });

  it("keeps the intent submit button inside one bordered capsule", () => {
    expect(styles).toMatch(/\.intentControl \{[^}]*height: 64px;[^}]*border: 1px solid rgb\(255 255 255 \/ 24%\);[^}]*border-radius: 34px;[^}]*background: rgb\(7 8 6 \/ 82%\);/);
    expect(styles).toMatch(/\.intentControl:focus-within \{[^}]*border-color: rgb\(199 255 24 \/ 72%\);[^}]*box-shadow: 0 0 0 3px rgb\(199 255 24 \/ 12%\);/);
    expect(styles).toMatch(/\.intentControl textarea \{[^}]*display: block;[^}]*height: 100%;[^}]*border: 0;[^}]*padding: 20px 84px 14px 24px;[^}]*background: transparent;/);
    expect(styles).toMatch(/\.intentControl button \{[^}]*top: 50%;[^}]*right: 10px;[^}]*width: 50px;[^}]*height: 50px;[^}]*transform: translateY\(-50%\);/);
    expect(styles).toMatch(/@media \(max-width: 780px\)[\s\S]*\.intentControl \{[^}]*height: 58px;[^}]*min-height: 58px;[^}]*\}[\s\S]*\.intentControl button \{[^}]*right: 8px;[^}]*width: 46px;[^}]*height: 46px;/);
    expect(styles).not.toMatch(/\.intentControl button \{[^}]*bottom:/);
  });

  it("uses the R22 copy hierarchy without clipped scenario values", () => {
    expect(styles).toMatch(/\.flowHeading h2 \{[^}]*display: flex;[^}]*flex-direction: column;[^}]*gap: \.06em;[^}]*line-height: 1\.03;/);
    expect(styles).toMatch(/\.flowTitleLine \{[^}]*display: block;[^}]*white-space: nowrap;/);
    expect(styles).toMatch(/\.scenarioTitleLine \{[^}]*display: block;[^}]*white-space: nowrap;/);
    expect(styles).toMatch(/\.scenarioCopy \{[^}]*grid-template-columns: 30px minmax\(0, 1fr\);[^}]*align-items: end;/);
    expect(styles).toMatch(/\.scenarioCopy p \{[^}]*font-size: 11px;[^}]*white-space: normal;/);
    expect(styles).not.toContain("text-overflow: ellipsis");
    expect(styles).toMatch(/\.intentSuggestions button \{[^}]*border-radius: 11px;[^}]*transition: border-color 180ms ease, color 180ms ease, background-color 180ms ease;/);
    expect(styles).toMatch(/\.intentSuggestions button:focus-visible \{[^}]*outline: 2px solid var\(--lime\);[^}]*outline-offset: 2px;/);
  });
});
