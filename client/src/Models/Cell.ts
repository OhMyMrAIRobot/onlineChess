import {Colors} from "./Colors";
import {Figure, FigureNames} from "./figures/Figure";
import {Board} from "./Board";
import GameState from "../Store/GameState";

export class Cell{
    public readonly _x: number;
    public readonly _y: number;
    public readonly _color: Colors;
    public _figure: Figure | null;
    public _board: Board;
    public _available: boolean;
    public _id: number;

    constructor(board: Board, x: number, y: number, color: Colors, figure: Figure | null) {
        this._board = board;
        this._x = x;
        this._y = y;
        this._color = color;
        this._figure = figure;
        this._available = false;
        this._id = Math.random()
    }

    public isEmpty(): boolean {
        return this._figure === null;
    }

    public isEnemy(target: Cell): boolean {
        if (target._figure){
            return this._figure?._color !== target._figure._color;
        }
        return false;
    }

    public isEmptyVertical(target: Cell): boolean {
        if (this._x !== target._x)
            return false;

        const min = Math.min(this._y, target._y);
        const max = Math.max(this._y, target._y);

        for (let y = min + 1; y < max; y++){
            if (!this._board.getCell(this._x, y).isEmpty())
                return false;
        }
        return true;
    }

    public isEmptyHorizontal(target: Cell): boolean {
        if (this._y !== target._y)
            return false;

        const min = Math.min(this._x, target._x);
        const max = Math.max(this._x, target._x);

        for (let x = min + 1; x < max; x++){
            if (!this._board.getCell(x, this._y).isEmpty())
                return false;
        }

        return true;
    }

    public isEmptyDiagonal(target: Cell): boolean {
        const absX = Math.abs(this._x - target._x);
        const absY = Math.abs(this._y - target._y);
        if (absX !== absY)
            return false;

        const dy = this._y < target._y ? 1 : -1;
        const dx = this._x < target._x ? 1 : -1;

        for (let i = 1; i < absX; i++){
            if (!this._board.getCell(this._x + dx * i, this._y + dy * i).isEmpty())
                return false;
        }

        return true;
    }

    public isCellUnderAttack(target: Cell, color: Colors): boolean {
        for (const row of this._board._cells) {
            for (const cell of row) {
                const figure = cell._figure;
                if (figure && figure._color !== color) {
                    if (figure._name === FigureNames.PAWN && figure.canPawnAttack(target)) {
                        return true;
                    }

                    const tmp = target._figure;
                    target._figure = null;
                    if (figure.canAttack(target) && figure !== tmp && figure._name !== FigureNames.PAWN) {
                        target._figure = tmp;
                        return true;
                    }
                    target._figure = tmp;
                }
            }
        }
        return false;
    }


    private setFigure(figure: Figure) {
        this._figure = figure;
        this._figure._cell = this;
    }

    public addLostFigure(figure: Figure) {
        figure._color === Colors.BLACK ?
            this._board._lostBlackFigures.push(figure)
            :
            this._board._lostWhiteFigures.push(figure);
    }

    public moveFigure(targetCell: Cell) {

        const getCoord = (x1: number, y1:number) => {
            const char = GameState._color === Colors.WHITE ? String.fromCharCode(x1 + 97) : String.fromCharCode(7 - x1 + 97);
            const digit = GameState._color === Colors.WHITE ? 7 - y1 + 1 : y1 + 1;
            return `${char}${digit}`
        }

        const makeNotation = (figure: string, x: number, y:number, x1:number, y1:number, isTake: boolean): string => {
            return `${figure}${getCoord(x, y)}${isTake ? ':' : '-'}${getCoord(x1, y1)}`;
        }

        if (this._figure){
            const color = this._figure._color;
            let move = makeNotation(this._figure._name.slice(0,1), this._figure._cell._x, this._figure._cell._y, targetCell._x, targetCell._y, false)

            this._figure.moveFigure(targetCell);
            if (targetCell._figure){
                this.addLostFigure(targetCell._figure);
                move = makeNotation(this._figure._name.slice(0,1), this._figure._cell._x, this._figure._cell._y, targetCell._x, targetCell._y, true)
            }
            targetCell.setFigure(this._figure)
            this._figure = null;

            const king = this._board.getKing(color === Colors.WHITE ? Colors.BLACK : Colors.WHITE);
            if (king.isCellUnderAttack(king, color === Colors.WHITE ? Colors.BLACK : Colors.WHITE))
                move += '+'
            GameState.addMove(move);
        }
    }
}