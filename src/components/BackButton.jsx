import { useNavigate } from "react-router-dom";
import "../styles/BackButton.css";

/* Botón Volver reutilizable: va en cada ventana (nunca en el Navbar).
   Vuelve atrás en el historial; si no hay a dónde volver, va al Dashboard. */
const BackButton = () => {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/Dashboard");
    }
  };

  return (
    <button className="back-btn" onClick={goBack} aria-label="Volver atrás">
      ← Volver
    </button>
  );
};

export default BackButton;
