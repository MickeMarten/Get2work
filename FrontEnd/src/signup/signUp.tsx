import { IonButton, IonContent, IonHeader, IonInput, IonText } from "@ionic/react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { useHistory } from "react-router-dom";

const firebaseConfig = {
    apiKey: "AIzaSyB7GnC4ffCPkTW7kGhedZMAX5_LSnvoUpk",
    authDomain: "punch-clock-cd580.firebaseapp.com",
    databaseURL: "https://punch-clock-cd580-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "punch-clock-cd580",
    storageBucket: "punch-clock-cd580.appspot.com",
    messagingSenderId: "392166204571",
    appId: "1:392166204571:web:b4f05b0a4fbe9c1782123e",
    measurementId: "G-ELMWFN42X1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);



function SignUp() {
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
            })

            history.push('/punchclock')
        } catch (error) {
            setError('för kort lösenord eller något idk.')
        }
    }



    return (
        <IonContent>
            <IonHeader>Skapa konto</IonHeader>

            <IonInput placeholder="Användarnamn" onIonChange={(e) => setEmail(e.detail.value!)}></IonInput>
            <IonInput placeholder="Lösenord" type="password" onIonChange={(e) => setPassword(e.detail.value!)}></IonInput>
            <IonButton onClick={handleSignUp}>Skapa konto</IonButton>
            {error && <IonText>{error}</IonText>}
        </IonContent>

    )
}

export default SignUp