import React, { useEffect } from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import "../../styles/GraphicsWellbeing.css";
import Navbar from "../../components/Navbar";
import { GetPhq4HistoryData } from "../../hooks/Grafics";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import BackButton from "../BackButton";

const tooltipStyle = {
  background: "#0f172a",
  borderColor: "rgba(255,255,255,0.2)",
  borderRadius: "8px",
  color: "#fff",
};

function GraphicsWellbeing() {
  const navigate = useNavigate();
  const cook = new Cookies();
  const idUsuario = cook.get("id");

  useEffect(() => {
    if (!idUsuario) {
      navigate("/time-out");
    }
  }, [idUsuario, navigate]);

  const { data: result, isSuccess, isLoading } = GetPhq4HistoryData(idUsuario);
  const hist = isSuccess ? result.data : [];

  const data = (hist || []).map((p) => ({
    name: p.date,
    Depresión: p.d,
    Ansiedad: p.a,
    Total: p.total,
  }));

  const last = data.length > 0 ? data[data.length - 1] : null;
  const band = !last ? null : last.Total <= 2 ? "Mínima" : last.Total <= 5 ? "Leve" : last.Total <= 8 ? "Moderada" : "Severa";

  return (
    <div>
      <Navbar />
      <BackButton />
      <div className="gwb-wrap">
        <span className="gwb-kicker">Gráficas · Bienestar PHQ-4</span>
        <h1 className="gwb-h1">Tu evolución emocional</h1>
        <p className="gwb-dim">Depresión (D) + Ansiedad (A) = Total /12. Menos es mejor.</p>

        {isLoading ? (
          <p className="gwb-dim">Cargando…</p>
        ) : data.length === 0 ? (
          <div className="gwb-panel"><p className="gwb-dim">Aún no tienes chequeos PHQ-4. Haz tu primer chequeo semanal y vuelve aquí.</p></div>
        ) : (
          <>
            <div className="gwb-stats">
              <div className="gwb-stat"><span>Último total</span><b>{last.Total}/12</b></div>
              <div className="gwb-stat"><span>Banda</span><b>{band}</b></div>
              <div className="gwb-stat"><span>Chequeos</span><b>{data.length}</b></div>
            </div>
            <div className="gwb-panel">
              <b className="gwb-h2">Tendencia (barras D/A apiladas + línea total)</b>
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={data} margin={{ top: 16, right: 8, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "#a6b1d6", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 12]} tick={{ fill: "#a6b1d6", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ color: "#a6b1d6", fontSize: 13 }} />
                  <Bar dataKey="Depresión" stackId="a" fill="#8b9bff" fillOpacity={0.85} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Ansiedad" stackId="a" fill="#ff7eb6" fillOpacity={0.85} radius={[8, 8, 0, 0]} />
                  <Line type="monotone" dataKey="Total" stroke="#34d3b0" strokeWidth={3} dot={{ fill: "#34d3b0", r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
              <p className="gwb-note">Bandas: 0–2 mínima · 3–5 leve · 6–8 moderada · 9–12 severa. Orientativo, no diagnóstico.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default GraphicsWellbeing;
