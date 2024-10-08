import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuth } from './authContext';

interface PrivateRouteProps extends RouteProps {
    component: React.ComponentType<{ userId?: string }>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
    const { currentUser } = useAuth();

    return (
        <Route
            {...rest}
            render={props =>
                currentUser ? <Component {...props} userId={currentUser.uid} /> : <Redirect to='/' />
            }
        />
    );
}

export default PrivateRoute;