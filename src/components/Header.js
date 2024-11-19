import React from 'react';
import { FaSearch, FaShoppingBag, FaUser } from 'react-icons/fa';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import logo from '../assets/Myntra-logo-horizontal.png'

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/'); // Redirect to the home or login page
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <header className="header">
            <img src={logo} alt="Banner" className='logo' />
            <nav className="nav">
                <ul>
                    <li>Men</li>
                    <li>Women</li>
                    <li>Kids</li>
                    <li>Home & Living</li>
                    <li>Beauty</li>
                </ul>
            </nav>
            <div className='logout'>
            <div className="icons">
                <FaSearch />
                <FaShoppingBag />
                <FaUser />
                
            </div>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
        </header>
    );
};

export default Header;