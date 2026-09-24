import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "universal-cookie";
import Navbar from "../components/Navbar";
import "../styles/MisPacientes.css";
import { GetMyPatientsData } from "../hooks/UserHook";
import BackButton from "../components/BackButton";

const initials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
};

const MisPacientes = () => {
  const navigate = useNavigate();
  const cookie = new Cookies();
  const cook = cookie.get("id");

  useEffect(() => {
    if (!cook) {
      navigate("/time-out");
    }
  }, [cook, navigate]);

  const { data: result, isSuccess, isLoading } = GetMyPatientsData(cook);
  const patients = isSuccess ? result.data || [] : [];

  return (
    <div>
      <Navbar />
      <BackButton />
      <div className="mpat-page">
        <h1>Mis pacientes</h1>
        <p className="mpat-intro">Solo ves a los pacientes vinculados contigo. Abre su reporte clínico o el chat.</p>

        {isLoading ? (
          <p className="mpat-dim">Cargando…</p>
        ) : patients.length === 0 ? (
          <div className="mpat-empty">
            <p className="mpat-dim">Aún no tienes pacientes vinculados. Cuando un paciente te elija como su psicólogo aparecerá aquí.</p>
          </div>
        ) : (
          <div className="mpat-list">
            {patients.map((p) => (
              <div key={p.userId} className="mpat-row">
                <div className="mpat-avatar">{initials(p.userName)}</div>
                <div className="mpat-info">
                  <b>{p.userName}</b>
                  <span>{p.email} · {p.phone}</span>
                </div>
                <div className="mpat-btns">
                  <Link to={`/Report/${p.userId}`} className="mpat-btn rep">Reporte</Link>
                  <Link to={`/Chat/${p.userId}`} className="mpat-btn chat">Chat</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisPacientes;
