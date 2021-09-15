import DrawableUtil from '../../utils/DrawableUtil';
import BaseDraw from './BaseDraw';
import { Color, LineAlignment } from '../structures';

class DrawRectangle extends BaseDraw {
    constructor(name: string) {
        super(name);
    }

    public draw(ctx: CanvasRenderingContext2D) : void {
        if (this.degree !== 0) {
            this.rotate(ctx);
        }

        DrawableUtil.setDashStyle(ctx, this.attribute.dashStyle);
        
        if (this.attribute.lineAlign !== LineAlignment.Outset) {
            ctx.lineWidth = this.attribute.lineThick;
        } else {
            ctx.lineWidth = this.attribute.lineThick * 2;
        }

        const insetGap = (this.attribute.lineAlign === LineAlignment.Inset && this.attribute.lineThick > 1) ? this.attribute.lineThick / 2 : 0;
        
        if (this.attribute.radiusEdge) {
            ctx.lineJoin = "round";
        }

        if (this.attribute.lineAlign !== LineAlignment.Outset) {
            ctx.globalCompositeOperation = "source-over";
            if (this.attribute.fillColor.toRGBA() !== Color.Transparent().toRGBA()) {
                ctx.fillStyle = this.attribute.fillColor.toRGBA();
                ctx.fillRect(this._currentLocation.x + insetGap / 2, this._currentLocation.y + insetGap / 2, this.getCurrentSize().width - insetGap, this.getCurrentSize().height - insetGap);
            }
        }

        ctx.strokeStyle = this.attribute.lineColor.toRGBA();
        ctx.strokeRect(this._currentLocation.x + insetGap / 2, this._currentLocation.y + insetGap / 2, this.getCurrentSize().width - insetGap, this.getCurrentSize().height - insetGap);

        if (this.attribute.lineAlign === LineAlignment.Outset) {
            ctx.globalCompositeOperation = "destination-out";
            ctx.fillRect(this._currentLocation.x, this._currentLocation.y, this.getCurrentSize().width, this.getCurrentSize().height);

            ctx.globalCompositeOperation = "source-over";
            if (this.attribute.fillColor.toRGBA() !== Color.Transparent().toRGBA()) {
                ctx.fillStyle = this.attribute.fillColor.toRGBA();
                ctx.fillRect(this._currentLocation.x, this._currentLocation.y, this.getCurrentSize().width, this.getCurrentSize().height);
            }
        }

        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.lineJoin = "miter";
        ctx.lineWidth = 1;
    }
}

export default DrawRectangle;