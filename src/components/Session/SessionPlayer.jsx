import { useState, useEffect, useRef } from "react";
import "../../styles/SessionPlayer.css";
import { LogActivity } from "../../querys/Activity.query";

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

/* Respiración 4-7-8: ciclo de 19s con fase + escala del círculo */
const phaseOf = (elapsed) => {
  const t = elapsed % 19;
  if (t < 4) return { label: "Inhala", left: 4 - t, scale: 1 + (t / 4) * 0.35 };
  if (t < 11) return { label: "Sostén", left: 11 - t, scale: 1.35 };
  return { label: "Exhala", left: 19 - t, scale: 1.35 - ((t - 11) / 8) * 0.35 };
};

/* Reproductor de sesión individual: animación propia + temporizador que registra tiempo. */
const SessionPlayer = ({
  action,
  title,
  subtitle,
  steps = [],
  animation = "breathe",
  accent = "#34d3b0",
  presets = [5, 10, 15, 20],
  userId,
}) => {
  const [minutes, setMinutes] = useState(presets[1] ?? presets[0]);
  const [remaining, setRemaining] = useState(null);
  const [running, setRunning] = useState(false);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const totalRef = useRef(0);
  const timerRef = useRef(null);

  const idle = remaining === null;
  const elapsed = idle ? 0 : totalRef.current - remaining;
  const ph = animation === "phases" && !idle ? phaseOf(elapsed) : null;

  useEffect(() => () => clearInterval(timerRef.current), []);

  const saveElapsed = async (secs) => {
    if (!userId || secs < 30) return false;
    setSaving(true);
    try {
      await LogActivity({ userId, action, seconds: secs });
      return true;
    } catch {
      return false;
    } finally {
      setSaving(false);
    }
  };

  const tick = () => {
    setRemaining((prev) => {
      if (prev === null) return prev;
      if (prev <= 1) {
        clearInterval(timerRef.current);
        setRunning(false);
        return 0;
      }
      return prev - 1;
    });
  };

  /* Al llegar a 0 se guarda la sesión completa */
  useEffect(() => {
    if (remaining === 0 && totalRef.current > 0) {
      const total = totalRef.current;
      totalRef.current = 0;
      saveElapsed(total).then((ok) => {
        setMsg(ok ? "¡Sesión completada y registrada! 🧘" : "Sesión completada.");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  const start = () => {
    const total = minutes * 60;
    totalRef.current = total;
    setRemaining(total);
    setRunning(true);
    setMsg("");
    clearInterval(timerRef.current);
    timerRef.current = setInterval(tick, 1000);
  };

  const pause = () => {
    clearInterval(timerRef.current);
    setRunning(false);
  };

  const resume = () => {
    setRunning(true);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(tick, 1000);
  };

  const stopAndSave = async () => {
    clearInterval(timerRef.current);
    setRunning(false);
    const done = totalRef.current - (remaining ?? 0);
    const ok = await saveElapsed(done);
    setMsg(ok ? `Sesión guardada: ${fmt(done)} ✔` : "Menos de 30 segundos: no se registró.");
    setRemaining(null);
    totalRef.current = 0;
  };

  const cancel = () => {
    clearInterval(timerRef.current);
    setRunning(false);
    setRemaining(null);
    totalRef.current = 0;
    setMsg("");
  };

  return (
    <div className="sess-card" style={{ "--sess-accent": accent }}>
      <span className="sess-kicker">{title}</span>
      <p className="sess-sub">{subtitle}</p>

      {/* Animación sencilla durante la sesión */}
      <div className={`sess-visual ${animation}${running ? " playing" : ""}`}>
        {animation === "phases" ? (
          <div className="sess-drop" style={ph ? { transform: `scale(${ph.scale})` } : undefined}>
            <span className="sess-phase">{!idle ? ph.label : "4-7-8"}</span>
            {!idle && <small className="sess-count">{ph.left}s</small>}
          </div>
        ) : animation === "scan" ? (
          <div className="sess-scanbox"><div className="sess-beam" /></div>
        ) : animation === "trail" ? (
          <div className="sess-trail">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="sess-dot" style={{ animationDelay: `${i * 0.35}s` }} />
            ))}
          </div>
        ) : (
          <div className="sess-drop" />
        )}
      </div>

      {idle && steps.length > 0 && (
        <ol className="sess-steps">
          {steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      )}

      {!idle && <div className="sess-clock">{fmt(remaining)}</div>}

      {idle && (
        <>
          <label className="sess-label">Duración</label>
          <div className="sess-presets">
            {presets.map((p) => (
              <button key={p} className={`sess-chip${minutes === p ? " sel" : ""}`} onClick={() => setMinutes(p)}>
                {p} min
              </button>
            ))}
          </div>
        </>
      )}

      <div className="sess-btns">
        {idle && <button className="sess-btn primary" onClick={start}>▶ Iniciar sesión</button>}
        {running && <button className="sess-btn ghost" onClick={pause}>⏸ Pausar</button>}
        {!running && !idle && <button className="sess-btn primary" onClick={resume}>▶ Continuar</button>}
        {!idle && <button className="sess-btn soft" onClick={stopAndSave} disabled={saving}>{saving ? "Guardando…" : "✔ Terminar y guardar"}</button>}
        {!idle && <button className="sess-btn ghost" onClick={cancel}>✕</button>}
      </div>
      {msg && <p className="sess-msg">{msg}</p>}
    </div>
  );
};

export default SessionPlayer;
