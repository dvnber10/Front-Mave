import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import Navbar from "../components/Navbar";
import SessionPlayer from "../components/Session/SessionPlayer";
import BackButton from "../components/BackButton";

const Respiracion = () => {
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
        <h1>Respiración 4-7-8</h1>
        <p className="sess-intro">El círculo te guía: inhala 4s, sostén 7s y exhala 8s. Repite cada ciclo.</p>
        <SessionPlayer
          action="BREATHING"
          title="Sesión de respiración"
          subtitle="Sigue el círculo: crece al inhalar, se sostiene y se contrae al exhalar."
          animation="phases"
          accent="#7ff0cf"
          presets={[3, 5, 10, 15]}
          userId={Number(cook)}
          steps={[
            "Siéntate con la espalda recta y relaja la mandíbula.",
            "Inhala por la nariz mientras el círculo crece (4 segundos).",
            "Sostén el aire con el círculo grande (7 segundos).",
            "Exhala lento por la boca mientras se contrae (8 segundos).",
          ]}
        />
      </div>
    </div>
  );
};

export default Respiracion;
