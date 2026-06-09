import {useState} from "react";
import NewMeetingForm from "./NewMeetingForm";
import MeetingsList from "./MeetingsList";

export default function MeetingsPage() {
    const [meetings, setMeetings] = useState([]);
    const [editedId, setEditedId] = useState(null);

    function handleNewMeeting(meeting) {
        const nextMeetings = [...meetings, { ...meeting, id: crypto.randomUUID() }];
        setMeetings(nextMeetings);

    }
    function onDelete(meetingToRemove) {
        setMeetings(prev => prev.filter(meeting => meeting.id !== meetingToRemove.id));
    }

    function onDeleteAll() {
        setMeetings([]);
    }

    function onEdit(id) {
        setEditedId(id);
    }
    function editMeeting(editedMeeting) {
        setMeetings(meetings.map(meeting => meeting.id === editedMeeting.id ? editedMeeting : meeting));
    }

    // Plan dzialania, pobierze ID z przycisku, nastepnie przekaze go do jakiejs zmiennej tutaj, to wedruje do NewMeetingForm, editMeeting laduje do NewMeetingForm
    const editedMeeting = meetings.find(m => m.id === editedId);

    return (
        <div>
            <h2>Zajęcia ({meetings.length})</h2>
            <NewMeetingForm
                onSubmit={(meeting) => handleNewMeeting(meeting)}
                editedMeeting={editedMeeting}
                onEditSubmit={(meeting) => editMeeting(meeting)}
            />
            <MeetingsList meetings={meetings} onDelete={onDelete} onDeleteAll={onDeleteAll} onEdit={onEdit}/>
        </div>
    )
}