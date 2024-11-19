// import { useEffect, useState } from 'react';
// import { auth } from '../firebase'; // Adjust import based on your project structure

// const useAuthState = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(user => {
//       setUser(user);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   return { user, loading };
// };

// export default useAuthState;


// src/hooks/useAuthState.js
import { useEffect, useState } from 'react';
import { auth } from '../firebase';

const useAuthState = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};

export default useAuthState;
