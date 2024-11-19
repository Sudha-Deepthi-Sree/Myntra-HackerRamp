import React from 'react';
import './Banner.css';
import bannerImage from '../assets/myntra1.jpg'; 
import MyntraImg from '../assets/banner.jpg';
import m1 from '../assets/m1.png';
import m2 from '../assets/m2 (3).png';
import m3 from '../assets/m3.png';
// Add a banner image to your assets folder

const Banner = () => {
    return (
        <div className="banner">
            
            <a href="/main">  <img src={m1} alt="Banner" />   </a>
            <img src={m2} alt="Banner" />
            <div className="banner-content">
                
            </div>
        </div>
    );
};

export default Banner;