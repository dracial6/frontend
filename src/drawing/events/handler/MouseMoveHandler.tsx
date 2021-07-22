import BaseDrawArea from "../../BaseDrawArea";
import DrawAreaStatus from "../../DrawAreaStatus";
import BaseDrawableObject from "../../elements/BaseDrawableObject";
import DrawableObject from "../../elements/DrawableObject";
import IDrawableGeometry from "../../elements/IDrawableGeometry";
import { Cursors, DrawControlEventType, OperationMode, Point, Size } from "../../structures";
import BaseEventHandler from "./BaseEventHandler";
import DrawCanvasEventArgs from "./../DrawCanvasEventArgs";
import DrawDragEventArgs from "./../DrawDragEventArgs";
import IDragable from "../../elements/IDragable";

class MouseMoveHandler extends BaseEventHandler {
    private _point:Point = Point.Empty();

    constructor(state: DrawAreaStatus) {
        super(state);
    }
    
    doHandling(drawArea: BaseDrawArea, e: MouseEvent): void {
        if (this.getOperationMode() === OperationMode.None) {
            this.setCurrentOperationMode(OperationMode.None);
        }

        this._point = new Point(e.pageX, e.pageY);

        this.doNone(drawArea);
        let isContinue = drawArea.isMouseClick();

        const tempLastPoint = super.getLastPoint();
        const dx = e.pageX - this.getLastPoint().x;
        const dy = e.pageY - this.getLastPoint().y;

        super.setLastPoint(e.pageX, e.pageY);

        if (isContinue) {
            isContinue = this.doResize(drawArea, e);
        }

        if (isContinue) {
            isContinue = this.doMove(drawArea, e, dx, dy, tempLastPoint);
        }

        if (isContinue) {
            isContinue = this.doDrag(drawArea);
        }

        if (isContinue) {
            isContinue = this.doDragSelection(drawArea, e);
        }
    }

    private doNone(drawArea: BaseDrawArea): boolean {
        if (drawArea.isMouseClick()) return true;

        if (drawArea.isDrawableObjectMouseOver
        || drawArea.isDrawableObjectMove
        || drawArea.isDrawableObjectResize
        || drawArea.isDrawableObjectSelect) {
            let cursor = Cursors.default;
            let overObj = undefined;

            const drawList = drawArea.getDefaultDrawList().getDrawListAtEventHandle();
            const temp = super.getCurrentOverObject();
            
            for (let i = 0; i < drawList.length; i++) {
                const obj = drawList[i];

                if (obj.isBackground) {
                    continue;
                }

                if (!obj.enableResizable) {
                    continue;
                }

                let n = obj.hitTest(this._point);
                if (!super.isValidHandleNumber(obj.enableResizeVertex, n)) n = 0;

                if (n === 0) {
                    if (drawArea.isDrawableObjectMouseOver) {
                        overObj = obj;

                        if (overObj instanceof DrawableObject) {
                            overObj = (overObj as DrawableObject).getDrawableObject(this._point) as IDrawableGeometry;
                        }

                        if (overObj.enableMouseOver) {
                            if (temp && temp.name !== overObj.name) {
                                temp.setIsOvered(false);
                            }

                            overObj.setIsOvered(true);

                            if (!temp || temp.name !== overObj.name) {
                                drawArea.refresh();
                            }

                            super.setCurrentOverObject(overObj);

                            return false;
                        }
                    }
                } else if (n > 0) {
                    if (drawArea.isDrawableObjectResize) {
                        drawArea.setCursor(obj.getHandleCursor(n));
                    }

                    return false;
                }
            }

            if (temp) {
                const n = temp.hitTest(this._point);
                if (n < 0) {
                    temp.setIsOvered(false);
                    drawArea.setCursor(Cursors.default);
                    super.setCurrentOverObject(undefined);
                    drawArea.refresh();
                    return false;
                } else if (n === 0) {
                    return false;
                }
            }

            if (!cursor) {
                cursor = Cursors.default;
            }

            drawArea.setCursor(cursor);
            return false;
        }

        return true;
    }

    private doResize(drawArea: BaseDrawArea, e: MouseEvent): boolean {
        if (this.getOperationMode() === OperationMode.Size) {
            this.setCurrentOperationMode(OperationMode.Size);

            const temp = this.getResizedObject();

            if (temp) {
                temp.moveHandleTo(this._point, this.getResizedObjectHandle());

                if (temp instanceof BaseDrawableObject) {
                    (temp as BaseDrawableObject).onResize(drawArea, e);
                }

                if (this.getResizedObject()) {
                    const drawCanvasEventArgs = new DrawCanvasEventArgs(e);
                    drawCanvasEventArgs.setResizeInfo(DrawControlEventType.Mouse_DragResize, this._point, this.getResizedObjectHandle(), this.getResizedObject());
                    drawArea.eventHandler(DrawControlEventType.Mouse_DragResize, drawCanvasEventArgs);
                }

                drawArea.refresh();
                return false;                
            }
        }

        return true;
    }

