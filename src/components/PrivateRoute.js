import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthState from '../hooks/useAuthState';

const PrivateRoute = ({ element: Element, ...rest }) => {
  const { user, loading } = useAuthState();

  if (loading) return <p>Loading...</p>;

  return user ? <Element {...rest} /> : <Navigate to="/" />;
};

export default PrivateRoute;