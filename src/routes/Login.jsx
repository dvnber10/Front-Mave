import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css";
import Registro from "../components/Authentication/Registro";
import InicioSession from "../components/Authentication/InicioSession";

const Login = () => {
    /* true = registro visible (izquierda) · false = login visible */
    const [isSignUpActive, setIsSignUpActive] = useState(false);
    /* pulse = la gota se expande 0.6s mostrando el cambio y se contrae sola */
    const [pulse, setPulse] = useState(false);
    const timer = useRef(null);

    useEffect(() => () => clearTimeout(timer.current), []);

    const firePulse = () => {
        setPulse(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setPulse(false), 750);
    };

    const handleLoginClick = () => { setIsSignUpActive(false); firePulse(); };
    const handleRegisterClick = () => { setIsSignUpActive(true); firePulse(); };

    return (
        <>
            <div className={`container${isSignUpActive ? ' active' : ''}${pulse ? ' pulse' : ''}`}>
                <div className="form-container sing-up">
                    <Registro />
                </div>

                <div className="form-container sign-in">
                    <InicioSession />
                </div>

                {/* GOTA MAVE · único interruptor login ⇄ registro (mockup glass) */}
                <div
                    className="gota"
                    onClick={isSignUpActive ? handleLoginClick : handleRegisterClick}
                    role="button"
                    aria-label={isSignUpActive ? "Gota MAVE: volver al ingreso" : "Gota MAVE: cambiar a registro"}
                >
                    {isSignUpActive ? (
                        <>
                            <h2>¿Ya tienes cuenta?</h2>
                            <p className="gota-small-text">Toca aquí · Ingresar</p>
                        </>
                    ) : (
                        <>
                            <h2>¿No tienes cuenta?</h2>
                            <p className="gota-small-text">Toca aquí · MAVE</p>
                        </>
                    )}
                </div>
            </div>
            <p className="login-pro">
              ¿Eres psicólogo? <Link to="/RegistroProfesional">Regístrate aquí</Link>
              {" · "}
              <Link to="/Estado">Estado del sistema</Link>
            </p>
        </>
    );
};

export default Login;
