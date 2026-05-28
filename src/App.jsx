import { useEffect, useMemo, useState } from "react";
import rules from "./data/biomeRules";
import "./styles.css";

const STORAGE_KEY = "biome-rule-levels-v2";
const LEVELS = ["off", "warn", "error"];

function getInitialLevels() {
  const defaults = Object.fromEntries(rules.map((rule) => [rule.id, rule.recommended || "off"]));
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return defaults;
  try {
    return { ...defaults, ...JSON.parse(saved) };
  } catch {
    return defaults;
  }
}

function buildBiomeJson(levels) {
  const grouped = rules.reduce((acc, rule) => {
    const [domain, ruleName] = rule.id.split("/");
    if (!acc[domain]) acc[domain] = {};
    acc[domain][ruleName] = levels[rule.id] || "off";
    return acc;
  }, {});

  return {
    $schema: "https://biomejs.dev/schemas/2.0.5/schema.json",
    linter: { enabled: true, rules: grouped }
  };
}

export default function App() {
  const [index, setIndex] = useState(0);
  const [levels, setLevels] = useState(getInitialLevels);
  const current = rules[index];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(levels));
  }, [levels]);

  const exported = useMemo(() => JSON.stringify(buildBiomeJson(levels), null, 2), [levels]);

  const goNext = () => setIndex((i) => Math.min(i + 1, rules.length - 1));
  const goPrev = () => setIndex((i) => Math.max(i - 1, 0));

  const setLevelAndAdvance = (value) => {
    setLevels((prev) => ({ ...prev, [current.id]: value }));
    if (index < rules.length - 1) goNext();
  };

  const copyJson = async () => navigator.clipboard.writeText(exported);

  const downloadJson = () => {
    const blob = new Blob([exported], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "biome.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="app">
      <header className="top">
        <h1>Biome Rules Explorer</h1>
        <p>{index + 1} / {rules.length} • click a level to auto-jump next</p>
      </header>

      <section className="rule-panel">
        <div className="rule-head">
          <h2>{current.name}</h2>
          <p>{current.id}</p>
        </div>

        <div className="iframe-wrap">
          <iframe title={current.name} src={current.sourceUrl} loading="lazy" referrerPolicy="no-referrer" />
        </div>

        <div className="rule-actions">
          <button onClick={goPrev} disabled={index === 0}>Prev</button>
          <a href={current.sourceUrl} target="_blank" rel="noreferrer">Open in new tab</a>
          <button onClick={goNext} disabled={index === rules.length - 1}>Next</button>
        </div>
      </section>

      <aside className="json-corner">
        <h3>biome.json</h3>
        <div className="json-actions">
          <button onClick={copyJson}>Copy</button>
          <button onClick={downloadJson}>Download</button>
        </div>
        <pre>{exported}</pre>
      </aside>

      <div className="sticky-toggle" role="group" aria-label="Rule level">
        {LEVELS.map((level) => (
          <button
            key={level}
            className={levels[current.id] === level ? "active" : ""}
            onClick={() => setLevelAndAdvance(level)}
          >
            {level}
          </button>
        ))}
      </div>
    </main>
  );
}