    private doMove(drawArea: BaseDrawArea, e: MouseEvent, dx: number, dy: number, tempLastPoint: Point): boolean {
        if (drawArea.isDrawableObjectMove) {
            if (this.getOperationMode() === OperationMode.Move && (dx !== 0 || dy !== 0)) {
                this.setCurrentOperationMode(OperationMode.Move);
                
                const mpt = new Point(dx, dy);
                if (mpt.equal(Point.Empty())) {
                    super.setLastPoint(tempLastPoint.x, tempLastPoint.y);
                    return true;
                }

                if (super.getCacheMoveList().length === 0) {
                    const list = drawArea.getDefaultDrawList().findSelection();

                    for (let i = 0; i < list.length; i++) {
                        const obj = list[i];

                        if (!obj.enableMove) continue;

                        if (!super.getMoveStart()) {
                            if (obj instanceof BaseDrawableObject) {
                                (obj as BaseDrawableObject).onMoveBegin(drawArea, e);
                            }
                        }

                        super.getCacheMoveList().push(obj);
                    }
                }

                if (super.getCacheMoveList().length > 0) {
                    const list = this.getCacheMoveList();

                    for (let i = 0; i < list.length; i++) {
                        const obj = list[i] as IDrawableGeometry;
                        obj.move(mpt.x, mpt.y);

                        if (obj instanceof BaseDrawableObject) {
                            (obj as BaseDrawableObject).onMouseMove(drawArea, e);
                        }
                    }
                }

                if (drawArea.isDrawableObjectMouseOver) {
                    const tempTargetOver = this.getCurrentTargetOverObject();
                    if (tempTargetOver) {
                        tempTargetOver.setIsOvered(false);
                        super.setCurrentTargetOverObject(undefined);
                    }

                    const list = drawArea.getDefaultDrawList().getDrawListAtEventHandle();
                    const tempOver = super.getCurrentOverObject();
                    
                    for (let i = 0; i < list.length; i++) {
                        const obj = list[i];
                        
                        if (tempOver === obj) {
                            continue;
                        }

                        if (obj instanceof DrawableObject) {
                            continue;
                        }

                        if (!tempOver) continue;

                        if (obj.getBounds().intersectsWith(tempOver.getBounds())) {
                            drawArea.getDefaultDrawList().unOverGeometryObjectAll();
                            obj.setIsOvered(true);
                            super.setCurrentTargetOverObject(obj);
                            break;
                        }
                    }
                }

                drawArea.setCursor(Cursors.move);

                if (super.getCacheMoveList().length > 0) {
                    const drawCanvasEventArgs = new DrawCanvasEventArgs(e);
                    drawCanvasEventArgs.setMovingInfo(DrawControlEventType.Mouse_DragMove, new Size(mpt.x, mpt.y), super.getCacheMoveList());
                    drawArea.eventHandler(DrawControlEventType.Mouse_DragMove, drawCanvasEventArgs);
                }

                super.setMoveStart(true);
                drawArea.refresh();
                return false;
            }
        }

        return true;
    }

    private doDrag(drawArea: BaseDrawArea): boolean {
        if (drawArea.allowDragAtDrawControl) {
            if (this.getOperationMode() === OperationMode.DragDrop) {
                this.setCurrentOperationMode(OperationMode.DragDrop);

                const list = drawArea.getDefaultDrawList().getDragableList();
                if (list.length > 0) {
                    const args = new DrawDragEventArgs(drawArea.getCurrentMouseButton(), this.getDragItem(list), list);
                    drawArea.eventHandlerDrag(DrawControlEventType.Mouse_ItemDrag, args);
                }

                drawArea.refresh();
                super.setOperationMode(OperationMode.None);
                return false;
            }
        }

        return true;
    }

    private getDragItem(list: IDrawableGeometry[]): any {
        if (list.length === 0) return undefined;

        const resultList:any[] = [];

        list.forEach(element => {
            if ('isDragable' in element && (element as any as IDragable).isDragable) {
                resultList.push((element as any as IDragable).getDragData());
            }
        });

        return resultList;
    }

    private doDragSelection(drawArea: BaseDrawArea, e: MouseEvent): boolean {
        if (this.getOperationMode() === OperationMode.MouseDown) {
            if (this.getMouseCheckPoint().x !== e.pageX || this.getMouseCheckPoint().y !== e.pageY) {
                this.setOperationMode(OperationMode.NetSelection);
            }
        }

        if (this.getOperationMode() === OperationMode.NetSelection) {
            drawArea.setCursor(Cursors.default);
            this.setCurrentOperationMode(OperationMode.NetSelection);

            if (drawArea.isDrawableObjectDragSelect) {
                drawArea.setDragLine(drawArea.visibleMouseDragLine, e.pageX, e.pageY);
                return false;
            }
        }

        return true;
    }
}

export default MouseMoveHandler;