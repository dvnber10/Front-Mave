import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import Navbar from "../components/Navbar";
import SessionPlayer from "../components/Session/SessionPlayer";
import BackButton from "../components/BackButton";

const Escaneo = () => {
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
        <h1>Escaneo corporal</h1>
        <p className="sess-intro">Recorre tu cuerpo de pies a cabeza siguiendo el haz de luz.</p>
        <SessionPlayer
          action="BODYSCAN"
          title="Sesión de escaneo"
          subtitle="Lleva tu atención donde pasa la luz, sin juzgar lo que sientas."
          animation="scan"
          accent="#ff7eb6"
          presets={[5, 10, 15, 20]}
          userId={Number(cook)}
          steps={[
            "Acuéstate o siéntate cómodo y cierra los ojos.",
            "Cuando la luz suba, lleva tu atención a esa zona del cuerpo.",
            "Nota tensión, calor, hormigueo o calma: todo vale.",
            "Al terminar, mueve dedos y manos antes de abrir los ojos.",
          ]}
        />
      </div>
    </div>
  );
};

export default Escaneo;
