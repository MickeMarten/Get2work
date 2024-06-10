import '@ionic/react/css/core.css';
import { IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonProgressBar, IonRow, IonSearchbar, IonText, IonToolbar, setupIonicReact } from '@ionic/react';
import { IonApp, IonRouterOutlet, IonCard, IonCardContent } from '@ionic/react';
import { useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc } from "firebase/firestore";
import { useState } from "react";
import { DateTime, Duration } from "luxon";
import './App.css'
setupIonicReact();
import { IonButton, IonDatetime } from '@ionic/react';

interface Workday {
  workHours: number,
  workSeconds: number,
  date: string,
}

const firebaseConfig = {
  apiKey: "AIzaSyB7GnC4ffCPkTW7kGhedZMAX5_LSnvoUpk",
  authDomain: "punch-clock-cd580.firebaseapp.com",
  databaseURL: "https://punch-clock-cd580-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "punch-clock-cd580",
  storageBucket: "punch-clock-cd580.appspot.com",
  messagingSenderId: "392166204571",
  appId: "1:392166204571:web:b4f05b0a4fbe9c1782123e",
  measurementId: "G-ELMWFN42X1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);





function Page() {
  const [startWork, setStartWork] = useState(0)
  const [toggleBtn, setToggleBtn] = useState(false)
  const [workData, setWorkData] = useState([])
  const today = DateTime.now().toLocaleString();




  function startBtn() {
    const startTimer = DateTime.now().second
    setStartWork(startTimer);
    setToggleBtn(true)


  }

  function stopBtn() {
    const stopWork = DateTime.now().second;
    const workTime = Duration.
    const hoursWorked = workTime.minus(stopWork)


    setToggleBtn(false);

    const docRef = addDoc(collection(db, 'clockIn'), {

      workHours: hoursWorked,
      date: today
    });

  }

  useEffect(() => {
    async function getData() {
      const dataList: Workday[] = []

      const querySnapshot = await getDocs(collection(db, 'clockIn'));
      querySnapshot.forEach((doc) => {
        dataList.push(doc.data())
      })
      setWorkData(dataList)

    }
    getData()

  }, [])


  return (
    <IonApp>
      <IonHeader>
        <IonToolbar >
          <IonText>Välkommen till jobbet. Idag är det {today}</IonText>
          <IonInput label='Namn' placeholder='Ditt namn här idiot'></IonInput>
          <IonButton onClick={startBtn} style={{ display: toggleBtn ? 'none' : '' }}>Börja jobba</IonButton>
          <IonButton onClick={stopBtn} style={{ display: toggleBtn ? '' : 'none' }}>Sluta jobba</IonButton>

          <IonSearchbar color="light" placeholder='Sök här' slot=''></IonSearchbar>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid>
          <IonRow>

            {workData.map((item) => (
              <IonCard>
                <IonCardContent>
                  <IonCol>
                    <IonCardSubtitle>{item.date}</IonCardSubtitle>
                  </IonCol>
                  <IonCol>
                    <IonCardSubtitle>{item.workHours} timmar och  {item.workSeconds} minuter arbetade</IonCardSubtitle>
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

export default Page
