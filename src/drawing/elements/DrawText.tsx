import { Color, Point, Rectangle, Size } from "../structures";
import BaseDraw from "./BaseDraw";
import ContentAlignment from "../structures/ContentAlignment";
import Font from "../structures/Font";
import FontStyles from "../structures/FontStyles";
import FontUtil from "../../utils/FontUtil";
import DrawableUtil from "../../utils/DrawableUtil";

class DrawText extends BaseDraw {
    private _pageScale = 1;
    private _stringSize = new Size(0, 0);
    private _drawFont = new Font("tahoma", 9, FontStyles.normal);

    text = "";
    wrappedText = false;

    constructor(name: string) {
        super(name);
    }

    static updateAlign(stringSize: Size, text: string, textAlign: ContentAlignment
        , x: number, y: number, width: number, height: number): Point {
        const align = new Point(x, y);
        if (text.length > 0) {
            switch (textAlign) {
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

    draw(ctx: CanvasRenderingContext2D): void {
        this.directDrawText(ctx);
        this.isChanged = false;
    }

    directDrawText(ctx: CanvasRenderingContext2D): void {
        if (this.text.length === 0) return;
        const matrix = ctx.getTransform();
        this._pageScale = matrix.a;
        this.makeTextSize(false);
        const alignPoint = FontUtil.updateAlign(this._stringSize, this.text, this.attribute.textAlign, this._currentLocation.x, this._currentLocation.y, this._size.width, this._size.height);

        DrawableUtil.setDashStyle(ctx, this.attribute.dashStyle);

        if (this.degree !== 0) {
            this.rotate(ctx);
        }

        if (this.attribute.fillColor !== Color.Transparent()) {
            const origin = ctx.fillStyle;
            ctx.fillStyle = this.attribute.fillColor.toRGBA();
            ctx.fillRect(this._currentLocation.x, this._currentLocation.y, this.getCurrentSize().width, this._currentSize.height);
            ctx.fillStyle = origin;
        }
        
        if (this.attribute.isOutLine && this.attribute.outLineColor !== Color.Transparent()) {
            const origin = ctx.strokeStyle;
            ctx.strokeStyle = this.attribute.outLineColor.toRGBA();
            ctx.strokeRect(this._currentLocation.x, this._currentLocation.y, this._size.width, this._size.height);
            ctx.strokeStyle = origin;
        }

        ctx.fillStyle = this.attribute.lineColor.toRGBA();
        ctx.font = FontUtil.getFontText(this._drawFont.fontName, this._drawFont.fontSize, this._drawFont.fontStyle);
        ctx.fillText(this.text, alignPoint.x, alignPoint.y + this._stringSize.height);

        if (this.attribute.textOutLineThick > 0) {
            ctx.strokeStyle = this.attribute.textOutLineColor.toRGBA();
            const originWidth = ctx.lineWidth;
            ctx.lineWidth = this.attribute.textOutLineThick;
            ctx.strokeText(this.text, alignPoint.x, alignPoint.y + this._stringSize.height);
            ctx.lineWidth = originWidth;
        }
        
        ctx.setTransform(matrix);
    }

    getMBR(): Rectangle {
        this.makeTextSize(false);
        return new Rectangle(this._currentLocation.x, this._currentLocation.y, this._size.width, this._size.height);
    }

    private makeTextSize(defaultSize: boolean): void {
        this._drawFont = FontUtil.getFont(this.attribute.fontName
            , this.attribute.fontSize
            , this.attribute.fontStyle
            , this._pageScale);
        
        if (defaultSize || this._size.equal(Size.Empty())) {
            this._stringSize = FontUtil.measureText(this.text, this.attribute.fontName, this.attribute.fontSize, this.attribute.fontStyle);
        } else {
            this._stringSize = FontUtil.measureText(this.text, this._drawFont.fontName, this._drawFont.fontSize, this._drawFont.fontStyle);

            if (this.wrappedText && !this._size.equal(Size.Empty())) {
                if (this._stringSize.width > this._size.width) this._stringSize.width = this._size.width;
                if (this._stringSize.height > this._size.height) this._stringSize.height = this._size.height;
            }
        }

        if ((this._pageScale == 1 || defaultSize || this._size.equal(Size.Empty()))
            && (this._size.width < this._stringSize.width || this._size.height < this._stringSize.height)) {
            let tWidth = this._size.width;
            let tHeight = this._size.height;

            if (this._size.width < this._stringSize.width) {
                tWidth = this._stringSize.width;
            }

            if (this._size.height < this._stringSize.height) {
                tHeight = this._stringSize.height;
            }

            this._size = new Size(tWidth, tHeight);
        }
    }    

    getTextSize(): Size {
        this.makeTextSize(true);
        return new Size(this._size.width, this._size.height);
    }

    getRealTextSize(): Size {
        return FontUtil.measureText(this.text, this.attribute.fontName, this.attribute.fontSize * this._pageScale, this.attribute.fontStyle);
    }
}

export default DrawText;