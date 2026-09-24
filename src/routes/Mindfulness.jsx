import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import "../styles/Mindfulness.css";
import exercises from "../components/Mindfulness/Exercise.jsx";
import SessionPlayer from "../components/Session/SessionPlayer";
import BackButton from "../components/BackButton";

const Mindfulnes = () => {
  const navigate = useNavigate();
  const cookie = new Cookies();
  const cook = cookie.get('id');

  /* Actividad elegida para la sesión (null = aún no elige) */
  const [selected, setSelected] = useState(null);
  const playerRef = useRef(null);

  // Validar sesión de usuario (Corregido para evitar bucles)
  useEffect(() => {
    if (!cook) {
      navigate('/time-out');
    }
  }, [cook, navigate]);

  // Mostrar el consejo inicial una sola vez al cargar la página
  useEffect(() => {
    Swal.fire({
      title: "Consejos:",
      html: "- Encuentra un lugar tranquilo y cómodo. <br/> <br/> - Adopta una postura relajada, ya sea sentado o de pie. <br/> <br/> - Respira profundamente y concéntrate en el ejercicio. <br/> <br/> - Si tu mente se distrae, no te juzgues. Reconoce el pensamiento y vuelve suavemente al presente.",
      confirmButtonColor: "#1B5091",
      background: "#0f172a",
      color: "#f8fafc",
    });
  }, []);

  const handleInfo = () => {
    Swal.fire({
      title: "¿Qué es el Mindfulness y por qué es importante?",
      html: "El mindfulness, también conocido como atención plena o conciencia plena, es una práctica que consiste en prestar atención al momento presente de manera intencional y sin juzgar. <br/><br/> Nos ayuda a ser más conscientes de nuestros pensamientos, emociones y sensaciones corporales, en lugar de dejarnos llevar por el piloto automático.",
      confirmButtonColor: "#1B5091",
      background: "#0f172a",
      color: "#f8fafc",
    });
  };

  /* Elegir actividad: sus instrucciones aparecen dentro de la sesión */
  const handleAdvice = (index) => {
    if (exercises[index]) {
      setSelected(index);
      setTimeout(() => {
        playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    }
  };

  return (
    <div>
      <Navbar />
      <BackButton />
      <div className="mid-container">
        <h1>Mindfulness</h1>
        <h2>Tómate un tiempo para ti, lo mereces</h2>
        <p className="mind-hint">Elige una actividad: sus instrucciones aparecerán en tu sesión.</p>

        <div id="space-mind">
          <button className={`space-option${selected === 0 ? " sel" : ""}`} onClick={() => handleAdvice(0)}>
            <img src="https://i.imgur.com/4GqlAew.png" className="option-icon" alt="Respiración" />
            <label>Respiración consciente</label>
          </button>

          <button className={`space-option${selected === 1 ? " sel" : ""}`} onClick={() => handleAdvice(1)}>
            <img src="https://i.imgur.com/4yThqtw.png" className="option-icon" alt="Exploración" />
            <label>Exploración sensorial</label>
          </button>

          <button className={`space-option${selected === 2 ? " sel" : ""}`} onClick={() => handleAdvice(2)}>
            <img src="https://i.imgur.com/vL07so6.png" className="option-icon" alt="Barrido" />
            <label>Barrido corporal</label>
          </button>

          <button className={`space-option${selected === 3 ? " sel" : ""}`} onClick={() => handleAdvice(3)}>
            <img src="https://i.imgur.com/wnFsSsp.png" className="option-icon" alt="Caminata" />
            <label>Caminata consciente</label>
          </button>

          <button id="info" className="space-option" onClick={handleInfo}>
            <img src="https://i.imgur.com/2I5LWRD.png" className="option-icon" alt="Información" />
            <label>Saber más</label>
          </button>

          <button className={`space-option${selected === 4 ? " sel" : ""}`} onClick={() => handleAdvice(4)}>
            <img src="https://i.imgur.com/jCXtRBd.png" className="option-icon" alt="Escucha" />
            <label>Escucha activa</label>
          </button>
        </div>

        {/* Sesión de la actividad elegida, con sus instrucciones dentro */}
        <div ref={playerRef} className="mind-player">
          {selected !== null && exercises[selected] && (
            <SessionPlayer
              key={selected}
              action="MINDFULNESS"
              title={exercises[selected].title}
              subtitle="Sigue estas instrucciones durante tu sesión."
              animation="rings"
              accent="#8b9bff"
              presets={[5, 10, 15, 20]}
              userId={Number(cook)}
              steps={[
                exercises[selected].text,
                "Si tu mente se distrae, no te juzgues: vuelve suavemente al presente.",
                "Al terminar, haz 3 respiraciones profundas antes de guardar.",
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Mindfulnes;