// import React, { useState, useEffect } from 'react';
// import { firestore } from '../firebase';
// import { collection, getDocs } from 'firebase/firestore';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

// const Quiz = () => {
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [answers, setAnswers] = useState([]);
//   const [time, setTime] = useState(15);
//   const [quizCompleted, setQuizCompleted] = useState(false);
//   const navigate = useNavigate(); // Initialize useNavigate hook for navigation

//   useEffect(() => {
//     console.log('Fetching questions...');
//     const fetchQuestions = async () => {
//       try {
//         const questionsRef = collection(firestore, 'questions');
//         const snapshot = await getDocs(questionsRef);
//         const questionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         console.log('Fetched questions:', questionsData);
//         setQuestions(questionsData);
//       } catch (error) {
//         console.error('Error fetching questions:', error);
//       }
//     };
//     fetchQuestions();
//   }, []);

//   useEffect(() => {
//     if (time > 0) {
//       const timer = setTimeout(() => setTime(time - 1), 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [time]);

//   const handleAnswer = (answer) => {
//     setAnswers([...answers, answer]);
//     if (currentQuestion < questions.length - 1) {
//       setCurrentQuestion(currentQuestion + 1);
//       setTime(15);
//     } else {
//       setQuizCompleted(true);
//       const answersRef = collection(firestore, 'answers');
//       getDocs(answersRef)
//         .then(() => {
//           console.log('Answers stored successfully!');
//         })
//         .catch(error => {
//           console.error('Error storing answers:', error);
//         });
//     }
//   };

  // const handleLeader = () => {
  //   navigate('/leaderboard'); // Navigate to the streak page using navigate function
  // };

//   return (
//     <div>
//       {questions.length > 0 && !quizCompleted && (
//         <div>
//           <h2>{questions[currentQuestion].question}</h2>
//           {questions[currentQuestion].options.map((option, index) => (
//             <button key={index} onClick={() => handleAnswer(option)}>{option}</button>
//           ))}
//           <p>Time left: {time}s</p>
//         </div>
//       )}
//       {quizCompleted && (
//         <div>
//           <p>Check the leaderboard positions tomorrow!</p>
//           <button onClick={navigateToStreakPage}>Go to Streak Page</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Quiz;



//this code is working till showing leaderboard but not according to the score.
import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, getDocs, doc, setDoc, getDoc, Timestamp, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import useAuthState from '../hooks/useAuthState'; // Adjust import path as needed
import Header from './Header';
import Footer from './Footer';
import m3 from '../assets/m3.png';
import bannerImage from '../assets/myntra1.jpg'; 
import './Quiz.css';
import shopping from '../assets/shopping.jpeg'
import tick from '../assets/quizdone.jpeg'
import correct from '../assets/score.jpeg'
import timer from '../assets/timer.png'
import mquiz from '../assets/mquiz.png'
import fire2 from '../assets/fire2.jpeg'
import l1 from '../assets/l1.jpeg'
import gc1 from '../assets/gc1.jpeg'

