import React from 'react';
import Button from '../Button';
import './MenuBoard.css';

function MenuBoard({ setScreen }) {
    return (
        <div className="menu-board-container">
        <h1>Menu Board</h1>
        <div className="menu-images">
            <img src="/images/MenuBoard1.png" alt="Menu 1" />
            <img src="/images/MenuBoard2.png" alt="Menu 2" />
            <img src="/images/MenuBoard3.png" alt="Menu 3" />
        </div>
        <Button text="Back" onClick={() => setScreen("home")} />
        </div>
    );
}

export default MenuBoard;
