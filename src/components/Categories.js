import React from 'react';
import './Categories.css';
import { FaMale, FaFemale, FaChild, FaGift,FaBaby, FaHome, FaBath } from 'react-icons/fa';

const Categories = () => {
    return (
        <div className="categories">
            <h2>Shop by Category</h2>
            <div className="category-list">
            <div className="category-item">
                    <FaFemale />
                    <p>Women</p>
                </div>
                <div className="category-item">
                    <FaMale />
                    <p>Men</p>
                </div>
                
                <div className="category-item">
                    <FaChild />
                    <p>Kids</p>
                </div>
                <div className="category-item">
                    <FaGift />
                    <p>Accessories</p>
                </div>
                <div className="category-item">
                    <FaHome />
                    <p>Home</p>
                </div>
                <div className="category-item">
                    <FaBaby />
                    <p>Baby</p>
                </div>
                <div className="category-item">
                    <FaBath />
                    <p>Beauty</p>
                </div>
            </div>
        </div>
    );
};

export default Categories;