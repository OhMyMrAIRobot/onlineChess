import {Cell} from "../Models/Cell";
import {Board} from "../Models/Board";
import {Colors} from "../Models/Colors";
import GameState from "../Store/GameState";
import {Queen} from "../Models/figures/Queen";
import {Bishop} from "../Models/figures/Bishop";
import {Knight} from "../Models/figures/Knight";
import {Pawn} from "../Models/figures/Pawn";
import {Rook} from "../Models/figures/Rook";

interface Message {
    method: string;
    username?: string;
    color?: string;
    cell?: Cell;
    selectedCell?: Cell;
    x0?: number;
    y0?: number;
    x1?: number;
    y1?: number;
    data?:string;
    time?: any;
}

export const MessageHandler = (
    socket: WebSocket,
    board: Board,
    curMove: Colors | null,
    setCurMove: (color: Colors | null) => void,
    updateBoard: () => void,
    setMsgArray: (update: (prevMsgArray: any[]) => any[]) => void,
    ) => {
    const moveAndChange = (msg: any, change: boolean) => {
        let selectedCell: Cell;
        let cell: Cell;
        if (msg.x0 !== undefined && msg.y0 !== undefined && msg.x1 !== undefined && msg.y1 !== undefined){
            if (curMove === GameState._color){
                selectedCell = board.getCell(msg.x0, msg.y0);
                cell = board.getCell(msg.x1, msg.y1);
            } else {
                selectedCell = board.getCell(7 - msg.x0, 7 - msg.y0);
                cell = board.getCell(7 - msg.x1, 7 - msg.y1);
            }
            selectedCell.moveFigure(cell);
            if (change && cell._figure) {
                switch (msg.figure){
                    case 'Bishop':
                        cell._figure = new Bishop(cell._figure._color, cell);
                        break;
                    case 'Knight':
                        cell._figure = new Knight(cell._figure._color, cell);
                        break;
                    case 'Pawn':
                        cell._figure = new Pawn(cell._figure._color, cell);
                        break;
                    case 'Queen':
                        cell._figure = new Queen(cell._figure._color, cell);
                        break;
                    case 'Rook':
                        cell._figure = new Rook(cell._figure._color, cell);
                        break;
                }
            }
            updateBoard()
            setCurMove(curMove === Colors.WHITE ? Colors.BLACK : Colors.WHITE);
        }
    }

    socket.onmessage = (event: MessageEvent) => {
        const msg: Message = JSON.parse(event.data);
        switch (msg.method) {
            case 'connection':
                setMsgArray(prev => [...prev, {type: 'connect', user: msg.username}])
                // if (msg.color === 'Black')
                    // setCurMove(Colors.WHITE);
                 break;
            case 'move':
                moveAndChange(msg, false);
                const checkColor = curMove === Colors.WHITE ? Colors.BLACK : Colors.WHITE
                if (curMove && board.checkMate(checkColor))
                    GameState.setWinner(curMove)
                break;
            case 'moveAndChange':
                moveAndChange(msg, true)
                break;
            case 'message':
                setMsgArray(prev => [...prev, {
                    type: 'message',
                    user: msg.username,
                    text: msg.data,
                    time: {hour: msg.time.hour, minute: msg.time.minute}
                }])
                break;
        }
    }
}