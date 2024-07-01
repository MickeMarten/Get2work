import { IonButton, IonPicker, IonPickerColumn, IonPickerColumnOption } from "@ionic/react";
import { useState } from "react";
import { collection, updateDoc, doc, getDocs } from "firebase/firestore";


function DropDownChange({ currentUser, dbRef, getWorkData }: { currentUser: any, dbRef: any, getWorkData: any }) {


  // const { currentUser } = useAuth()
  const [changedHours, setChangedHours] = useState<number>()
  const [changedMinutes, setChangedMinutes] = useState<number>(0)

  const hourValueList = []
  const minuteValueList = []

  for (let i = 0; i < 24; i++) {
    hourValueList.push(
      <IonPickerColumnOption value={i} key={i}>{i} Timmar</IonPickerColumnOption>
    )

  }
  for (let i = 0; i < 60; i++) {
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

  async function handleWorkDataChange() {
    const workDataCollectionRef = collection(dbRef, 'Users', currentUser.uid, 'workData',);
    const querySnapshot = await getDocs(workDataCollectionRef);

    querySnapshot.forEach(async (document) => {
      const docId = document.id
      const workDataRef = doc(dbRef, 'Users', currentUser.uid, 'workData', docId);

      await updateDoc(workDataRef, {
        hoursWorked: changedHours,
        minutesWorked: changedMinutes,
      });
    })
    getWorkData()

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
    <IonButton onClick={handleWorkDataChange}>Ok</IonButton>
  </>)

}

export default DropDownChange;