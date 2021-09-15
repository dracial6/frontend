import DrawableUtil from "../../utils/DrawableUtil";
import GeometryRectangle from "./GeometryRectangle";
import { LineAlignment, Point, Size } from "../structures";

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
        if (Size.isEmpty(this.getCurrentSize())) return;
        ctx.globalCompositeOperation = "";
        const matrix = ctx.getTransform();
        this.makeRotateTransform(ctx);
        DrawableUtil.setDashStyle(ctx, this.attribute.dashStyle);
        
        if (this.attribute.lineAlign !== LineAlignment.Outset) {
            ctx.lineWidth = this.attribute.lineThick;
        } else {
            ctx.lineWidth = this.attribute.lineThick * 2;
        }

        const insetGap = (this.attribute.lineAlign === LineAlignment.Inset && this.attribute.lineThick > 1) ? this.attribute.lineThick / 2 : 0;
        ctx.beginPath();
        ctx.ellipse(this.getCurrentLocation().x + this.getCurrentSize().width / 2 + insetGap / 2 - 1, this.getCurrentLocation().y + this.getCurrentSize().height / 2 + insetGap / 2 - 1, this.getCurrentSize().width / 2 - insetGap, this.getCurrentSize().height / 2 - insetGap, 0, 0, Math.PI * 2);

        if (this.attribute.lineAlign !== LineAlignment.Outset) {
            ctx.globalCompositeOperation = "source-over";
            if (this.attribute.isFill) {
                ctx.fillStyle = this.attribute.fillColor.toRGBA();
                ctx.fill();
            }
        }

        ctx.strokeStyle = this.attribute.lineColor.toRGBA();
        ctx.stroke();

        if (this.attribute.lineAlign === LineAlignment.Outset) {
            ctx.globalCompositeOperation = "destination-out";
            ctx.fill();

            ctx.globalCompositeOperation = "source-over";
            if (this.attribute.isFill) {
                ctx.fillStyle = this.attribute.fillColor.toRGBA();
                ctx.fill();
            }
        }

        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.lineWidth = 1;
        this.rollBackTransform(ctx, matrix);
    }
}

export default GeometryEllipse;