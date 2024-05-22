import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import './App.css'

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

// const docRef = await addDoc(collection(db, 'Timestamps'), {
  
// })

function Page() {
let time:String = new Date().toLocaleTimeString()
let date:String = new Date().toLocaleDateString()
const [realTime, setRealTime] = useState(time)

const updateTime = () =>{
  time = new Date().toLocaleTimeString();
  setRealTime(time);
}
setInterval(updateTime);

// async function startWork() {
//   try {
//   const docRef = await addDoc(collection(db, "clockIn"), {
//     date: date,
//     time: time
//   });

//   console.log("Document written with ID: ", docRef.id);
// } catch (e) {
//   console.error("Error adding document: ", e);
// }
// }

  return (
    <main> 
<h1 className=''>Dags att stämpla in</h1>
<p>Idag är det {date} klockan {realTime}</p>

<div className="max-w-36 bg-red-500"> 
<div className="border border-black text-center" onClick={async function startWork() {
  try {
  const docRef = await addDoc(collection(db, "clockIn"), {
    date: date,
    time: time
  });

  console.log("Document written with ID: ", docRef.id);
} catch (e) {
  console.error("Error adding document: ", e);
}
}}>
  börja jobba
</div>
</div>

</main>
  )
}

export default Page
