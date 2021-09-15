import IBaseGeometry from "../../../drawing/elements/IBaseGeometry";
import { Color } from "../../../drawing/structures";
import GeneralLogger from "../../../logger/GeneralLogger";
import IGeomMarking from "../../shipplan/IGeomMarking";
import { MarkingTypes } from "../../shipplan/structures";
import YBayView from "../../yard/bayview/YBayView";
import TBaseContainer from "../../yard/TBaseContainer";
import ContainerBayItem from "../items/ContainerBayItem";
import BlockType from "../structures/BlockType";
import ViewDirection from "../structures/ViewDirection";
import YTLaneLocTypes from "../structures/YTLaneLocTypes";

class ContainerHandler {
    private _yBayView : YBayView;
    private _containerList : ContainerBayItem[] = [];

    constructor (yBayView: YBayView) {
        this._yBayView = yBayView;
    }

    containerAttribute(block: string, bay: number, row: number, tier: number) : ContainerBayItem {
        try {
            let container = this.getContainerItemWithBlock(block, bay, row, tier);
            if (!container) {
                container = new ContainerBayItem();
                container.block = block;
                container.bay = bay;
                container.row = row;
                container.tier = tier;
                this._containerList.push(container);
            }
            
            return container;
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    removeMarking(block: string, bay: number, row: number, tier: number) : void {
        try {
            const tContainer = this.getContainerObject(block, bay, row, tier) as any as IGeomMarking;
            if (tContainer) {
                tContainer.setMarking(false);
                this._yBayView.getDrawArea().isChanged = true;
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    removeMarkingByViewDir(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number) : void {
        this.removeMarkingByYTLane(viewDir, block, bay, row, tier, YTLaneLocTypes.None);
    }

    removeMarkingByYTLane(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number, ytLaneLocTypes: YTLaneLocTypes) : void {
        try {
            const tContainer = this.getContainerObjectWithViewDirYTLane(viewDir, block, bay, row, tier, ytLaneLocTypes) as any as IGeomMarking;
            if (tContainer) {
                tContainer.setMarking(false);
                this._yBayView.getDrawArea().isChanged = true;
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    clearMarking() : void {
        try {
            for (let item of this._containerList) {
                this.removeMarking(item.block, item.bay, item.row, item.tier);
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    setMarking(block: string, bay: number, row: number, tier: number, isVisible: boolean) : void {
        try {
            const tContainer = this.getContainerObject(block, bay, row, tier) as any as IGeomMarking;
            if (tContainer) {
                tContainer.markingSizeRatio = 4;
                tContainer.setMarking(isVisible);
                this._yBayView.getDrawArea().isChanged = true;
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    setMarkingColor(block: string, bay: number, row: number, tier: number, isVisible: boolean, backColor: Color, borderColor: Color) : void {
        try {
            const tContainer = this.getContainerObject(block, bay, row, tier) as any as IGeomMarking;
            if (tContainer) {
                tContainer.markingSizeRatio = 4;
                tContainer.setMarkingColor(isVisible, backColor, borderColor);
                this._yBayView.getDrawArea().isChanged = true;
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    setMarkingMarkingType(block: string, bay: number, row: number, tier: number, isVisible: boolean, backColor: Color, borderColor: Color, markingType: MarkingTypes) : void {
        this.setMarkingColorMarkingType(block, bay, row, tier, YTLaneLocTypes.None, isVisible, backColor, borderColor, markingType);
    }

    setMarkingColorMarkingType(block: string, bay: number, row: number, tier: number, ytLaneLocTypes: YTLaneLocTypes, isVisible: boolean, backColor: Color, borderColor: Color, markingType: MarkingTypes) : void {
        this.setMarkingDetail(block, bay, row, tier, ytLaneLocTypes, isVisible, backColor, borderColor, markingType, 0);
    }

    setMarkingDetail(block: string, bay: number, row: number, tier: number, ytLaneLocTypes: YTLaneLocTypes, isVisible: boolean, backColor: Color, borderColor: Color, markingType: MarkingTypes, lineThick: number) : void {
        try {
            const tContainer = this.getContainerObjectWithYTLane(block, bay, row, tier, ytLaneLocTypes) as any as IGeomMarking;
            if (tContainer) {
                tContainer.markingSizeRatio = 4;
                tContainer.setMarkingBorderThickByType(isVisible, backColor, borderColor, markingType, lineThick);
                this._yBayView.getDrawArea().isChanged = true;
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    addMarking(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number, backColor: Color, borderColor: Color) : void {
        this.addMarkingMarkingType(viewDir, block, bay, row, tier, YTLaneLocTypes.None, backColor, borderColor, MarkingTypes.CIRCLE);
    }

    addMarkingYT(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number, ytLaneLocTypes: YTLaneLocTypes, backColor: Color, borderColor: Color) : void {
        this.addMarkingMarkingType(viewDir, block, bay, row, tier, ytLaneLocTypes, backColor, borderColor, MarkingTypes.CIRCLE);
    }

    addMarkingMarkingType(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number, ytLaneLocTypes: YTLaneLocTypes, backColor: Color, borderColor: Color, markingType: MarkingTypes) : void {
        this.addMarkingDetail(viewDir, block, bay, row, tier, ytLaneLocTypes, backColor, borderColor, markingType, 0);
    }

    addMarkingDetail(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number, ytLaneLocTypes: YTLaneLocTypes, backColor: Color, borderColor: Color, markingType: MarkingTypes, lineThick: number) : void {
        try {
            const tcontainer = this.getContainerObjectWithViewDirYTLane(viewDir, block, bay, row, tier, ytLaneLocTypes) as any as IGeomMarking;
            if (tcontainer) {
                tcontainer.markingSizeRatio = 4;
                tcontainer.setMarkingBorderThickByType(true, backColor, borderColor, markingType, lineThick);
                this._yBayView.getDrawArea().isChanged = true;
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    isMarking(block: string, bay: number, row: number, tier: number, ytLaneLocTypes: YTLaneLocTypes) : boolean {
        try {
            const markableContainer = this.getContainerObjectWithYTLane(block, bay, row, tier, ytLaneLocTypes) as any as IGeomMarking;
            if (markableContainer) {
                return markableContainer.getMarked();
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }

        return false;
    }

    setLayout(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number, ytLaneLocTypes: YTLaneLocTypes, slotPadding: number, containerValidation: boolean, fontRate: number) : void {
        try {
            const tbay = this._yBayView.getTBayViewDir(viewDir, block, bay, row);
            if (tbay) {
                const item = this.getContainerItemWithYTLane(block, bay, row, tier, ytLaneLocTypes);
                const geom = this.getContainerObjectWithViewDirYTLane(viewDir, block, bay, row, tier, ytLaneLocTypes);
                if (geom && item) {
                    tbay.setContainerLocation(geom, item, slotPadding, containerValidation);
                    tbay.setContainerSize(geom, item, slotPadding, containerValidation);
                    tbay.moveFirst(geom);
                }
                
                this._yBayView.getDrawArea().isChanged = true;
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }
    
    setData(container: ContainerBayItem) : void {
        try {
            const idx = this.getContainerItemIndex(container.block, container.bay, container.row, container.tier);
            if (idx >= 0) {
                this._containerList[idx] = container;
            } else {
                this._containerList.push(container);
            }

            this._yBayView.getDrawArea().isChanged = true;
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    setDatas(containerList: ContainerBayItem[]) : void {
        try {
            for (let tempSlot of containerList) {
                let container = this.getContainerItemWithBlock(tempSlot.block, tempSlot.bay, tempSlot.row, tempSlot.tier);
                if (container) {
                    container = tempSlot;
                } else {
                    this._containerList.push(tempSlot);
                }
            }

            this._yBayView.getDrawArea().isChanged = true;
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    changeContainerInfo(viewDir: ViewDirection, block: string, fromBay: number, fromRow: number, fromTier: number, fromYTLaneLocTypes: YTLaneLocTypes, toBay: number, toRow: number, toTier: number, toYTLaneLocTypes: YTLaneLocTypes, slotPadding: number, containerValidation: boolean, fontRate: number) : void {
        const containerItems = this.getContainerItemsWithYTLane(block, fromBay, fromRow, fromTier, fromYTLaneLocTypes);
        const count = containerItems.length;
        if (containerItems && count > 0) {
            const containerItem = containerItems[0];
            if (containerItem) {
                containerItem.bay = toBay;
                containerItem.row = toRow;
                containerItem.tier = toTier;
                containerItem.ytLaneLocTypes = toYTLaneLocTypes;
                this._containerList.splice(this._containerList.indexOf(containerItem), 1);
                this._containerList.splice(0, 0, containerItem);
                let geomContainer = this.getContainerObjectWithYTLane(block, fromBay, fromRow, fromTier, fromYTLaneLocTypes);
                const tbay = this._yBayView.getTBayViewDir(viewDir, block, toBay, toRow);
                if (tbay && geomContainer) {
                    tbay.moveFirst(geomContainer);
                    if (geomContainer === undefined) {
                        this.paintContainer(containerItem, slotPadding, containerValidation, fontRate);
                        this._yBayView.getDrawArea().isChanged = true;
                        geomContainer = this.getContainerObjectWithYTLane(block, toBay, toRow, toTier, toYTLaneLocTypes);
                    }
                } else {
                    this.removeContainerObject(viewDir, block, fromBay, fromRow, fromTier, fromYTLaneLocTypes);
                }
                
                if (geomContainer) {
                    geomContainer.name = this.getContainerKey(block, toBay, toRow, toTier, toYTLaneLocTypes.toString());
                    if (geomContainer instanceof TBaseContainer) {
                        (geomContainer as TBaseContainer).searchKey = containerItem.searchKey;
                    }
                }
            }
        }
    }

    clearByViewDir(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number) : void {
        try {
            const items = this.getContainerItems(block, bay, row, tier);
            if (items.length > 0) {
                this.removeContainerObjectsByViewDir(viewDir, items);
            }
            this.removeAllContainerItemWithBlock(block, bay, row, tier);
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    clearByBlock(block: string, bay: number, row: number, tier: number) : void {
            try {
                const items = this.getContainerItems(block, bay, row, tier);
                if (items.length > 0) {
                    this.removeContainerObjects(items);
                }
                this.removeAllContainerItemWithBlock(block, bay, row, tier);
            } catch (ex) {
                GeneralLogger.error(ex);
                throw ex;
            }
        }

    clearByContainerNo(containerNo: string) : void {
        try {
            const items = this.getContainerItemsWithNo(containerNo);
            if (items.length > 0) {
                this.removeContainerObjects(items);
            }
            this.removeAllContainerItemWithNo(containerNo);
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    clearDetail(containerNo: string, block: string, bay: number, row: number, tier: number) : void {
        try {
            const items = this.getContainerItemsWithNoBlock(containerNo, block, bay, row, tier);
            if (items.length > 0) {
                this.removeContainerObjects(items);
            }
            this.removeAllContainerItem(containerNo, block, bay, row, tier);
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    clearAll() : void {
        try {
            if (this._containerList) {
                this.removeContainerObjects(this._containerList);
            }
            this._containerList.length = 0;
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    removeContainerByNoYTLane(viewDir: ViewDirection, containerNo: string, ytLaneLocTypes: YTLaneLocTypes) : void {
        const item = this.getContainerItemWithNoYTLane(containerNo, ytLaneLocTypes);
        if (item) {
            this.removeContainerObject(viewDir, item.block, item.bay, item.row, item.tier, item.ytLaneLocTypes);
            this.removeContainerItemWithNo(item.containerNo.text, ytLaneLocTypes);
        }
    }

    removeContainerByBlockYTLane(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number, ytLaneLocTypes: YTLaneLocTypes) : void {
        const item = this.getContainerItemWithYTLane(block, bay, row, tier, ytLaneLocTypes);
        if (item) {
            this.removeContainerObject(viewDir, item.block, item.bay, item.row, item.tier, item.ytLaneLocTypes);
            this.removeContainerItemWithYTLane(block, item.bay, item.row, item.tier, ytLaneLocTypes);
        }
    }

    removeContainerByNo(viewDir: ViewDirection, containerNo: string) : void {
        const item = this.getContainerItemWithNo(containerNo);
        if (item) {
            this.removeContainerObject(viewDir, item.block, item.bay, item.row, item.tier, item.ytLaneLocTypes);
            this.removeContainerItemWithBlock(item.block, item.bay, item.row, item.tier);
        }
    }

    removeContainerByBlock(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number) : void {
        const item = this.getContainerItemWithBlock(block, bay, row, tier);
        if (item) {
            this.removeContainerObject(viewDir, item.block, item.bay, item.row, item.tier, item.ytLaneLocTypes);
            this.removeContainerItemWithBlock(item.block, item.bay, item.row, item.tier);
        }
    }

    removeContainerByNoBlock(viewDir: ViewDirection, containerNo: string, block: string, bay: number, row: number, tier: number) : void {
        const item = this.getContainerItemWithNoBlock(containerNo, block, bay, row, tier);
        if (item) {
            this.removeContainerObject(viewDir, item.block, item.bay, item.row, item.tier, item.ytLaneLocTypes);
            this.removeContainerItemWithBlock(block, item.bay, item.row, item.tier);
        }
    }

    removeContainerDetail(viewDir: ViewDirection, containerNo: string, block: string, bay: number, row: number, tier: number, ytLaneLocTypes: YTLaneLocTypes) : void {
        const item = this.getContainerItem(containerNo, block, bay, row, tier, ytLaneLocTypes);
        if (item) {
            this.removeContainerObject(viewDir, item.block, item.bay, item.row, item.tier, item.ytLaneLocTypes);
            this.removeContainerItemWithYTLane(block, bay, row, tier, ytLaneLocTypes);
        }
    }

    removeContainerByItem(item: ContainerBayItem) : void {
        this.removeContainerByBlockYTLane(0, item.block, item.bay, item.row, item.tier, item.ytLaneLocTypes);
    }

    private removeContainerObject(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number, ytLaneLocTypes: YTLaneLocTypes) : void {
        let tbay = undefined;
        try {
            if (viewDir === 0) {
                tbay = this._yBayView.getTBay(block, bay, row);
            } else {
                tbay = this._yBayView.getTBayViewDir(viewDir, block, bay, row);
            }

            if (tbay) {
                const keyName = this.getContainerKey(block, bay, row, tier, ytLaneLocTypes.toString());
                tbay.removeGeomObjectKey(keyName);
                this._yBayView.getDrawArea().isChanged = true;
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    private removeContainerObjects(items: ContainerBayItem[]) : void {
        this.removeContainerObjectsByViewDir(0, items);
    }

    private removeContainerObjectsByViewDir(viewDir: ViewDirection, items: ContainerBayItem[]) : void {
        if (items) {
            for (let item of items) {
                if (item) {
                    this.removeContainerObject(viewDir, item.block, item.bay, item.row, item.tier, item.ytLaneLocTypes);
                }
            }
        }
    }

    clearContainerObject(viewDir: ViewDirection) : void {
        this.removeContainerObjectsByViewDir(viewDir, this._containerList);
    }

    draw(block: string, bay: number, row: number, tier: number, slotPadding: number, containerValidation: boolean, fontRate: number) : void {
        try {
            this.drawWithAllowDuplication(block, bay, row, tier, slotPadding, containerValidation, fontRate, false);
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    drawWithAllowDuplication(block: string, bay: number, row: number, tier: number, slotPadding: number, containerValidation: boolean, fontRate: number, allowDuplication: boolean) : void {
        try {
            const slot = this.getContainerItemWithBlock(block, bay, row, tier);
            if (slot) {
                this.paintContainerWithAllowDuplication(slot, slotPadding, containerValidation, fontRate, allowDuplication);
                this._yBayView.getDrawArea().isChanged = true;
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    drawWithFacility(block: string, bay: number, row: number, tier: number, facility: string, slotPadding: number, containerValidation: boolean, fontRate: number) : void {
        try {
            const slot = this.getContainerItemWithBlock(block, bay, row, tier);
            if (slot) {
                this.paintContainerWithFacility(slot, facility, slotPadding, containerValidation, fontRate);
                this._yBayView.getDrawArea().isChanged = true;
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    drawWithYTLaneAllowDuplication(block: string, bay: number, row: number, tier: number, ytLaneLocTypes: YTLaneLocTypes, slotPadding: number, containerValidation: boolean, fontRate: number, allowDuplication: boolean) : void {
        try {
            const slot = this.getContainerItemWithYTLane(block, bay, row, tier, ytLaneLocTypes);
            if (slot) {
                this.paintContainerWithAllowDuplication(slot, slotPadding, containerValidation, fontRate, allowDuplication);
                this._yBayView.getDrawArea().isChanged = true;
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    drawWithYTLaneFacility(block: string, bay: number, row: number, tier: number, ytLaneLocTypes: YTLaneLocTypes, facility: string, slotPadding: number, containerValidation: boolean, fontRate: number) : void {
        try {
            const slot = this.getContainerItemWithYTLane(block, bay, row, tier, ytLaneLocTypes);
            if (slot) {
                this.paintContainerWithFacility(slot, facility, slotPadding, containerValidation, fontRate);
                this._yBayView.getDrawArea().isChanged = true;
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    private paintContainerWithFacility(slot: ContainerBayItem, facility: string, slotPadding: number, containerValidation: boolean, fontRate: number) : void {
        if (slot === undefined) return;
        try {
            let viewDir = ViewDirection.Front;
            if (facility === BlockType.SC) {
                viewDir = ViewDirection.Side;
            }

            const tbay = this._yBayView.getTBayViewDir(viewDir, slot.block, slot.bay, slot.row);
            if (tbay) {
                const key = this.getContainerKey(slot.block, slot.bay, slot.row, slot.tier, slot.ytLaneLocTypes.toString());
                tbay.addContainer(key, slot, slotPadding, containerValidation, fontRate, false);
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    private paintContainer(slot: ContainerBayItem, slotPadding: number, containerValidation: boolean, fontRate: number) : void {
        this.paintContainerWithAllowDuplication(slot, slotPadding, containerValidation, fontRate, false);
    }

    private paintContainerWithAllowDuplication(slot: ContainerBayItem, slotPadding: number, containerValidation: boolean, fontRate: number, allowDuplication: boolean) : void {
        if (slot === undefined) return;
        try {
            const tbay = this._yBayView.getTBay(slot.block, slot.bay, slot.row);
            if (tbay) {
                const key = this.getContainerKey(slot.block, slot.bay, slot.row, slot.tier, slot.ytLaneLocTypes.toString());
                tbay.addContainer(key, slot, slotPadding, containerValidation, fontRate, allowDuplication);
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    clear() : void {
        if (this._containerList) {
            this._containerList.length = 0;
        }
    }

    addContainer(block: string, bayRow: number, viewDir: ViewDirection, slotPadding: number, containerValidation: boolean, fontRate: number) : void {
        try {
            let containerList = undefined;
            if (viewDir === ViewDirection.Front) {
                containerList = this._containerList.filter(x => x.block === block && x.bay === bayRow); 
            } else {
                containerList = this._containerList.filter(x => x.block === block && x.row === bayRow);
            }

            for (let i = 0; i < containerList.length; i++) {
                if (viewDir === ViewDirection.Side) {
                    this.paintContainerWithFacility(containerList[i], "S", slotPadding, containerValidation, fontRate);
                } else {
                    this.paintContainerWithFacility(containerList[i], "", slotPadding, containerValidation, fontRate);
                }
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    drawContainerItems(slotPadding: number, containerValidation: boolean, fontRate: number) : void {
        try {
            const length = this._containerList.length;
            for (let j = 0; j < length; j++) {
                this.paintContainer(this._containerList[j], slotPadding, containerValidation, fontRate);
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    private getContainerObject(block: string, bay: number, row: number, tier: number) : IBaseGeometry | undefined {
        return this.getContainerObjectWithYTLane(block, bay, row, tier, YTLaneLocTypes.None);
    }

    private getContainerObjectWithYTLane(block: string, bay: number, row: number, tier: number, ytLaneLocTypes: YTLaneLocTypes) : IBaseGeometry | undefined {
        let tbay = undefined;
        let containerObject = undefined;
        
        try {
            tbay = this._yBayView.getTBay(block, bay, row);
            if (tbay) {
                const key = this.getContainerKey(block, bay, row, tier, ytLaneLocTypes.toString());
                containerObject = tbay.find(key);
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }

        return containerObject;
    }

    private getContainerObjectWithViewDir(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number) : IBaseGeometry | undefined {
        return this.getContainerObjectWithViewDirYTLane(viewDir, block, bay, row, tier, YTLaneLocTypes.None);
    }

    private getContainerObjectWithViewDirYTLane(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number, ytLaneLocTypes: YTLaneLocTypes) : IBaseGeometry | undefined {
        let tbay = undefined;
        let containerObject = undefined;
        try {
            tbay = this._yBayView.getTBayViewDir(viewDir, block, bay, row);
            if (tbay) {
                const key = this.getContainerKey(block, bay, row, tier, ytLaneLocTypes.toString());
                containerObject = tbay.find(key);
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }

        return containerObject;
    }

    getContainerInfo() : ContainerBayItem[] {
        return this._containerList;
    }

    private getContainerKey(block: string, bay: number, row: number, tier: number, ytLaneLocType: string) : string {
        return "TContainer_" + block + "_" + bay + "_" + row + "_" + tier + "_" + ytLaneLocType;
    }

    getContainerItems(block: string, bay: number, row: number, tier: number) : ContainerBayItem[] {
        try {
            return this._containerList.filter(x => x && x.block === block && x.bay === bay && x.row === row && x.tier === tier);
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    getContainerItemsWithYTLane(block: string, bay: number, row: number, tier: number, ytLaneLocTypes: YTLaneLocTypes) : ContainerBayItem[] {
        try {
            return this._containerList.filter(x => x && x.block === block && x.bay === bay && x.row === row && x.tier === tier && x.ytLaneLocTypes === ytLaneLocTypes);
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    getContainerItemByObjectKey(key: string) : ContainerBayItem | undefined {
        let item = undefined;
        try {
            const splitKey = key.split("_");
            if (splitKey.length === 6 || splitKey.length === 7) {
                const block = splitKey[1];
                const ytLaneTypes = parseInt(splitKey[5]);
                const bay = parseInt(splitKey[2]);
                const row = parseInt(splitKey[3]);
                const tier = parseInt(splitKey[4]);
                if (isNaN(bay) === false && isNaN(row) === false && isNaN(tier) === false) {
                    item = this._containerList.find(x => x && x.block === block && x.bay === bay && x.row === row && x.tier === tier && x.ytLaneLocTypes === ytLaneTypes);
                }
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
        return item;
    }

    getContainerItemsWithNo(containerNo: string) : ContainerBayItem[] {
        try {
            return this._containerList.filter(x => x && x.containerNo.text === containerNo);
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    getContainerItemWithNo(containerNo: string) : ContainerBayItem | undefined {
        try {
            return this._containerList.find(x => x && x.containerNo.text === containerNo);
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    getContainerItemWithBlock(block: string, bay: number, row: number, tier: number) : ContainerBayItem | undefined {
        try {
            return this._containerList.find(x => x && x.block === block && x.bay === bay && x.row === row && x.tier === tier);
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    getContainerItemWithNoBlock(containerNo: string, block: string, bay: number, row: number, tier: number) : ContainerBayItem | undefined {
        try {
            return this._containerList.find(x => x && x.containerNo.text === containerNo && x.block === block && x.bay === bay && x.row === row && x.tier === tier);
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    getContainerItemWithYTLane(block: string, bay: number, row: number, tier: number, ytLaneLocTypes: YTLaneLocTypes) : ContainerBayItem | undefined {
        try {
            return this._containerList.find(x => x && x.block === block && x.bay === bay && x.row === row && x.tier === tier && x.ytLaneLocTypes === ytLaneLocTypes);
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    getContainerItemWithNoYTLane(containerNo: string, ytLaneLocTypes: YTLaneLocTypes) : ContainerBayItem | undefined {
        try {
            return this._containerList.find(x => x && x.containerNo.text === containerNo && x.ytLaneLocTypes === ytLaneLocTypes);
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    getContainerItem(containerNo: string, block: string, bay: number, row: number, tier: number, ytLaneLocTypes: YTLaneLocTypes) : ContainerBayItem | undefined {
        try {
            return this._containerList.find(x => x && x.containerNo.text === containerNo && x.block === block && x.bay === bay && x.row === row && x.tier === tier && x.ytLaneLocTypes === ytLaneLocTypes);
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    getContainerItemsWithNoBlock(containerNo: string, block: string, bay: number, row: number, tier: number) : ContainerBayItem[] {
        try {
            return this._containerList.filter(x => x && x.containerNo.text === containerNo && x.block === block && x.bay === bay && x.row === row && x.tier === tier);
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    private getContainerItemIndex(block: string, bay: number, row: number, tier: number) : number {
        try {
            return this._containerList.findIndex(x => x && x.block === block && x.bay === bay && x.row === row && x.tier === tier);
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    private removeContainerItemWithBlock(block: string, bay: number, row: number, tier: number) : void {
        try {
            const index = this._containerList.findIndex(x => x && x.block === block && x.bay === bay && x.row === row && x.tier === tier);
            this._containerList.splice(index, 1);
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    private removeContainerItemWithYTLane(block: string, bay: number, row: number, tier: number, ytLaneLocTypes: YTLaneLocTypes) : void {
        try {
            const index = this._containerList.findIndex(x => x && x.block === block && x.bay === bay && x.row === row && x.tier === tier && x.ytLaneLocTypes === ytLaneLocTypes);
            this._containerList.splice(index, 1);
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    private removeContainerItemWithNo(containerNo: string, ytLaneLocTypes: YTLaneLocTypes) : void {
        try {
            const index = this._containerList.findIndex(x => x && x.containerNo.text === containerNo && x.ytLaneLocTypes === ytLaneLocTypes);
            this._containerList.splice(index, 1);
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    private removeAllContainerItemWithBlock(block: string, bay: number, row: number, tier: number) : void {
        try {
            const index = this._containerList.findIndex(x => x && x.block === block && x.bay === bay && x.row === row && x.tier === tier);
            this._containerList.splice(index, 1);
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    private removeAllContainerItemWithNo(containerNo: string) : void {
        try {
            this._containerList = this._containerList.filter(x => x && x.containerNo.text !== containerNo);            
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    private removeAllContainerItem(containerNo: string, block: string, bay: number, row: number, tier: number) : void {
        try {
            this._containerList = this._containerList.filter(x => !x || x.containerNo.text !== containerNo || x.block !== block || x.bay !== bay || x.row !== row || x.tier !== tier);            
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }
}

export default ContainerHandler