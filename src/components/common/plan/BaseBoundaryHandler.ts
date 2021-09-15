import BaseDrawArea from "../../../drawing/BaseDrawArea";
import BaseDrawableObject from "../../../drawing/elements/BaseDrawableObject";
import BoundaryItem from "../items/BoundaryItem";
import BoundaryMode from "../structures/BoundaryMode";
import ViewDirection from "../structures/ViewDirection";
import TBoundary, { TBoundaryProperty } from "../TBoundary";
import BoundaryUtil from "./BoundaryUtil";
import IBoundaryContainer from "./IBoundaryContainer";

abstract class BaseBoundaryHandler {
    private _sortedBoundaryMap = new Map<string, BoundaryItem>();

    abstract getBoundaryContainer(block: string, bay: number, row: number): IBoundaryContainer | undefined;
    abstract getBoundaryContainerVD(viewDirection: ViewDirection, block: string, bay: number, row: number): IBoundaryContainer | undefined;
    abstract getBoundaryContainers(): IBoundaryContainer[];
    abstract getBaseDrawArea(): BaseDrawArea;

    private addBoundaryItem(key: string, item: BoundaryItem): void {
        this._sortedBoundaryMap.set(key, item);
        this._sortedBoundaryMap = new Map([...Array.from(this._sortedBoundaryMap.entries())].sort());
    }

    private removeBoundaryItem(key: string): void {
        this._sortedBoundaryMap.delete(key);
    }

    protected getBoundaryInfo(): Map<string, BoundaryItem>{
        return this._sortedBoundaryMap;
    }

    protected getBoundaryKey(block: string, startBay: number, startRow: number, startTier: number, endBay: number, endRow: number, endTier: number, seq: number, boundaryType: BoundaryMode, userDefineKey: string): string {
        return BoundaryUtil.getBoundaryKeyDetail(block, startBay, startRow, startTier, endBay, endRow, endTier, seq, boundaryType, userDefineKey);
    }

    getBoundaryItem(block: string, startBay: number, startRow: number, startTier: number, endBay: number, endRow: number, endTier: number, seq: number, boundaryType: BoundaryMode, userDefineKey: string): BoundaryItem | undefined {
        const key = this.getBoundaryKey(block, startBay, startRow, startTier, endBay, endRow, endTier, seq, boundaryType, userDefineKey);

        if (this._sortedBoundaryMap.has(key)) {
            return this._sortedBoundaryMap.get(key);
        }

        return undefined;
    }

    getBoundaryItemUserDefine(userDefineKey: string): BoundaryItem | undefined {
        if (userDefineKey.length > 0 && this._sortedBoundaryMap.has(userDefineKey)) {
            return this._sortedBoundaryMap.get(userDefineKey);
        }

        return undefined;
    }

    getBoundaryItems(): BoundaryItem[] {
        return Array.from(this._sortedBoundaryMap.values()) as BoundaryItem[];
    }

    makeBoundaryItem(block: string, startBay: number, startRow: number, startTier: number, endBay: number, endRow: number, endTier: number, seq: number, boundaryType: BoundaryMode, userDefineKey: string): BoundaryItem {
        let boundaryInfo = this.getBoundaryItem(block, startBay, startRow, startTier, endBay, endRow, endTier, seq, boundaryType, userDefineKey);

        if (!boundaryInfo) {
            boundaryInfo = new BoundaryItem();
            boundaryInfo.block = block;
            boundaryInfo.startBay = startBay;
            boundaryInfo.startRow = startRow;
            boundaryInfo.startTier = startTier;
            boundaryInfo.endBay = endBay;
            boundaryInfo.endRow = endRow;
            boundaryInfo.endTier = endTier;
            boundaryInfo.seq = seq;
            boundaryInfo.boundaryType = boundaryType;
            boundaryInfo.userDefineKey = userDefineKey;

            const key = this.getBoundaryKey(block, startBay, startRow, startTier, endBay, endRow, endTier, seq, boundaryType, userDefineKey);
            this.addBoundaryItem(key, boundaryInfo);
        }

        return boundaryInfo;
    }

    private findBoundaryKey(block: string, startBay: number, startRow: number, startTier: number, endBay: number, endRow: number, endTier: number, seq: number, boundaryType: BoundaryMode, userDefineKey: string): string | undefined {
        const key = this.getBoundaryKey(block, startBay, startRow, startTier, endBay, endRow, endTier, seq, boundaryType, userDefineKey);
        
        if (this._sortedBoundaryMap.has(key)) {
            return key;
        }

        return undefined;
    }

    addBoundary(bi: BoundaryItem, property: TBoundaryProperty): void {
        const key = this.getBoundaryKey(bi.block, bi.startBay, bi.startRow, bi.startTier, bi.endBay, bi.endRow, bi.endTier, bi.seq, bi.boundaryType, bi.userDefineKey);
        this.addBoundaryItem(key, bi);

        const drawObject = this.getBoundaryContainerVD(bi.viewDirection, bi.block, bi.startBay, bi.startRow);

        if (drawObject) {
            const tBoundary = drawObject.addBoundary(bi);
            if (tBoundary) {
                tBoundary.isBackground = false;
                tBoundary.property = property;
            }
        }
    }

    addBoundaries(block: string, boundaryInfos: BoundaryItem[]): void {
        if (boundaryInfos.length === 0) return;
        const drawObject = this.getBoundaryContainer(block, 0, 0);

        if (!drawObject) return;

        const len = boundaryInfos.length;
        for (let i = 0; i < len; i++) {
            const key = BoundaryUtil.getBoundaryKey(boundaryInfos[i]);
            this.addBoundaryItem(key, boundaryInfos[i]);
            drawObject.addBoundary(boundaryInfos[i]);
        }
    }

