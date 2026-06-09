import { useState, useEffect } from "react";

export default function NewMeetingForm({ onSubmit, editedMeeting, onEditSubmit }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [confirmEdit, setConfirmEdit] = useState(false);

    useEffect(() => {
        if (editedMeeting) {
            setTitle(editedMeeting.title);
            setDescription(editedMeeting.description);
        } else {
            setTitle('');
            setDescription('');
        }
        setConfirmEdit(false);
    }, [editedMeeting]);

    function submit(event) {
        event.preventDefault();
        if (editedMeeting) {
            setConfirmEdit(true);
        } else {
            onSubmit({ title, description });
            setTitle('');
            setDescription('');
        }
    }

    function confirmEditSubmit() {
        onEditSubmit({ ...editedMeeting, title, description });
        setTitle('');
        setDescription('');
        setConfirmEdit(false);
    }

    return (
        <>
            {confirmEdit && (
                <div style={{
                    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                    background: "rgba(0,0,0,0.5)", display: "flex",
                    alignItems: "center", justifyContent: "center", zIndex: 1000
                }}>
                    <div style={{ background: "white", padding: "24px", borderRadius: "4px", minWidth: "300px" }}>
                        <p>Czy na pewno chcesz zapisać zmiany w spotkaniu?</p>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                            <button type="button" onClick={() => setConfirmEdit(false)}>Anuluj</button>
                            <button type="button" onClick={confirmEditSubmit}>Zapisz</button>
                        </div>
                    </div>
                </div>
            )}
            <form onSubmit={submit}>
                <h3>{editedMeeting ? "Edytuj spotkanie" : "Dodaj nowe spotkanie"}</h3>
                <label>Nazwa</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
                <label>Opis</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}/>
                <button>{editedMeeting ? "Zapisz" : "Dodaj"}</button>
            </form>
        </>
    );
}