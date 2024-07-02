
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

    function handleSetTask(event: any) {
        const taskItem = event.target.value;
        setTask(taskItem)
        console.log('hallå', taskItem)

    }

    async function getTasks() {
        const dbTodoRef = collection(db, 'Users', currentUser.uid, 'Todo')
        const todoDataSnapshot = await getDocs(dbTodoRef)
        const todoData = todoDataSnapshot.docs.map(doc => {
            const data = doc.data()
            return {
                todo: data.todo,
                id: doc.id
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
                <input className='' placeholder='Uppgift' onChange={handleSetTask} />
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

    )
}

export default Todo;