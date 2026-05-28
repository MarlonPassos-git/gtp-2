import { useEffect, useMemo, useState } from "react";
import rules from "./data/biomeRules";
import "./styles.css";

const STORAGE_KEY = "biome-rule-levels-v1";
const LEVELS = ["off", "warn", "error"];

function getInitialLevels() {
  const defaults = Object.fromEntries(rules.map((rule) => [rule.id, rule.recommended || "off"]));
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return defaults;

  try {
    const parsed = JSON.parse(saved);
    return { ...defaults, ...parsed };
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
  const [detailStage, setDetailStage] = useState(0);

  const current = rules[index];
  const progress = `${index + 1} / ${rules.length}`;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(levels));
  }, [levels]);

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const ratio = maxScroll <= 0 ? 0 : window.scrollY / maxScroll;
      setDetailStage(ratio > 0.65 ? 2 : ratio > 0.3 ? 1 : 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [index]);

  const exported = useMemo(() => JSON.stringify(buildBiomeJson(levels), null, 2), [levels]);

  const setLevel = (value) => {
    setLevels((prev) => ({ ...prev, [current.id]: value }));
  };

  const copyJson = async () => navigator.clipboard.writeText(exported);

  const downloadJson = () => {
    const blob = new Blob([exported], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "biome.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="app">
      <header className="header">
        <h1>Biome Rules Explorer</h1>
        <p>Review rules, tune level, and export a complete biome.json.</p>
      </header>

      <section className="card">
        <p className="meta">Rule {progress}</p>
        <h2>{current.name}</h2>
        <p className="tagline">{current.id} · {current.domain} / {current.category}</p>
        <p>{current.summary}</p>
        {detailStage >= 1 && <p>{current.description}</p>}

        {detailStage >= 2 && (
          <div className="examples">
            <h3>Official examples</h3>
            {current.examples ? (
              <>
                <h4>Invalid</h4>
                <pre>{current.examples.invalid?.[0]}</pre>
                <h4>Valid</h4>
                <pre>{current.examples.valid?.[0]}</pre>
              </>
            ) : (
              <p>No official example available.</p>
            )}
            <a href={current.sourceUrl} target="_blank" rel="noreferrer">Open official rule page</a>
          </div>
        )}

        <div className="nav">
          <button onClick={() => setIndex((i) => Math.max(i - 1, 0))} disabled={index === 0}>Prev</button>
          <button onClick={() => setIndex((i) => Math.min(i + 1, rules.length - 1))} disabled={index === rules.length - 1}>Next</button>
        </div>
      </section>

      <section className="export">
        <h3>Export biome.json</h3>
        <div className="buttons">
          <button onClick={copyJson}>Copy JSON</button>
          <button onClick={downloadJson}>Download</button>
        </div>
        <pre>{exported}</pre>
      </section>

      <div className="sticky-toggle" role="group" aria-label="Rule level">
        {LEVELS.map((level) => (
          <button
            key={level}
            className={levels[current.id] === level ? "active" : ""}
            onClick={() => setLevel(level)}
          >
            {level}
          </button>
        ))}
      </div>
    </main>
  );
}
