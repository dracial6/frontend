import BaseDrawArea from "./../../BaseDrawArea";
import BaseEventHandler from "./BaseEventHandler";
import DrawAreaStatus from "./../../DrawAreaStatus";
import IDrawableGeometry from "./../../elements/IDrawableGeometry";
import DrawCanvasEventArgs from "./../../events/DrawCanvasEventArgs";
import { DrawControlEventType, OperationMode, Point } from "./../../structures";
import BaseDrawableObject from "../../elements/BaseDrawableObject";

class MouseClickHandler extends BaseEventHandler {    
    constructor(state: DrawAreaStatus) {
        super(state);
    }
    
    doHandling(drawArea: BaseDrawArea, e: MouseEvent): void {
        if (super.getCurrentOperationMode() === OperationMode.NetSelection) return;
        if (super.getCurrentOperationMode() === OperationMode.Size) return;

        const point = new Point(e.pageX, e.pageY);
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

                if (element instanceof BaseDrawableObject) {
                    (element as BaseDrawableObject).onMouseClick(drawArea, e);
                    //this.showContextMenu()
                }
            }
        });

        if (clickList.length > 0) {
            const eventArgs = new DrawCanvasEventArgs(e);
            eventArgs.eventType = DrawControlEventType.Mouse_Click;
            eventArgs.selectionList = clickList;

            if (clickedGeom) {
                eventArgs.geometry = clickedGeom;
            } else {
                eventArgs.geometry = clickList[0] as IDrawableGeometry;
            }

            drawArea.eventHandler(DrawControlEventType.Mouse_Click, eventArgs);
        }
    }
}

export default MouseClickHandler;