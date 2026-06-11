import {useState, useEffect} from "react";
import NewMeetingForm from "./NewMeetingForm";
import MeetingsList from "./MeetingsList";

export default function MeetingsPage() {
    const [meetings, setMeetings] = useState([]);
    const [editedId, setEditedId] = useState(null);
    const [numberOfParticipants, setNumberOfParticipants] = useState(0);

    async function handleNewMeeting(meeting) {
        const response = await fetch('/api/meetings', {
            method: 'POST',
            body: JSON.stringify(meeting),
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            const savedMeeting = await response.json();
            setMeetings(prev => [...prev, savedMeeting]);
        }
    }

    async function onDelete(meetingToRemove) {
        const response = await fetch(`/api/meetings/${meetingToRemove.id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            setMeetings(prev => prev.filter(meeting => meeting.id !== meetingToRemove.id));
            return null;
        } else if (response.status === 409) {
            return "Nie można usunąć spotkania z zapisanymi uczestnikami";
        }
        return "Błąd podczas usuwania";
    }

    async function onDeleteAll() {
        const response = await fetch('/api/meetings', {
            method: 'DELETE'
        });
        if (response.ok) {
            const refreshResponse = await fetch('/api/meetings');
            if (refreshResponse.ok) {
                const data = await refreshResponse.json();
                setMeetings(data);
            }
        }
    }

    async function onJoin(meetingId, login) {
        if (!login.trim()) return "Podaj login uczestnika";
        const response = await fetch(`/api/meetings/${meetingId}/participants`, {
            method: 'POST',
            body: JSON.stringify({ login: login.trim() }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            const updatedMeeting = await response.json();
            setMeetings(prev => prev.map(m => m.id === meetingId ? updatedMeeting : m));
            return null;
        } else if (response.status === 409) {
            return "Uczestnik jest już zapisany na to spotkanie";
        }
        return "Błąd podczas dołączania";
    }

    async function onLeave(meetingId, login) {
        const response = await fetch(`/api/meetings/${meetingId}/participants?login=${encodeURIComponent(login)}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            const updatedMeeting = await response.json();
            setMeetings(prev => prev.map(m => m.id === meetingId ? updatedMeeting : m));
        }
    }

    function onEdit(id) {
        setEditedId(id);
    }

    async function editMeeting(editedMeeting) {
        const response = await fetch(`/api/meetings/${editedMeeting.id}`, {
            method: 'PUT',
            body: JSON.stringify(editedMeeting),
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) return;
        const updatedMeeting = await response.json();
        setMeetings(prev => prev.map(m => m.id === updatedMeeting.id ? updatedMeeting : m));
        setEditedId(null);
    }



    const editedMeeting = meetings.find(m => m.id === editedId);

    useEffect(() => {
        const fetchMeetings = async () => {
            const response = await fetch('/api/meetings');
            if (response.ok) {
                const data = await response.json();
                setMeetings(data);
            }
        };
        fetchMeetings();
    }, []);

    return (
        <div>
            <h2>Zajęcia ({meetings.length})</h2>
            <NewMeetingForm
                onSubmit={(meeting) => handleNewMeeting(meeting)}
                editedMeeting={editedMeeting}
                onEditSubmit={(meeting) => editMeeting(meeting)}
            />
            <MeetingsList
                meetings={meetings}
                onDelete={onDelete}
                onDeleteAll={onDeleteAll}
                onEdit={onEdit}
                onJoin={onJoin}
                onLeave={onLeave}
            />
        </div>
    )
}
