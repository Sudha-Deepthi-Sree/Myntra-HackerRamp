// // src/components/MainPage.js
// import React from 'react';

// const MainPage = () => {
//   return (
//     <div>
//       <h1>Welcome to the Quiz!</h1>
//       <button onClick={() => window.location.href = '/quiz'}>Click here to participate in today's quiz</button>
//     </div>
//   );
// };

// export default MainPage;

// src/components/MainPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore, auth } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import useAuthState from '../hooks/useAuthState'; 
import Header from './Header';
import Footer from './Footer';
import Banner from './Banner';
import Categories from './Categories';
import './MainPage.css'
import quiz from '../assets/quizImage.png';
import fire from '../assets/fire2.jpeg';
import medal from '../assets/medal.png';



const MainPage = () => {
  const navigate = useNavigate();
  const [quizAttemptedToday, setQuizAttemptedToday] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = useAuthState();
  useEffect(() => {
    checkQuizAttempt();
  }, []);


 

  const checkQuizAttempt = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        const quizAttemptsRef = collection(firestore, 'quizAttempts');
        const q = query(
          quizAttemptsRef,
          where('userId', '==', userId),
          where('date', '>=', startOfDay),
          where('date', '<', endOfDay)
        );
      
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot);
        if (querySnapshot.size > 0) {
          setQuizAttemptedToday(true); // User has already attempted the quiz today
          console.log('User has already attempted the quiz today.');
        }
      } else {
        console.log('User not authenticated.');
      }
    } catch (error) {
      console.error('Error checking quiz attempt:', error);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    navigate('/quiz');
  };

  if (loading) {
    return <p>Loading...</p>;
  }



  return (
    <div>
         <Header />
        
         <div className='quiz'>
          <div className='card'>
          <img src={quiz} className='img'/>
        <button  className='btn' onClick={startQuiz}>Click here to participate in today's quiz</button>
        </div>
        <div className='card'>
        <img src={medal} className='img'/>
      <button  className='btn' onClick={() => navigate('/leaderboard')}>View Leaderboard</button>
      </div>
      </div>
      <Categories />
            <Banner />
           
            <Footer />
    </div>
    
  );
};

export default MainPage;