    removeBoundaries(block: string, boundaryInfos: BoundaryItem[]): void {
        if (boundaryInfos.length === 0) return;
        const drawObject = this.getBoundaryContainer(block, 0, 0);

        if (!drawObject) return;

        const len = boundaryInfos.length;
        for (let i = 0; i < len; i++) {
            const key = BoundaryUtil.getBoundaryKey(boundaryInfos[i]);
            this.removeBoundaryItem(key);
            drawObject.removeBoundary(boundaryInfos[i]);
        }
    }

    removeBoundaryDetail(block: string, startBay: number, startRow: number, startTier: number, endBay: number, endRow: number, endTier: number, seq: number, boundaryType: BoundaryMode, userDefineKey: string): void {
        const key = this.findBoundaryKey(block, startBay, startRow, startTier, endBay, endRow, endTier, seq, boundaryType, userDefineKey);

        if (key) {
            const drawObject = this.getBoundaryContainer(block, startBay, startRow);

            if (drawObject && this.getBoundaryInfo().has(key)) {
                drawObject.removeBoundary(this.getBoundaryInfo().get(key) as BoundaryItem);
            }

            this.removeBoundaryItem(key);
        }
    }

    removeBoundaryByUserDefineKey(userDefineKey: string): void {
        const item = this.getBoundaryItemUserDefine(userDefineKey);

        if (item && userDefineKey.length > 0) {
            const drawObj = this.getBoundaryContainer(item.block, item.startBay, item.startRow);

            if (drawObj && this.getBoundaryInfo().has(userDefineKey)) {
                drawObj.removeBoundary(this.getBoundaryInfo().get(userDefineKey) as BoundaryItem);
            }
            
            this.removeBoundaryItem(userDefineKey);
        }
    }

    removeBoundaryByFunction(func: (param: BoundaryItem[]) => BoundaryItem[]): void {
        const boundaryList = func(Array.from(this.getBoundaryInfo().values()));

        if (boundaryList.length > 0) {
            for (let i = 0; i < boundaryList.length; i++) {
                const bi = boundaryList[i];
                const key = this.getBoundaryKey(bi.block, bi.startBay, bi.startRow, bi.startTier, bi.endBay, bi.endRow, bi.endTier, bi.seq, bi.boundaryType, bi.userDefineKey);
                this.removeBoundaryItem(key);

                let drawObj: IBoundaryContainer | undefined;
                if (bi.viewDirection === ViewDirection.Front) {
                    drawObj = this.getBoundaryContainer(bi.block, bi.startBay, bi.startRow);
                } else {
                    drawObj = this.getBoundaryContainer(bi.block, bi.startRow, bi.startBay);
                }

                if (drawObj) {
                    drawObj.removeBoundary(bi);
                }
            }
        }
    }

    removeAllBoundary(): void {
        const list = this.getBoundaryContainers();

        list.forEach(boundary => {
            boundary.removeAllBoundary();
        });

        this.getBoundaryInfo().clear();
    }

    removeAllBoundaryByType(boundaryType: BoundaryMode): void {
        const func = (boundaries: BoundaryItem[]) => {
            const list: BoundaryItem[] = [];

            boundaries.forEach(boundary => {
                if (boundary.boundaryType === boundaryType) {
                    list.push(boundary);
                }
            });

            return list;
        }

        this.removeBoundaryByFunction(func);
    }

    setVisibleBoundary(visible: boolean): void {
        const list = this.getBoundaryContainers();

        list.forEach(element => {
            element.setVisibleBoundary(visible);
        });

        this.getBaseDrawArea().refresh();
    }

    setVisibleBoundaryByType(visible: boolean, boundaryType: BoundaryMode): void {
        const list = this.getBoundaryContainers();
        
        list.forEach(element => {
            if (element instanceof BaseDrawableObject) {
                const boundaryList = (element as BaseDrawableObject).getGeomListByMember("TBoundary");
                
                boundaryList.forEach(boundary => {
                    if ((boundary as TBoundary).boundary.boundaryType === boundaryType) {
                        element.visible = visible;
                    }
                });
            }
        });

        this.getBaseDrawArea().refresh();
    }

    setVisibleBoundaryByFunction(func: (param: BoundaryItem[]) => BoundaryItem[], visible: boolean): void {
        if (this.getBoundaryInfo().size === 0) return;

        let boundaryList = Array.from(this.getBoundaryInfo().values());
        boundaryList = func(boundaryList);
        boundaryList.forEach(boundary => {
            const boundaryContainer = this.getBoundaryContainer(boundary.block, boundary.startBay, boundary.startRow);
            if (boundaryContainer) {
                boundaryContainer.setVisibleBoundaryItem(boundary, visible);
            }
        });

        this.getBaseDrawArea().refresh();
    }

    setSelectionValue(isSelected: boolean): void {
        const list = this.getBoundaryContainers();

        list.forEach(element => {
            if (element instanceof BaseDrawableObject) {
                const boundaryList = element.getGeomListByMember("TBoundary");

                boundaryList.forEach(boundary => {
                    (boundary as TBoundary).isSelected = true;
                });
            }
        });
    }

    clear(): void {
        this._sortedBoundaryMap.clear();
    }
}

export default BaseBoundaryHandler;