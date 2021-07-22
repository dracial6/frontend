import IBaseGeometry from "./IBaseGeometry";
import { Point, Rectangle, Size } from "../structures";
import ContentAlignment from "../structures/ContentAlignment";

interface IGeometry extends IBaseGeometry {
    minimumSize: Size;
    getBounds(): Rectangle;
    getRealRectangle(): Rectangle;
    getMaxXInMinBoundary(scalef: number): number;
    getMaxYInMinBoundary(scalef: number): number;
    rotate(degree: number): void;
    rotateCenter(centerPoint: Point, degree: number): void;
    rotateAlign(align: ContentAlignment, degree: number): void;
}

export default IGeometry;