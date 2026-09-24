import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
import { GetNotifyAdd, GetDailySuggestionData } from "../hooks/Notify";
import { GetUser } from "../hooks/UserHook";

function Navbar() {
  const navigate = useNavigate();

  /* Cookie */
  /* import Cookies from "universal-cookie"; */
  const cookie = new Cookies();
  const cook = cookie.get('id')


  const handleLogout = () => {
    Swal.fire({
      title: "¿Quieres cerrar la sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
      backdrop: "rgba(10,15,36,.7)",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/time-out");
      }
    });
  };
  const { data: result, isSuccess } = GetNotifyAdd(cook)
  const messages = isSuccess && result.data.message;

  /* Avatar del perfil (inicial del usuario) */
  const userQ = GetUser(cook);
  const uname = userQ.isSuccess ? userQ.data.data.UserName : "";

  /* Encuesta inicial obligatoria: Usuario (rol 4) sin evaluación → /Encuesta sí o sí */
  const location = useLocation();
  const userRole = userQ.isSuccess ? userQ.data.data.RoleId : null;
  const evalId = userQ.isSuccess ? userQ.data.data.EvaluationId : null;
  const statusId = userQ.isSuccess ? userQ.data.data.StatusId : null;
  useEffect(() => {
    /* Cuenta bloqueada por admin: fuera sí o sí */
    if (!userQ.isFetching && userQ.isSuccess && statusId !== null && statusId !== 1) {
      cookie.remove("id", { path: "/" });
      navigate("/time-out");
      return;
    }
    /* isFetching: espera el dato fresco al montar (no la caché vieja) */
    if (!userQ.isFetching && userRole === 4 && evalId === 1 && location.pathname !== "/Encuesta") {
      navigate("/Encuesta");
    }
  }, [userRole, evalId, statusId, location.pathname, navigate, userQ.isFetching, userQ.isSuccess]);

  /* Menú móvil de navegación global */
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  /* Campana web: sugerencia diaria + pendientes de hoy */
  const [showNotif, setShowNotif] = useState(false);
  const sugQuery = GetDailySuggestionData(cook);
  const sug = sugQuery.isSuccess ? sugQuery.data.data : null;
  const sugLoading = sugQuery.isLoading;

  const handleMessages = () => {
    Swal.fire({
      title: "! Eres valioso ¡ ",
      text: messages,
      confirmButtonText: "Gracias",
      width: 600,
      padding: "3em",
      background: "#fff url(/images/trees.png)",
      backdrop: `
    url("https://media.tenor.com/xzjlrhYq_lQAAAAj/cat-nyan-cat.gif")
    left center
    no-repeat
  `,
    });
  };

  return (
    <div className="navbar">
      <div className="nav_logo">
        <img src="https://imgur.com/C86LPG8.png" alt="" className="Logo" />
      </div>
      <h1 id="mave">MAVE</h1>
      {userRole !== 3 && (
      <nav className="nav_links">
        <NavLink to="/Dashboard" className={({ isActive }) => `nav-link${isActive ? " on" : ""}`}>Inicio</NavLink>
        <NavLink to="/Habitos" className={({ isActive }) => `nav-link${isActive ? " on" : ""}`}>Hábitos</NavLink>
        <NavLink to="/MoodMonitoring" className={({ isActive }) => `nav-link${isActive ? " on" : ""}`}>Ánimo</NavLink>
        <NavLink to="/Graphics" className={({ isActive }) => `nav-link${isActive ? " on" : ""}`}>Gráficas</NavLink>
        <NavLink to="/Texts" className={({ isActive }) => `nav-link${isActive ? " on" : ""}`}>Saber más</NavLink>
      </nav>
      )}
      <div className="nav_items">
        <Link to="/Dashboard">
          <a href="#" className="items">
            <img src="https://imgur.com/JBl68w8.png" alt="" className="Logo" />
          </a>
        </Link>

        <Link to="/Perfil" className="items prof-avatar-nav" title="Mi perfil">
          {uname ? uname.trim()[0].toUpperCase() : "👤"}
        </Link>

        <div className="notif-wrap">
          <a href="#" className="items" onClick={(e) => { e.preventDefault(); setShowNotif(!showNotif); }}>
            <img src="https://imgur.com/M4S6rkV.png" alt="" className="Logo" />
          </a>
          {showNotif && (
            <div className="notif-panel">
              <div className="notif-head">
                <b>Notificaciones</b>
                <button className="notif-close" onClick={() => setShowNotif(false)}>✕</button>
              </div>
              {sugLoading ? (
                <p className="dim">Cargando…</p>
              ) : sug ? (
                <>
                  <p className="notif-tip">💡 {sug.suggestion}</p>
                  <div className="notif-pills">
                    {sug.pendingMood && <span className="pill pink">Falta tu ánimo de hoy</span>}
                    {sug.pendingHabits && <span className="pill amber">Hábitos pendientes</span>}
                    {!sug.pendingMood && !sug.pendingHabits && <span className="pill teal">Día completado ✓</span>}
                  </div>
                </>
              ) : null}
              {messages && <p className="notif-msg">{messages}</p>}
            </div>
          )}
        </div>

        <a href="#" className="items" onClick={handleLogout}>
          <img src="https://imgur.com/rvPskIN.png" alt="" className="Logo" />
        </a>
      </div>
      {userRole !== 3 && (
      <button className="nav_toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menú de navegación">
        ☰
      </button>
      )}
      {menuOpen && userRole !== 3 && (
        <div className="nav_menu">
          <NavLink to="/Dashboard" className={({ isActive }) => `nav-link${isActive ? " on" : ""}`}>Inicio</NavLink>
          <NavLink to="/Habitos" className={({ isActive }) => `nav-link${isActive ? " on" : ""}`}>Hábitos</NavLink>
          <NavLink to="/MoodMonitoring" className={({ isActive }) => `nav-link${isActive ? " on" : ""}`}>Ánimo</NavLink>
          <NavLink to="/Graphics" className={({ isActive }) => `nav-link${isActive ? " on" : ""}`}>Gráficas</NavLink>
          <NavLink to="/Texts" className={({ isActive }) => `nav-link${isActive ? " on" : ""}`}>Saber más</NavLink>
        </div>
      )}
    </div>
  );
}
export default Navbar;
