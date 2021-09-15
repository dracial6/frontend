import DrawEllipse from "../../../drawing/elements/DrawEllipse";
import { Color, Point, Rectangle, Size } from "../../../drawing/structures";
import TBaseWheel from "./TBaseWheel";

class TWheelTire extends TBaseWheel {
    wheelSize = 0;
    count = 0;

    constructor(key: string, wheelSize: number, count: number, wheelBackColor: Color) {
        super(key);
        this.wheelSize = wheelSize;
        this.count = count;
        this.wheelBackColor = wheelBackColor;
        this.attribute.lineColor = wheelBackColor;
        this.attribute.fillColor = wheelBackColor;
        this.setSize();
    }

    setSize(): void {
        super.setSize(new Size(this.wheelSize * this.count, this.wheelSize));
    }

    drawWheel(ctx: CanvasRenderingContext2D, pageScale: number, canvasBoundary: Rectangle): void {
        const wheelWidth = this.wheelSize;
        const wheelHeight = this.wheelSize;

        const wheel = new DrawEllipse("", 0, 0, 0, 0);

        for (let i = 0; i < this.count; i++) {
            wheel.setLocation(new Point(this.getCurrentLocation().x + (i * wheelWidth), this.getCurrentLocation().y));
            wheel.setSize(new Size(wheelWidth, wheelHeight));
            wheel.attribute.lineColor = this.attribute.lineColor;
            wheel.attribute.fillColor = this.attribute.fillColor;
            wheel.draw(ctx);
        }
    }
}

export default TWheelTire;