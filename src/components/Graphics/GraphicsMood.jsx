import React, { useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import "../../styles/GraphicsMood.css";
import Navbar from "../../components/Navbar";
import { GetGraficsMood, GetMoodAnalysisData } from "../../hooks/Grafics";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "universal-cookie";
import BackButton from "../BackButton";

const tooltipDark = {
  background: "#0f172a",
  borderColor: "rgba(255,255,255,0.2)",
  borderRadius: "8px",
  color: "#fff",
};

const trendLabel = (t) => (t === "improving" ? "Mejorando 🌱" : t === "needs-attention" ? "A atender 👀" : "Estable");

function GraphicsMood() {
  const navigate = useNavigate();
  const cook = new Cookies();
  let idUsuario = cook.get('id');

  useEffect(() => {
    if (!idUsuario) {
      navigate('/time-out');
    }
  }, [idUsuario, navigate]);

  const { data: result, isSuccess, isLoading } = GetGraficsMood(idUsuario);
  const analQuery = GetMoodAnalysisData(idUsuario);
  const anal = analQuery.isSuccess ? analQuery.data.data : null;

  const data = [
    { name: "Muy Bueno", value: isSuccess && result?.data?.score1 ? result.data.score1 : 0 },
    { name: "Bueno", value: isSuccess && result?.data?.score2 ? result.data.score2 : 0 },
    { name: "Regular", value: isSuccess && result?.data?.score3 ? result.data.score3 : 0 },
    { name: "Malo", value: isSuccess && result?.data?.score4 ? result.data.score4 : 0 },
    { name: "Muy Malo", value: isSuccess && result?.data?.score5 ? result.data.score5 : 0 },
  ];

  const COLORS = ["#38bdf8", "#60C8B3", "#FFCE7A", "#E881A6", "#CE3375"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    if (percent === 0) return null; // No mostrar etiqueta si el porcentaje es 0
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: '12px', fontWeight: 'bold', fontFamily: 'Manrope' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div>
      <Navbar />
      <BackButton />
    
    <div id="cont-graphic">
      
      
      <h1 id="h1-que">¿Qué tal tus días?</h1>
      
      <div id="face">
        <div className="image-container">
          <img src="/image/Graphics/face1.svg" alt="Face 1" className="svg-image" />
          <div className="description">Muy Bueno</div>
        </div>
        <div className="image-container">
          <img src="/image/Graphics/face2.svg" alt="Face 2" className="svg-image" />
          <div className="description">Bueno</div>
        </div>
        <div className="image-container">
          <img src="/image/Graphics/face3.svg" alt="Face 3" className="svg-image" />
          <div className="description">Regular</div>
        </div>
        <div className="image-container">
          <img src="/image/Graphics/face4.svg" alt="Face 4" className="svg-image" />
          <div className="description">Malo</div>
        </div>
        <div className="image-container">
          <img src="/image/Graphics/face5.svg" alt="Face 5" className="svg-image" />
          <div className="description">Muy Malo</div>
        </div>
      </div>

      {isLoading ? (
        <img className="Loading" src="https://mvalma.com/inicio/public/include/img/ImagenesTL/paginaTL/Cargando.gif" alt="Cargando" />
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={110}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.1)" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ background: '#0f172a', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}

      {anal && anal.facesCount > 0 && (
        <div className="mood-analysis">
          <div className="mood-stats">
            <div className="mood-stat"><span>Promedio</span><b>{anal.facesAvg.toFixed(1)}</b><small>±{anal.volatility.toFixed(1)} · 1 = muy bueno</small></div>
            <div className="mood-stat"><span>Racha</span><b>{anal.streakDays} {anal.streakDays === 1 ? "día" : "días"}</b><small>consecutivos</small></div>
            <div className="mood-stat"><span>Tendencia</span><b>{trendLabel(anal.trend)}</b><small>últimos registros</small></div>
            {anal.index !== null && anal.index !== undefined && (
            <div className="mood-stat"><span>Índice bienestar</span><b>{anal.index}/100</b><small>{anal.indexBand}</small></div>)}
          </div>

          {(anal.facesTrend || []).length > 1 && (
          <div className="mood-trend">
            <b className="mood-h2">Evolución (menos es mejor)</b>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={anal.facesTrend.map((p) => ({ name: p.date, Ánimo: p.score }))} margin={{ top: 12, right: 8, left: -22, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#a6b1d6", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fill: "#a6b1d6", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipDark} />
                <Line type="monotone" dataKey="Ánimo" stroke="#8b9bff" strokeWidth={3} dot={{ fill: "#8b9bff", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>)}

          {anal.lastPhq4 && (
          <Link to="/GraphicsWellbeing" className="mood-phq">
            <span>PHQ-4 {anal.lastPhq4.date}: <b>{anal.lastPhq4.total}/12 · {anal.lastPhq4.band}</b></span>
            <span className="mood-go">Ver evolución →</span>
          </Link>)}

          <p className="mood-note">Cálculos orientativos (promedio, volatilidad, racha y tendencia de tus registros + tu último PHQ-4). No constituyen un diagnóstico.</p>
        </div>
      )}
    </div>
    </div>
  );
}

export default GraphicsMood;