import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import Navbar from "../components/Navbar";
import "../styles/Profesionales.css";
import { GetPsychologistsList, GetUser, setPsychologist } from "../hooks/UserHook";
import BackButton from "../components/BackButton";

const initials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
};

const Profesionales = () => {
  const navigate = useNavigate();
  const cookie = new Cookies();
  const cook = cookie.get("id");

  useEffect(() => {
    if (!cook) {
      navigate("/time-out");
    }
  }, [cook, navigate]);

  const { data: result, isSuccess, isLoading } = GetPsychologistsList();
  const pros = isSuccess ? result.data || [] : [];

  const userQ = GetUser(cook);
  const myPsy = userQ.isSuccess ? userQ.data.data.HealthProfessionalId : null;
  const mutLink = setPsychologist();

  const choosePsy = async (psyId) => {
    try {
      await mutLink.mutateAsync({ patientId: Number(cook), psychologistId: psyId });
      userQ.refetch();
    } catch {
      /* el backend responde el motivo */
    }
  };

  return (
    <div>
      <Navbar />
      <BackButton />
      <div className="prof-page">
        <h1>Contactar con un profesional</h1>
        <p className="prof-intro">
          Psicólogos registrados en MAVE. Escríbeles por WhatsApp o correo para agendar tu consulta.
        </p>

        {isLoading ? (
          <p className="prof-dim">Cargando…</p>
        ) : pros.length === 0 ? (
          <div className="prof-empty">
            <p className="prof-dim">Aún no hay psicólogos registrados en el sistema.</p>
          </div>
        ) : (
          <div className="prof-grid">
            {pros.map((p) => (
              <div key={p.userId} className="prof-card">
                <div className="prof-avatar">{initials(p.userName)}</div>
                <b className="prof-name">{p.userName}</b>
                {p.verified && <span className="prof-verified">Verificado ✓</span>}
                {p.description ? <p className="prof-desc">{p.description}</p> : null}
                <span className="prof-mail">{p.email}</span>
                <div className="prof-btns">
                  {myPsy === p.userId ? (
                    <>
                      <span className="prof-mine">Tu psicólogo ✓</span>
                      <button className="prof-btn mail" onClick={() => choosePsy(0)}>
                        Dejar
                      </button>
                    </>
                  ) : (
                    <button className="prof-btn mail" onClick={() => choosePsy(p.userId)} disabled={mutLink.isPending}>
                      {mutLink.isPending ? "Guardando…" : "Mi psicólogo"}
                    </button>
                  )}
                  <button className="prof-btn chat" onClick={() => navigate(`/Chat/${p.userId}`)}>
                    Abrir chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profesionales;
