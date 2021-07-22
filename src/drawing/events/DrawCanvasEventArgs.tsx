import DrawableUtil from "../../utils/DrawableUtil";
import GeometryObject from "../elements/GeometryObject";
import IDrawableGeometry from "../elements/IDrawableGeometry";
import { DrawControlEventType, Point, Rectangle, Size } from "../structures";

class DrawCanvasEventArgs {
    eventType: DrawControlEventType = DrawControlEventType.None;
    selectionList: IDrawableGeometry[] = [];
    dropTarget?: GeometryObject;
    geometry?: IDrawableGeometry;
    mouseEvent: MouseEvent;
    dragSelectBoundary = Rectangle.Empty();
    dragStartPoint = Point.Empty();
    dragEndPoint = Point.Empty();
    dragMoveSize = Size.Empty();
    dragResizePoint = Point.Empty();
    handleNumber = 0;

    constructor(mouseEvent: MouseEvent) {
        this.mouseEvent = mouseEvent;
    }

    setMovingInfo(eventType: DrawControlEventType, dragMoveSize: Size, selectionList: IDrawableGeometry[]): void {
        this.eventType = eventType;
        this.dragMoveSize = dragMoveSize;
        this.selectionList = selectionList;
    }

    setResizeInfo(eventType: DrawControlEventType, dragResizePoint: Point, handleNumber: number, geometry: IDrawableGeometry | undefined): void {
        this.eventType = eventType;
        this.dragResizePoint = dragResizePoint;
        this.handleNumber = handleNumber;
        this.geometry = geometry;
    }

    setMoveInfo(eventType: DrawControlEventType, selectionList: IDrawableGeometry[]): void {
        this.eventType = eventType;
        this.selectionList = selectionList;
        
        if (selectionList.length > 0){
            this.geometry = selectionList[0];
        }
    }

    getDragBoundary(): Rectangle {
        if (this.dragStartPoint || this.dragEndPoint) {
            return Rectangle.Empty();
        }

        const p1:Point[] = [];
        p1.push(this.dragStartPoint);
        p1.push(this.dragEndPoint);

        return DrawableUtil.getMBR(p1);
    }
}

export default DrawCanvasEventArgs;