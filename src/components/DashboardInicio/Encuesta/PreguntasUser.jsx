import React, { useState } from "react";
import { preguntas } from "../../../assets/data/preguntas";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Swal from 'sweetalert2';
import { SendQuestionIni } from "../../../hooks/Question";

function PreguntasUser({ segundosAMinutos, tiempoRestante }) {
  const navigate = useNavigate();
  const [preguntaActual, setPreguntaActual] = useState(1);
  const [respuestas, setRespuestas] = useState(new Array(24).fill(null));

  const queryClient = useQueryClient();

  /* Guarda ESPERANDO al servidor: solo navega si quedó registrado */
  async function Terminar() {
      try {
        await mutacion.mutateAsync(respuestas);
        await queryClient.invalidateQueries({ queryKey: ["keyUsers"] });
        await Swal.fire({
          title: 'Has finalizado el test inicial',
          icon: 'success',
          confirmButtonColor: '#1B5091',
        });
        navigate("/Dashboard");
      } catch {
        Swal.fire({
          title: 'No se pudo guardar, intenta de nuevo',
          icon: 'error',
          confirmButtonColor: '#1B5091',
        });
      }
  }

  const mutacion = SendQuestionIni()

  const handleSeleccionRespuesta = (opcion) => {
    const nuevasRespuestas = [...respuestas];
    nuevasRespuestas[preguntaActual - 1] = opcion;
    setRespuestas(nuevasRespuestas);
  };

  const handleSeguirPregunta = () => {
    const respuestaSeleccionada = respuestas[preguntaActual - 1];
    if (respuestaSeleccionada) {
      if (preguntaActual < 24) {
        setPreguntaActual(preguntaActual + 1);
      } else {
        Terminar();
      }
    } else {
      Swal.fire({
        title: 'Por favor selecciona una respuesta antes de continuar',
        icon: 'info',
        confirmButtonColor: '#1B5091',
        backdrop: "linear-gradient(to right, #60C8B3, #1B5091)",
      });
    }
  };

  return (
    <div>
      <div className="radio-input">
        <div className="info">
          <span className="question">
            Tiempo restante: {segundosAMinutos(tiempoRestante)}{" "}
          </span>
        </div>
        <div className="info">
          <span className="question">¿Con que opcion te idenificas? </span>
          <span className="steps">{preguntaActual}/24</span>
        </div>
        <div className="qbar"><i style={{ width: `${(preguntaActual / 24) * 100}%` }} /></div>
        {preguntas[preguntaActual].opciones.map((opcion, index) => (
          <div key={index} className="opcion">
            <input
              type="radio"
              id={`value-${index + 1}`}
              name={`value${preguntaActual}`}
              value={String.fromCharCode(65 + index)}
              checked={respuestas[preguntaActual - 1] === String.fromCharCode(65 + index)}
              onClick={() => handleSeleccionRespuesta(String.fromCharCode(65 + index))}
            />
            <label htmlFor={`value-${index + 1}`}>{opcion}</label>
          </div>
        ))}
        <div className="botones">
          {preguntaActual >= 1 && preguntaActual <= 23 && (
            <button className="boton-quest" onClick={handleSeguirPregunta} >
              Confirmar Respuesta
            </button>
          )}
          {preguntaActual === 24 && (
            <button className="boton-quest" onClick={handleSeguirPregunta}>
              Finalizar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PreguntasUser;
