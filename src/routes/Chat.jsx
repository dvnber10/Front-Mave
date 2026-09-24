import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import Navbar from "../components/Navbar";
import "../styles/Chat.css";
import { GetConversationsData, GetHistoryData, sendChat } from "../hooks/Chat";
import BackButton from "../components/BackButton";

const fmtDate = (iso) => {
  try {
    return new Date(iso).toLocaleString("es", {
      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return "";
  }
};

const Chat = () => {
  const navigate = useNavigate();
  const cookie = new Cookies();
  const cook = cookie.get("id");
  const { peerId } = useParams();

  const [peer, setPeer] = useState(peerId ? Number(peerId) : null);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!cook) {
      navigate("/time-out");
    }
  }, [cook, navigate]);

  useEffect(() => {
    if (peerId) setPeer(Number(peerId));
  }, [peerId]);

  const convQ = GetConversationsData(cook);
  const convs = convQ.isSuccess ? convQ.data.data || [] : [];

  const histQ = GetHistoryData(cook, peer);
  const msgs = histQ.isSuccess ? histQ.data.data || [] : [];

  const mut = sendChat();
  const peerName = convs.find((c) => c.userId === peer)?.userName || (peer ? "Conversación" : "");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const send = async (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t || !peer) return;
    setText("");
    try {
      await mut.mutateAsync({ senderId: Number(cook), receiverId: peer, text: t });
      histQ.refetch();
      convQ.refetch();
    } catch {
      /* el backend responde el motivo */
    }
  };

  return (
    <div>
      <Navbar />
      <BackButton />
      <div className="chat-page">
        <h1>Chat</h1>
        <div className="chat-layout">
          <aside className="chat-list">
            {convQ.isLoading ? (
              <p className="chat-dim">Cargando…</p>
            ) : convs.length === 0 ? (
              <p className="chat-dim">Sin conversaciones todavía.</p>
            ) : (
              convs.map((c) => (
                <button key={c.userId} className={`chat-conv${peer === c.userId ? " sel" : ""}`} onClick={() => setPeer(c.userId)}>
                  <span className="chat-conv-name">{c.userName}</span>
                  <span className="chat-conv-last">{(c.lastText || "").slice(0, 40)}</span>
                  {c.unread > 0 && <span className="chat-badge">{c.unread}</span>}
                </button>
              ))
            )}
          </aside>

          <section className="chat-thread">
            {!peer ? (
              <p className="chat-dim chat-empty">Elige una conversación para empezar a escribir.</p>
            ) : (
              <>
                <div className="chat-head"><b>{peerName}</b></div>
                <div className="chat-msgs">
                  {msgs.map((m) => (
                    <div key={m.messageId} className={`chat-msg${m.senderId === Number(cook) ? " mine" : ""}`}>
                      <p>{m.text}</p>
                      <small>{fmtDate(m.date)}</small>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>
                <form className="chat-form" onSubmit={send}>
                  <input
                    className="chat-input"
                    type="text"
                    placeholder="Escribe un mensaje… (máx. 500)"
                    value={text}
                    maxLength={500}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <button className="chat-send" type="submit" disabled={mut.isPending || !text.trim()}>
                    Enviar
                  </button>
                </form>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Chat;
