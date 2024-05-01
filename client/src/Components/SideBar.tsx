import React, {FC} from 'react';
import "../Resources/Styles/SideBar.css"
import GameState from "../Store/GameState";
import {Colors} from "../Models/Colors";
import Timer from "./Timer";
import {SendMessage} from "../Handlers/SendMessage";

interface SideBarProps {
    curMove: Colors | null,
}

const SideBar: FC<SideBarProps> = ({curMove}) => {

    const giveUpHandler = () => {
        SendMessage(GameState._socket, {
            method: 'giveUp',
            id: GameState._session,
            color: GameState._color,
        })
    }

    const offerDrawHandler = () => {
        SendMessage(GameState._socket, {
            method: 'offerDraw',
            id: GameState._session,
            color: GameState._color,
        })
    }

    const title = () => {
        if (GameState._winner) {
            return <h3 className={GameState._winner === GameState._color ? 'green' : 'red'}>
                {GameState._winner && GameState._winner === GameState._color ? 'You won' : 'You lose'}</h3>
        } else if (curMove) {
            return <h3 className={GameState._color === curMove ? 'green' : 'red'}>
                {GameState._color === curMove ? 'Your move' : 'Opponent move'}</h3>
        } else if (GameState._isDraw)
            return <h3 className="green">Draw!</h3>
        else
            return <h3 className="red">Waiting for opponent</h3>
    }

    return (
        <div className="sidebar">
            {title()}

            <Timer curMove={curMove}/>

            <div className="sidebarButtons">
                <button
                    className="sidebarButton draw"
                    onClick={() => offerDrawHandler()}
                >Offer a draw</button>

                <button
                    className="sidebarButton giveUp"
                    onClick={() => giveUpHandler()}
                >Give up</button>
            </div>
        </div>
    );
};

export default SideBar;