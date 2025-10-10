const { useState, useEffect, useMemo } = React;

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
      <div
        className="progress-bar"
        style={{ width: `${progress}%` }}
        role="presentation"
      ></div>
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
      stage.appendChild(spark);
      setTimeout(() => {
        spark.remove();
      }, 1500);
    }, i * 80);
  }
}

const App = () => {
  const [view, setView] = useState("home");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totals, setTotals] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch("questions.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Não consegui carregar as perguntas. 😿");
        }
        return res.json();
      })
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (view === "result") {
      launchFireworks();
    }
  }, [view]);

  const handleStart = () => {
    setView("quiz");
    setCurrentIndex(0);
  };

  const handleSelect = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const progress = totalQuestions ? Math.round(((currentIndex + 1) / totalQuestions) * 100) : 0;

  const handleNavigate = (direction) => {
    if (direction === "next" && currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
    if (direction === "prev" && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const calculateResult = () => {
    const tally = resultProfiles.reduce((acc, profile) => {
      acc[profile.id] = 0;
      return acc;
    }, {});

    questions.forEach((question) => {
      const answerId = answers[question.id];
      if (!answerId) return;
      const selected = question.answers.find((answer) => answer.id === answerId);
      if (!selected) return;
      Object.entries(selected.weights).forEach(([profileId, weight]) => {
        tally[profileId] = (tally[profileId] || 0) + weight;
      });
    });

    let winner = resultProfiles[0];
    resultProfiles.forEach((profile) => {
      if (tally[profile.id] > tally[winner.id]) {
        winner = profile;
      }
    });

    setTotals(tally);
    setResult(winner);
  };

  const handleSubmit = () => {
    if (answeredCount !== totalQuestions) {
      return;
    }
    calculateResult();
    setView("result");
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentIndex(0);
    setResult(null);
    setTotals({});
    setView("home");
  };

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const completion = totalQuestions ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  return (
    <>
      <CatParade active={view !== "home"} />
      <main>
        <section className="hero">
          <FloatingStars />
          <div className="hero-content">
            <p className="badge">
              <span>🌈</span>
              Descubra quem você é
            </p>
            <h1>Quiz Nonsense: Qual é seu alter-ego de meme cósmico?</h1>
            <p>
              Prepare-se para perguntas sem pé nem cabeça, pesos secretos e respostas iluminadas
              por glitter. Ao final, revelaremos qual das seis entidades meme você realmente é.
            </p>
            <button className="primary-button" onClick={handleStart}>
              Faça o teste agora
            </button>
            <p style={{ marginTop: "1.4rem", color: "var(--text-soft)" }}>
              {totalQuestions
                ? `São ${totalQuestions} perguntas com ${completion}% já respondidas.`
                : "Carregando perguntas insanas diretamente do etéreo..."}
            </p>
          </div>
        </section>

        <section className="section" id="personas">
          <h2>As seis criaturas que disputam sua alma meme</h2>
          <div className="grid">
            {resultProfiles.map((profile, index) => (
              <article
                key={profile.id}
                className="profile-card"
                style={{ background: `var(--card-${index + 1})` }}
              >
                <div className="emoji" role="img" aria-label={profile.name}>
                  {profile.emoji}
                </div>
                <h3>{profile.name}</h3>
                <strong style={{ display: "block", marginBottom: "0.6rem" }}>
                  {profile.tagline}
                </strong>
                <p>{profile.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="quiz">
          <h2>Hora do teste cósmico</h2>
          {loading && <p style={{ textAlign: "center" }}>Carregando perguntas malucas...</p>}
          {error && <p style={{ textAlign: "center", color: "#ff9a3c" }}>{error}</p>}
          {!loading && !error && view === "quiz" && currentQuestion && (
            <>
              <QuizQuestion
                question={currentQuestion}
                value={answers[currentQuestion.id]}
                onChange={(optionId) => handleSelect(currentQuestion.id, optionId)}
                progress={progress}
              />
              <div className="quiz-actions" style={{ marginTop: "1.6rem" }}>
                <button
                  className="secondary-button"
                  onClick={() => handleNavigate("prev")}
                  disabled={currentIndex === 0}
                  style={currentIndex === 0 ? { opacity: 0.4, cursor: "not-allowed" } : undefined}
                >
                  Voltar
                </button>
                {currentIndex < totalQuestions - 1 ? (
                  <button
                    className="primary-button"
                    onClick={() => handleNavigate("next")}
                    disabled={!answers[currentQuestion.id]}
                    style={
                      !answers[currentQuestion.id]
                        ? { opacity: 0.6, cursor: "not-allowed" }
                        : undefined
                    }
                  >
                    Próxima pergunta
                  </button>
                ) : (
                  <button
                    className="primary-button"
                    onClick={handleSubmit}
                    disabled={answeredCount !== totalQuestions}
                    style={
                      answeredCount !== totalQuestions
                        ? { opacity: 0.6, cursor: "not-allowed" }
                        : undefined
                    }
                  >
                    Revelar meu alter-ego
                  </button>
                )}
              </div>
            </>
          )}

          {view === "result" && result && (
            <ResultPanel result={result} totals={totals} onRestart={handleRestart} />
          )}

          {view !== "quiz" && view !== "result" && !loading && (
            <p style={{ textAlign: "center", color: "var(--text-soft)", maxWidth: "540px", margin: "0 auto" }}>
              Clique em "Faça o teste agora" para liberar o formulário nonsense. A cada pergunta,
              você soma pontos secretos que escolhem qual dessas figuras brilhantes combina com seu
              humor hoje.
            </p>
          )}
        </section>
      </main>
      <footer>
        Feito com React, glitter sintético e muito carinho meme. Compartilhe seu resultado e marque
        a hashtag <strong>#QuizDoMultiverso</strong>.
      </footer>
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
