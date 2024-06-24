import '@ionic/react/css/core.css';
import { IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonProgressBar, IonRow, IonSearchbar, IonText, IonToolbar, setupIonicReact } from '@ionic/react';
import { IonApp, IonRouterOutlet, IonCard, IonCardContent } from '@ionic/react';
import { useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, arrayUnion, updateDoc, deleteDoc, deleteField, getDoc } from "firebase/firestore";
import { useState } from "react";
import { DateTime, Duration } from "luxon";
import { useHistory } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { IonButton, IonDatetime } from '@ionic/react';
import firebaseConfig from '../firebaseConfig';
import { useAuth } from '../auth/authContext';


interface IUser {
    createdAt: string,
    email: string,
    name: string,
    punchClock: IWorkday[],
}
interface IWorkday {
    id: string,
    date: string,
    hoursWorked: number,
    minutesWorked: number,

}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
console.log(auth.name, auth.currentUser)


function PunchClock() {
    const { currentUser } = useAuth()
    const [startWork, setStartWork] = useState<number>(0)
    const [toggleBtn, setToggleBtn] = useState<boolean>(false)
    const [workData, setWorkData] = useState<IWorkday[]>([])
    const today = DateTime.now().toLocaleString();
    const [workedTime, setWorkedTime] = useState<{ hours: number, minutes: number }>({ hours: 0, minutes: 0 });
    const history = useHistory();

    async function getData() {
        if (!currentUser) {
            console.error('No current user');
            return;
        }
        const userRef = doc(db, 'Users', currentUser.uid)
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data() as IUser;
        setWorkData(userData.punchClock);
    }


    useEffect(() => {
        if (currentUser) {
            getData();
        }
    }, []);

    async function handleLogout() {
        signOut(auth);
        history.push('/start');
    }

    function handleStartBtn() {
        const startTimer = DateTime.now();
        setStartWork(startTimer);
        setToggleBtn(true);
    }

    const handleStopBtn = async () => {
        const stopWork = DateTime.now();
        const duration = stopWork.diff(startWork);
        const hoursWorked = Math.floor(duration.as('hours'));
        const minutesWorked = Math.floor(duration.as('minutes')) % 60;
        const today = stopWork.toISODate();

        try {
            const userRef = doc(db, 'Users', currentUser.uid);

            await updateDoc(userRef, {
                punchClock: arrayUnion({
                    id: `${Date.now()}`,
                    hoursWorked,
                    minutesWorked,
                    date: today,
                })
            });

            setWorkedTime({ hours: hoursWorked, minutes: minutesWorked });
            setToggleBtn(false);
        } catch (e) {
            console.error("Error adding document: ", e);
        }

        getData();
    };

    async function handleDelete(id: string) {
        try {
            await deleteDoc(doc(db, 'Users', currentUser.uid, 'PunchClock', id));

        } catch (e) {
            console.error("Error deleting document: ", e);
        }
        getData();
    }

    return (
        <IonApp>
            <IonHeader>
                <IonToolbar>
                    <IonText>Välkommen till jobbet. Idag är det {today}</IonText>
                    <IonButton onClick={handleStartBtn} style={{ display: toggleBtn ? 'none' : '' }}>Börja jobba</IonButton>
                    <IonButton onClick={handleStopBtn} style={{ display: toggleBtn ? '' : 'none' }}>Sluta jobba</IonButton>
                    <IonButton onClick={handleLogout}>Logga ut</IonButton>
                    <IonButton onClick={() => { history.push('/todo') }}>Todo</IonButton>
                    <IonSearchbar color="light" placeholder='Sök här'></IonSearchbar>
                </IonToolbar>
                <div>
                    {currentUser ? (
                        <p>Inloggad som: {currentUser.email}</p>
                    ) : (
                        <p>Du är inte inloggad</p>
                    )}
                </div>
            </IonHeader>

            <IonContent>
                <IonGrid>
                    <IonRow>
                        {workData.map((item, index) => (
                            <IonCard key={index}>
                                <IonCardContent>
                                    <IonCol>
                                        <IonCardSubtitle>{item.date}</IonCardSubtitle>
                                    </IonCol>
                                    <IonCol>
                                        <IonCardSubtitle>{item.hoursWorked} timmar och {item.minutesWorked} minuter arbetade</IonCardSubtitle>
                                    </IonCol>
                                    <IonCol>
                                        <IonButton onClick={() => handleDelete(item.id)}>Ta bort</IonButton>
                                    </IonCol>
                                </IonCardContent>
                            </IonCard>
                        ))}
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonApp>
    );
}

export default PunchClock;