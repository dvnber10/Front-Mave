import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Graphics.css";
import Navbar from "../components/Navbar";
import Cookies from "universal-cookie";
import BackButton from "../components/BackButton";

const Graphics = () => {
  const cookie = new Cookies();
  const navigate = useNavigate();
  const cook = cookie.get('id');

  useEffect(() => {
    if (!cook) {
      navigate('/time-out');
    }
  }, [cook, navigate]);

  return (
    <div>
      <Navbar />
      <BackButton />
      <div className="rp-cont">
        <h1>Gráficas</h1>
        
        <div id="space-graphics">
          <Link to="/GraphicsInitial">
            <div className="space-option">
              <img
                src="/image/test.svg"
                className="option-icon"
                alt="Test Inicial"
              />
              <label>Test Inicial</label>
            </div>
          </Link>

          <Link to="/GraphicsMood">
            <div className="space-option">
              <img
                src="/image/MoodMonitoring/face1.svg"
                className="option-icon"
                alt="Seguimiento Anímico"
              />
              <label>Seguimiento Anímico</label>
            </div>
          </Link>

          <Link to="/GraphicsActivity">
            <div className="space-option">
              <img
                src="/image/Dashboard/calendar.svg"
                className="option-icon"
                alt="Actividades"
              />
              <label>Actividades</label>
            </div>
          </Link>

          <Link to="/GraphicsWellbeing">
            <div className="space-option">
              <img
                src="/image/MoodMonitoring/face2.svg"
                className="option-icon"
                alt="Bienestar PHQ-4"
              />
              <label>Bienestar PHQ-4</label>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Graphics;