import './App.css';
import { useState } from "react";
import "milligram";
import LoginForm from "./LoginForm";
import UserPanel from "./UserPanel";
function App() {
    const [loggedIn, setLoggedIn] = useState(false); // czyli przypisujemy 2 zmienne wynikowi z useState ktory jest tablicą

    function login(email) {
        setLoggedIn(email);
    }

    function logout() {
        setLoggedIn(false);
    }

    return (
        <div>
            <h1>System do zapisów na zajęcia</h1>
            {
                loggedIn
                    ? <UserPanel username={loggedIn} onLogout={logout}/>
                    : <LoginForm onLogin={login}/>
            }
        </div>
    );
}

export default App;
