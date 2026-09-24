import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import Navbar from "../components/Navbar";
import SessionPlayer from "../components/Session/SessionPlayer";
import BackButton from "../components/BackButton";

const Caminata = () => {
  const navigate = useNavigate();
  const cookie = new Cookies();
  const cook = cookie.get("id");

  useEffect(() => {
    if (!cook) {
      navigate("/time-out");
    }
  }, [cook, navigate]);

  return (
    <div>
      <Navbar />
      <BackButton />
      <div className="sess-page">
        <h1>Caminata consciente</h1>
        <p className="sess-intro">Camina lento notando cada paso, al ritmo de las pisadas.</p>
        <SessionPlayer
          action="WALK"
          title="Sesión de caminata"
          subtitle="Un paso por pisada: talón, planta, dedos. Sin prisa."
          animation="trail"
          accent="#2dd4bf"
          presets={[10, 15, 20, 30]}
          userId={Number(cook)}
          steps={[
            "Elige un tramo corto y seguro para ir y volver.",
            "Camina más lento de lo habitual, notando talón-planta-dedos.",
            "Sincroniza tu respiración con los pasos.",
            "Si la mente se va, vuelve amablemente a los pies.",
          ]}
        />
      </div>
    </div>
  );
};

export default Caminata;
