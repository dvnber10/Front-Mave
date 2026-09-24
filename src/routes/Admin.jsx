import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "universal-cookie";
import Navbar from "../components/Navbar";
import "../styles/Admin.css";
import { GetUser, GetAllUsersFromAdmin, GetPendingPsyData, verifyPsy, blockUser } from "../hooks/UserHook";
import { GetKpisData, GetActivityLogData } from "../hooks/Grafics";

const ROLE_LABEL = { 1: "SuperAdmin", 2: "Admin", 3: "Psicólogo", 4: "Usuario" };

const Admin = () => {
  const navigate = useNavigate();
  const cookie = new Cookies();
  const cook = cookie.get("id");
  const [tab, setTab] = useState("users");

  useEffect(() => {
    if (!cook) {
      navigate("/time-out");
    }
  }, [cook, navigate]);

  const meQ = GetUser(cook);
  const myRole = meQ.isSuccess ? meQ.data.data.RoleId : null;
  useEffect(() => {
    if (meQ.isSuccess && myRole !== 1 && myRole !== 2) {
      navigate("/Dashboard");
    }
  }, [meQ.isSuccess, myRole, navigate]);

  const usersQ = GetAllUsersFromAdmin(cook);
  const users = usersQ.isSuccess ? usersQ.data.data || [] : [];
  const pendQ = GetPendingPsyData();
  const pends = pendQ.isSuccess ? pendQ.data.data || [] : [];
  const kpisQ = GetKpisData();
  const kpis = kpisQ.isSuccess ? kpisQ.data.data : null;
  const logQ = GetActivityLogData(50);
  const logs = logQ.isSuccess ? logQ.data.data || [] : [];

  const mutVerify = verifyPsy();
  const mutBlock = blockUser();

  const acceptPsy = async (id) => {
    try {
      await mutVerify.mutateAsync({ userId: id, verified: true });
      pendQ.refetch();
    } catch { /* el backend responde el motivo */ }
  };

  const toggleBlock = async (u) => {
    try {
      await mutBlock.mutateAsync({ userId: u.userId, blocked: u.statusId === 1 });
      usersQ.refetch();
    } catch { /* el backend responde el motivo */ }
  };

  if (meQ.isSuccess && myRole !== 1 && myRole !== 2) return null;

  return (
    <div>
      <Navbar />
      <div className="adm-page">
        <h1>Administración</h1>
        <div className="adm-tabs no-print">
          <button className={`adm-tab${tab === "users" ? " on" : ""}`} onClick={() => setTab("users")}>Usuarios</button>
          <button className={`adm-tab${tab === "psy" ? " on" : ""}`} onClick={() => setTab("psy")}>
            Psicólogos{pends.length > 0 ? ` (${pends.length})` : ""}
          </button>
          <button className={`adm-tab${tab === "kpis" ? " on" : ""}`} onClick={() => setTab("kpis")}>KPIs y uso</button>
        </div>

        {tab === "users" && (
          <div className="adm-panel">
            <b className="adm-h2">Usuarios ({users.length})</b>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.userId}>
                      <td>{u.userName}</td>
                      <td>{u.email}</td>
                      <td>{ROLE_LABEL[u.roleId] || u.roleId}</td>
                      <td>{u.statusId === 1 ? "Activo" : "Bloqueado"}</td>
                      <td>
                        <div className="adm-act">
                          <Link to={`/Report/${u.userId}`} className="adm-mini">Reporte</Link>
                          <button className="adm-mini danger" disabled={mutBlock.isPending}
                            onClick={() => toggleBlock(u)}>
                            {u.statusId === 1 ? "Bloquear" : "Desbloquear"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "psy" && (
          <div className="adm-panel">
            <b className="adm-h2">Psicólogos pendientes de aceptación</b>
            {pendQ.isLoading ? <p className="adm-dim">Cargando…</p> :
              pends.length === 0 ? <p className="adm-dim">Sin pendientes. Todo al día ✓</p> :
              pends.map((p) => (
                <div key={p.userId} className="adm-psy">
                  <div className="adm-psy-info">
                    <b>{p.userName}</b>
                    <span>{p.email} · {p.phone}</span>
                    {p.description ? <p>{p.description}</p> : null}
                  </div>
                  <div className="adm-psy-btns">
                    {p.credentialUrl ? (
                      <a className="adm-mini" href={p.credentialUrl} target="_blank" rel="noreferrer">Ver documento</a>
                    ) : <span className="adm-dim">Sin documento</span>}
                    <button className="adm-mini go" disabled={mutVerify.isPending} onClick={() => acceptPsy(p.userId)}>
                      Aceptar
                    </button>
                    <Link to={`/OneUser/${p.userId}`} className="adm-mini">Ver</Link>
                  </div>
                </div>
              ))}
          </div>
        )}

        {tab === "kpis" && (
          <div className="adm-panel">
            <b className="adm-h2">KPIs de la aplicación</b>
            {!kpis ? <p className="adm-dim">Cargando…</p> : (
              <div className="adm-kpis">
                <div className="adm-kpi"><span>Usuarios</span><b>{kpis.totalUsers}</b><small>👑{kpis.superAdmins} · 🛠{kpis.admins} · 🧠{kpis.psychologists} · 🙋{kpis.patients}</small></div>
                <div className="adm-kpi"><span>Activos 7d</span><b>{kpis.activeUsers7d}</b><small>con actividad</small></div>
                <div className="adm-kpi"><span>Min. práctica</span><b>{kpis.activityMinutes}</b><small>acumulados</small></div>
                <div className="adm-kpi"><span>Mensajes chat</span><b>{kpis.chatMessages}</b><small>en total</small></div>
                <div className="adm-kpi"><span>PHQ-4 (30d)</span><b>{kpis.phq4Count30d}</b><small>promedio {kpis.phq4Avg30d}</small></div>
              </div>
            )}
            <b className="adm-h2">Actividad reciente (auditoría)</b>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead><tr><th>Fecha</th><th>Usuario</th><th>Acción</th><th>Detalle</th></tr></thead>
                <tbody>
                  {logs.map((l, i) => (
                    <tr key={i}>
                      <td>{new Date(l.date).toLocaleString("es", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                      <td>{l.userName}</td>
                      <td>{l.action}</td>
                      <td>{l.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="adm-btn primary no-print" onClick={() => window.print()}>🖨 Imprimir reporte</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
