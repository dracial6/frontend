import DrawableObject from "../../../drawing/elements/DrawableObject";
import { Color, Rectangle } from "../../../drawing/structures";

abstract class TBaseWheel extends DrawableObject {
    wheelBackColor = Color.Transparent();

    constructor(key: string) {
        super(key);
    }

    abstract drawWheel(ctx: CanvasRenderingContext2D, pageScale: number, canvasBoundary: Rectangle): void;

    drawDetail(ctx: CanvasRenderingContext2D, pageScale: number, canvasBoundary: Rectangle, isMemoryCache: boolean): void {
        this.drawWheel(ctx, pageScale, canvasBoundary);
    }

    onMouseDown(sender: any, event: MouseEvent): void {
        
    }
    onMouseMove(sender: any, event: MouseEvent): void {
        
    }
    onMouseUp(sender: any, event: MouseEvent): void {
        
    }
    onSelected(sender: any, event: MouseEvent): void {
        
    }
    onMouseHover(sender: any, event: MouseEvent): void {
        
    }
    onMouseLeave(sender: any, event: MouseEvent): void {
        
    }
    onMouseClick(sender: any, event: MouseEvent): void {
        
    }
    onResize(sender: any, event: MouseEvent): void {
        
    }
}

export default TBaseWheel;