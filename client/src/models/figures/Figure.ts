import {Colors} from "../Colors";
import {Cell} from "../Cell";
import img from "../../resourses/images/black-knight.png"

export enum FigureNames{
    FIGURE = "Фигура",
    KING = "Король",
    QUEEN= "Ферзь",
    KNIGHT = "Конь",
    PAWN = "Пешка",
    ROOK = "Ладья",
    BISHOP = "Слон",
}

export class Figure{
    _color: Colors;
    _img: typeof img | null;
    _cell: Cell;
    _name: FigureNames;
    _id: number;

    constructor(color: Colors, cell: Cell) {
        this._color = color;
        this._cell = cell;
        this._cell._figure = this;
        this._img = null;
        this._name = FigureNames.FIGURE;
        this._id = Math.random();
    }

    canAttack(target: Cell): boolean {
        if (target._figure?._color === this._color) // same color
            return false;
        return true;
    }

    canMove(target: Cell) : boolean {
        if (target._figure?._color === this._color) // same color
            return false;

        // if (this._cell.isKingUnderAttack(this._color))
        //     return false;

        return true
    }

    canPawnAttack(target: Cell): boolean {
        const direction = this._cell._figure?._color === Colors.BLACK ? 1 : -1;
        return target._y === this._cell._y + direction
            && (target._x === this._cell._x + 1 || target._x === this._cell._x - 1);
    }

    moveFigure(target: Cell){}
}