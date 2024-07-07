import { IonButton, IonContent, IonHeader, IonInput, IonGrid, IonCol, IonRow, IonToolbar, IonPage, IonIcon, IonBackButton, IonTitle, IonButtons, useIonRouter } from "@ionic/react";
import { checkmarkDoneOutline } from 'ionicons/icons';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import firebaseConfig from "../firebaseConfig";


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


function SignUp() {
    const [fullName, setFullName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const history = useHistory();
    const [isEmailValid, setIsEmailValid] = useState<boolean | undefined>();
    const [isPasswordValid, setIsPasswordValid] = useState<boolean | undefined>();
    const [isEmailTouched, setIsEmailTouched] = useState<boolean>(false);
    const [isPasswordTouched, setIsPasswordTouched] = useState<boolean>(false);

    const validateMatch = (email: string) => {
        return email.match(/^(?=.{1,254}$)(?=.{1,64}@)[a-zA-ZåäöÅÄÖ0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-ZåäöÅÄÖ0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-ZåäöÅÄÖ0-9](?:[a-zA-ZåäöÅÄÖ0-9-]{0,61}[a-zA-ZåäöÅÄÖ0-9])?(?:\.[a-zA-ZåäöÅÄÖ0-9](?:[a-zA-ZåäöÅÄÖ0-9-]{0,61}[a-zA-ZåäöÅÄÖ0-9])?)*$/);
    }

    const validateEmail = (ev: Event) => {
        const value = (ev.target as HTMLInputElement).value;
        setIsEmailValid(undefined);
        if (value === '') {
            return;
        } else {
            const isValid = validateMatch(value) !== null;
            setIsEmailValid(isValid);
        }
        setEmail(value);
    }

    const validatePassword = (ev: Event) => {
        setIsPasswordValid(undefined)
        const value = (ev.target as HTMLInputElement).value;
        if (value === '') {
            return;
        } else {

            value.length < 6 ? setIsPasswordValid(false) : setIsPasswordValid(true);
            setPassword(value)
        }

    }


    const markEmailTouched = () => {
        setIsEmailTouched(true);
    }

    const markPasswordTouched = () => {
        setIsPasswordTouched(true);
    }

    const handleSignUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'Users', user.uid), {
                email: user.email,
                createdAt: new Date(),
                name: fullName,
            });

            history.push('/punchclock');
        } catch (error) {
            console.log(error, 'error med inloggning');
        }
    }




    return (
        <IonPage>
            <IonContent color="light" className="ion-margin">
                <IonHeader>
                    <IonToolbar >
                        <IonButtons>
                            <IonBackButton defaultHref="/"></IonBackButton>
                        </IonButtons>
                        <IonTitle className="text-center text-3xl font-mono">Skapa konto</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <IonInput
                                className="text-2xl"
                                type="text"
                                fill="solid"
                                label="Användarnamn"
                                labelPlacement="floating"
                                required={true}
                                maxlength={10}
                                onIonInput={(event) => setFullName(event.detail.value!)}
                            ></IonInput>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonInput
                                className={`${'text-2xl'} ${isEmailValid ? 'ion-valid text-2xl' : ''} ${isEmailValid === false ? 'ion-invalid text-2xl' : ''} ${isEmailTouched ? 'ion-touched text-2xl' : ''}`}
                                type="email"
                                fill="solid"
                                label="Email"
                                placeholder="Exempel@hotmail.com"
                                labelPlacement="floating"
                                errorText='Fullständig Email'
                                required={true}
                                onIonInput={(event) => validateEmail(event)}
                                onIonBlur={markEmailTouched}
                            ></IonInput>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonInput
                                className={` ${'text-2xl'}${isPasswordValid ? 'ion-valid text-2xl' : ''} ${isPasswordValid === false ? 'ion-invalid text-2xl' : ''} ${isPasswordTouched ? 'ion-touched text-2xl' : ''}`}
                                minlength={6}
                                type="password"
                                fill="solid"
                                label="Password"
                                labelPlacement="floating"
                                helperText="Lösenordet måste innehålla minst 6 symboler"
                                errorText='För kort lösenord'
                                required={true}
                                onIonInput={(event) => validatePassword(event)}
                                onIonBlur={markPasswordTouched}
                            ></IonInput>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonButton expand="block" onClick={() => handleSignUp()}>Skapa konto <IonIcon icon={checkmarkDoneOutline} slot="start" /></IonButton>
                        </IonCol>
                        <IonCol>


                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    )
}
export default SignUp