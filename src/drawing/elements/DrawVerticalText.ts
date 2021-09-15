import FontUtil from "../../utils/FontUtil";
import { Color, ContentAlignment, DrawTextDirection, Font, FontStyles, Rectangle, Size } from "../structures";
import BaseDraw from "./BaseDraw";
import DrawText from "./DrawText";

class DrawVerticalText extends DrawText {    
    drawTextDirection = DrawTextDirection.Normal;

    constructor(name: string) {
        super(name);
        this.wrappedText = false;
    }

    fillDrawObjectFields(): BaseDraw {
        const returnValue = super.fillDrawObjectFields();
        (returnValue as DrawText).text = this.text;
        return returnValue;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.directDrawText(ctx);
    }

    protected directDrawText(ctx: CanvasRenderingContext2D): void {
        if (this.text.length === 0) return;

        const matrix = ctx.getTransform();
        this._pageScale = matrix.a;
        this.makeTextSize(false);
        this.rotateAt(ctx, this.drawTextDirection, this._currentLocation.x, this._currentLocation.y, this._currentSize.height, this._currentSize.width);

        let alignPoint = this._currentLocation;

        if (this.attribute.textAlign !== ContentAlignment.TopLeft) {
            alignPoint = DrawVerticalText.updateAlign(this._stringSize, this.text, this.attribute.textAlign, this._currentLocation.x, this._currentLocation.y, this._currentSize.height, this._currentSize.width);
        }

        if (this.degree !== 0) {
            super.rotate(ctx);
        }

        if (this.attribute.isOutLine && this.attribute.outLineColor !== Color.Transparent()) {
            ctx.strokeStyle = this.attribute.outLineColor.toRGBA();
            ctx.strokeRect(this._currentLocation.x, this._currentLocation.y, this._size.width, this._size.height);
        }

        ctx.fillStyle = this.attribute.lineColor.toRGBA();
        ctx.font = FontUtil.getFontText(this._drawFont.fontName, this._drawFont.fontSize, this._drawFont.fontStyle);
        ctx.fillText(this.text, alignPoint.x, alignPoint.y + this._stringSize.height - (this._textMetrics ? this._textMetrics.actualBoundingBoxDescent : 0));

        if (this.attribute.textOutLineThick > 0) {
            ctx.strokeStyle = this.attribute.textOutLineColor.toRGBA();
            ctx.lineWidth = this.attribute.textOutLineThick;
            ctx.strokeText(this.text, alignPoint.x, alignPoint.y + this._stringSize.height - (this._textMetrics ? this._textMetrics.actualBoundingBoxDescent : 0));
        }
        
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.lineWidth = 1;
        ctx.setTransform(matrix);
    }

    protected makeTextSize(defaultSize: boolean): void {
        this._drawFont = FontUtil.getFont(this.attribute.fontName
            , this.attribute.fontSize
            , this.attribute.fontStyle
            , this._pageScale);
        
        if (defaultSize || Size.isEmpty(this._size)) {
            this._textMetrics = FontUtil.measureText(this.text, this.attribute.fontName, this.attribute.fontSize, this.attribute.fontStyle); 
            if (this._textMetrics) this._stringSize = new Size(this._textMetrics.width, this._textMetrics.actualBoundingBoxAscent + this._textMetrics.actualBoundingBoxDescent);
        } else {
            this._textMetrics = FontUtil.measureText(this.text, this._drawFont.fontName, this._drawFont.fontSize, this._drawFont.fontStyle);
            if (this._textMetrics) this._stringSize = new Size(this._textMetrics.width, this._textMetrics.actualBoundingBoxAscent + this._textMetrics.actualBoundingBoxDescent);

            if (this.wrappedText && !Size.isEmpty(this._size)) {
                if (this._stringSize.width > this._size.width) this._stringSize.width = this._size.width;
                if (this._stringSize.height > this._size.height) this._stringSize.height = this._size.height;
            }
        }

        if ((this._pageScale === 1 || defaultSize || Size.isEmpty(this._size))
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

    private rotateAt(ctx: CanvasRenderingContext2D, direction: DrawTextDirection, x: number, y: number, width: number, height: number): void {
        if (direction === DrawTextDirection.TopDown) {
            const rec = new Rectangle(x, y, width, height);
            const matrix = ctx.getTransform();            
            ctx.setTransform(matrix.translate(-1, -1).translate(rec.x, rec.y).rotate(90).translate(0, -height));
        }

        if (direction === DrawTextDirection.BottomUp) {
            const rec = new Rectangle(x, y, width, height);
            const matrix = ctx.getTransform();            
            ctx.setTransform(matrix.translate(-1, -1).translate(rec.x, rec.y).rotate(-90).translate(-width, 0));
        }
    }
}

export default DrawVerticalText;