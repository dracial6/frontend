import BaseDrawArea from "../../BaseDrawArea";
import DrawAreaStatus from "../../DrawAreaStatus";
import IDrawableGeometry from "../../elements/IDrawableGeometry";
import { OperationMode, Point, ResizeVertex } from "../../structures";

abstract class BaseEventHandler {
    private _state: DrawAreaStatus;

    constructor(state: DrawAreaStatus) {
        this._state = state;
    }

    abstract doHandling(drawArea: BaseDrawArea, e: MouseEvent): void;

    setMouseCheckPoint(x: number, y: number): void {
        this._state.setMouseCheckPoint(x, y);
    }

    getMouseCheckPoint(): Point {
        return this._state.getMouseCheckPoint();
    }

    setOperationMode(selectMode: OperationMode): void {
        this._state.selectMode = selectMode;
    }

    getOperationMode(): OperationMode {
        return this._state.selectMode;
    }

    setCurrentOperationMode(operationMode: OperationMode) {
        this._state.currentOperationMode = operationMode;
    }

    getCurrentOperationMode(): OperationMode {
        return this._state.currentOperationMode;
    }

    setResizedObject(operationMode: IDrawableGeometry | undefined) {
        this._state.resizedObject = operationMode;
    }

    getResizedObject(): IDrawableGeometry | undefined {
        return this._state.resizedObject;
    }

    setResizedObjectHandle(resizedObjectHandle: number) {
        this._state.resizedObjectHandle = resizedObjectHandle;
    }

    getResizedObjectHandle(): number {
        return this._state.resizedObjectHandle;
    }

    setStartPoint(x: number, y: number): void {
        this._state.setStartPoint(x, y);
    }

    getStartPoint(): Point {
        return this._state.getStartPoint();
    }

    setLastPoint(x: number, y: number): void {
        this._state.setLastPoint(x, y);
    }

    getLastPoint(): Point {
        return this._state.getLastPoint();
    }

    setMoveStart(moveStart: boolean): void {
        this._state.moveStart = moveStart;
    }

    getMoveStart(): boolean {
        return this._state.moveStart;
    }

    setCacheMoveList(moveList: IDrawableGeometry[]): void {
        this._state.cacheMoveList = moveList;
    }

    getCacheMoveList(): IDrawableGeometry[] {
        return this._state.cacheMoveList;
    }

    setCurrentOverObject(currentOverObject: IDrawableGeometry | undefined): void {
        this._state.currentOverObject = currentOverObject;
    }

    getCurrentOverObject(): IDrawableGeometry | undefined {
        return this._state.currentOverObject;
    }

    setCurrentTargetOverObject(currentTargetOverObject: IDrawableGeometry | undefined): void {
        this._state.currentTargetOverObject = currentTargetOverObject;
    }

    getCurrentTargetOverObject(): IDrawableGeometry | undefined {
        return this._state.currentTargetOverObject;
    }

    setAlreadySelectedList(alreadySelectedList: IDrawableGeometry[]): void {
        this._state.alreadySelectedList = alreadySelectedList;
    }

    getAlreadySelectedList(): IDrawableGeometry[] {
        return this._state.alreadySelectedList;
    }

    setCurrentPressingObject(currentPressingObject: IDrawableGeometry | undefined): void {
        this._state.currentPressingObject = currentPressingObject;
    }

    getCurrentPressingObject(): IDrawableGeometry | undefined {
        return this._state.currentPressingObject;
    }

    protected isValidHandleNumber(resizeVertex: ResizeVertex, handleNumber: number): boolean {
        if (handleNumber > 0) {
            if ((resizeVertex & (1 << (handleNumber - 1))) === 0) {
                return false;    
            }
        }

        return true;
    }
}

export default BaseEventHandler;