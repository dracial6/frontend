import BaseTextItem from "../../../drawing/items/BaseTextItem";
import { Color, ContentAlignment, FontStyles } from "../../../drawing/structures";

class CustomTextItem extends BaseTextItem {
    private _gridColumnCount : number;
    private _gridRowCount : number;
    private _gridColumnIndex : number;
    private _gridRowIndex : number;
    
    textAlign : ContentAlignment;
    fontName : string;
    fontSizeRateByCell : number;
    backgroundColor : Color;

    getGridColumnCount(): number {
        return this._gridColumnCount;
    }

    setGridColumnCount(gridColumnCount: number): void {
        this._gridColumnCount = gridColumnCount;
    }
    
    getGridRowCount(): number {
        return this._gridRowCount;
    }

    setGridRowCount(gridRowCount: number): void {
        this._gridRowCount = gridRowCount;
    }

    getGridColumnIndex(): number {
        return this._gridColumnIndex;
    }

    setGridColumnIndex(gridColumnIndex: number): void {
        this._gridColumnIndex = gridColumnIndex;
    }

    getGridRowIndex(): number {
        return this._gridRowIndex;
    }

    setGridRowIndex(gridRowIndex: number): void {
        this._gridRowIndex = gridRowIndex;
    }

    constructor() {
        super();
        this.textAlign = ContentAlignment.MiddleCenter;
        this.textColor = Color.Black();
        this.backgroundColor = Color.Transparent();
        this.fontName = "tahoma";
        this.text = "";
        this.setFontStyle(FontStyles.normal);
        this.fontSizeRateByCell = 0.37;
        this.autoFontSize = true;
        this._gridColumnCount = 1;
        this._gridRowCount = 1;
        this._gridColumnIndex = 1;
        this._gridRowIndex = 1;
    }

    getFontSize(width: number, height: number) : number {  
        if (this.autoFontSize == true) {
            const baseSize = ((width < height) ? width : height);
            return baseSize * this.fontSizeRateByCell;
        }

        return this.fontSize;
    }

    setGridPosition(rowCount: number, columnCount: number, rowIndex: number, columnIndex: number) : void {
        this.setGridRowCount(rowCount);
        this.setGridColumnCount(columnCount);
        this.setGridRowIndex(rowIndex);
        this.setGridColumnIndex(columnIndex);
    }
}

export default CustomTextItem;