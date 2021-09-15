import DirectionPriority from "../components/common/structures/DirectionPriority";
import IGeometry from "../drawing/elements/IGeometry";
import { Point } from "../drawing/structures";
import GeneralLogger from "../logger/GeneralLogger";

class DragSelectSortManager {
    getSort(directonPriority: DirectionPriority, isLeftStart: boolean, isTopStart: boolean, list: IGeometry[]): IGeometry[] {
        let checkIndex = 1;
        try {
            if (directonPriority === DirectionPriority.Vertical) {
                if (isLeftStart) {
                    if (isTopStart) checkIndex = 1;
                    else checkIndex = 2;
                } else {
                    if (isTopStart) checkIndex = 3;
                    else checkIndex = 4;
                }
            } else {
                if (isLeftStart) {
                    if (isTopStart) checkIndex = 5;
                    else checkIndex = 6;
                } else {
                    if (isTopStart) checkIndex = 7;
                    else checkIndex = 8;
                }
            }

            switch (checkIndex) {
                case 1: // 수직, 왼쪽, 위 기준
                    list.sort(this.verticalLeftTopSort);
                    break;
                case 2: // 수직, 왼쪽, 아래 기준
                    list.sort(this.verticalLeftBottomSort);
                    break;
                case 3: // 수직, 오른쪽, 위 기준
                    list.sort(this.verticalRightTopSort);
                    break;
                case 4: // 수직, 오른쪽, 아래 기준
                    list.sort(this.verticalRightBottomSort);
                    break;
                case 5: // 수평, 왼쪽, 위 기준
                    list.sort(this.horizontalLeftTopSort);
                    break;
                case 6: // 수평, 왼쪽, 아래 기준
                    list.sort(this.horizontalLeftBottomSort);
                    break;
                case 7: // 수평, 오른쪽, 위 기준
                    list.sort(this.horizontalRightTopSort);
                    break;
                case 8: // 수평, 오른쪽, 아래 기준
                    list.sort(this.horizontalRightBottomSort);
                    break;
            }
        } catch (ex) {
            GeneralLogger.error(ex);
        }

        return list;
    }

    private verticalLeftTopSort(b1: IGeometry, b2: IGeometry) : number {
        const p1 = new Point(b1.getRealRectangle().x, b1.getRealRectangle().y);
        const p2 = new Point(b2.getRealRectangle().x, b2.getRealRectangle().y);
        
        if (p1.x > p2.x) {
            return 1;
        } else if (p1.x < p2.x) {
            return -1;
        } else {
            if (p1.y > p2.y) {
                return 1;
            } else if
             (p1.y < p2.y) {
                return -1;
            } else
             return 0;
        }
    }

    private verticalLeftBottomSort(b1: IGeometry, b2: IGeometry) : number {
        const p1 = new Point(b1.getRealRectangle().x, b1.getRealRectangle().y + b1.getRealRectangle().height);
        const p2 = new Point(b2.getRealRectangle().x, b2.getRealRectangle().y + b2.getRealRectangle().height);
        if (p1.x > p2.x) {
            return 1;
        } else if (p1.x < p2.x) {
            return -1;
        } else {
            if (p1.y > p2.y) {
                return -1;
            } else if (p1.y < p2.y) {
                return 1;
            } else
                return 0;
        }
    }

    private verticalRightTopSort(b1: IGeometry, b2: IGeometry) : number {
        const p1 = new Point(b1.getRealRectangle().x + b1.getRealRectangle().width, b1.getRealRectangle().y);
        const p2 = new Point(b2.getRealRectangle().x + b2.getRealRectangle().width, b2.getRealRectangle().y);
        
        if (p1.x > p2.x) {
            return -1;
        } else if (p1.x < p2.x) {
            return 1;
        } else {
            if (p1.y > p2.y) {
                return 1;
            } else if (p1.y < p2.y) {
                return -1;
            } else
                return 0;
        }
    }
    
    private verticalRightBottomSort(b1: IGeometry, b2: IGeometry) : number {
        const p1 = new Point(b1.getRealRectangle().x + b1.getRealRectangle().width
            , b1.getRealRectangle().y + b1.getRealRectangle().height);
        const p2 = new Point(b2.getRealRectangle().x + b2.getRealRectangle().width
            , b2.getRealRectangle().y + +b2.getRealRectangle().height);
        
        if (p1.x > p2.x) {
            return -1;
        } else if (p1.x < p2.x) {
            return 1;
        } else {
            if (p1.y > p2.y) {
                return -1;
            } else if (p1.y < p2.y) {
                return 1;
            } else
                return 0;
        }
    }

    private horizontalLeftTopSort(b1: IGeometry, b2: IGeometry) : number {
        const p1 = new Point(b1.getRealRectangle().x, b1.getRealRectangle().y);
        const p2 = new Point(b2.getRealRectangle().x, b2.getRealRectangle().y);
        
        if (p1.y > p2.y) {
            return 1;
        } else if (p1.y < p2.y) {
            return -1;
        } else {
            if (p1.x > p2.x) {
                return 1;
            } else if (p1.x < p2.x) {
                return -1;
            } else
                return 0;
        }
    }

    private horizontalLeftBottomSort(b1: IGeometry, b2: IGeometry) : number {
        const p1 = new Point(b1.getRealRectangle().x, b1.getRealRectangle().y + b1.getRealRectangle().height);
        const p2 = new Point(b2.getRealRectangle().x, b2.getRealRectangle().y + b2.getRealRectangle().height);
        
        if (p1.y > p2.y) {
            return -1;
        } else if (p1.y < p2.y) {
            return 1;
        } else {
            if (p1.x > p2.x) {
                return 1;
            } else if (p1.x < p2.x) {
                return -1;
            } else
                return 0;
        }
    }

    private horizontalRightTopSort(b1: IGeometry, b2: IGeometry) : number {
        const p1 = new Point(b1.getRealRectangle().x + b1.getRealRectangle().width, b1.getRealRectangle().y);
        const p2 = new Point(b2.getRealRectangle().x + b2.getRealRectangle().width, b2.getRealRectangle().y);
        
        if (p1.y > p2.y) {
            return 1;
        } else if (p1.y < p2.y) {
            return -1;
        } else {
            if (p1.x > p2.x) {
                return -1;
            } else if (p1.x < p2.x) {
                return 1;
            } else
                return 0;
        }
    }

    private horizontalRightBottomSort(b1: IGeometry, b2: IGeometry) : number {
        const p1 = new Point(b1.getRealRectangle().x + b1.getRealRectangle().width
            , b1.getRealRectangle().y + b1.getRealRectangle().height);
        const p2 = new Point(b2.getRealRectangle().x + b2.getRealRectangle().width
            , b2.getRealRectangle().y + +b2.getRealRectangle().height);
        if (p1.y > p2.y) {
            return -1;
        } else if (p1.y < p2.y) {
            return 1;
        } else {
            if (p1.x > p2.x) {
                return -1;
            } else if (p1.x < p2.x) {
                return 1;
            } else
                return 0;
        }
    }
}

export default DragSelectSortManager;