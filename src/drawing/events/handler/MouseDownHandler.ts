import { useImperativeHandle } from "react";
import SearchUtil from "../../../utils/SearchUtil";
import BaseDrawArea from "../../BaseDrawArea";
import BaseEventHandler from "./BaseEventHandler";
import DrawAreaStatus from "../../DrawAreaStatus";
import BaseDrawableObject from "../../elements/BaseDrawableObject";
import IDragable from "../../elements/IDragable";
import IDrawableGeometry from "../../elements/IDrawableGeometry";
import DrawCanvasEventArgs from "../DrawCanvasEventArgs";
import { Cursors, DrawControlEventType, OperationMode, Point } from "../../structures";

class MouseDownHandler extends BaseEventHandler {
    private _point:Point = Point.empty();
    
    deepSearch = false;

    constructor(state: DrawAreaStatus) {
        super(state);
    }

    doHandling(drawArea: BaseDrawArea, e: MouseEvent): void {
        this._point = new Point(e.pageX, e.pageY);
        super.setMouseCheckPoint(e.pageX, e.pageY);
        super.setOperationMode(OperationMode.None);
        super.setCurrentOperationMode(OperationMode.None);
        
        this.beginResize(drawArea, e);
        this.beginSelect(drawArea, e);
        this.beginNetSelection(drawArea, e);

        super.setLastPoint(e.pageX, e.pageY);
        super.setStartPoint(e.pageX, e.pageY);
    }

    private beginResize(drawArea: BaseDrawArea, e: MouseEvent): void {
        if (!drawArea.isDrawableObjectResize) return;

        const list = drawArea.getDefaultDrawList().findSelection();

        for (let i = 0; i < list.length; i++) {
            const obj = list[i];
            if (!obj.enableResizable) continue;
            let handleNumber = obj.hitTest(this._point);

            if (!super.isValidHandleNumber(obj.enableResizeVertex, handleNumber)) handleNumber = 0;

            if (handleNumber > 0 && !obj.isBackground) {
                super.setOperationMode(OperationMode.Size);
                super.setResizedObject(obj);
                super.setResizedObjectHandle(handleNumber);

                drawArea.getDefaultDrawList().unSelectAll();
                obj.isSelected = true;

                const resizeObj = this.getResizedObject();
                if (resizeObj instanceof BaseDrawableObject) {
                    (resizeObj as BaseDrawableObject).onResizeBegin(drawArea, e);
                }

                if (resizeObj) {
                    const drawCanvasEventArgs = new DrawCanvasEventArgs(e);
                    drawCanvasEventArgs.setResizeInfo(DrawControlEventType.Mouse_DragResizeBegin, this._point, this.getResizedObjectHandle(), this.getResizedObject());
                    drawArea.eventHandler(DrawControlEventType.Mouse_DragResizeBegin, drawCanvasEventArgs);
                }

                break;
            }
        }
    }

    private beginSelect(drawArea: BaseDrawArea, e: MouseEvent): void {
        if (drawArea.isDrawableObjectSelect) return;

        let isRefresh = false;
        let prevIsSelected = false;
        const alreadySelectedList = [];

        super.setAlreadySelectedList([]);
        super.setCurrentPressingObject(undefined);

        if (this.getOperationMode() === OperationMode.None) {
            let obj;

            if (this.deepSearch) {
                const drawList = SearchUtil.getGeometryListByMemberPoint(drawArea.getDefaultDrawList().getDrawList(), "isChanged", true, true, this._point);

                for (let i = 0; i < drawList.length; i++) {
                    const temp = drawList[i];
                    if (temp.isBackground) {
                        continue;
                    } else {
                        obj = temp;
                    }
                    break;
                }
            } else {
                const drawList = drawArea.getDefaultDrawList().getDrawListAtEventHandle();
    
                for (let i = 0; i < drawList.length; i++) {
                    const temp = drawList[i];
                    if (temp.hitTest(this._point) >= 0) {
                        if (temp.isBackground) {
                            continue;
                        } else {
                            obj = temp;
                        }
                        break;
                    }
                }
            }

            if (obj) {
                if (drawArea.getAllowDragAtDrawControl() || drawArea.isChildDrawableObjectSelect) {
                    if (obj instanceof BaseDrawableObject) {
                        const dummyList = obj.getGeomListByMember('isChanged') as IDrawableGeometry[];
                        const dragObjs = SearchUtil.getGeometryListByMemberPoint(dummyList, 'isDragable', true, true, undefined);

                        if (dragObjs && dragObjs.length > 0) {
                            if (drawArea.getAllowDragAtDrawControl() && (dragObjs[0] as any as IDragable).isDragable === false) {
                                obj = dragObjs[0] as IDrawableGeometry;
                            } else if (drawArea.isChildDrawableObjectSelect) {
                                obj = dragObjs[0] as IDrawableGeometry;
                            }
                        }
                    }
                }

                super.setCurrentPressingObject(obj);

                if ('isChanged' in obj) {
                    prevIsSelected = obj.isSelected;

                    if ((obj  as any as IDragable).isDragable && drawArea.getAllowDragAtDrawControl()) {
                        super.setOperationMode(OperationMode.DragDrop);
                    } else if ((obj  as any as IDragable).isDragable === false && drawArea.isChildDrawableObjectSelect) {
                        super.setOperationMode(OperationMode.MouseDown);
                    } else {
                        if (drawArea.isDrawableObjectMove) {
                            super.setMoveStart(false);
                            super.setCacheMoveList([]);
                            super.setOperationMode(OperationMode.Move);
                            drawArea.setCursor(Cursors.move);
                        }
                    }

                    if ((BaseDrawArea.IsCtrlKeyPressed === false || drawArea.isDrawableObjectDragSelect)
                    && !obj.isSelected) {
                        drawArea.getDefaultDrawList().unSelectAll();
                        isRefresh = true;
                    }

                    if (obj.isSelected) {
                        alreadySelectedList.push(obj);
                    }

                    obj.isSelected = true;
                    super.setAlreadySelectedList(alreadySelectedList);

                    if (!drawArea.isDrawableObjectMove && !drawArea.getAllowDragAtDrawControl()) {
                        super.setOperationMode(OperationMode.Hover);
                    }

                    if (obj.isSelected) {
                        (obj as BaseDrawableObject).onMouseDown(drawArea, e);
                    }

                    if (!prevIsSelected) {
                        if (drawArea.getAutoSelectionToFront()) {
                            drawArea.getDefaultDrawList().moveSelectionToTop();
                        }
                    }

                    if (isRefresh) {
                        drawArea.refresh();
                    }
                }
            }            
        }
    }

    private beginNetSelection(drawArea: BaseDrawArea, e: MouseEvent): void {
        if (this.getOperationMode() === OperationMode.None || this.getOperationMode() === OperationMode.Hover) {
            if (this.getOperationMode() === OperationMode.None) {
                if (BaseDrawArea.IsCtrlKeyPressed === false)
                    drawArea.getDefaultDrawList().unSelectAll();
            }

            super.setOperationMode(OperationMode.MouseDown);
        }
    }
}

export default MouseDownHandler;