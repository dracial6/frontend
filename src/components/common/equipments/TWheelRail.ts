import DrawLine from "../../../drawing/elements/DrawLine";
import DrawRectangle from "../../../drawing/elements/DrawRectangle";
import { Color, Point, Rectangle, Size } from "../../../drawing/structures";
import TBaseWheel from "./TBaseWheel";

class TWheelRail extends TBaseWheel {
    wheelWidth = 0;
    railWidth = 0;
    railHeight = 0;

    constructor(key: string, wheelWidth: number, railWidth: number, railHeight: number, wheelBackColor: Color) {
        super(key);
        this.wheelWidth = wheelWidth;
        this.railWidth = railWidth;
        this.railHeight = railHeight;
        this.wheelBackColor = wheelBackColor;
        this.attribute.lineColor = wheelBackColor;
        this.attribute.fillColor = wheelBackColor;

        this.setSize();
    }

    setSize(): void {
        super.setSize(new Size(this.railWidth, this.railHeight));
    }

    drawWheel(ctx: CanvasRenderingContext2D, pageScale: number, canvasBoundary: Rectangle): void {
        const width = this.railWidth;
        const wheelHeight = this.railHeight * 0.4;
        const startGap = (width - this.wheelWidth) / 2;

        const wheel = new DrawRectangle("");
        wheel.attribute.lineColor = this.attribute.lineColor;
        wheel.attribute.lineThick = 1;

        wheel.setLocation(new Point(this.getCurrentLocation().x + startGap, this.getCurrentLocation().y + 1));
        wheel.setSize(new Size(this.wheelWidth, wheelHeight));
        wheel.draw(ctx);

        const rail = new DrawLine("", 0, 0, 0, 0,);
        rail.attribute.lineColor = this.attribute.lineColor;
        rail.attribute.lineThick = 2;

        //left
        rail.setStartPoint(new Point(this.getCurrentLocation().x + startGap, this.getCurrentLocation().y));
        rail.setEndPoint(new Point(this.getCurrentLocation().x, this.getCurrentLocation().y + this.railHeight));
        rail.draw(ctx);

        //right
        rail.setStartPoint(new Point(this.getCurrentLocation().x + startGap + this.wheelWidth, this.getCurrentLocation().y));
        rail.setEndPoint(new Point(this.getCurrentLocation().x + width, this.getCurrentLocation().y + this.railHeight));
        rail.draw(ctx);
    }
}

export default TWheelRail;