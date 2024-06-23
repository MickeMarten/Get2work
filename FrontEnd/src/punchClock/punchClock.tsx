import '@ionic/react/css/core.css';
import { IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonProgressBar, IonRow, IonSearchbar, IonText, IonToolbar, setupIonicReact } from '@ionic/react';
import { IonApp, IonRouterOutlet, IonCard, IonCardContent } from '@ionic/react';
import { useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, arrayUnion, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { DateTime, Duration } from "luxon";
import { useHistory } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { IonButton, IonDatetime } from '@ionic/react';
import firebaseConfig from '../firebaseConfig';
import { useAuth } from '../auth/authContext';

interface Workday {
    hoursWorked: number,
    minutesWorked: number,
    date: string,
}
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
console.log(auth.name, auth.currentUser)


function PunchClock() {
    const { currentUser } = useAuth()
    const [startWork, setStartWork] = useState(0)
    const [toggleBtn, setToggleBtn] = useState(false)
    const [workData, setWorkData] = useState([])
    const today = DateTime.now().toLocaleString();
    const [workedTime, setWorkedTime] = useState({ hours: 0, minutes: 0 });
    const history = useHistory();

    async function logOut() {
        const auth = getAuth()
        signOut(auth)
        history.push('/start')

    }


    function startBtn() {
        const startTimer = DateTime.now()
        setStartWork(startTimer);
        setToggleBtn(true)
    }

    const stopBtn = async () => {

        const stopWork = DateTime.now();
        const diff = stopWork.diff(startWork, ['hours', 'minutes']);
        const hoursWorked = Math.floor(diff.as('hours'));
        const minutesWorked = Math.floor(diff.as('minutes')) % 60;
        const today = stopWork.toISODate();

        try {
            const userRef = doc(db, 'Users', currentUser.uid);

            await updateDoc(userRef, {
                punchClock: arrayUnion({
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

    };

    useEffect(() => {
        async function getData() {

            const dataList: Workday[] = [];

            const querySnapshot = await getDocs(collection(db, 'Users', currentUser.uid, 'punchClock'));
            querySnapshot.forEach((doc) => {
                dataList.push(doc.data())
            })
            setWorkData(dataList)
            console.log(dataList, 'workdata', workData)

        }
        getData()

    }, [])


    return (
        <IonApp>
            <IonHeader >
                <IonToolbar  >
                    <IonText>Välkommen till jobbet. Idag är det {today}</IonText>
                    <IonButton onClick={startBtn} style={{ display: toggleBtn ? 'none' : '' }}>Börja jobba</IonButton>
                    <IonButton onClick={stopBtn} style={{ display: toggleBtn ? '' : 'none' }}>Sluta jobba</IonButton>
                    <IonButton onClick={logOut}>Logga ut</IonButton>
                    <IonButton onClick={() => { history.push('/todo') }}>Todo</IonButton>

                    <IonSearchbar color="light" placeholder='Sök här' slot=''></IonSearchbar>
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
                                        <IonCardSubtitle>{item.hoursWorked} timmar och  {item.minutesWorked} minuter arbetade</IonCardSubtitle>
                                    </IonCol>

                                </IonCardContent>
                            </IonCard>

                        ))}
                    </IonRow>
                </IonGrid>
            </IonContent>


        </IonApp >


    )
}

export default PunchClock;
