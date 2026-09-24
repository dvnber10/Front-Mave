import React, { useState, useEffect, useRef } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { GetGraficsIni } from "../../hooks/Grafics";
import Cookies from "universal-cookie";
import "../../styles/HeaderPrint.css";
import "../../styles/OneArticle.css";
import NavBar from "../Navbar";
import BackButton from "../BackButton";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";

function GraphicsInitial() {
  const navigate = useNavigate();
  const cook = new Cookies();
  let idUsuario = cook.get('id');
  const { data: result, isSuccess, isLoading } = GetGraficsIni(idUsuario);

  useEffect(() => {
    if (!cook) {
      navigate('/time-out');
    }
  }, [cook, navigate]);

  const data = [
    {
      subject: 'Dominante',
      desc: 'Las personas dominantes se caracterizan por tener energía desbordante, seguridad en sí mismos y tono de voz fuerte, manifestando una actitud segura y dominante al caminar, hablar en reuniones o participar en seminarios.',
      A: isSuccess && result?.data?.d ? result.data.d : 0,
      fullMark: 21,
    },
    {
      subject: 'Estable',
      desc: 'Las personas estables se caracterizan por su tranquilidad, adaptabilidad y lentitud en hablar y caminar, mostrándose discretos y callados en reuniones con una humildad notable.',
      A: isSuccess && result?.data?.s ? result.data.s : 0,
      fullMark: 21,
    },
    {
      subject: 'Concienzudo',
      desc: 'La persona concienzuda se distingue por hablar con fundamentos y cuidar su aspecto físico. Camina directo a su destino, observa detalladamente y toma apuntes ordenados.',
      A: isSuccess && result?.data?.c ? result.data.c : 0,
      fullMark: 21,
    },
    {
      subject: 'Influyente',
      desc: 'Las personas influyentes se destacan por su alegría, charlas constantes y amistosas, prefiriendo ropa creativa, colores llamativos y socializar constantemente.',
      A: isSuccess && result?.data?.i ? result.data.i : 0,
      fullMark: 21,
    },
  ];

  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipContent, setTooltipContent] = useState(null);
  const tooltipRef = useRef(null);

  const handleGenerarReporte = () => {
    navigate('/Report');
  };

  // Coordenadas dinámicas basadas en la posición del mouse para evitar desbordes
  const CustomTooltip = ({ active, payload }) => {
    useEffect(() => {
      if (active && payload && payload.length) {
        setTooltipContent(payload[0].payload.desc);
      } else {
        setTooltipContent(null);
      }
    }, [active, payload]);

    return null;
  };

  const handleMouseMove = (e) => {
    if (tooltipContent) {
      setTooltipPosition({
        x: e.clientX + 15,
        y: e.clientY + 15,
      });
    }
  };

  return (
    <div>
      <NavBar />
      <BackButton />
    
    <div className="todo" onMouseMove={handleMouseMove}>
      
      <div className="Container">
        
        <header className="header-print">
          <h1 className="mave-print">Estadísticas Iniciales</h1>
        </header>
      </div>
      
      <span>
        {isLoading ? (
          <img className="Loading" src="https://mvalma.com/inicio/public/include/img/ImagenesTL/paginaTL/Cargando.gif" alt="Cargando" />
        ) : (
          <ResponsiveContainer width="100%" aspect={1.1}>
            <RadarChart outerRadius="75%" data={data} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <PolarGrid stroke="rgba(255, 255, 255, 0.15)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#e2e8f0', fontSize: 14, fontFamily: 'Manrope' }} />
              <PolarRadiusAxis stroke="rgba(255, 255, 255, 0.2)" />
              <Tooltip content={<CustomTooltip />} />
              <Radar name="Perfil" dataKey="A" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.5} />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </span>

      {tooltipContent && ReactDOM.createPortal(
        <div
          className="custom-tooltip"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
          }}
          ref={tooltipRef}
        >
          <p style={{ margin: 0 }}>{tooltipContent}</p>
        </div>,
        document.body
      )}

      <button className="button" onClick={handleGenerarReporte}>
        Generar Reporte
      </button>
    </div>
    </div>
  );
}

GraphicsInitial.displayName = "GraphicsInitial";

export default GraphicsInitial;