const Quiz = () => {
  const { user, loading } = useAuthState(); // Use the custom useAuthState hook
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [time, setTime] = useState(15);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userAttemptedQuiz, setUserAttemptedQuiz] = useState(false);
  const [streak, setStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const navigate = useNavigate();
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionsRef = collection(firestore, 'questions');
        const snapshot = await getDocs(questionsRef);
        
        const questionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuestions(questionsData);
        setCorrectAnswers(questionsData.map(q => q.correctAnswer));
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    const checkQuizAttempt = async () => {
      if (user) {
        const today = new Date();
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        console.log(userDocSnap.data())
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
           const lastQuizDate = userData.lastQuizDate ? userData.lastQuizDate.toDate() : null;
          setStreak(userData.streak);
          setCorrectCount(userData.correctCount)
    
          if (lastQuizDate && isSameDay(lastQuizDate, today)) {
            setUserAttemptedQuiz(true);

             // Fetch correct answer count from answers collection
             const answersRef = collection(firestore, 'answers');
             const userAnswersDoc = await getDoc(doc(answersRef, user.uid));
             if (userAnswersDoc.exists()) {
               const answersData = userAnswersDoc.data();
             }
          }
        }
      }
    };

    checkQuizAttempt();
  }, [user]);

  // let counter  = 0;
  // useEffect(() => {
 
  //   if (time > 0) {
  //     const timer = setTimeout(() => setTime(time - 1), 1000);
  //     return () => clearTimeout(timer);
  //     counter = counter +  1;
  //   } else {
  //     handleNextQuestion();
  //   }
  // }, [counter]);
  useEffect(() => {
    if (time > 0) {
      const timer = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleNextQuestion();
    }
  }, [time]);

  const handleNextQuestion = async() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTime(15);
    } else {
      setQuizCompleted(true);
      storeAnswers();
      updateStreak();

      
  
    }
  };

  const saveScoreToLeaderboard = async (userId, displayName, score) => {
    try {

      const leaderboardRef = collection(firestore, 'leaderboard');
      await addDoc(leaderboardRef, {
        userId : userId,
        displayName :displayName,
        score : score,
        date: Timestamp.fromDate(new Date())
      });
      console.log('Score saved to leaderboard!');
    } catch (error) {
      console.error('Error saving score to leaderboard:', error);
    }
  };

  // const handleAnswer = (answer) => {
  //   setAnswers([...answers, answer]);
  //   handleNextQuestion();
  // };

  const handleAnswer = (answer) => {
    setAnswers([...answers, answer]);
    handleNextQuestion();
    // if (currentQuestion === questions.length - 1) {
    //   updateStreak();
      
    // }
  };



  
  const storeAnswers = async () => {
    if (user) {
      const answersRef = collection(firestore, 'answers');
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.exists() ? userDocSnap.data() : {};

      await setDoc(doc(answersRef), {
        userId: user.uid,
        answers: answers,
        date: Timestamp.fromDate(new Date()),
   
      });

      // await setDoc(userDocRef, {
      //   ...userData,
      //   lastQuizDate: Timestamp.fromDate(new Date())
      // });

      localStorage.setItem('quizAttempted', 'true');
    }
  };

  const updateStreak = async () => {
    if (user) {
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.exists() ? userDocSnap.data() : {};
  
      const today = new Date();
      let newStreak = 1;
  
      if (userData.lastQuizDate) {
        const lastQuizDate = userData.lastQuizDate.toDate();
        const diffTime = today - lastQuizDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Use floor to get whole days
  
        if (diffDays === 1) {
          newStreak = (userData.streak || 0) + 1;
          
        } else if (diffDays > 1) {
          newStreak = 1; // Reset streak if missed a day
        } else {
          newStreak = userData.streak || 0; // If the quiz is taken again the same day, maintain the current streak
        }
      }
  
      await setDoc(userDocRef, {
        ...userData,
        streak: newStreak,
        lastQuizDate: Timestamp.fromDate(today),

      });
  
      setStreak(newStreak);
      calculateCorrectAnswers();
      setUserAttemptedQuiz(true);

    }
  };
  
  const calculateCorrectAnswers = async () => {
    
    let count = 0;
    answers.forEach((answer, index) => {
      if (answer === correctAnswers[index]) {
        count++;
      }
    }
  );
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.exists() ? userDocSnap.data() : {};

      await setDoc(userDocRef, {
        ...userData,
        correctCount: count,
      
      }
    
    );


    setCorrectCount(count);
    saveScoreToLeaderboard(user.uid, userData.displayName, count );

  };



  const handleLeader = () => {
    navigate('/leaderboard'); // Change this path to your leaderboard route
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (userAttemptedQuiz) {
    return (
      <div>
          <Header />
          
          <img src={mquiz} className='mquiz'/>
          <div className='one'>
          <div className='streak'>
              <img src={fire2} className='fire'/>
              <div className='streaktext'>Your Streak so far is : {streak}</div>
            </div>
            <div className='two'>
                <div className='quizA'>
                  <img src={tick} className='tick'/>
                  <div>You've submitted today's quiz already!</div>
                </div>
                <div className='shoppingA'>
                <img src={shopping} className='shopping'/>
                <div>You can keep shopping on the website until the next one</div>
                </div>
                <div className='correctA'>
                <img src={correct} className='correct'/>
                <div>Meanwhile, you've scored {correctCount} out of 3 in the last quiz</div>
                </div>
            </div>
           
            <div className='leader'>
              <img src={l1} className='l1'/>
              <button onClick={handleLeader} className='lbtn'>Go To LeaderBoard</button>
            </div>
          </div>
        <div className='rs'>
        <div className='t'>Avail your rewards here</div>
          <div className='rewards'>
          
              <div className='gc'>
                <img src={gc1} className='gc1'/>
                <div className='gctext'>Gift Card 1</div>
                <div className='condition'>Condition: Complete 5 quizzes</div>
                </div>
                <div className='gc'>
                <img src={gc1} className='gc1'/>
                <div className='gctext'>Gift Card 2</div>
                <div className='condition'>Condition: Achieve a streak of 7 days</div>
                </div>
                <div className='gc'>
                <img src={gc1} className='gc1'/>
                <div className='gctext'>Gift Card 3</div>
                <div className='condition'>Condition: Score 80% or above in 10 quizzes</div>
                </div>
              
              
          </div>
        
          </div>
          <Footer/>

      </div>
    )
  }


  const handleCategorySelect =()=>{
    setShowQuiz(true);
  }
  return (
    // <div>
    //   {questions.length > 0 && !quizCompleted && (
    //     <div>
    //       <h2>{questions[currentQuestion].question}</h2>
    //       {questions[currentQuestion].options.map((option, index) => (
    //         <button key={index} onClick={() => handleAnswer(option)}>{option}</button>
    //       ))}
    //       <p>Time left: {time}s</p>
    //     </div>
    //   )}
    //   {quizCompleted && (
    //     <div>
    //       <p>Check the leaderboard positions tomorrow!</p>
    //       <button onClick={navigateToStreakPage}>Go to Streak Page</button>
    //     </div>
    //   )}
    // </div>
<div>
  <Header />
 
  <h2 className='quizTitle'>Myntra Daily Quiz</h2>
  {!showQuiz && (
   
            <div className="category-buttons">
              <div className="option">
              <div className='optiontext'>Select from the options below</div>
                <button onClick={handleCategorySelect} className='option-button'>Skincare</button>
                <button onClick={handleCategorySelect} className='option-button'>Clothing</button>
                <button onClick={handleCategorySelect} className='option-button'>Beauty</button>
                <button onClick={handleCategorySelect} className='option-button'>Home Finds</button>
            </div>
            </div>
)}
            {showQuiz && (
    <div className="quiz-container">
    {questions.length > 0 && !quizCompleted && (
        <div className="question-container">
            <h2 className="question-text">{questions[currentQuestion].question}</h2>
            <div className="options-container">
                {questions[currentQuestion].options.map((option, index) => (
                    <button key={index} className="option-button" onClick={() => handleAnswer(option)}>{option}</button>
                ))}
            </div>
            <div className='timer-box'>
            <img src={timer} className='timer'/>
            <div className="timer-text">Time left: {time}s</div>
            </div>
        </div>
    )}
    {quizCompleted && (
        <div className="completion-container">
            <p className="completion-message">Check the leaderboard positions tomorrow!</p>
            <p className="completion-message">You got {correctCount} out of {questions.length} correct!</p>
            <div className='streak'>Streak: {streak} days</div>
        </div>
    )}
</div>  )}

</div>
  );
};

