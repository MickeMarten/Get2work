
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
import { DateTime } from "luxon";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
function Todo() {
    const [task, setTask] = useState<string>('')
    const [taskList, setTaskList] = useState<ITodo[]>([])
    let [taskCount, setTaskCount] = useState<number>(0)
    const [warningText, setWarningText] = useState<string>('')
    const { currentUser } = useAuth();
    const history = useHistory()
    const today = DateTime.now().toLocaleString();



    function handleLogout() {
        signOut(auth);
        history.push('/');
    }

    function handleSetTask(event: Event) {
        const value = (event.target as HTMLInputElement).value
        setTask(value)

    }

    async function addTask() {
        if (!currentUser)
            return;
        if (task === '') {
            setWarningText('Du måste skriva något hallå.');
            setTimeout(() => {
                setWarningText('');
            }, 2000);
        } else {
            const punchClockRef = collection(db, 'Users', currentUser.uid, 'Todo');
            const punchClockEntry = await addDoc(punchClockRef, {
                todo: task,
                date: DateTime.now().toLocaleString(),
                taskCompleted: false,

            })
            getTasks();
        }



    }

    async function getTasks(): Promise<void> {
        if (!currentUser)
            return;

        const dbTodoRef = collection(db, 'Users', currentUser.uid, 'Todo')

        const todoDataSnapshot = await getDocs(dbTodoRef)
        const todoData = todoDataSnapshot.docs.map<ITodo>(doc => {

            const data = doc.data()
            return {
                todo: data.todo,
                date: data.date,
                id: doc.id,
                taskCompleted: data.taskCompleted,

            }
        })

        const completedData = todoData.filter((completed) => completed.taskCompleted === true).length
        setTaskCount(completedData);
        setTaskList(todoData)
    }

    useEffect(() => {

        getTasks()
    }, [])



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
        if (!currentUser)
            return;
        const dbTodoRef = doc(db, 'Users', currentUser.uid, 'Todo', task.id);
        await updateDoc(dbTodoRef, {
            taskCompleted: !task.taskCompleted
        });
        const tempList = [...taskList]
        const todoToChange = tempList.find((tempTask) => tempTask.id === task.id)
        if (!todoToChange) return;
        todoToChange.taskCompleted = !todoToChange?.taskCompleted;
        setTaskList(tempList)
        const completedTaskCount = tempList.filter((task) => task.taskCompleted === true).length;
        setTaskCount(completedTaskCount);


    }


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color='secondary'>
                    <IonButtons>
                        <IonBackButton defaultHref='/punchclock'></IonBackButton>
                    </IonButtons>
                    <IonTitle className='text-center mb-3'>Todo {today}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent color=''>
                <div className='flex flex-col mt-4 gap-5'>
                    <IonInput
                        className=' w-52 ml-2 text-xl'
                        type="text"
                        fill="outline"
                        label="Skriv en uppgift"
                        labelPlacement="floating"
                        placeholder="Kasta soppor"
                        errorText={warningText}
                        clearOnEdit={true}
                        autocorrect='on'
                        onIonInput={(e) => handleSetTask(e)}
                    >
                    </IonInput>
                    <IonButton onClick={() => addTask()}>Lägg till</IonButton>
                    <IonLabel className='text-center animate-pulse text-red-400'>{warningText}</IonLabel>
                    <IonList>
                        {taskList.map((task) => (
                            <IonItem key={task.id}>
                                <IonLabel onClick={() => handleCompleteTask(task)}>
                                    <div className={task.taskCompleted ? 'line-through' : ' animate-pulse'}>
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
                    <IonLabel className='ml-2'> Uppgifter utförda: {taskCount}</IonLabel>
                </div>
            </IonContent>
            <IonToolbar color='secondary'>
                <IonButton color='success' className='w-32' slot='start' onClick={handleLogout}>Logga ut</IonButton>
            </IonToolbar>
        </IonPage>

    )
}

export default Todo;