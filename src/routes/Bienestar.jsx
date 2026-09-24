import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Bienestar.css";
import Navbar from "../components/Navbar";
import Cookies from "universal-cookie";
import api from "../querys/api";
import { URL } from "../querys/Auth.query";
import BackButton from "../components/BackButton";

/* PHQ-4: chequeo ultrabreve validado (2 depresión + 2 ansiedad). Rango: últimas 2 semanas. */
const ITEMS = [
  { key: "D1", text: "Poco interés o placer en hacer las cosas" },
  { key: "D2", text: "Desánimo, depresión o falta de esperanza" },
  { key: "D3", text: "Nerviosismo, ansiedad o tensión" },
  { key: "D4", text: "Dificultad para parar o controlar la preocupación" },
];

const OPTS = [
  { v: 0, label: "Nada" },
  { v: 1, label: "Varios días" },
  { v: 2, label: "Más de la mitad de los días" },
  { v: 3, label: "Casi todos los días" },
];

const bandOf = (t) => (t <= 2 ? "Mínima" : t <= 5 ? "Leve" : t <= 8 ? "Moderada" : "Severa");

const Bienestar = () => {
  const navigate = useNavigate();
  const cookie = new Cookies();
  const cook = cookie.get("id");

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([null, null, null, null]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  if (!cook) {
    navigate("/time-out");
    return null;
  }

  const choose = (v) => {
    const next = [...answers];
    next[idx] = v;
    setAnswers(next);
    setError("");
  };

  const submit = async () => {
    if (answers.some((a) => a === null)) {
      setError("Responde las 4 preguntas para guardar tu chequeo.");
      return;
    }
    setSaving(true);
    setError("");
    const d = answers[0] + answers[1];
    const a = answers[2] + answers[3];
    try {
      await api.post(`${URL}/Mood/phq4/${cook}`, {
        d1: answers[0], d2: answers[1], d3: answers[2], d4: answers[3],
      });
      setResult({ d, a, total: d + a, band: bandOf(d + a) });
    } catch (e) {
      const msg = e?.response?.data;
      setError(typeof msg === "string" ? msg : "No se pudo guardar, intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  if (result) {
    return (
      <div>
        <Navbar />
        <BackButton />
        <div className="phq-wrap">
          <div className="phq-card">
            <span className="phq-kicker">Chequeo semanal · PHQ-4</span>
            <h1 className="phq-h1">Tu resultado</h1>
            <div className="phq-total">{result.total}<small>/12</small></div>
            <span className={`phq-band ${result.band.toLowerCase()}`}>{result.band}</span>
            <div className="phq-subs">
              <div className="phq-sub"><span>Depresión</span><b>{result.d}/6</b></div>
              <div className="phq-sub"><span>Ansiedad</span><b>{result.a}/6</b></div>
            </div>
            <p className="phq-note">Resultado orientativo para acompañamiento profesional. No constituye un diagnóstico.</p>
            <div className="phq-btns">
              <Link to="/Dashboard"><button className="phq-btn ghost">Dashboard</button></Link>
              <Link to="/GraphicsWellbeing"><button className="phq-btn primary">Ver mi evolución</button></Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const item = ITEMS[idx];

  return (
    <div>
      <Navbar />
      <div className="phq-wrap">
        <div className="phq-card">
          <span className="phq-kicker">Chequeo semanal · PHQ-4</span>
          <h1 className="phq-h1">¿Cómo te has sentido las últimas 2 semanas?</h1>
          <p className="phq-dim">Pregunta {idx + 1} de 4 · Solo te tomará un minuto.</p>
          <div className="phq-qbar"><i style={{ width: `${((idx + 1) / 4) * 100}%` }} /></div>
          <h2 className="phq-q">{item.text}</h2>
          <div className="phq-opts">
            {OPTS.map((o) => (
              <button
                key={o.v}
                className={`phq-opt${answers[idx] === o.v ? " sel" : ""}`}
                onClick={() => choose(o.v)}
              >
                <span className="phq-k">{o.v}</span> {o.label}
              </button>
            ))}
          </div>
          {error && <p className="phq-error">{error}</p>}
          <div className="phq-btns">
            <button className="phq-btn ghost" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>← Anterior</button>
            {idx < 3 ? (
              <button className="phq-btn primary" onClick={() => setIdx(idx + 1)}>Siguiente →</button>
            ) : (
              <button className="phq-btn primary" disabled={saving} onClick={submit}>
                {saving ? "Guardando…" : "Guardar chequeo"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bienestar;