// Function to check if two dates are the same day
const isSameDay = (date1, date2) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export default Quiz;







// import React, { useState, useEffect } from 'react';
// import { firestore, auth } from '../firebase';
// import { collection, getDocs, addDoc, query, where, Timestamp } from 'firebase/firestore';
// import { useNavigate } from 'react-router-dom';

// const Quiz = () => {
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [answers, setAnswers] = useState([]);
//   const [time, setTime] = useState(15);
//   const [quizCompleted, setQuizCompleted] = useState(false);
//   const [userAttemptedQuiz, setUserAttemptedQuiz] = useState(false); // Track if user has attempted the quiz
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const questionsRef = collection(firestore, 'questions');
//         const snapshot = await getDocs(questionsRef);
//         const questionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         setQuestions(questionsData);
//       } catch (error) {
//         console.error('Error fetching questions:', error);
//       }
//     };
//     fetchQuestions();
//   }, []);

//   useEffect(() => {
//     const checkQuizAttempt = async () => {
//       try {
//         const user = auth.currentUser;
//         if (user) {
//           const quizAttemptsRef = collection(firestore, 'quizAttempts');
//           const q = query(quizAttemptsRef, where('userId', '==', user.uid));
//           const querySnapshot = await getDocs(q);
//           if (!querySnapshot.empty) {
//             // User has already attempted the quiz
//             setUserAttemptedQuiz(true);
//           }
//         }
//       } catch (error) {
//         console.error('Error checking quiz attempt:', error);
//       }
//     };

//     checkQuizAttempt();
//   }, []);

//   useEffect(() => {
//     if (time > 0) {
//       const timer = setTimeout(() => setTime(time - 1), 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [time]);

//   const handleAnswer = (answer) => {
//     setAnswers([...answers, answer]);
//     if (currentQuestion < questions.length - 1) {
//       setCurrentQuestion(currentQuestion + 1);
//       setTime(15);
//     } else {
//       setQuizCompleted(true);
//       recordQuizAttempt(); // Record the user's quiz attempt
//     }
//   };

//   const recordQuizAttempt = async () => {
//     try {
//       const user = auth.currentUser;
//       if (user) {
//         const quizAttemptsRef = collection(firestore, 'quizAttempts');
//         await addDoc(quizAttemptsRef, {
//           userId: user.uid,
//           timestamp: Timestamp.now()
//         });
//         console.log('Quiz attempt recorded successfully!');
//         setUserAttemptedQuiz(true); // Update local state to reflect quiz attempt
//       }
//     } catch (error) {
//       console.error('Error recording quiz attempt:', error);
//     }
//   };

//   const navigateToStreakPage = () => {
//     navigate('/streak');
//   };

//   // Render the quiz only if the user has not attempted it yet
//   if (userAttemptedQuiz || quizCompleted) {
//     return (
//       <div>
//         {quizCompleted ? (
//           <div>
//             <p>Check the leaderboard positions tomorrow!</p>
//             <button onClick={navigateToStreakPage}>Go to Streak Page</button>
//           </div>
//         ) : (
//           <p>You have already attempted the quiz today. Try again tomorrow!</p>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div>
//       {questions.length > 0 && !quizCompleted && (
//         <div>
//           <h2>{questions[currentQuestion].question}</h2>
//           {questions[currentQuestion].options.map((option, index) => (
//             <button key={index} onClick={() => handleAnswer(option)}>{option}</button>
//           ))}
//           <p>Time left: {time}s</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Quiz;




