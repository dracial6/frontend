import BaseDrawArea from "../../BaseDrawArea";
import DrawAreaStatus from "../../DrawAreaStatus";
import IDrawableGeometry from "../../elements/IDrawableGeometry";
import { DrawControlEventType, Point } from "../../structures";
import DrawCanvasEventArgs from "../DrawCanvasEventArgs";
import MouseClickHandler from "./MouseClickHandler";
import MouseDownHandler from "./MouseDownHandler";
import MouseMoveHandler from "./MouseMoveHandler";
import MouseUpHandler from "./MouseUpHandler";

class DrawableEventManager {
    private _clickHdl: MouseClickHandler;
    private _downHdl: MouseDownHandler;
    private _moveHdl: MouseMoveHandler;
    private _upHdl: MouseUpHandler;

    constructor(state: DrawAreaStatus) {
        this._clickHdl = new MouseClickHandler(state);
        this._downHdl = new MouseDownHandler(state);
        this._moveHdl = new MouseMoveHandler(state);
        this._upHdl = new MouseUpHandler(state);
    }

    onMouseDown(drawArea: BaseDrawArea, e: MouseEvent): void {
        this._downHdl.doHandling(drawArea, e);
    }

    onMouseMove(drawArea: BaseDrawArea, e: MouseEvent): void {
        this._moveHdl.doHandling(drawArea, e);
    }

    onMouseUp(drawArea: BaseDrawArea, e: MouseEvent): void {
        this._upHdl.doHandling(drawArea, e);
    }

    onMouseClick(drawArea: BaseDrawArea, e: MouseEvent): void {
        this._clickHdl.doHandling(drawArea, e);
    }

    onSelected(drawArea: BaseDrawArea, e: MouseEvent): void {
        const point = new Point(e.x, e.y);
        const drawList = drawArea.getDefaultDrawList().getDrawObjectAllVisible(true);
        const clickList: IDrawableGeometry[] = [];
        let clickedGeom: IDrawableGeometry | undefined = undefined;

        drawList.forEach(element => {
            const handleNumber = element.hitTest(point);

            if (handleNumber >= 0) {
                clickList.push(element);

                if (!clickedGeom && !element.isBackground) {
                    clickedGeom = element;
                }
            }
        });

        if (clickList.length > 0) {
            const eventArgs = new DrawCanvasEventArgs(e);
            eventArgs.eventType = DrawControlEventType.Mouse_DoubleClick;
            eventArgs.selectionList = clickList;

            if (clickedGeom) {
                eventArgs.geometry = clickedGeom;
            } else {
                eventArgs.geometry = clickList[0] as IDrawableGeometry;
            }

            drawArea.eventHandler(DrawControlEventType.Mouse_DoubleClick, eventArgs);
        }
    }
}

export default DrawableEventManager;