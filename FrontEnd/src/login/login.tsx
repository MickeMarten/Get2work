import { IonRow, IonContent, IonInput, IonButton, IonHeader, IonToolbar, IonTitle, IonText, IonGrid, IonCol } from "@ionic/react"
import { useHistory } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Warning } from "postcss";

function Login() {
    const history = useHistory();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const auth = getAuth();

    const handleLogin = async () => {
        try {
            setError('')
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user;
            history.push('/punchclock')
        } catch (error) {
            setError('Minns du inte ditt lösenord? Prova igen..')
        }
        console.log(email, password)
    }
    console.log(email, password, auth.name, auth.currentUser)
    return (
        <IonContent>
            <IonHeader class="w-screen">
                <IonToolbar>
                    <IonTitle>Välkommen till jobbet.</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonInput

                placeholder="Användarnamn"
                onIonChange={(e) => setEmail(e.detail.value!)}
            />
            <IonInput

                placeholder="Lösenord"
                type="password"
                onIonChange={(e) => setPassword(e.detail.value!)}
            />
            {error && <IonText>{error}</IonText>}
            <IonButton onClick={handleLogin}>Logga in</IonButton>
            <IonButton onClick={() => { history.push('/signup') }}>Skapa konto</IonButton>
        </IonContent>
    );
}

export default Login;