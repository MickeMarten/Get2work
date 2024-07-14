import PunchClock from './punchClock/punchClock';
import Todo from './todo/Todo';
import SignUp from './signup/signUp';
import Login from './login/login';
import { IonReactRouter } from '@ionic/react-router';
import { setupIonicReact, IonRouterOutlet, IonApp } from '@ionic/react';
import '@ionic/react/css/core.css';
import { Route, Redirect } from 'react-router-dom';
import './index.css';
import { AuthProvider, useAuth } from './auth/authContext';
import PrivateRoute from './auth/privateRoute';
//gittestAsd
setupIonicReact();

function App() {
  return (
    <IonApp>
      <AuthProvider>
        <IonReactRouter>
          <AuthHandler />
        </IonReactRouter>
      </AuthProvider>
    </IonApp>
  );
}

function AuthHandler() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <IonRouterOutlet>
      <Route exact path="/">
        {currentUser ? <Redirect to="/punchclock" /> : <Login />}
      </Route>
      <Route path="/signup" component={SignUp} />
      <PrivateRoute path="/punchclock" component={PunchClock} />
      <PrivateRoute path="/todo" component={Todo} />
    </IonRouterOutlet>
  );
}

export default App;