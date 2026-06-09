import MeetingsPage from "./meetings/MeetingsPage";

export default function UserPanel(props) {
    return (
        <div>
            <h2>Twój e-mail to {props.username}</h2>
            <p>Operacja zakończona sukcesem!</p>
            <button type="button" onClick={() => props.onLogout()}>
                Wyloguj
            </button>
            <MeetingsPage />
        </div>
    );
}
