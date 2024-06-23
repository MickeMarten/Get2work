import 'firebase/compat/database';
import PunchClock from './punchClock/punchClock';
import Todo from './todo/Todo';
import SignUp from './signup/signUp';
import Login from './login/login';
import { IonReactRouter } from '@ionic/react-router';
import { setupIonicReact, IonRouterOutlet, IonApp } from '@ionic/react';
import '@ionic/react/css/core.css';
import { Route, Redirect } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './auth/authContext';
import PrivateRoute from './auth/privateRoute';
setupIonicReact();

function App() {
  return (
    <IonApp>
      <AuthProvider>
        <IonReactRouter>
          <IonRouterOutlet>
            <PrivateRoute path="/punchclock" component={PunchClock} />
            <PrivateRoute path="/todo" component={Todo} />
            <Route path='/signup' component={SignUp} />
            <Route path='/start' component={Login} />
            <Redirect exact from='/' to='/start' />
          </IonRouterOutlet>
        </IonReactRouter>
      </AuthProvider>
    </IonApp>
  );
}

export default App;