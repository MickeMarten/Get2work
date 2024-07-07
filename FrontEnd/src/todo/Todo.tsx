
import '@ionic/react/css/core.css';
import { useState, useEffect } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonList, IonItem, IonLabel, IonIcon, IonPage, IonBackButton, IonChip, IonButtons } from '@ionic/react';
import { trashBinOutline } from 'ionicons/icons';
import firebaseConfig from '../firebaseConfig';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";
import { useAuth } from '../auth/authContext';
import { useHistory } from "react-router-dom";
import { ITodo } from '../models/models';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
function Todo() {
    const [task, setTask] = useState<string>('')
    const [taskList, setTaskList] = useState<ITodo[]>([])
    const [taskCount, setTaskCount] = useState<number>(0)
    const [warningText, setWarningText] = useState<string>('')
    const { currentUser } = useAuth();
    const history = useHistory()

    function handleSetTask(event: Event) {
        const value = (event.target as HTMLInputElement).value
        setTask(value)

    }

    async function getTasks(): Promise<void> {
        const dbTodoRef = collection(db, 'Users', currentUser.uid, 'Todo')

        const todoDataSnapshot = await getDocs(dbTodoRef)
        const todoData = todoDataSnapshot.docs.map(doc => {

            const data = doc.data()
            return {
                todo: data.todo,
                id: doc.id,
                date: Date.now()
            }
        })

        setTaskList(todoData)
        console.log(todoData, taskList)
    }

    useEffect(() => {
        getTasks()
    }, [])


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
                todo: task,
            })
            setTask('');
            getTasks();
        }



    }

    async function deleteTask(id: string) {
        try {
            await deleteDoc(doc(db, 'Users', currentUser.uid, 'Todo', id));

        } catch (e) {
            console.error("Error deleting document: ", e);
        }
        getTasks();
    }

    return (
        <IonPage>
            <IonContent>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons>
                            <IonBackButton defaultHref='/punchclock'></IonBackButton>
                        </IonButtons>
                        <IonTitle>Todo</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonInput className='' placeholder='Uppgift' onIonInput={handleSetTask}></IonInput>
                    <IonButton onClick={addTask}>Lägg till</IonButton>
                    <IonLabel>{warningText}</IonLabel>
                    <IonList>
                        {taskList.map((item) => (
                            <IonItem key={item.id}>
                                <IonLabel>
                                    {item.todo}

                                </IonLabel>
                                {<IonIcon
                                    onClick={() => deleteTask(item.id)}
                                    icon={trashBinOutline}
                                    slot="end"
                                />}


                            </IonItem>
                        ))}
                    </IonList>
                    <IonLabel> Uppgifter utförda: {taskCount}</IonLabel>
                </IonContent>

            </IonContent>
        </IonPage>

    )
}

export default Todo;