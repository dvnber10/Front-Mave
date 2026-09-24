import React, { useEffect } from "react";
import "../styles/Table.css";
import Navbar from "../components/Navbar";
import Cookies from "universal-cookie";
import { GetReportInitial, GetActivityTimeData, GetClinicalReportData } from "../hooks/Grafics";
import jsPDF from "jspdf";
import { username } from "../querys/User.query";
import "jspdf-autotable";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";

function Report() {
    const navigate = useNavigate();
    const cook = new Cookies();
    let idUsuario = cook.get('id');
    const { patientId } = useParams();
    const effId = patientId || idUsuario;

    useEffect(() => {
        if (!cook.get('id')) {
            navigate('/time-out');
        }
    }, [cook, navigate]);

    const { data: result, isSuccess, isLoading } = GetReportInitial(effId);
    const actQuery = GetActivityTimeData(effId);
    const actData = actQuery.isSuccess ? actQuery.data.data : null;
    const actLoading = actQuery.isLoading;
    const clinQuery = GetClinicalReportData(effId);
    const clinData = clinQuery.isSuccess ? clinQuery.data.data : null;
    const clinLoading = clinQuery.isLoading;

    const fmtHMS = (s) => {
        s = s || 0;
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        return h > 0 ? `${h}h ${m}m` : `${m}m ${s % 60}s`;
    };

    const questions = isSuccess && result?.data?.question ? result.data.question : [];
    const answer = isSuccess && result?.data?.answer ? result.data.answer : [];
    const score = isSuccess && result?.data?.score ? result.data.score : [];

    // Generación dinámica y limpia del arreglo de respuestas sin repetir código
    const respuestas = questions.map((q, index) => ({
        opcion: q,
        respuesta: answer[index] || "-",
        puntaje: score[index] !== undefined ? score[index] : "-"
    }));

    const generatePDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        
        const title = `Reporte de estadísticas`;
        const ach = "MAVE";

        doc.setFontSize(24);
        doc.text(ach, pageWidth / 2, 15, { align: 'center' });

        doc.setFontSize(14);
        doc.text(title, pageWidth / 2, 23, { align: 'center' });

        // Descripción de categorías en el PDF
        doc.setFontSize(10);
        doc.text("D: Dominante  |  I: Influyente  |  S: Estable  |  C: Concienzudo", pageWidth / 2, 32, { align: 'center' });

        const columns = ["Opción N°", "Respuesta", "Puntaje"];
        const rows = respuestas.map(rta => [rta.opcion, rta.respuesta, rta.puntaje]);

        doc.autoTable({
            head: [columns],
            body: rows,
            startY: 40,
            theme: 'grid',
            headStyles: { fillColor: [27, 80, 145] },
            margin: { top: 10, left: 14, right: 14 },
        });

        doc.autoTable({
            head: [["Actividad", "Total"]],
            body: [
                ["Meditación total", `${fmtHMS(actData?.meditationSeconds)} (${actData?.meditationSessions ?? 0} sesiones)`],
                ["Ánimos registrados", String(actData?.moodsCount ?? 0)],
                ["Hábitos completados", String(actData?.habitsCount ?? 0)],
                ...(actData?.last7Days || []).map(d => [`Meditación ${d.date}`, fmtHMS(d.seconds)]),
            ],
            startY: doc.lastAutoTable.finalY + 14,
            theme: 'grid',
            headStyles: { fillColor: [27, 80, 145] },
            margin: { top: 10, left: 14, right: 14 },
        });

        if (clinData) {
            doc.autoTable({
                head: [["Reporte clínico", clinData.patientName || ""]],
                body: [
                    ["Último PHQ-4", clinData.lastPhq4 ? `${clinData.lastPhq4.total}/12 (${clinData.lastPhq4.band}) el ${clinData.lastPhq4.date}` : "Sin datos"],
                    ["Depresión / Ansiedad", clinData.lastPhq4 ? `D ${clinData.lastPhq4.d} · A ${clinData.lastPhq4.a}` : "-"],
                    ["Días con ánimo (30d)", String(clinData.daysMood30 ?? 0)],
                    ["Días con hábitos (30d)", String(clinData.daysHabits30 ?? 0)],
                    ...(clinData.phq4History || []).map(p => [`PHQ-4 ${p.date}`, `D ${p.d} · A ${p.a} · T ${p.total}`]),
                    ...(clinData.recentHabits || []).slice(0, 10).map(h => [`Hábito ${h.date}`, `${h.question} → ${h.answer}`]),
                ],
                startY: doc.lastAutoTable.finalY + 14,
                theme: 'grid',
                headStyles: { fillColor: [27, 80, 145] },
                margin: { top: 10, left: 14, right: 14 },
            });
        }

        doc.save("Estadistic_Report.pdf");
    };

    return (
        <div>
            <Navbar />
            <BackButton />
        <div className="report-main-container">
            
            
            <div id="print-vis" className="report-content-wrapper">
                <div className="report-header-section">
                    <img
                        src="https://imgur.com/C86LPG8.png"
                        alt="Logo MAVE"
                        className="report-logo"
                    />
                    <div>
                        <h1 className="report-title">Reporte de estadísticas</h1>
                        <span className="report-subtitle">Sistema MAVE</span>
                    </div>
                </div>

                <div id="description" className="report-legend">
                    <span className="legend-item"><strong>D:</strong> Dominante</span>
                    <span className="legend-item"><strong>I:</strong> Influyente</span>
                    <span className="legend-item"><strong>S:</strong> Estable</span>
                    <span className="legend-item"><strong>C:</strong> Concienzudo</span>
                </div>

                <div className="table-responsive-container">
                    <table id="table">
                        <thead>
                            <tr id="table-title">
                                <th>Opción N°</th>
                                <th>Respuesta</th>
                                <th>Puntaje</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="3" style={{ textAlign: "center", padding: "30px" }}>
                                        <img className="Loading" src="https://mvalma.com/inicio/public/include/img/ImagenesTL/paginaTL/Cargando.gif" alt="Cargando" />
                                    </td>
                                </tr>
                            ) : (
                                respuestas.length > 0 ? (
                                    respuestas.map((rta, index) => (
                                        <tr key={index}>
                                            <td>{rta.opcion}</td>
                                            <td>{rta.respuesta}</td>
                                            <td>{rta.puntaje}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>No hay datos disponibles.</td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="report-activity">
                    <h2 className="report-activity-title">Tiempo en actividades</h2>
                    {actLoading ? (
                        <p className="dim">Cargando…</p>
                    ) : actData ? (
                        <>
                            <div className="activity-cards">
                                <div className="activity-card"><span>Meditación total</span><b>{fmtHMS(actData.meditationSeconds)}</b><small>{actData.meditationSessions} sesiones</small></div>
                                <div className="activity-card"><span>Ánimos registrados</span><b>{actData.moodsCount}</b><small>sesiones</small></div>
                                <div className="activity-card"><span>Hábitos completados</span><b>{actData.habitsCount}</b><small>respuestas</small></div>
                            </div>
                            <div className="table-responsive-container">
                                <table id="table">
                                    <thead>
                                        <tr id="table-title">
                                            <th>Día</th>
                                            <th>Meditación</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(actData.last7Days || []).map((d, i) => (
                                            <tr key={i}>
                                                <td>{d.date}</td>
                                                <td>{fmtHMS(d.seconds)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <p className="dim">Sin datos de actividad todavía.</p>
                    )}
                </div>

                {clinData && (
                <div className="report-activity">
                    <h2 className="report-activity-title">Reporte clínico{clinData.patientName ? ` · ${clinData.patientName}` : ""}</h2>
                    {clinData.lastPhq4 ? (
                    <>
                        <div className="activity-cards">
                            <div className="activity-card"><span>Último PHQ-4 ({clinData.lastPhq4.date})</span><b>{clinData.lastPhq4.total} · {clinData.lastPhq4.band}</b><small>D {clinData.lastPhq4.d} · A {clinData.lastPhq4.a}{clinData.lastPhq4.needsFollowUp ? " · seguimiento sugerido" : ""}</small></div>
                            <div className="activity-card"><span>Días con ánimo (30d)</span><b>{clinData.daysMood30}</b><small>días con registro</small></div>
                            <div className="activity-card"><span>Días con hábitos (30d)</span><b>{clinData.daysHabits30}</b><small>días con respuestas</small></div>
                        </div>
                        {(clinData.phq4History || []).length > 0 && (
                        <div className="table-responsive-container">
                            <table id="table">
                                <thead><tr id="table-title"><th>Fecha</th><th>D</th><th>A</th><th>Total</th></tr></thead>
                                <tbody>{clinData.phq4History.map((p, i) => (<tr key={i}><td>{p.date}</td><td>{p.d}</td><td>{p.a}</td><td>{p.total}</td></tr>))}</tbody>
                            </table>
                        </div>)}
                        {(clinData.recentHabits || []).length > 0 && (
                        <div className="table-responsive-container">
                            <h3 className="report-activity-title" style={{ fontSize: 16 }}>Hábitos recientes</h3>
                            <table id="table">
                                <thead><tr id="table-title"><th>Fecha</th><th>Pregunta</th><th>Respuesta</th></tr></thead>
                                <tbody>{clinData.recentHabits.map((h, i) => (<tr key={i}><td>{h.date}</td><td>{h.question}</td><td>{h.answer}</td></tr>))}</tbody>
                            </table>
                        </div>)}
                    </>
                    ) : (<p className="dim">Aún sin chequeos PHQ-4 registrados.</p>)}
                    <p className="dim">Uso orientativo para acompañamiento profesional. No constituye un diagnóstico.</p>
                </div>
                )}

                <button className="button" onClick={generatePDF}>Generar PDF</button>
            </div>
        </div>
        </div>
    );
}

export default Report;