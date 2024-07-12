
import '@ionic/react/css/core.css';
import { useState, useEffect } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonList, IonItem, IonLabel, IonIcon, IonPage, IonBackButton, IonButtons } from '@ionic/react';
import { trashBinOutline } from 'ionicons/icons';
import firebaseConfig from '../firebaseConfig';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useAuth } from '../auth/authContext';
import { useHistory } from "react-router-dom";
import { ITodo } from '../models/models';
import { getAuth, signOut } from "firebase/auth";
import { update } from 'firebase/database';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
function Todo() {
    const [task, setTask] = useState<string>('')
    const [taskList, setTaskList] = useState<ITodo[]>([])
    const [taskCount, setTaskCount] = useState<number>(0)
    const [warningText, setWarningText] = useState<string>('')
    const { currentUser } = useAuth();
    const history = useHistory()


    function handleLogout() {
        signOut(auth);
        history.push('/');
    }

    function handleSetTask(event: Event) {
        const value = (event.target as HTMLInputElement).value
        setTask(value)

    }

    async function getTasks(): Promise<void> {
        if (!currentUser)
            return;

        const dbTodoRef = collection(db, 'Users', currentUser.uid, 'Todo')

        const todoDataSnapshot = await getDocs(dbTodoRef)
        const todoData = todoDataSnapshot.docs.map(doc => {

            const data = doc.data()
            console.log(data);

            return {
                todo: data.todo,
                id: doc.id,
                date: Date.now(),
                taskComplete: data.taskComplete,
            }
        })

        setTaskList(todoData)
        const completedData = todoData.filter((todo) => todo.taskComplete === true).length;
        setTaskCount(completedData);

        console.log(taskList)
    }

    useEffect(() => {
        getTasks()
    }, [])


    async function addTask() {
        if (!currentUser)
            return;
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
                taskComplete: false,
            })

            getTasks();
        }



    }

    async function deleteTask(id: string) {
        if (!currentUser)
            return;
        try {
            await deleteDoc(doc(db, 'Users', currentUser.uid, 'Todo', id));

        } catch (e) {
            console.error("Error deleting document: ", e);
        }
        getTasks();
    }

    async function handleCompleteTask(task: ITodo) {

        if (!currentUser) {
            return;
        }
        console.log('handlecomplete');
        const dbTaskRef = doc(db, 'Users', currentUser.uid, 'Todo', task.id)
        await updateDoc(dbTaskRef, {
            taskComplete: !task.taskComplete
        })
        const temp = [...taskList]
        const todoToChange = temp.find((tempTask) => tempTask.id === task.id)
        if (!todoToChange) return;
        todoToChange.taskComplete = !todoToChange?.taskComplete
        setTaskList(temp)
        const completedTaskCount = temp.filter((task) => task.taskComplete === true).length
        setTaskCount(completedTaskCount)

    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons>
                        <IonBackButton defaultHref='/punchclock'></IonBackButton>
                    </IonButtons>
                    <IonTitle>Todo</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div className='flex flex-col gap-10'>
                    <IonInput
                        className=''
                        type="text"
                        fill="solid"
                        label="Skriv en uppgift"
                        labelPlacement="floating"
                        placeholder="Skriv en uppgift"
                        errorText={warningText}
                        onIonInput={handleSetTask}
                    >
                    </IonInput>
                    <IonButton onClick={addTask}>Lägg till</IonButton>
                    <IonLabel color='warning'>{warningText}</IonLabel>
                    <IonList>
                        {taskList.map((task) => (
                            <IonItem key={task.id}>
                                <IonLabel onClick={() => handleCompleteTask(task)}>
                                    <div className={task.taskComplete ? 'line-through' : ''}>
                                        {task.todo}
                                    </div>

                                </IonLabel>
                                {<IonIcon
                                    onClick={() => deleteTask(task.id)}
                                    icon={trashBinOutline}
                                    slot="end"
                                />}


                            </IonItem>
                        ))}
                    </IonList>
                    <IonLabel> Uppgifter utförda: {taskCount}</IonLabel>
                </div>
            </IonContent>
            <IonToolbar color='secondary'>
                <IonButton color='success' className='w-32' slot='start' onClick={handleLogout}>Logga ut</IonButton>
            </IonToolbar>
        </IonPage>

    )
}

export default Todo;