import React from 'react';
import Button from '../Button';
import './MenuBoard.css';

// Import images from src-based path
import MenuBoard1 from './Images/menuboard/MenuBoard1.png';
import MenuBoard2 from './Images/menuboard/MenuBoard2.png';
import MenuBoard3 from './Images/menuboard/MenuBoard3.png';

function MenuBoard({ setScreen }) {
    return (
        <div className="menu-board-container">
            <h1>Menu Board</h1>
            <div className="menu-images">
                <img src={MenuBoard1} alt="Menu 1" />
                <img src={MenuBoard2} alt="Menu 2" />
                <img src={MenuBoard3} alt="Menu 3" />
            </div>
            <Button text="Back" onClick={() => setScreen("home")} />
        </div>
    );
}

export default MenuBoard;
