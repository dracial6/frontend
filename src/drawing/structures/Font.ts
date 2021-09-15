import FontStyles from "./FontStyles";

class Font {
    fontName: string;
    fontSize: number;
    fontStyle: FontStyles;

    constructor(fontName: string, fontSize: number, fontStyle: FontStyles){
        this.fontName = fontName;
        this.fontSize = fontSize;
        this.fontStyle = fontStyle;
    }
}

export default Font;