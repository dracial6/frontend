import BaseTextStyleItem from "../../../drawing/items/BaseTextStyleItem";
import { Color } from "../../../drawing/structures";

class ShortItem extends BaseTextStyleItem {
    fontSize : number;
    value : number;
    text = "";
    triangleColor : Color;

    constructor(value: number, fontSize: number, triangleColor: Color, isbold: boolean, isItalic: boolean, txtColor: Color) {
        super(isbold, isItalic, txtColor)
        this.value = value;
        this.fontSize = fontSize;
        this.triangleColor = triangleColor;
    }
}

export default ShortItem;