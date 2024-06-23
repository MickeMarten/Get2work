import { IonButton, IonContent, IonHeader, IonInput, IonText } from "@ionic/react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import firebaseConfig from "../firebaseConfig";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


function SignUp() {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const history = useHistory();
    const [error, setError] = useState('')

    const handleSignUp = async () => {
        try {
            setError('')

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'Users', user.uid), {
                email: user.email,
                createdAt: new Date(),
                name: fullName,
            })

            history.push('/punchclock')
        } catch (error) {
            setError('för kort lösenord eller något idk.')
        }
    }

    return (
        <IonContent>
            <IonHeader>Skapa konto</IonHeader>
            <IonInput placeholder="Användarnamn" onIonChange={(e) => setFullName(e.detail.value!)}></IonInput>
            <IonInput placeholder="Email" onIonChange={(e) => setEmail(e.detail.value!)}></IonInput>
            <IonInput placeholder="Lösenord" type="password" onIonChange={(e) => setPassword(e.detail.value!)}></IonInput>
            <IonButton onClick={handleSignUp}>Skapa konto</IonButton>
            {error && <IonText>{error}</IonText>}
        </IonContent>

    )
}

export default SignUp