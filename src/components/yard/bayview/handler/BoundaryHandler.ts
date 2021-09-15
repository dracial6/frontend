import BaseDrawArea from "../../../../drawing/BaseDrawArea";
import SearchUtil from "../../../../utils/SearchUtil";
import BoundaryItem from "../../../common/items/BoundaryItem";
import BaseBoundaryHandler from "../../../common/plan/BaseBoundaryHandler";
import IBoundaryContainer from "../../../common/plan/IBoundaryContainer";
import BoundaryMode from "../../../common/structures/BoundaryMode";
import ViewDirection from "../../../common/structures/ViewDirection";
import TBayRowGroup from "../TBayRowGroup";
import YBayView from "../YBayView";

class BoundaryHandler extends BaseBoundaryHandler {
    private _yBayView: YBayView;

    constructor(yBayView: YBayView) {
        super();
        this._yBayView = yBayView;
    }

    getBoundaryContainer(block: string, bay: number, row: number): IBoundaryContainer | undefined {
        return this._yBayView.getTBay(block, bay, row);
    }
    getBoundaryContainerVD(viewDirection: ViewDirection, block: string, bay: number, row: number): IBoundaryContainer | undefined {
        return this._yBayView.getTBayViewDir(viewDirection, block, bay, row);
    }
    getBoundaryContainers(): IBoundaryContainer[] {
        const list = SearchUtil.getGeometryListByMemberPoint(this._yBayView.getDrawArea().getDefaultDrawList().getDrawList(), "TBayRowGroup", undefined, false, undefined);
        const returnList: IBoundaryContainer[] = [];
        list.forEach(element => {
            if (element) {
                if (element instanceof TBayRowGroup) {
                    returnList.push((element as TBayRowGroup).tBay);
                }
            }
        });

        return returnList;
    }

    getBaseDrawArea(): BaseDrawArea {
        return this._yBayView.getDrawArea();
    }

    removeBoundary(viewDir: ViewDirection, block: string, bayRow: number) : void {
        let func = undefined;
        if (viewDir === ViewDirection.Side) {
            func = (boundaries: BoundaryItem[]) => {
                const list: BoundaryItem[] = [];
    
                boundaries.forEach(boundary => {
                    if (boundary.block === block && boundary.startRow === bayRow) {
                        list.push(boundary);
                    }
                });
    
                return list;
            }
        } else {
            func = (boundaries: BoundaryItem[]) => {
                const list: BoundaryItem[] = [];
    
                boundaries.forEach(boundary => {
                    if (boundary.block === block && boundary.startBay === bayRow) {
                        list.push(boundary);
                    }
                });
    
                return list;
            }
        }

        super.removeBoundaryByFunction(func);
    }

    removeBoundaryWithBoundaryMode(viewDir: ViewDirection, block: string, bayRow: number, boundaryType: BoundaryMode) : void {
        let func = undefined;
        if (viewDir === ViewDirection.Side) {
            func = (boundaries: BoundaryItem[]) => {
                const list: BoundaryItem[] = [];
    
                boundaries.forEach(boundary => {
                    if (boundary.block === block && boundary.startRow === bayRow && boundary.boundaryType === boundaryType) {
                        list.push(boundary);
                    }
                });
    
                return list;
            }
        } else {
            func = (boundaries: BoundaryItem[]) => {
                const list: BoundaryItem[] = [];
    
                boundaries.forEach(boundary => {
                    if (boundary.block === block && boundary.startBay === bayRow && boundary.boundaryType === boundaryType) {
                        list.push(boundary);
                    }
                });
    
                return list;
            }
        }
        
        super.removeBoundaryByFunction(func);
    }

    drawBoundary() : void {
        const boundaryInfo = this.getBoundaryItems();
        if (boundaryInfo.length > 0) {
            for (const bi of boundaryInfo) {
                const tBay = this._yBayView.getTBay(bi.block, bi.startBay, bi.startRow);
                if (tBay) {
                    tBay.removeBoundary(bi);
                    tBay.addBoundary(bi);
                }
            }
        }
    }
}

export default BoundaryHandler;