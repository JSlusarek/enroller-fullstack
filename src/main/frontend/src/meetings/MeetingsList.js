import { useState } from "react";
import { Trash2, Trash, Pencil } from "lucide-react";

export default function MeetingsList({ meetings, onDelete, onDeleteAll, onEdit }) {
    const [selected, setSelected] = useState([]);
    const [confirmDelete, setConfirmDelete] = useState(false);

    function toggleSelect(id) {
        setSelected(selected =>
            selected.includes(id) ? selected.filter(i => i !== id) : [...selected, id]
        );
    }

    function deleteSelected() {
        selected.forEach(id => onDelete(meetings.find(m => m.id === id)));
        setSelected([]);
        setConfirmDelete(false);
    }

    return (
        <div>
            {confirmDelete && (
                <div style={{
                    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                    background: "rgba(0,0,0,0.5)", display: "flex",
                    alignItems: "center", justifyContent: "center", zIndex: 1000
                }}>
                    <div style={{ background: "white", padding: "24px", borderRadius: "4px", minWidth: "300px" }}>
                        <p>Czy na pewno chcesz usunąć {selected.length} spotkań?</p>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                            <button onClick={() => setConfirmDelete(false)}>Anuluj</button>
                            <button onClick={deleteSelected}><Trash2 size={14}/> Usuń</button>
                        </div>
                    </div>
                </div>
            )}
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
                        <td>
                            <button onClick={() => onEdit(meeting.id)}>
                                <Pencil size={14}/> Edytuj
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}