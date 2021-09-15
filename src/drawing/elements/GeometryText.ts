import DrawableUtil from "../../utils/DrawableUtil";
import FontUtil from "../../utils/FontUtil";
import GeometryRectangle from "./GeometryRectangle";
import { Color, Font, FontStyles, Point, Rectangle, Size } from "../structures";
import ContentAlignment from "../structures/ContentAlignment";

class GeometryText extends GeometryRectangle{
    private _textMetrics?: TextMetrics;
    
    text = '';
    pageScale = 1;
    stringSize = new Size(0, 0);
    drawFont = new Font("Tahoma", 9, FontStyles.normal);

    constructor(name: string, x: number, y: number, text: string) {
        super(name, 0, 0, 0, 0);
        this.text = text;
        this.setLocation(new Point(x, y));
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.directDrawText(ctx);
        this.isChanged = true;
    }

    private directDrawText(ctx: CanvasRenderingContext2D): void {
        if (!this.text) return;
        const matrix = ctx.getTransform();
        this.pageScale = matrix.a;
        this.makeRotateTransform(ctx);
        this.makeTextSize(false);
        this._textMetrics = FontUtil.measureText(this.text, this.attribute.fontName, this.attribute.fontSize * this.pageScale, this.attribute.fontStyle);
        if (this._textMetrics) this.stringSize = new Size(this._textMetrics.width, this._textMetrics.actualBoundingBoxAscent + this._textMetrics.actualBoundingBoxDescent);
        DrawableUtil.setDashStyle(ctx, this.attribute.dashStyle);
        
        let alignPoint = this._currentLocation;
        if (this.attribute.textAlign !== ContentAlignment.TopLeft) {
            alignPoint = FontUtil.updateAlign(this.stringSize, this.text, this.attribute.textAlign, this._currentLocation.x, this._currentLocation.y, this._size.width, this._size.height);
        }

        if (this.attribute.fillColor.toRGBA() !==  Color.Transparent().toRGBA()) {
            ctx.fillStyle = this.attribute.fillColor.toRGBA();
            ctx.fillRect(this._currentLocation.x, this._currentLocation.y, this.getCurrentSize().width, this.getCurrentSize().height);
        }

        if (this.attribute.isOutLine && this.attribute.outLineColor.toRGBA() !==  Color.Transparent().toRGBA()) {
            ctx.strokeStyle = this.attribute.outLineColor.toRGBA();
            ctx.strokeRect(this._currentLocation.x, this._currentLocation.y, this._size.width, this._size.height);
        }

        const originFont = ctx.font;
        ctx.fillStyle = this.attribute.lineColor.toRGBA();
        ctx.font = FontUtil.getFontText(this.drawFont.fontName, this.drawFont.fontSize, this.drawFont.fontStyle);

        ctx.fillText(this.text, alignPoint.x, alignPoint.y + this.stringSize.height - (this._textMetrics ? this._textMetrics.actualBoundingBoxDescent : 0));
        if (this.attribute.textOutLineThick > 0) {
            ctx.strokeStyle = this.attribute.textOutLineColor.toRGBA();
            ctx.lineWidth = this.attribute.textOutLineThick;
            ctx.strokeText(this.text, alignPoint.x, alignPoint.y + this.stringSize.height - (this._textMetrics ? this._textMetrics.actualBoundingBoxDescent : 0));
        }

        ctx.font = originFont;
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.lineWidth = 1;
        this.rollBackTransform(ctx, matrix);
    }

    getMBR(): Rectangle {
        this.makeTextSize(false);

        if (this.degree !== 0) {
            return this.getRealRectangle();
        } else {
            return this.getBounds();
        }
    }

    getTextSize(): Size {
        this.makeTextSize(true);
        return this._size;
    }

    getRealTextSize(): Size {
        const tempFont = FontUtil.getFont(this.attribute.fontName
            , this.attribute.fontSize
            , this.attribute.fontStyle
            , 1);

        this._textMetrics = FontUtil.measureText(this.text, this.drawFont.fontName, this.drawFont.fontSize, this.drawFont.fontStyle);

        if (this._textMetrics) {
            return new Size(this._textMetrics.width, this._textMetrics.actualBoundingBoxAscent + this._textMetrics.actualBoundingBoxDescent);
        } else {
            return Size.empty();
        }
    }

    protected makeTextSize(defaultSize: boolean): void {
        this.drawFont = FontUtil.getFont(this.attribute.fontName
            , this.attribute.fontSize
            , this.attribute.fontStyle
            , this.pageScale);
        
        if (defaultSize) {
            this._textMetrics = FontUtil.measureText(this.text, this.attribute.fontName, this.attribute.fontSize, this.attribute.fontStyle);
            if (this._textMetrics) this.stringSize = new Size(this._textMetrics.width, this._textMetrics.actualBoundingBoxAscent + this._textMetrics.actualBoundingBoxDescent);
        } else {
            this._textMetrics = FontUtil.measureText(this.text, this.attribute.fontName, this.attribute.fontSize * this.pageScale, this.attribute.fontStyle);
            if (this._textMetrics) this.stringSize = new Size(this._textMetrics.width, this._textMetrics.actualBoundingBoxAscent + this._textMetrics.actualBoundingBoxDescent);
        }

        if ((this.pageScale === 1 || defaultSize)
            && (this._size.width < this.stringSize.width || this._size.height < this.stringSize.height)) {
            let width = this._size.width;
            let height = this._size.height;

            if (this._size.width < this.stringSize.width) {
                width = this.stringSize.width;
            }

            if (this._size.height < this.stringSize.height) {
                height = this.stringSize.height;
            }

            this.setSize(new Size(width, height));
        } else if (this._size.width === 1 && this._size.height === 1) {
            this.setSize(new Size(this.stringSize.width / this.pageScale, this.stringSize.height / this.pageScale));
        }
    }
}

export default GeometryText;