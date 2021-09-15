import IGeometry from "../../../drawing/elements/IGeometry";
import DrawCanvasEventArgs from "../../../drawing/events/DrawCanvasEventArgs";
import DragSelectSortManager from "../../../utils/DragSelectSortManager";
import DirectionPriority from "../structures/DirectionPriority";
import HorizontalDirection from "../structures/HorizontalDirection";
import VerticalDirection from "../structures/VerticalDirection";

class DragSelectManager {
    private _dragSelectSortHandler = new DragSelectSortManager();
    
    private isLeftStart(pEventInfo: DrawCanvasEventArgs, horizontalDirection: HorizontalDirection) : boolean {
        let isLeftStart = true;
        try {
            if (pEventInfo.dragStartPoint.x - pEventInfo.dragEndPoint.x > 0) {
                isLeftStart = false;
            }
            
            if (horizontalDirection !== HorizontalDirection.MouseDrag) {
                if (horizontalDirection === HorizontalDirection.LeftToRight) {
                    isLeftStart = true;
                } else if (horizontalDirection === HorizontalDirection.RightToLeft) {
                    isLeftStart = false;
                }
            }
        } catch (ex) {
            isLeftStart = true;
        }

        return isLeftStart;
    }

    private isTopStart(pEventInfo: DrawCanvasEventArgs, verticalDirection: VerticalDirection) : boolean {
        let isTopStart = true;
        try {
            if (pEventInfo.dragStartPoint.y - pEventInfo.dragEndPoint.y > 0) {
                isTopStart = false;
            }
            
            if (verticalDirection !== VerticalDirection.MouseDrag) {
                if (verticalDirection === VerticalDirection.UpToDown) {
                    isTopStart = true;
                } else if (verticalDirection === VerticalDirection.DownToUp) {
                    isTopStart = false;
                }
            }
        } catch (Exception) {
            isTopStart = true;
        }

        return isTopStart;
    }

    private getSort(directionPriority: DirectionPriority, isLeftStart: boolean, isTopStart: boolean, list: IGeometry[]): IGeometry[] {
        return this._dragSelectSortHandler.getSort(directionPriority, isLeftStart, isTopStart, list);
    }

    getSortList(pEventInfo: DrawCanvasEventArgs, directionPriority: DirectionPriority
        , horizontalDirection: HorizontalDirection, verticalDirection: VerticalDirection, list: IGeometry[]): IGeometry[] {
        const isLeftStart = this.isLeftStart(pEventInfo, horizontalDirection);
        const isTopStart = this.isTopStart(pEventInfo, verticalDirection);
        return this.getSort(directionPriority, isLeftStart, isTopStart, list);
    }
}

export default DragSelectManager;
    