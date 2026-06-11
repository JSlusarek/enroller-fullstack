import { useState, useEffect, useRef } from "react";
import { Trash2, Trash, Pencil, UserPlus, UserMinus, Users } from "lucide-react";

export default function MeetingsList({ meetings, onDelete, onDeleteAll, onEdit, onJoin, onLeave}) {
    const [selected, setSelected] = useState([]);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteErrors, setDeleteErrors] = useState([]);
    const [currentLogin, setCurrentLogin] = useState("");
    const [participantsModalId, setParticipantsModalId] = useState(null);
    const [counts, setCounts] = useState({});
    const [enrolled, setEnrolled] = useState(new Set());
    const prevLoginRef = useRef(currentLogin);

    useEffect(() => {
        setCounts(prev => {
            const next = { ...prev };
            meetings.forEach(m => {
                next[m.id] = m.participantCount ?? prev[m.id] ?? 0;
            });
            return next;
        });
    }, [meetings]);

    useEffect(() => {
        if (prevLoginRef.current !== currentLogin) {
            prevLoginRef.current = currentLogin;
            setEnrolled(new Set());
        }
    }, [currentLogin]);

    function toggleSelect(id) {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    }

    async function deleteSelected() {
        const errors = [];
        for (const id of selected) {
            const meeting = meetings.find(m => m.id === id);
            const err = await onDelete(meeting);
            if (err) errors.push(`"${meeting.title}": ${err}`);
        }
        setSelected([]);
        setConfirmDelete(false);
        setDeleteErrors(errors);
    }

    async function handleJoin(meetingId) {
        const err = await onJoin(meetingId, currentLogin);
        if (!err) {
            setCounts(prev => ({ ...prev, [meetingId]: (prev[meetingId] ?? 0) + 1 }));
            setEnrolled(prev => new Set([...prev, meetingId]));
        }
    }

    async function handleLeave(meetingId, login) {
        await onLeave(meetingId, login);
        setCounts(prev => ({ ...prev, [meetingId]: Math.max(0, (prev[meetingId] ?? 0) - 1) }));
        if (login === currentLogin) {
            setEnrolled(prev => { const s = new Set(prev); s.delete(meetingId); return s; });
        }
    }

    const participantsModal = meetings.find(m => m.id === participantsModalId);

    const overlayStyle = {
        position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
        background: "rgba(0,0,0,0.5)", display: "flex",
        alignItems: "center", justifyContent: "center", zIndex: 1000
    };
    const dialogStyle = {
        background: "white", padding: "24px", borderRadius: "4px",
        minWidth: "300px", maxWidth: "420px", width: "100%"
    };

    return (
        <div>
            {confirmDelete && (
                <div style={overlayStyle}>
                    <div style={dialogStyle}>
                        <p>Czy na pewno chcesz usunąć {selected.length} spotkań?</p>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                            <button onClick={() => setConfirmDelete(false)}>Anuluj</button>
                            <button onClick={deleteSelected}><Trash2 size={14}/> Usuń</button>
                        </div>
                    </div>
                </div>
            )}

            {participantsModal && (
                <div style={overlayStyle}>
                    <div style={dialogStyle}>
                        <h3 style={{ marginTop: 0 }}>
                            <Users size={16} style={{ verticalAlign: "middle", marginRight: "6px" }}/>
                            Uczestnicy: {participantsModal.title}
                        </h3>
                        <ul style={{ paddingLeft: "16px", marginBottom: "12px" }}>
                            {(participantsModal.participants || []).length === 0 && (
                                <li style={{ color: "#888" }}>Brak uczestników</li>
                            )}
                            {(participantsModal.participants || []).map(p => (
                                <li key={p.login} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                    <span>{p.login}</span>
                                    <button onClick={() => handleLeave(participantsModalId, p.login)}>Wypisz</button>
                                </li>
                            ))}
                        </ul>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <button onClick={() => setParticipantsModalId(null)}>Zamknij</button>
                        </div>
                    </div>
                </div>
            )}

            {deleteErrors.length > 0 && (
                <div style={{ color: "red", marginBottom: "8px" }}>
                    {deleteErrors.map((e, i) => <div key={i}>{e}</div>)}
                    <button onClick={() => setDeleteErrors([])}>OK</button>
                </div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <label><strong>Twój login:</strong></label>
                <input
                    value={currentLogin}
                    onChange={e => setCurrentLogin(e.target.value)}
                    placeholder="Wpisz login..."
                    style={{ width: "180px" }}
                />
            </div>

            <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                {selected.length > 0 && (
                    <button onClick={() => setConfirmDelete(true)}>
                        <Trash2 size={14}/> Usuń zaznaczone ({selected.length})
                    </button>
                )}
                {meetings.length > 0 && (
                    <button onClick={onDeleteAll}>
                        <Trash size={14}/> Usuń wszystkie
                    </button>
                )}
            </div>

            <table>
                <thead>
                <tr>
                    <th></th>
                    <th>Nazwa spotkania</th>
                    <th>Opis</th>
                    <th>Liczba uczestników</th>
                    <th>Akcje</th>
                </tr>
                </thead>
                <tbody>
                {meetings.map((meeting) => (
                    <tr key={meeting.id}>
                        <td>
                            <input
                                type="checkbox"
                                checked={selected.includes(meeting.id)}
                                onChange={() => toggleSelect(meeting.id)}
                            />
                        </td>
                        <td>{meeting.title}</td>
                        <td>{meeting.description}</td>
                        <td>{meeting.participants.length}</td>
                        <td style={{ textAlign: "center" }}>
                            <button
                                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                                onClick={() => setParticipantsModalId(meeting.id)}
                                title="Pokaż uczestników"
                            >
                                {counts[meeting.id] ?? 0}
                            </button>
                        </td>
                        <td style={{ display: "flex", gap: "6px" }}>
                            <button onClick={() => onEdit(meeting.id)}>
                                <Pencil size={14}/> Edytuj
                            </button>
                            {enrolled.has(meeting.id) ? (
                                <button onClick={() => handleLeave(meeting.id, currentLogin)}>
                                    <UserMinus size={14}/> Wypisz się
                                </button>
                            ) : (
                                <button
                                    disabled={!currentLogin.trim()}
                                    onClick={() => handleJoin(meeting.id)}
                                >
                                    <UserPlus size={14}/> Dołącz
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
