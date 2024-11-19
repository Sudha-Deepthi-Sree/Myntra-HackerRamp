

// import React, { useState, useEffect } from 'react';
// import { firestore } from '../firebase';
// import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
// import useAuthState from '../hooks/useAuthState'; // Adjust import path as needed

// const Streak = () => {
//   const { user, loading } = useAuthState(); // Use the custom useAuthState hook

//   const [streak, setStreak] = useState(0);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchStreak = async () => {
//       try {
//         if (user) {
//           const userDocRef = doc(firestore, 'users', user.uid);
//           const userDocSnap = await getDoc(userDocRef);
//           const today = new Date(); // Define today's date here
//           if (userDocSnap.exists()) {
//             const userData = userDocSnap.data();
//             // const lastQuizDate = userData.lastQuizDate ? userData.lastQuizDate.toDate() : null;
//             // if (lastQuizDate && isSameDay(lastQuizDate, today)) {
//             //   // User played quiz today, streak remains the same
//             //   setStreak(userData.streak);
//             // } else {
//             //   // User did not play quiz today, reset streak to 1
//             //   const newStreak = lastQuizDate && (today - lastQuizDate) / (1000 * 60 * 60 * 24) === 1 ? userData.streak + 1 : 0;
//             //   setStreak(newStreak);
//               // Update Firestore with new streak and lastQuizDate
//               await setDoc(userDocRef, {
//                 ...userData,
//                 streak: newStreak,
//                 lastQuizDate: Timestamp.fromDate(today)
//               });
//             }
//           } else {
//             // If user document doesn't exist, create it with initial streak
//             await setDoc(userDocRef, {
//               streak: 0,
//               lastQuizDate: Timestamp.fromDate(today)
//             });
//             setStreak(0);
//           }
//         } else {
//           setError('User not authenticated');
//         }
//       } catch (error) {
//         console.error('Error fetching streak:', error);
//         setError('Failed to fetch streak');
//       }
//     };

//     if (user) {
//       fetchStreak();
//     }
//   }, [user]);

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   return (
//     <div>
//       <h2>Your 30-Day Streak</h2>
//       <p>{streak} days</p>
//     </div>
//   );
// };

// // Function to check if two dates are the same day
// const isSameDay = (date1, date2) => {
//   return (
//     date1.getDate() === date2.getDate() &&
//     date1.getMonth() === date2.getMonth() &&
//     date1.getFullYear() === date2.getFullYear()
//   );
// };

// export default Streak;


