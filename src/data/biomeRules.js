const biomeRules = [
  {
    id: "css/noDuplicateAtImportRules",
    domain: "css",
    category: "suspicious",
    name: "noDuplicateAtImportRules",
    summary: "Disallow duplicate @import rules.",
    description:
      "Prevents repeated @import statements that can cause redundancy and maintenance issues.",
    recommended: "error",
    sourceUrl: "https://biomejs.dev/linter/css/rules/no-duplicate-at-import-rules/",
    examples: {
      invalid: ["@import url('a.css');\\n@import url('a.css');"],
      valid: ["@import url('a.css');\\n@import url('b.css');"]
    }
  },
  {
    id: "css/noImportantInKeyframe",
    domain: "css",
    category: "suspicious",
    name: "noImportantInKeyframe",
    summary: "Disallow !important declarations in keyframe animations.",
    description:
      "Using !important inside keyframes has no practical effect and indicates likely confusion.",
    recommended: "warn",
    sourceUrl: "https://biomejs.dev/linter/css/rules/no-important-in-keyframe/",
    examples: {
      invalid: ["@keyframes spin {\\n  from { transform: rotate(0deg) !important; }\\n}"],
      valid: ["@keyframes spin {\\n  from { transform: rotate(0deg); }\\n}"]
    }
  },
  {
    id: "javascript/noConsole",
    domain: "javascript",
    category: "suspicious",
    name: "noConsole",
    summary: "Disallow console usage.",
    description:
      "Avoid shipping debug logging in production code when linting application sources.",
    recommended: "off",
    sourceUrl: "https://biomejs.dev/linter/javascript/rules/no-console/",
    examples: {
      invalid: ["console.log('debug');"],
      valid: ["logger.info('ready');"]
    }
  },
  {
    id: "javascript/useConst",
    domain: "javascript",
    category: "style",
    name: "useConst",
    summary: "Require const for variables that are never reassigned.",
    description:
      "Improves readability and intent by preventing reassignment for immutable bindings.",
    recommended: "error",
    sourceUrl: "https://biomejs.dev/linter/javascript/rules/use-const/",
    examples: {
      invalid: ["let answer = 42;\\nconsole.log(answer);"],
      valid: ["const answer = 42;\\nconsole.log(answer);"]
    }
  }
];

export default biomeRules;
