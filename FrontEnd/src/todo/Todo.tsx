
import '@ionic/react/css/core.css';
import { useState, useEffect } from 'react';
import { IonApp, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonList, IonItem, IonLabel, IonIcon, IonText } from '@ionic/react';
import { trashBinOutline } from 'ionicons/icons';
import firebaseConfig from '../firebaseConfig';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, } from "firebase/firestore";
import { useAuth } from '../auth/authContext';
import { useHistory } from "react-router-dom";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function Todo() {
    const [task, setTask] = useState<string>('')
    const [taskList, setTaskList] = useState<[]>([])
    const [taskCount, setTaskCount] = useState<number>(0)
    const [warningText, setWarningText] = useState<string>('')
    const { currentUser } = useAuth();
    const history = useHistory()

    function handleSetTask(event: CustomEvent) {
        const taskItem = event.detail.value;
        setTask(taskItem)

    }
    useEffect(() => {
        console.log(task)

    }, [handleSetTask]);

    async function getTasks() {


    }

    async function addTask() {
        if (task === '') {
            setWarningText('Du måste skriva något hallå.');
            setTimeout(() => {
                setWarningText('');
            }, 2000);
            return;
        } else {

            const punchClockRef = collection(db, 'Users', currentUser.uid, 'Todo');
            const punchClockEntry = await addDoc(punchClockRef, {
                todo: task
            })
        }



    }

    // function deleteTask(id) {



    // }

    return (
        <IonContent>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Todo</IonTitle>
                    <div>
                        {currentUser ? (
                            <p>Inloggad som: {currentUser.email}</p>
                        ) : (
                            <p>Du är inte inloggad</p>

                        )}
                    </div>
                    <IonButton onClick={() => { history.push('/punchclock') }}>PunchClock</IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonInput placeholder='Uppgift' onIonChange={handleSetTask}></IonInput>
                <IonButton onClick={() => addTask}>Lägg till</IonButton>
                <IonLabel>{warningText}</IonLabel>
                <IonList>
                    {taskList.map((item, index) => (
                        <IonItem key={index}>
                            <IonLabel>
                                {item.task}

                            </IonLabel>
                            <IonIcon
                                onClick={() => deleteTask(item.id)}
                                icon={trashBinOutline}
                                slot="end"
                            />


                        </IonItem>
                    ))}
                </IonList>
                <IonLabel> Uppgifter utförda: {taskCount}</IonLabel>
            </IonContent>

        </IonContent>

    )
}

export default Todo;