import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/RegistroProfesional.css";
import api from "../querys/api";
import { URL } from "../querys/Auth.query";

/* Registro único para profesionales: crea RoleId=3 pendiente de verificación. */
const RegistroProfesional = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", pass: "", description: "" });
  const [doc, setDoc] = useState(null);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setOk("");
    setErr("");
    if (!form.name || !form.email || !form.phone || !form.pass || form.pass.length < 6) {
      setErr("Completa todos los campos (clave mín. 6).");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("UserName", form.name);
      fd.append("Email", form.email);
      fd.append("Phone", form.phone);
      fd.append("Password", form.pass);
      fd.append("Description", form.description);
      if (doc) fd.append("credential", doc);
      await api.post(`${URL}/User/RegisterProfessional`, fd);
      setOk("Registro recibido. Un administrador revisará tus documentos y te avisaremos.");
      setForm({ name: "", email: "", phone: "", pass: "", description: "" });
      setDoc(null);
    } catch (e) {
      const m = e?.response?.data;
      setErr(typeof m === "string" ? m : "No se pudo registrar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="regpro-page">
      <div className="regpro-card">
        <span className="regpro-kicker">Solo profesionales de la salud mental</span>
        <h1>Registro profesional</h1>
        <p className="regpro-dim">Crea tu cuenta como psicólogo. Quedará pendiente de verificación por un administrador.</p>
        <form onSubmit={submit} className="regpro-form">
          <label>Nombre completo</label>
          <input type="text" placeholder="Tu nombre" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <label>Correo</label>
          <input type="email" placeholder="tu@correo.com" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <label>Teléfono</label>
          <input type="text" placeholder="3001234567" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <label>Contraseña (mín. 6)</label>
          <input type="password" placeholder="••••••••" value={form.pass}
            onChange={(e) => setForm({ ...form, pass: e.target.value })} />
          <label>Descripción profesional</label>
          <textarea rows={3} maxLength={500} placeholder="Especialidad, experiencia…"
            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <label>Documento que te ratifica (PDF/JPG/PNG, máx 10MB)</label>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setDoc(e.target.files[0])} />
          {ok && <p className="regpro-ok">{ok}</p>}
          {err && <p className="regpro-error">{err}</p>}
          <button className="regpro-btn" type="submit" disabled={saving}>
            {saving ? "Enviando…" : "Solicitar cuenta profesional"}
          </button>
        </form>
        <Link to="/" className="regpro-back">← Volver al ingreso</Link>
      </div>
    </div>
  );
};

export default RegistroProfesional;
