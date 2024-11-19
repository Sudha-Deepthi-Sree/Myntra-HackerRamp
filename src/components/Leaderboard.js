import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import './Leaderboard.css'; 
import Header from './Header';
import Footer from './Footer';
import rank1 from '../assets/rank1.png'
import rank2 from '../assets/rank2.png'
import rank3 from '../assets/rank3.png'

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const leaderboardRef = collection(firestore, 'leaderboard');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const q = query(
          leaderboardRef,
          where('date', '>=', yesterday),
          where('date', '<', today),
          orderBy('date'),
          orderBy('score', 'desc'),
          limit(3)
        );

        const snapshot = await getDocs(q);
        const leaderboardData = snapshot.docs.map(doc => doc.data());
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }
  const rankImages = [rank1, rank2, rank3];
  return (
    <div>
      < Header/>
    <div className="leaderboard-container">
      
      <h2 className="leaderboard-title">Yesterday's Leaderboard</h2>
      <div className="leaderboard">
        {leaderboard.map((entry, index) => (
          <div key={index} className={`leaderboard-entry rank-${index + 1}`}>
            <img 
              src={rankImages[index]}
              alt={`Rank ${index + 1}`} 
              className="rank-icon"
            />
            <span className="leaderboard-name">{entry.displayName}</span>
            
          </div>
        ))}
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default Leaderboard;
