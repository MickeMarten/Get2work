import '@ionic/react/css/core.css';
import { IonCardSubtitle, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonPage, IonRow, IonText, IonToolbar } from '@ionic/react';
import { IonCard, IonCardContent } from '@ionic/react';
import { HtmlHTMLAttributes, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { DateTime } from "luxon";
import { useHistory } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { IonButton } from '@ionic/react';
import firebaseConfig from '../firebaseConfig';
import { useAuth } from '../auth/authContext';
import DropDownChange from '../Components/DropdownChange';
import { IUser, IWorkday } from '../models/models';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
console.log(auth.name, auth.currentUser);

function PunchClock() {
    const { currentUser } = useAuth();
    const [userInfo, setUserInfo] = useState<IUser | undefined>(undefined);
    const [startWork, setStartWork] = useState<DateTime | null>(null);
    const [toggleBtn, setToggleBtn] = useState<boolean>(false);
    const [toggleChangeBtn, setToggleChangeBtn] = useState({});
    const [workData, setWorkData] = useState<IWorkday[]>([]);
    const today = DateTime.now().toLocaleString();
    const [workedTime, setWorkedTime] = useState<{ hours: number, minutes: number }>({ hours: 0, minutes: 0 });
    const history = useHistory();
    console.log(currentUser)

    const handleToggleChangeBtn = (id: string) => {
        setToggleChangeBtn((prev) => ({ ...prev, [id]: !prev[id] }))
    }

    async function getUserInfo() {
        if (currentUser) {
            const userRef = doc(db, 'Users', currentUser.uid);
            const userDoc = await getDoc(userRef);
            const userData = userDoc.data() as IUser;
            setUserInfo(userData);
        }
    }

    async function getWorkData() {
        if (currentUser) {
            const workDataRef = collection(db, 'Users', currentUser.uid, 'workData');
            const workDataSnaphot = await getDocs(workDataRef);
            const workDataList: IWorkday[] = workDataSnaphot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    date: data.date,
                    hoursWorked: data.hoursWorked,
                    minutesWorked: data.minutesWorked,
                };
            });
            console.log(workDataList);
            setWorkData(workDataList);
        }
    }

    useEffect(() => {
        if (currentUser) {
            getWorkData();
            getUserInfo();
        }
    }, []);

    function handleLogout() {
        signOut(auth);
        history.push('/');
    }

    function handleStartBtn() {
        const startTimer = DateTime.now();
        setStartWork(startTimer);
        setToggleBtn(true);
    }

    const handleStopBtn = async () => {
        if (!startWork) {
            console.log('tiden startades inte');
        } else {
            const stopWork = DateTime.now();
            const duration = stopWork.diff(startWork);
            const hoursWorked = Math.floor(duration.as('hours'));
            const minutesWorked = Math.floor(duration.as('minutes')) % 60;
            const today = stopWork.toISODate();

            try {
                const punchClockRef = collection(db, 'Users', currentUser.uid, 'workData');
                await addDoc(punchClockRef, {
                    date: today,
                    hoursWorked: hoursWorked,
                    minutesWorked: minutesWorked,
                });

                setWorkedTime({ hours: hoursWorked, minutes: minutesWorked });
                setToggleBtn(false);
            } catch (e) {
                console.error("Error adding document: ", e);
            }

            getWorkData();
        }
    };

    async function handleDelete(id: string) {
        try {
            await deleteDoc(doc(db, 'Users', currentUser.uid, 'workData', id));
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
        getWorkData();
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color='secondary' >
                    <div className='flex flex-col p-3 text-center'>
                        <IonText>Välkommen till jobbet {userInfo?.name}.</IonText>
                        <IonText>Idag är det {today}.</IonText>
                        <IonButton color='success' onClick={handleStartBtn} style={{ display: toggleBtn ? 'none' : '' }}>Börja jobba</IonButton>
                        <IonButton color='danger' onClick={handleStopBtn} style={{ display: toggleBtn ? '' : 'none' }}>Sluta jobba</IonButton>

                    </div>
                </IonToolbar>
            </IonHeader>

            <IonContent color='tertiary'>
                <IonGrid className=''>
                    <IonRow>
                        {workData.map((item) => (
                            <IonCard key={item.id} >
                                <IonCardContent className=''>
                                    <IonCol>
                                        <IonCardSubtitle>{item.date}</IonCardSubtitle>
                                    </IonCol>
                                    <IonCol>
                                        <IonCardSubtitle>{item.hoursWorked} timmar och {item.minutesWorked} minuter arbetade</IonCardSubtitle>
                                    </IonCol>
                                    <IonCol>
                                        <IonButton expand="block" onClick={() => handleDelete(item.id)}>Ta bort</IonButton>
                                        <IonButton expand="block" className='mt-10' onClick={() => { handleToggleChangeBtn(item.id) }}>{toggleChangeBtn[item.id] ? 'Ångra' : 'Ändra'}</IonButton>
                                        <div className={toggleChangeBtn[item.id] ? '' : 'hidden'}>
                                            <DropDownChange currentUser={currentUser} dbRef={db} getWorkData={getWorkData} workDataId={item.id}></DropDownChange>
                                        </div>
                                    </IonCol>
                                </IonCardContent>
                            </IonCard>
                        ))}
                    </IonRow>
                </IonGrid>
            </IonContent>
            <IonFooter>
                <IonToolbar color='secondary'>
                    <IonButton color='success' className='w-32' slot='start' onClick={handleLogout}>Logga ut</IonButton>
                    <IonButton color='success' className='w-32' slot='end' onClick={() => { history.push('/todo') }}>Todo</IonButton>
                </IonToolbar>

            </IonFooter>
        </IonPage>
    );
}

export default PunchClock;