import DrawableUtil from '../../utils/DrawableUtil';
import BaseDraw from './BaseDraw';
import { Color } from '../structures';

class DrawRectangle extends BaseDraw {
    constructor(name: string) {
        super(name);
    }

    public draw(ctx: CanvasRenderingContext2D) : void {
        if (this.degree !== 0) {
            this.rotate(ctx);
        }

        DrawableUtil.setDashStyle(ctx, this.attribute.dashStyle);

        if (this.attribute.radius === 0) {
            if (this.attribute.fillColor.toRGBA() !== Color.Transparent().toRGBA()) {
                ctx.fillStyle = this.attribute.fillColor.toRGBA();
                ctx.fillRect(this._currentLocation.x, this._currentLocation.y, this.getCurrentSize().width, this.getCurrentSize().height);
            }

            ctx.strokeStyle = this.attribute.lineColor.toRGBA();
            ctx.strokeRect(this._currentLocation.x, this._currentLocation.y, this.getCurrentSize().width, this.getCurrentSize().height);
        } else {
            //TO-DO : draw round rectangle
        }
    }
}

export default DrawRectangle;