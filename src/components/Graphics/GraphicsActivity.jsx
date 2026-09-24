import React, { useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import "../../styles/GraphicsActivity.css";
import Navbar from "../../components/Navbar";
import { GetActivityTimeData } from "../../hooks/Grafics";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import BackButton from "../BackButton";

const LABELS = {
  MEDITATION: "Meditación",
  MINDFULNESS: "Mindfulness",
  YOGA: "Yoga",
  BREATHING: "Respiración",
  BODYSCAN: "Escaneo",
  WALK: "Caminata",
};

const COLORS = ["#34d3b0", "#ff7eb6", "#8b9bff", "#ffce7a", "#7ff0cf", "#aab6ff"];

const tooltipStyle = {
  background: "#0f172a",
  borderColor: "rgba(255,255,255,0.2)",
  borderRadius: "8px",
  color: "#fff",
};

function GraphicsActivity() {
  const navigate = useNavigate();
  const cook = new Cookies();
  const idUsuario = cook.get("id");

  useEffect(() => {
    if (!idUsuario) {
      navigate("/time-out");
    }
  }, [idUsuario, navigate]);

  const { data: result, isSuccess, isLoading } = GetActivityTimeData(idUsuario);
  const act = isSuccess ? result.data : null;

  const byType = (act?.byType || []).map((t, i) => ({
    name: LABELS[t.action] || t.action,
    minutos: Math.round(t.seconds / 60),
    sesiones: t.sessions,
    fill: COLORS[i % COLORS.length],
  }));

  const week = (act?.last7Days || []).map((d) => ({
    name: d.date,
    minutos: Math.round(d.seconds / 60),
  }));

  return (
    <div>
      <Navbar />
      <BackButton />
      <div className="gact-wrap">
        <span className="gact-kicker">Gráficas · Actividades</span>
        <h1 className="gact-h1">Tu tiempo por actividad</h1>
        <p className="gact-dim">Minutos acumulados de meditación, mindfulness, yoga, respiración y más.</p>

        {isLoading ? (
          <p className="gact-dim">Cargando…</p>
        ) : byType.length === 0 ? (
          <div className="gact-panel"><p className="gact-dim">Aún no hay sesiones registradas. Practica con el temporizador y vuelve aquí.</p></div>
        ) : (
          <>
            <div className="gact-panel">
              <b className="gact-h2">Minutos por tipo de actividad</b>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={byType} margin={{ top: 16, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "#a6b1d6", fontSize: 12 }} axisLine={false} tickLine={false} interval={0} angle={-12} dy={8} height={52} />
                  <YAxis tick={{ fill: "#a6b1d6", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => (n === "minutos" ? [`${v} min`, "Minutos"] : [v, "Sesiones"])} />
                  <Bar dataKey="minutos" radius={[10, 10, 4, 4]}>
                    {byType.map((e, i) => (
                      <Cell key={i} fill={e.fill} fillOpacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="gact-panel">
              <b className="gact-h2">Meditación últimos 7 días (min)</b>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={week} margin={{ top: 16, right: 8, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "#a6b1d6", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#a6b1d6", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="minutos" fill="#34d3b0" fillOpacity={0.8} radius={[8, 8, 3, 3]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default GraphicsActivity;
