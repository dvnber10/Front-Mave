import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import Navbar from "../components/Navbar";
import "../styles/Meditation.css";
import { SoundsList, LogTime } from "../querys/Meditation.query";
import BackButton from "../components/BackButton";

const Meditation = () => {
  const navigate = useNavigate();
  const cookie = new Cookies();
  const cook = cookie.get('id');

  // Lista Freesound (10 pistas distintas) + reproductor con registro de tiempo
  const [sounds, setSounds] = useState([]);
  const [sound, setSound] = useState(null);
  const [loadingList, setLoadingList] = useState(false);
  const [soundError, setSoundError] = useState("");
  const audioRef = useRef(null);
  const lastSentRef = useRef(0);
  const intervalRef = useRef(null);
  const [remaining, setRemaining] = useState(null);
  const [audioDur, setAudioDur] = useState(null);

  const fmtDur = (s) => {
    if (!s && s !== 0) return "--:--";
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return `${m}:${String(r).padStart(2, "0")}`;
  };

  const loadSounds = async () => {
    setLoadingList(true);
    setSoundError("");
    try {
      const res = await SoundsList(10);
      const list = res.data || [];
      setSounds(list);
      if (list.length === 0) setSoundError("Sin resultados, intenta de nuevo");
    } catch {
      setSoundError("No se pudo traer la lista, intenta de nuevo");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadSounds();
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reportTime = async () => {
    const audio = audioRef.current;
    const uid = Number(cook);
    if (!audio || !sound || !uid) return;
    const delta = Math.round(audio.currentTime - lastSentRef.current);
    lastSentRef.current = audio.currentTime;
    if (delta > 0) {
      try {
        await LogTime({ userId: uid, soundId: sound.id, seconds: delta });
      } catch {
        /* se pierde ese tramo; el siguiente reporte continúa */
      }
    }
  };

  /* Elegir sonido: la sesión dura lo que dure ese audio */
  const handleSelectSound = (track) => {
    reportTime();
    clearInterval(intervalRef.current);
    setSound(track);
    lastSentRef.current = 0;
    setRemaining(track.durationSeconds);
    setAudioDur(null);
  };

  const handlePlay = () => {
    if (audioRef.current) lastSentRef.current = audioRef.current.currentTime;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => { reportTime(); }, 30000);
  };

  const handlePause = () => {
    clearInterval(intervalRef.current);
    reportTime();
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio && isFinite(audio.duration)) {
      const d = Math.round(audio.duration);
      setAudioDur(d);
      setRemaining(d);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || !sound) return;
    const total = audioDur ?? sound.durationSeconds;
    setRemaining(Math.max(0, Math.round(total - audio.currentTime)));
  };

  const handleBack = () => {
    reportTime();
    clearInterval(intervalRef.current);
    setSound(null);
    setRemaining(null);
    setAudioDur(null);
  };

  // Validar sesión de usuario
  useEffect(() => {
    if (!cook) {
      navigate('/time-out');
    }
  }, [cook, navigate]);

  return (
    <div>
      <Navbar />
      <BackButton />
    
    <div className="meditation-container">
      
      <h1>Meditación y Sonidos Ambientales</h1>

      {/* Fase 1: escoger sonido · Fase 2: sesión de lo que dure ese audio */}
      {!sound ? (
      <div className="sound-panel">
        <span className="kicker">Sonido vivo · Freesound</span>
        <h2>Elige tu sonido para meditar</h2>
        <p className="dim">Primero escoge una pista: la sesión durará lo que dure ese audio.</p>
        <button className="btn-sound" onClick={loadSounds} disabled={loadingList}>
          {loadingList ? "Buscando sonidos…" : "🔄 Otros 10 sonidos"}
        </button>
        {soundError && <span className="alert">{soundError}</span>}
        <div className="sound-list">
          {sounds.map((t) => (
            <button key={t.id} className="sound-item" onClick={() => handleSelectSound(t)}>
              <span className="sound-item-title">{t.title}</span>
              <span className="sound-item-meta">{t.author} · {fmtDur(t.durationSeconds)}</span>
            </button>
          ))}
        </div>
      </div>
      ) : (
      <div className="sound-panel">
        <span className="kicker">Sesión en curso</span>
        <div className="sound-title">{sound.title}</div>
        <div className="sound-meta">👤 {sound.author} · ⏳ {fmtDur(sound.durationSeconds)}</div>
        <div className="med-count">{fmtDur(remaining ?? sound.durationSeconds)}</div>
        <audio key={sound.streamUrl} ref={audioRef} controls preload="metadata" src={sound.streamUrl} className="sound-audio" onPlay={handlePlay} onPause={handlePause} onEnded={handlePause} onLoadedMetadata={handleLoadedMetadata} onTimeUpdate={handleTimeUpdate} />
        <button className="med-back" onClick={handleBack}>← Cambiar de sonido</button>
      </div>
      )}

    </div>
    </div>
  );
};

export default Meditation;