// import React, { useState } from 'react';
// import { auth } from '../firebase'; // Adjust import based on your project structure
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation


// const AuthForm = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isLogin, setIsLogin] = useState(true); // State to toggle between login and signup
//   const navigate = useNavigate(); // Initialize useNavigate for navigation

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (isLogin) {
//         // Login existing user
//         const userCredential = await signInWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;
//         console.log('Login successful:', user.uid);
//         // Redirect to main page after login
//         navigate('/main');
//       } else {
//         // Signup new user
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;
//         console.log('Signup successful:', user.uid);
//         // Redirect to main page after signup
//         navigate('/main');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setError(error.message); // Display error to the user
//     }
//   };

//   return (
//     <div>
//       <h2>{isLogin ? 'Login' : 'Signup'}</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//         />
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//         <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
//       </form>
//       <p>
//         {isLogin ? "Don't have an account? " : 'Already have an account? '}
//         <button onClick={() => setIsLogin(!isLogin)}>
//           {isLogin ? 'Signup' : 'Login'}
//         </button>
//       </p>
//     </div>
//   );
// };

// export default AuthForm;


import React, { useState } from 'react';
import { auth, firestore } from '../firebase'; // Adjust import based on your project structure
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import '../components/Auth.css'

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and signup
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const handleAuthentication = async (email, password, isLogin) => {
    try {
      let userCredential;
      if (isLogin) {
        // Login existing user
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Signup new user
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Create user document in Firestore
        const user = userCredential.user;
        const userRef = doc(firestore, 'users', user.uid);
        await setDoc(userRef, {
          displayName: user.displayName || email,
          email: user.email,
          streak: 0,
          correctCount : 0
          // Initialize streak or any other default fields
        });
      }
      const user = userCredential.user;
      console.log(isLogin ? 'Login successful:' : 'Signup successful:', user.uid);
      // Redirect to main page after login/signup
      navigate('/main');
    } catch (error) {
      console.error('Error:', error);
      setError(error.message); // Display error to the user
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAuthentication(email, password, isLogin);
  };

  return (
    <div  className='auth-container'>
      <h2>{isLogin ? 'Login' : 'Signup'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
      </form>
      <p>
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Signup' : 'Login'}
        </button>
      </p>
    </div>
  //   <div className='auth-container'>
  //   <h2>{isLogin ? 'Login' : 'Signup'}</h2>
  //   <form onSubmit={handleSubmit}>
  //     <input
  //       type="text"
  //       value={email}
  //       onChange={(e) => setEmail(e.target.value)}
  //       placeholder="Email"
  //     />
  //     <input
  //       type="password"
  //       value={password}
  //       onChange={(e) => setPassword(e.target.value)}
  //       placeholder="Password"
  //     />
  //     {error && <p style={{ color: 'red' }}>{error}</p>}
  //     <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
  //   </form>
  //   <p>
  //     {isLogin ? "Don't have an account? " : 'Already have an account? '}
  //     <button onClick={() => setIsLogin(!isLogin)}>
  //       {isLogin ? 'Signup' : 'Login'}
  //     </button>
  //   </p>
  // </div>
  );
};

export default AuthForm;
