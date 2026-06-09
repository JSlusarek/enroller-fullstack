import { useState } from "react";

export default function LoginForm(props) {
    const [email, setEmail] = useState('');

    const isValid = email.length >= 5 && email.length <= 40 && email.includes('@');

    const validationMsg = () => {
        if (email.length === 0) return null;
        if (email.length < 5) return <p style={{color: "red"}}>Email za krótki</p>;
        if (email.length > 40) return <p style={{color: "red"}}>Email za długi</p>;
        if (!email.includes('@')) return <p style={{color: "red"}}>Brak znaku @</p>;
        return <p style={{color: "green"}}>Email poprawny</p>;
    };

    return (
        <div>
            <label>Zaloguj się e-mailem</label>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
            {validationMsg()}
            <button type="button" disabled={!isValid} onClick={() => props.onLogin(email)}>
                Wchodzę
            </button>
        </div>
    );
}