import BaseDrawArea from "../drawing/BaseDrawArea";
import { Font, FontStyles, Point, Size } from "../drawing/structures";
import ContentAlignment from "../drawing/structures/ContentAlignment";

class FontUtil {
    private static _fontDic: Map<string, Font> = new Map<string, Font>();

    static measureText(text: string, familyName: string, emSize: number, style: FontStyles): Size {
        const ctx = BaseDrawArea.getContext();
        if (ctx) {
            const originFont = ctx.font;
            ctx.font = FontUtil.getFontText(familyName, emSize, style);
            const textMetrics = ctx.measureText(text);
            ctx.font = originFont;            
            return new Size(textMetrics.width, textMetrics.actualBoundingBoxAscent);
        } else {
            return Size.Empty();
        }
    }

    static updateAlign(stringSize: Size, text: string, textAlign: ContentAlignment, x: number, y: number, width: number, height: number) {
        const align = new Point(x, y);

        if (text && text.length > 0) {
            switch (textAlign)
            {
                case ContentAlignment.TopLeft:
                    align.x = x;
                    align.y = y;
                    break;
                case ContentAlignment.TopCenter:
                    align.x = x + (width - stringSize.width) / 2;
                    align.y = y;
                    break;
                case ContentAlignment.TopRight:
                    align.x = (x + width) - stringSize.width;
                    align.y = y;
                    break;
                case ContentAlignment.MiddleLeft:
                    align.x = x;
                    align.y = y + (height - stringSize.height) / 2;
                    break;
                case ContentAlignment.MiddleCenter:
                    align.x = x + (width - stringSize.width) / 2;
                    align.y = y + (height - stringSize.height) / 2;
                    break;
                case ContentAlignment.MiddleRight:
                    align.x = (x + width) - stringSize.width;
                    align.y = y + (height - stringSize.height) / 2;
                    break;
                case ContentAlignment.BottomLeft:
                    align.x = x;
                    if (height < stringSize.height) {
                        align.y = y;
                    } else {
                        align.y = (y + height) - stringSize.height;
                    }
                    break;
                case ContentAlignment.BottomCenter:
                    align.x = x + (width - stringSize.width) / 2;
                    if (height < stringSize.height) {
                        align.y = y;
                    } else {
                        align.y = (y + height) - stringSize.height;
                    }
                    break;
                case ContentAlignment.BottomRight:
                    align.x = (x + width) - stringSize.width;
                    if (height < stringSize.height) {
                        align.y = y;
                    } else {
                        align.y = (y + height) - stringSize.height;
                    }
                    break;
            }
        }

        return align;
    }

    static getFontText(familyName: string, emSize: number, style: FontStyles): string {
        const fontStyles = style.toString();
        const replaced = fontStyles.replaceAll('|', " ").replaceAll('0', '');
        return (replaced + " " + emSize + "px " + familyName).trimStart().trimEnd();
    }

    static getFont(familyName: string, emSize: number, style: FontStyles, pageScale: number): Font {
        if (familyName === '') familyName = "Tahoma";
        if (emSize === 0) emSize = 9;

        const key = FontUtil.getKey(familyName, emSize, style, pageScale);

        if (this._fontDic.has(key)) {
            return this._fontDic.get(key) as Font;
        } else {
            const tempFont = new Font(familyName, emSize * pageScale, style);
            this._fontDic.set(key, tempFont);
            return tempFont;
        }
    }

    private static getKey(familyName: string, emSize: number, style: FontStyles, pageScale: number): string {
        return  familyName + "_" + emSize + "_" + style + "_" + pageScale.toString();
    }

    static makeFontStyle(bold: boolean, italic: boolean): FontStyles {
        let fontStyle = FontStyles.normal;

        if (bold) {
            fontStyle = FontStyles.bold;
        }

        if (italic) {
            if (fontStyle === FontStyles.normal) {
                fontStyle = FontStyles.italic;
            } else {
                fontStyle = fontStyle | FontStyles.italic;
            }
        }        

        return fontStyle;
    }
}

export default FontUtil;