import Point from './Point';
import Rectangle from './Rectangle';
import ResizeVertex from './ResizeVertex';
import DisplayLayer from './DisplayLayer';
import Cursors from './Cursors';

interface IDrawableGeometry {
    isSelected: boolean;
    isOvered: boolean;
    isMemberGeomGroup: boolean;
    isBackGround: boolean;
    enableResizable: boolean;
    enableMove: boolean;
    enableResizeVertex: ResizeVertex;
    rotationCenter: Point;
    enableMouseOver: boolean;
    layer: DisplayLayer;

    hitTest(point: Point): number;
    pointInObject(point: Point): boolean;
    contains(point: Point): boolean;
    containsAtMBRPoint(point: Point): boolean;
    containsAtMBRRectangle(rectangle: Rectangle): number;
    move(deltaX: number, deltaY: number): void;
    moveHandleTo(point: Point, handleNumber: number): void;
    getHandleCursor(handleNumber: number): Cursors;
    normalize(): void;
    drawTracker(ctx: CanvasRenderingContext2D, isResize: boolean): void;
    drawSelectedOutLine(ctx: CanvasRenderingContext2D): void;
    intersectsWith(rectangle: Rectangle): boolean;
    movePoint(point: Point): void;
    getTotalDegree(): number;
}

class DrawableGeometry implements IDrawableGeometry {
    isSelected = false;
    isOvered = false;
    isMemberGeomGroup = false;
    isBackGround = false;
    enableResizable = false;
    enableMove = false;
    enableResizeVertex: ResizeVertex = ResizeVertex.LeftAndBottom;
    rotationCenter: Point = new Point(0, 0);
    enableMouseOver = false;
    layer: DisplayLayer = DisplayLayer.One;

    hitTest(point: Point): number {
        throw new Error('Method not implemented.');
    }

    pointInObject(point: Point): boolean {
        throw new Error('Method not implemented.');
    }

    contains(point: Point): boolean {
        throw new Error('Method not implemented.');
    }

    containsAtMBRPoint(point: Point): boolean{
        throw new Error('Method not implemented.');
    }

    containsAtMBRRectangle(rectangle: Rectangle): number{
        throw new Error('Method not implemented.');
    }

    move(deltaX: number, deltaY: number): void {
        throw new Error('Method not implemented.');
    }

    moveHandleTo(point: Point, handleNumber: number): void {
        throw new Error('Method not implemented.');
    }

    getHandleCursor(handleNumber: number): Cursors {
        throw new Error('Method not implemented.');
    }

    normalize(): void {
        throw new Error('Method not implemented.');
    }

    drawTracker(ctx: any, isResize: boolean): void {
        throw new Error('Method not implemented.');
    }

    drawSelectedOutLine(ctx: any): void {
        throw new Error('Method not implemented.');
    }

    intersectsWith(rectangle: Rectangle): boolean {
        throw new Error('Method not implemented.');
    }

    movePoint(point: Point): void {
        throw new Error('Method not implemented.');
    }
    
    getTotalDegree(): number {
        throw new Error('Method not implemented.');
    }
}

export default DrawableGeometry;