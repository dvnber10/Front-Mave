import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import "../styles/Estado.css";
import { URL } from "../querys/Auth.query";

/* Página de diagnóstico del despliegue: semáforos por módulo. Pública a propósito
   (debe funcionar incluso si el login está roto). */
const Estado = () => {
  const [checks, setChecks] = useState([]);
  const [running, setRunning] = useState(false);
  const [stamp, setStamp] = useState("");

  const runCheck = async (id, label, fn) => {
    const t0 = performance.now();
    try {
      const detail = await fn();
      return { id, label, ok: true, detail, ms: Math.round(performance.now() - t0) };
    } catch (e) {
      const m = e?.response?.data;
      return { id, label, ok: false, detail: typeof m === "string" ? m : (e?.message || "Sin respuesta"), ms: Math.round(performance.now() - t0) };
    }
  };

  const runAll = async () => {
    setRunning(true);
    const out = [];
    let health = null;
    out.push(await runCheck("api", "API MAVE", async () => {
      const r = await fetch(`${URL}/health`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      health = await r.json();
      return `En línea · v${health.version || "?"}`;
    }));
    out.push(await runCheck("db", "Base de datos", async () => {
      if (!health) throw new Error("Sin datos del API");
      if (!health.database?.ok) throw new Error("No conecta");
      return `Conecta · ${health.database.latencyMs} ms`;
    }));
    out.push(await runCheck("freesound", "Freesound (sonidos)", async () => {
      if (!health) throw new Error("Sin datos del API");
      if (!health.freesound?.configured) throw new Error("API key sin configurar");
      return "Clave configurada";
    }));
    out.push(await runCheck("sounds", "Sonidos en vivo", async () => {
      const r = await fetch(`${URL}/meditation/sounds?count=1`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const list = await r.json();
      if (!Array.isArray(list) || list.length === 0) throw new Error("Sin pistas");
      return `Pista: ${(list[0].title || "").slice(0, 50)}`;
    }));
    out.push(await runCheck("session", "Sesión local", async () => {
      const id = new Cookies().get("id");
      if (!id) throw new Error("Sin sesión (normal si no entraste)");
      return `Sesión activa · usuario ${id}`;
    }));
    setChecks(out);
    setStamp(new Date().toLocaleTimeString("es"));
    setRunning(false);
  };

  useEffect(() => {
    runAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const failed = checks.filter((c) => !c.ok && c.id !== "session").length;

  return (
    <div className="est-page">
      <div className="est-card">
        <span className="est-kicker">Diagnóstico del despliegue</span>
        <h1>Estado del sistema</h1>
        {checks.length > 0 && (
          <div className={`est-banner${failed === 0 ? " ok" : " bad"}`}>
            {failed === 0 ? "✓ Todo operativo" : `✗ ${failed} fallo(s) detectado(s)`}
          </div>
        )}
        <div className="est-list">
          {checks.map((c) => (
            <div key={c.id} className="est-row">
              <span className={`est-dot${c.ok ? " ok" : " bad"}`} />
              <div className="est-info">
                <b>{c.label}</b>
                <span>{c.detail} · {c.ms} ms</span>
              </div>
            </div>
          ))}
          {checks.length === 0 && running && <p className="est-dim">Revisando…</p>}
        </div>
        <div className="est-btns">
          <button className="est-btn" onClick={runAll} disabled={running}>
            {running ? "Revisando…" : "↻ Revisar de nuevo"}
          </button>
          <Link to="/" className="est-link">Ir al ingreso</Link>
        </div>
        {stamp && <p className="est-dim">Última revisión: {stamp}</p>}
        <p className="est-dim">API: {URL} · La sesión en rojo solo avisa si no entraste; no es un fallo.</p>
      </div>
    </div>
  );
};

export default Estado;
