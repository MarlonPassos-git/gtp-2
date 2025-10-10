import React, { useMemo, useState, useEffect } from "react";
import questions from "./data/questions";
import "./styles.css";

const resultProfiles = [
  {
    id: "nyan",
    name: "Nyantronauta Rosa",
    emoji: "🚀🐱",
    description:
      "Você é movido a glitter interestelar e acha que todo problema se resolve com uma boa playlist vaporwave.",
    gradient: "var(--card-1)",
    tagline: "Piloto oficial dos memes supersônicos"
  },
  {
    id: "pudim",
    name: "Oráculo do Pudim do Espaço",
    emoji: "🍮🔮",
    description:
      "Conselhos doces, respostas místicas. Você vê o futuro através da calda caramelizada e sempre tem um insight fofo para dar.",
    gradient: "var(--card-3)",
    tagline: "Guru cremoso das timelines"
  },
  {
    id: "capy",
    name: "Capivara do Wi-Fi Emocional",
    emoji: "🦫📶",
    description:
      "Calmo, acolhedor e sempre online. Você cria zonas de conforto com meme-terapia e compartilha senha de Wi-Fi com quem precisa.",
    gradient: "var(--card-2)",
    tagline: "Suporte técnico do coração"
  },
  {
    id: "flamingo",
    name: "Flamingo DJ das Alturas",
    emoji: "🦩🎛️",
    description:
      "Batidas aéreas e coreografias sem gravidade: você é o hype personificado e transforma filas em pistas de dança.",
    gradient: "var(--card-5)",
    tagline: "Residente oficial do céu-clube"
  },
  {
    id: "abacate",
    name: "Abacate Cyber-Samurai",
    emoji: "🥑⚔️",
    description:
      "Disciplinado com um toque caótico, você mistura códigos secretos, artes marciais e carinho vitamínico pra salvar o dia.",
    gradient: "var(--card-4)",
    tagline: "Guardião verde neon"
  },
  {
    id: "pipoca",
    name: "Pipoca Filósofa do Multiverso",
    emoji: "🍿🌀",
    description:
      "Pensamentos crocantes e questionamentos profundos. Você transforma qualquer rolê em debate existencial com muito humor.",
    gradient: "var(--card-6)",
    tagline: "Mente brilhante, textura crocante"
  }
];

const FloatingStars = () => <div className="floating-stars" aria-hidden="true"></div>;

const CatParade = ({ active }) => (
  <div className={`cat-parade ${active ? "is-active" : ""}`} aria-hidden="true">
    <span>🐱‍👓</span>
    <span>🐱‍🚀</span>
    <span>😺</span>
    <span>🐈‍⬛</span>
    <span>🐱‍🏍️</span>
  </div>
);

const QuizOption = ({ option, isSelected, onSelect }) => {
  return (
    <label className={`option ${isSelected ? "selected" : ""}`}>
      <input
        type="radio"
        name={option.questionId}
        value={option.id}
        checked={isSelected}
        onChange={() => onSelect(option.id)}
      />
      <span>{option.text}</span>
    </label>
  );
};

const QuizQuestion = ({ question, value, onChange, progress }) => (
  <div className="quiz-card" role="group" aria-labelledby={`label-${question.id}`}>
    <div className="progress" aria-hidden="true">
      <div className="progress-bar" style={{ width: `${progress}%` }} role="presentation"></div>
    </div>
    <h3 id={`label-${question.id}`}>{question.question}</h3>
    <p style={{ color: "var(--text-soft)", marginTop: "0.3rem" }}>
      Escolha a resposta que mais vibra com sua alma meme.
    </p>
    <div className="options">
      {question.answers.map((answer) => (
        <QuizOption
          key={answer.id}
          option={{ ...answer, questionId: question.id }}
          isSelected={value === answer.id}
          onSelect={onChange}
        />
      ))}
    </div>
  </div>
);

const ResultPanel = ({ result, onRestart, totals }) => {
  return (
    <div className="quiz-card result-card">
      <div className="emoji" aria-hidden="true">
        {result.emoji}
      </div>
      <p className="badge" style={{ justifyContent: "center" }}>
        <span>✨</span>
        Resultado mega-sério
        <span>✨</span>
      </p>
      <h3>{result.name}</h3>
      <strong style={{ color: "var(--accent-2)", fontSize: "1rem" }}>{result.tagline}</strong>
      <p>{result.description}</p>
      <div className="score-grid">
        {resultProfiles.map((profile) => (
          <div key={profile.id} className="score-card">
            <span role="img" aria-label={profile.name}>
              {profile.emoji}
            </span>
            <strong>{profile.name}</strong>
            <small style={{ color: "var(--text-soft)" }}>Pontuação: {totals[profile.id] || 0}</small>
          </div>
        ))}
      </div>
      <div className="quiz-actions" style={{ marginTop: "2.5rem", justifyContent: "center" }}>
        <button className="primary-button" onClick={onRestart}>
          Fazer de novo
        </button>
      </div>
    </div>
  );
};

