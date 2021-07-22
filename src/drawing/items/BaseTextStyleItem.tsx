import FontUtil from "../../utils/FontUtil";
import { Color, FontStyles } from "../structures";
import ContentAlignment from "../structures/ContentAlignment";

class BaseTextStyleItem {
    bold = false;
    italic = false;
    textColor = Color.Black();
    backColor = Color.Transparent();
    textAlign = ContentAlignment.TopLeft;
    _textStyle = FontStyles.normal;

    constructor(bold: boolean, italic: boolean, textColor: Color) {
        this.bold = bold;
        this.italic = italic;
        this.textColor = textColor;
        this._textStyle = FontUtil.makeFontStyle(this.bold, this.italic);
    }

    getTextStyle(): FontStyles {
        return this._textStyle;
    }
}

export default BaseTextStyleItem;