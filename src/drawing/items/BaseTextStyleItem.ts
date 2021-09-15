import FontUtil from "../../utils/FontUtil";
import { Color, FontStyles } from "../structures";
import ContentAlignment from "../structures/ContentAlignment";

class BaseTextStyleItem {
    bold = false;
    italic = false;
    textColor = Color.Black();
    backColor = Color.Transparent();
    textAlign = ContentAlignment.TopLeft;
    textStyle = FontStyles.normal;

    constructor(bold: boolean, italic: boolean, textColor: Color) {
        this.bold = bold;
        this.italic = italic;
        this.textColor = textColor;
        this.textStyle = FontUtil.makeFontStyle(this.bold, this.italic);
    }

    getTextStyle(): FontStyles {
        return this.textStyle;
    }

    setValue(isBold: boolean, isItalic: boolean, textColor: Color): void {
        this.bold = isBold;
        this.italic = isItalic;
        this.textColor = textColor;

        this.setFontStyleDetail(this.bold, this.italic);
    }

    setFontStyleDetail(isBold: boolean, isItalic: boolean): void {
        this.textStyle = FontUtil.makeFontStyle(isBold, isItalic);
    }

    setFontStyle(fontStyle: FontStyles): void {
        this.textStyle = fontStyle;
        this.bold = false;
        this.italic = false;

        if ((fontStyle & FontStyles.italic) > 1) {
            this.italic = true;
        }

        if ((fontStyle & FontStyles.bold) > 0) {
            this.bold = true;
        }
    }
}

export default BaseTextStyleItem;