function launchFireworks() {
  const stage = document.querySelector(".firework-stage");
  if (!stage) return;
  const colors = ["#ff71d4", "#61f4de", "#ffe066", "#c4b5fd", "#ff9a3c", "#7c3aed"];
  for (let i = 0; i < 32; i++) {
    setTimeout(() => {
      const spark = document.createElement("span");
      spark.className = "firework";
      const size = 10 + Math.random() * 22;
      spark.style.width = `${size}px`;
      spark.style.height = `${size}px`;
      spark.style.background = colors[Math.floor(Math.random() * colors.length)];
      spark.style.left = `${Math.random() * 100}%`;
      spark.style.top = `${Math.random() * 100}%`;
      spark.style.animationDuration = `${1.6 + Math.random()}s`;
      stage.appendChild(spark);
      setTimeout(() => stage.removeChild(spark), 1600);
    }, 60 * i);
  }
}

const HeroCard = ({ profile }) => (
  <article className="hero-card" style={{ background: profile.gradient }}>
    <div className="hero-card__emoji" aria-hidden="true">
      {profile.emoji}
    </div>
    <h3>{profile.name}</h3>
    <p>{profile.tagline}</p>
  </article>
);

const useQuizProgress = (answers) => {
  const answered = Object.values(answers).filter(Boolean).length;
  return Math.round((answered / questions.length) * 100);
};

const computeTotals = (answers) => {
  return questions.reduce((totals, question) => {
    const selectedAnswerId = answers[question.id];
    if (!selectedAnswerId) return totals;
    const answer = question.answers.find((item) => item.id === selectedAnswerId);
    if (!answer) return totals;

    Object.entries(answer.weights).forEach(([profileId, value]) => {
      totals[profileId] = (totals[profileId] || 0) + value;
    });

    return totals;
  }, {});
};

const getTopProfile = (totals) => {
  const [topId] = Object.entries(totals).reduce(
    (acc, [profileId, score]) => {
      if (score > acc[1]) return [profileId, score];
      return acc;
    },
    [resultProfiles[0].id, 0]
  );
  return resultProfiles.find((profile) => profile.id === topId) ?? resultProfiles[0];
};

const useFireworks = (active) => {
  useEffect(() => {
    if (!active) return;
    launchFireworks();
  }, [active]);
};

const App = () => {
  const [view, setView] = useState("home");
  const [answers, setAnswers] = useState({});
  const [totals, setTotals] = useState({});

  const progress = useQuizProgress(answers);
  const result = useMemo(() => getTopProfile(totals), [totals]);
  useFireworks(view === "result");

  const handleSelectAnswer = (questionId, answerId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const computedTotals = computeTotals(answers);
    setTotals(computedTotals);
    setView("result");
  };

  const handleRestart = () => {
    setAnswers({});
    setTotals({});
    setView("home");
  };

  return (
    <div className="page">
      <FloatingStars />
      <CatParade active={view !== "home"} />
      <div className="firework-stage" aria-hidden="true"></div>
      {view === "home" && (
        <main className="hero">
          <header className="hero__header">
            <p className="badge">
              <span>✨</span>
              Descubra quem você é
              <span>✨</span>
            </p>
            <h1>Quiz Meme-místico</h1>
            <p className="lead">
              Um teste sério e científico (ou não) para revelar qual alter-ego aleatório vive dentro de você.
            </p>
            <button className="primary-button" onClick={() => setView("quiz")}>
              Faça o teste agora
            </button>
          </header>
          <section className="hero__grid" aria-label="Opções de resultado">
            {resultProfiles.map((profile) => (
              <HeroCard profile={profile} key={profile.id} />
            ))}
          </section>
        </main>
      )}

      {view === "quiz" && (
        <form className="quiz" onSubmit={handleSubmit}>
          <header className="quiz__header">
            <p className="badge">
              <span>🐾</span>
              Perguntas absolutamente científicas
              <span>🐾</span>
            </p>
            <h2>Responda com honestidade meme</h2>
            <p className="lead">
              São apenas perguntas aleatórias, prometemos. Complete todas para descobrir seu destino.
            </p>
            <div className="overall-progress" aria-hidden="true">
              <div className="overall-progress__bar" style={{ width: `${progress}%` }}></div>
            </div>
          </header>

          <div className="quiz__questions">
            {questions.map((question, index) => (
              <QuizQuestion
                key={question.id}
                question={question}
                value={answers[question.id]}
                onChange={(answerId) => handleSelectAnswer(question.id, answerId)}
                progress={Math.round(((index + 1) / questions.length) * 100)}
              />
            ))}
          </div>

          <div className="quiz-actions">
            <button type="button" className="secondary-button" onClick={handleRestart}>
              Voltar para home
            </button>
            <button
              type="submit"
              className="primary-button"
              disabled={Object.values(answers).filter(Boolean).length < questions.length}
            >
              Revelar meu alter-ego
            </button>
          </div>
        </form>
      )}

      {view === "result" && <ResultPanel result={result} totals={totals} onRestart={handleRestart} />}
    </div>
  );
};

export default App;
