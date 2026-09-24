import Navbar from "../Navbar";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; 
import Cookies from "universal-cookie";
import React, { useState, useEffect } from "react";
import { GetQuestionHabbitts } from "../../hooks/Question";
import BackButton from "../BackButton";

const QuestionsForHabits = ({ pregunta, onRespuesta, onConfirmar, esUltimaPregunta }) => {
  const cookie = new Cookies();
  const navigate = useNavigate();
  const cook = cookie.get('id');

  useEffect(() => {
    if (!cook) {
      navigate('/time-out');
    }
  }, [cook, navigate]);

  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);

  const handleSeleccionRespuesta = (respuesta) => {
    setRespuestaSeleccionada(respuesta);
  };

  const handleConfirmarRespuesta = () => {
    if (respuestaSeleccionada !== null) {
      onRespuesta(respuestaSeleccionada);
      onConfirmar();
      setRespuestaSeleccionada(null); 
    } else {
      Swal.fire({
        title: 'Por favor selecciona una respuesta antes de continuar',
        icon: 'info',
        confirmButtonColor: '#1B5091',
        backdrop: "linear-gradient(to right, #60C8B3, #1B5091)", 
      });
    }
  };

  const { data: result, isLoading } = GetQuestionHabbitts(cook);

  return (
    <>
      <Navbar />
      <BackButton />
      {isLoading ? (
        <div style={{ textAlign: "center" }}>
          <img className="Loading" src="https://mvalma.com/inicio/public/include/img/ImagenesTL/paginaTL/Cargando.gif" alt="Cargando" />
        </div>
      ) : (
        <div className="habit-questions-container"> 
          <div>
            <h1>Test de Hábitos</h1>
            <p>
              Una serie de preguntas sobre hábitos es una consulta breve que te ayuda a reflexionar sobre tus acciones diarias relacionadas a aspectos de tu vida. Simplemente elige una opción que mejor describa tu comportamiento del día.
            </p>
          </div>

          <h2 className="question">{pregunta.pregunta}</h2>

          <div className="radio-input">
            {pregunta.tipo === "puntuacion" ? (
              [1, 2, 3, 4, 5].map((opcion) => (
                <label key={opcion} className="radio-option">
                  <input
                    type="radio"
                    name="respuesta"
                    value={opcion}
                    checked={respuestaSeleccionada === opcion}
                    onChange={() => handleSeleccionRespuesta(opcion)}
                  />
                  <span className="option-text">{opcion}</span>
                </label>
              ))
            ) : (
              <>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="respuesta"
                    value="Sí"
                    checked={respuestaSeleccionada === "Sí"}
                    onChange={() => handleSeleccionRespuesta("Sí")}
                  />
                  <span className="option-text">Sí</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="respuesta"
                    value="No"
                    checked={respuestaSeleccionada === "No"}
                    onChange={() => handleSeleccionRespuesta("No")}
                  />
                  <span className="option-text">No</span>
                </label>
              </>
            )}
          </div>

          <button onClick={handleConfirmarRespuesta}>
            {esUltimaPregunta ? "Finalizar" : "Confirmar Respuesta"}
          </button>
        </div>
      )}
    </>
  );
};

export default QuestionsForHabits;