import {
    IonRow, IonContent, IonInput, IonButton, IonHeader, IonToolbar, IonTitle, IonGrid, IonCol, IonCard,
    IonFooter,
    IonPage,
    IonIcon
} from "@ionic/react"
import { logInOutline, personCircleOutline } from 'ionicons/icons';
import { useHistory } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

function Login() {
    const history = useHistory();
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState('');
    const auth = getAuth();
    const [isEmailTouched, setIsEmailTouched] = useState<boolean>(false);
    const [isEmailValid, setIsEmailValid] = useState<boolean>();
    const [isPasswordValid, setIsPasswordValid] = useState<boolean | undefined>();
    const [isPasswordTouched, setIsPasswordTouched] = useState<boolean | undefined>();

    const handleLogin = async () => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log(user);
        history.push('/punchclock');
        console.log(email, password);
    }

    const validateMatch = (email: string) => {
        return email.match(
            /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-ZåäöÅÄÖ0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-ZåäöÅÄÖ0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-ZåäöÅÄÖ0-9](?:[a-zA-ZåäöÅÄÖ0-9-]{0,61}[a-zA-ZåäöÅÄÖ0-9])?(?:\.[a-zA-ZåäöÅÄÖ0-9](?:[a-zA-ZåäöÅÄÖ0-9-]{0,61}[a-zA-ZåäöÅÄÖ0-9])?)*$/
        );
    };


    const validateEmail = (ev: Event) => {
        const value = (ev.target as HTMLInputElement).value;

        setIsEmailValid(undefined);

        if (value === '') {
            return

        } else {
            validateMatch(value) !== null ? setIsEmailValid(true) : setIsEmailValid(false);
            setEmail(value);
        }

    };

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
    };

    const markPasswordTouched = () => {
        setIsPasswordTouched(true);
    };
    console.log(email, password, auth.name, auth.currentUser);
    return (
        <IonPage>
            <IonContent className="">
                <IonHeader class="w-screen">
                    <IonToolbar>
                        <IonTitle color='primary' className="text-center text-4xl">Get2Work</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <IonCard color='light'>
                                <div className="flex flex-col gap-10">
                                    <IonInput
                                        className={` ${'text-2xl'} ${isEmailValid && 'ion-valid text-2xl'}  ${isEmailValid === false && 'ion-invalid text-2xl'} ${isEmailTouched && 'ion-touched text-2xl'}`}
                                        type="email"
                                        fill="solid"
                                        label="Email"
                                        labelPlacement="floating"
                                        placeholder="Exempel@hotmail.com"
                                        errorText="Skriv en ordentlig email"
                                        onIonInput={(event) => { validateEmail(event) }}
                                        onIonBlur={() => markEmailTouched()}>
                                    </IonInput>
                                    <IonInput
                                        className={` ${'text-2xl'} ${isPasswordValid && 'ion-valid text-2xl'} ${isPasswordValid === false && 'ion-invalid text-2xl'} ${isPasswordTouched && 'ion-touched text-2xl'}`}
                                        label="Lösenord"
                                        labelPlacement="floating"
                                        fill="solid"
                                        type="password"
                                        errorText="För kort lösenord"

                                        minlength={6}
                                        onIonInput={(e) => validatePassword(e)}
                                        onIonBlur={() => markPasswordTouched()}
                                    />
                                    <IonButton type='submit' expand="block" onClick={handleLogin} className="text-2xl" >Logga in
                                        <IonIcon icon={logInOutline} slot='start' />
                                    </IonButton>
                                    <IonButton expand="block" routerLink="/signup" className="text-2xl">Skapa konto
                                        <IonIcon icon={personCircleOutline} slot='start' />
                                    </IonButton>
                                </div>
                            </IonCard>
                        </IonCol>
                    </IonRow>
                </IonGrid>

            </IonContent>
            <IonFooter>
                Beta V.1.0, hej Aylin
            </IonFooter>
        </IonPage>
    );
}

export default Login;