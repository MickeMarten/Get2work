import { IonButton, IonPicker, IonPickerColumn, IonPickerColumnOption, IonText } from "@ionic/react";
import { useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, updateDoc, doc, getDocs } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import firebaseConfig from "../firebaseConfig";
import { useAuth } from '../auth/authContext';
import { serverTimestamp, update } from "firebase/database";
import { IWorkday } from "../models/models";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
function DropDownChange() {


  const [hourValue, setHourValue] = useState<number>(24)
  const [minuteValue, setMinuteValue] = useState<number>(60)
  const { currentUser } = useAuth()
  const [changedHours, setChangedHours] = useState<number>()
  const [changedMinutes, setChangedMinutes] = useState<number>(0)

  const hourValueList = []
  const minuteValueList = []

  for (let i = 0; i < hourValue; i++) {
    hourValueList.push(
      <IonPickerColumnOption value={i} key={i}>{i} Timmar</IonPickerColumnOption>
    )

  }
  for (let i = 0; i < minuteValue; i++) {
    minuteValueList.push(
      <IonPickerColumnOption value={i} key={i} class="">{i} Minuter</IonPickerColumnOption>
    )

  }


  function handleHourPicker(event: CustomEvent,) {
    const time = event.detail.value;
    setChangedHours(time);
    console.log(time)
  };
  function handleMinutePicker(event: CustomEvent,) {
    const time = event.detail.value;
    setChangedMinutes(time);
    console.log(time)
  };

  async function workDataChange() {
    const workDataCollectionRef = collection(db, 'Users', currentUser.uid, 'workData',);
    const querySnapshot = await getDocs(workDataCollectionRef);

    querySnapshot.forEach(async (document) => {
      const docId = document.id
      const workDataRef = doc(db, 'Users', currentUser.uid, 'workData', docId);

      await updateDoc(workDataRef, {
        hoursWorked: changedHours,
        minutesWorked: changedMinutes,
      });
    })


  }
  return (<>
    <IonPicker class=''   >
      <IonPickerColumn onIonChange={handleHourPicker} >
        {hourValueList}
      </IonPickerColumn>
      <IonPickerColumn onIonChange={handleMinutePicker}>
        {minuteValueList}
      </IonPickerColumn>
    </IonPicker>
    <IonButton onClick={workDataChange}>Ok</IonButton>
  </>)

}

export default DropDownChange;