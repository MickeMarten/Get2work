import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

const firebaseConfig = {
     apiKey: 'AIzaSyB7GnC4ffCPkTW7kGhedZMAX5_LSnvoUpk',
     authDomain: 'punch-clock-cd580.firebaseapp.com',
     databaseURL: 'https://punch-clock-cd580-default-rtdb.europe-west1.firebasedatabase.app',
     projectId: 'punch-clock-cd580',
     storageBucket: 'punch-clock-cd580.appspot.com',
     messagingSenderId: '392166204571',
     appId: '1:392166204571:web:b4f05b0a4fbe9c1782123e',
     measurementId: 'G-ELMWFN42X1',
};

if (!firebase.apps.length) {
     firebase.initializeApp(firebaseConfig);
}

export default firebaseConfig;
