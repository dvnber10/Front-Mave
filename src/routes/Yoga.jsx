import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import Navbar from "../components/Navbar";
import SessionPlayer from "../components/Session/SessionPlayer";
import BackButton from "../components/BackButton";

const Yoga = () => {
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
        <h1>Yoga suave</h1>
        <p className="sess-intro">Posturas suaves combinadas con respiración. Sigue el ritmo del círculo.</p>
        <SessionPlayer
          action="YOGA"
          title="Sesión de yoga"
          subtitle="Fluye con calma: los pétalos giran mientras practicas."
          animation="flow"
          accent="#ffce7a"
          presets={[10, 15, 20, 30]}
          userId={Number(cook)}
          steps={[
            "Comienza de pie, con los pies firmes y los hombros relajados.",
            "Sincroniza cada movimiento con tu respiración: inhala al abrir, exhala al cerrar.",
            "Mantén cada postura sin forzar; el estiramiento debe sentirse amable.",
            "Termina sentada/o con 3 respiraciones profundas antes de guardar.",
          ]}
        />
      </div>
    </div>
  );
};

export default Yoga;
