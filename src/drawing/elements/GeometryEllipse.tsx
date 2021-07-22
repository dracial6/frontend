import DrawableUtil from "../../utils/DrawableUtil";
import GeometryRectangle from "./GeometryRectangle";
import { Point, Size } from "../structures";

class GeometryEllipse extends GeometryRectangle {
    constructor(name: string, x: number, y: number, width: number, height: number) {
        super(name, x, y, width, height);

        this.setLocation(new Point(x, y));
        this.setSize(new Size(width, height));
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.drawEllipse(ctx);
        this.isChanged = false;
    }

    private drawEllipse(ctx: CanvasRenderingContext2D): void {
        if (this.getCurrentSize().equal(Size.Empty())) return;

        const matrix = ctx.getTransform();
        this.makeRotateTransform(ctx);
        DrawableUtil.setDashStyle(ctx, this.attribute.dashStyle);
        
        ctx.beginPath();
        ctx.ellipse(this.getCurrentLocation().x + this.getCurrentSize().width / 2, this.getCurrentLocation().y + this.getCurrentSize().height / 2, this.getCurrentSize().width / 2, this.getCurrentSize().height / 2, 0, 0, Math.PI * 2);

        if (this.attribute.isFill) {
            const origin = ctx.fillStyle;
            ctx.fillStyle = this.attribute.fillColor.toRGBA();
            ctx.fill();
            ctx.fillStyle = origin;
        }

        const origin = ctx.strokeStyle;
        ctx.strokeStyle = this.attribute.lineColor.toRGBA();
        ctx.stroke();
        ctx.strokeStyle = origin;

        this.rollBackTransform(ctx, matrix);
    }
}

export default GeometryEllipse;