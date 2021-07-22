import IGeometry from "./IGeometry";
import { Rectangle } from "../structures";

interface IDrawable extends IGeometry {
    draw(ctx: CanvasRenderingContext2D): void;
    drawDetail(ctx: CanvasRenderingContext2D, pageScale: number, viewBoundary: Rectangle, isMemoryCache: boolean): void;    
}

export default IDrawable;