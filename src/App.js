import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/AuthForm';
import MainPage from './components/MainPage';
import Quiz from './components/Quiz';
import Leaderboard from './components/Leaderboard';
import Streak from './components/Streak';
import PrivateRoute from './components/PrivateRoute'; 


const App = () => {
  return (
    <Router>
      
        <Routes>
        <Route path="/" element={<Login />} />
          <Route path="/main" element={<PrivateRoute element={MainPage} />} />
          <Route path="/quiz" element={<PrivateRoute element={Quiz} />} />
          <Route path="/leaderboard" element={<PrivateRoute element={Leaderboard} />} />
          <Route path="/streak" element={<PrivateRoute element={Streak} />} />
        </Routes>
        
      
    </Router>
  );
};

export default App;
