import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import Navbar from "../components/Navbar";
import "../styles/Perfil.css";
import { GetUser, updateProfile, changePassword, GetPsyProfileData, savePsyDescription, uploadCredential } from "../hooks/UserHook";
import BackButton from "../components/BackButton";

const initials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
};

const Perfil = () => {
  const navigate = useNavigate();
  const cookie = new Cookies();
  const cook = cookie.get("id");

  useEffect(() => {
    if (!cook) {
      navigate("/time-out");
    }
  }, [cook, navigate]);

  const { data: result, isSuccess } = GetUser(cook);
  const user = isSuccess ? result.data : null;

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loaded, setLoaded] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (user && !loaded) {
      /* GetUserInfo serializa PascalCase (UserName/Email/Phone) */
      setForm({ name: user.UserName || "", email: user.Email || "", phone: user.Phone || "" });
      setLoaded(true);
    }
  }, [user, loaded]);

  const [pass, setPass] = useState({ current: "", next: "", confirm: "" });
  const [msgPass, setMsgPass] = useState("");
  const [errPass, setErrPass] = useState("");

  const mutProf = updateProfile();
  const mutPass = changePassword();

  /* Perfil profesional (solo psicólogos) */
  const psyQ = GetPsyProfileData(cook);
  const psy = psyQ.isSuccess ? psyQ.data.data : null;
  const [desc, setDesc] = useState("");
  const [descLoaded, setDescLoaded] = useState(false);
  const [doc, setDoc] = useState(null);
  const [docPreview, setDocPreview] = useState(null);

  /* Vista previa local si el documento es imagen */
  const handleDoc = (e) => {
    const file = e.target.files[0];
    if (docPreview) URL.revokeObjectURL(docPreview);
    setDoc(file || null);
    if (file && file.type.startsWith("image/")) {
      setDocPreview(URL.createObjectURL(file));
    } else {
      setDocPreview(null);
    }
  };

  useEffect(() => () => { if (docPreview) URL.revokeObjectURL(docPreview); }, [docPreview]);
  const [msgDesc, setMsgDesc] = useState("");
  const [errDesc, setErrDesc] = useState("");
  const [msgDoc, setMsgDoc] = useState("");
  const [errDoc, setErrDoc] = useState("");
  const mutDesc = savePsyDescription();
  const mutDoc = uploadCredential();

  useEffect(() => {
    if (psy && !descLoaded) {
      setDesc(psy.description || "");
      setDescLoaded(true);
    }
  }, [psy, descLoaded]);

  const saveDesc = async () => {
    setMsgDesc("");
    setErrDesc("");
    try {
      await mutDesc.mutateAsync({ userId: cook, description: desc });
      setMsgDesc("Descripción guardada ✔");
      psyQ.refetch();
    } catch {
      setErrDesc("No se pudo guardar");
    }
  };

  const uploadDoc = async () => {
    if (!doc) return;
    setMsgDoc("");
    setErrDoc("");
    try {
      const r = await mutDoc.mutateAsync({ userId: cook, file: doc });
      setMsgDoc(typeof r?.data === "string" ? r.data : "Documento cargado ✔");
      setDoc(null);
      psyQ.refetch();
    } catch (e) {
      const m = e?.response?.data;
      setErrDoc(typeof m === "string" ? m : "No se pudo subir");
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    try {
      await mutProf.mutateAsync({ userId: cook, ...form });
      setMsg("Perfil actualizado ✔");
    } catch (e) {
      const m = e?.response?.data;
      setErr(typeof m === "string" ? m : "No se pudo guardar");
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setMsgPass("");
    setErrPass("");
    if (pass.next !== pass.confirm) {
      setErrPass("La confirmación no coincide.");
      return;
    }
    try {
      await mutPass.mutateAsync({ userId: cook, currentPassword: pass.current, newPassword: pass.next });
      setMsgPass("Contraseña actualizada ✔");
      setPass({ current: "", next: "", confirm: "" });
    } catch (e) {
      const m = e?.response?.data;
      setErrPass(typeof m === "string" ? m : "No se pudo cambiar");
    }
  };

  return (
    <div>
      <Navbar />
      <BackButton />
      <div className="perf-page">
        <div className="perf-card">
          <div className="perf-head">
            <div className="perf-avatar">{initials(user?.UserName)}</div>
            <div>
              <h1 className="perf-h1">Mi perfil</h1>
              <p className="perf-dim">Actualiza tus datos cuando quieras.</p>
            </div>
          </div>

          <form onSubmit={saveProfile} className="perfil-form">
            <label className="perf-label">Nombre</label>
            <input className="perf-input" type="text" placeholder="Tu nombre"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <label className="perf-label">Correo</label>
            <input className="perf-input" type="email" placeholder="tu@correo.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <label className="perf-label">Teléfono</label>
            <input className="perf-input" type="text" placeholder="3001234567"
              value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            {msg && <p className="perf-ok">{msg}</p>}
            {err && <p className="perf-error">{err}</p>}
            <button className="perf-btn primary" type="submit" disabled={mutProf.isPending}>
              {mutProf.isPending ? "Guardando…" : "Guardar cambios"}
            </button>
          </form>
        </div>

        <div className="perf-card">
          <h2 className="perf-h2">Cambiar contraseña</h2>
          <form onSubmit={savePassword} className="perf-form">
            <label className="perf-label">Contraseña actual</label>
            <input className="perf-input" type="password" placeholder="••••••••"
              value={pass.current} onChange={(e) => setPass({ ...pass, current: e.target.value })} />
            <label className="perf-label">Nueva contraseña (mín. 6)</label>
            <input className="perf-input" type="password" placeholder="••••••••"
              value={pass.next} onChange={(e) => setPass({ ...pass, next: e.target.value })} />
            <label className="perf-label">Confirmar nueva</label>
            <input className="perf-input" type="password" placeholder="••••••••"
              value={pass.confirm} onChange={(e) => setPass({ ...pass, confirm: e.target.value })} />
            {msgPass && <p className="perf-ok">{msgPass}</p>}
            {errPass && <p className="perf-error">{errPass}</p>}
            <button className="perf-btn ghost" type="submit" disabled={mutPass.isPending}>
              {mutPass.isPending ? "Cambiando…" : "Cambiar contraseña"}
            </button>
          </form>
        </div>

        {user?.RoleId === 3 && (
        <div className="perf-card">
          <h2 className="perf-h2">Perfil profesional</h2>
          {psy && psy.verified && <span className="perf-verified">Verificado ✓</span>}
          <label className="perf-label">Descripción pública (la ven los pacientes)</label>
          <textarea className="perf-input perf-area" rows={3} maxLength={500} placeholder="Cuéntales a tus pacientes sobre ti…"
            value={desc} onChange={(e) => setDesc(e.target.value)} />
          <button className="perf-btn primary" onClick={saveDesc} disabled={mutDesc.isPending}>
            {mutDesc.isPending ? "Guardando…" : "Guardar descripción"}
          </button>
          {msgDesc && <p className="perf-ok">{msgDesc}</p>}
          {errDesc && <p className="perf-error">{errDesc}</p>}
          <label className="perf-label">Documento que te ratifica (PDF/JPG/PNG, máx 10MB)</label>
          <input className="perf-input" type="file" accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleDoc} />
          {docPreview ? (
            <img src={docPreview} className="perf-preview" alt="Vista previa del documento" />
          ) : doc ? (
            <p className="perf-dim">Archivo: {doc.name}</p>
          ) : null}
          <button className="perf-btn ghost" onClick={uploadDoc} disabled={mutDoc.isPending || !doc}>
            {mutDoc.isPending ? "Subiendo…" : "Cargar documento"}
          </button>
          {msgDoc && <p className="perf-ok">{msgDoc}</p>}
          {errDoc && <p className="perf-error">{errDoc}</p>}
          {psy && psy.credentialUrl ? (
            <p className="perf-dim">Documento cargado ✓ {psy.verified ? "(verificado)" : "(pendiente de verificación)"}</p>
          ) : null}
        </div>
        )}
      </div>
    </div>
  );
};

export default Perfil;
