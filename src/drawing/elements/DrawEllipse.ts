import DrawableUtil from "../../utils/DrawableUtil";
import BaseDraw from "./BaseDraw";
import { LineAlignment, Point, Size } from "../structures";

class DrawEllipse extends BaseDraw {
    constructor(name: string, x: number, y: number, width: number, height: number) {
        super(name);

        this.setLocation(new Point(x, y));
        this.setSize(new Size(width, height));
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.drawEllipse(ctx);
        this.isChanged = false;
    }

    private drawEllipse(ctx: CanvasRenderingContext2D): void {
        if (Size.isEmpty(this.getCurrentSize())) return;

        const matrix = ctx.getTransform();
        
        if (this.degree !== 0) {
            this.rotate(ctx);
        }

        if (this.attribute.lineAlign !== LineAlignment.Outset) {
            ctx.lineWidth = this.attribute.lineThick;
        } else {
            ctx.lineWidth = this.attribute.lineThick * 2;
        }

        const insetGap = (this.attribute.lineAlign === LineAlignment.Inset && this.attribute.lineThick > 1) ? this.attribute.lineThick / 2 : 0;

        DrawableUtil.setDashStyle(ctx, this.attribute.dashStyle);
        
        ctx.beginPath();
        ctx.ellipse(this.getCurrentLocation().x + this.getCurrentSize().width / 2, this.getCurrentLocation().y + this.getCurrentSize().height / 2, this.getCurrentSize().width / 2, this.getCurrentSize().height / 2, 0, 0, Math.PI * 2);

        if (this.attribute.lineAlign !== LineAlignment.Outset) {
            ctx.globalCompositeOperation = "source-over";
            if (this.attribute.isFill) {
                ctx.fillStyle = this.attribute.fillColor.toRGBA();
                ctx.fill();
            }
        }

        ctx.strokeStyle = this.attribute.lineColor.toRGBA();
        ctx.stroke();

        if (this.attribute.lineAlign === LineAlignment.Inset) {
            ctx.globalCompositeOperation = "destination-in";
            ctx.fill();
        } else if (this.attribute.lineAlign === LineAlignment.Outset) {
            ctx.globalCompositeOperation = "destination-out";
            ctx.fill();
        }

        if (this.attribute.lineAlign === LineAlignment.Outset) {
            ctx.globalCompositeOperation = "source-over";
            if (this.attribute.isFill) {
                ctx.fillStyle = this.attribute.fillColor.toRGBA();
                ctx.fill();
            }
        }

        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.setTransform(matrix);
        ctx.lineWidth = 1;
    }
}

export default DrawEllipse;