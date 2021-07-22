import IDrawableGeometry from "./elements/IDrawableGeometry";
import { OperationMode, Point } from "./structures";

class DrawAreaStatus {
    private _mouseCheckPoint = new Point(0, 0);
    private _startPoint = new Point(0, 0);
    private _lastPoint = new Point(0, 0);

    selectMode = OperationMode.None;
    currentOperationMode = OperationMode.None;
    currentResizeObject?: IDrawableGeometry;
    resizedObject?: IDrawableGeometry;
    resizedObjectHandle = 0;
    moveStart = false;
    cacheMoveList: IDrawableGeometry[] = [];
    startScrollPositionX = 0;
    startScrollPositionY = 0;
    currentOverObject?: IDrawableGeometry;
    currentTargetOverObject?: IDrawableGeometry;
    alreadySelectedList: IDrawableGeometry[] = [];
    currentPressingObject?: IDrawableGeometry;
    
    setMouseCheckPoint(x: number, y: number): void {
        this._mouseCheckPoint.x = x;
        this._mouseCheckPoint.y = y;
    }

    getMouseCheckPoint(): Point {
        return this._mouseCheckPoint;
    }

    setStartPoint(x: number, y: number): void {
        this._startPoint.x = x;
        this._startPoint.y = y;
    }

    getStartPoint(): Point {
        return this._startPoint;
    }

    setLastPoint(x: number, y: number): void {
        this._lastPoint.x = x;
        this._lastPoint.y = y;
    }

    getLastPoint(): Point {
        return this._lastPoint;
    }
}

export default DrawAreaStatus;