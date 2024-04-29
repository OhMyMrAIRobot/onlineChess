import {Figure, FigureNames} from "./Figure";
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackImg from "../../Resources/Images/kosal/black-king.svg";
import whiteImg from "../../Resources/Images/kosal/white-king.svg";
import {Rook} from "./Rook";
import GameState from "../../Store/GameState";

export class King extends Figure {
    _isFirstMove: boolean = true;

    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this._img = color === Colors.BLACK ? blackImg : whiteImg;
        this._name = FigureNames.KING;
    }

    canMove(target: Cell): boolean {

        if (!super.canMove(target)) {
            return false;
        }

        if (this.canLeftCastle(target)) {
            return true;
        }

        if (Math.abs(target._x - this._cell._x) > 1 || Math.abs(target._y - this._cell._y) > 1) {
            return false;
        }

        if (this._cell.isCellUnderAttack(target, this._color)) {
            return false;
        }

        if (this._cell.isEmptyVertical(target)) {
            return true;
        }

        if (this._cell.isEmptyHorizontal(target)) {
            return true;
        }

        if (this._cell.isEmptyDiagonal(target)) {
            return true;
        }

        return false;
    }

    canAttack(target: Cell): boolean {
        return super.canAttack(target) && !(Math.abs(target._x - this._cell._x) > 1 || Math.abs(target._y - this._cell._y) > 1);
    }

     canLeftCastle(target: Cell): boolean {
        if (!this._isFirstMove)
            return false;
        const board = target._board;

        const figure = board._cells[7][0]._figure;
        if (figure?._name === FigureNames.ROOK && figure._color === this._color){
            const leftRook = figure as Rook;
            if (!leftRook._isFirstMove){
                return false;
            }
        } else return false;

        if (!(target._y === 7 && target._x < 4 && target._x > (GameState._color === Colors.WHITE ? 1 : 0)))
             return false;

        for (let i = 1; i <= (GameState._color === Colors.WHITE ? 3 : 2); i++){
            if (board._cells[7][i]._figure || target.isCellUnderAttack(board._cells[7][i], this._color)){
                return false;
            }
        }
        return true;
    }

    moveFigure(target: Cell): void {
        super.moveFigure(target);
        this._isFirstMove = false;
    }
}
