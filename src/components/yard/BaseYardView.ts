import DrawUserComponent from "../../drawing/DrawUserComponent";
import IDrawableGeometry from "../../drawing/elements/IDrawableGeometry";
import { Color, Point } from "../../drawing/structures";
import SearchUtil from "../../utils/SearchUtil";
import TBoundary, { TBoundaryProperty } from "../common/TBoundary";
import YardDisplayItem from "../common/items/YardDisplayItem";
import BlockSlotItem from "../common/items/BlockSlotItem";
import TBaseSlot from "./TBaseSlot";
import BoundaryItem from "../common/items/BoundaryItem";
import BaseBoundaryHandler from "../common/plan/BaseBoundaryHandler";
import BoundaryMode from "../common/structures/BoundaryMode";

abstract class BaseYardView extends DrawUserComponent {
    private _viewDisplayDic: Map<string, YardDisplayItem> = new Map<string, YardDisplayItem>();
    private _boundaryProperty = new TBoundaryProperty();

    applyBufferSlot = false;
    slotPadding = 0;

    protected addYardDisplay(key: string, displayAttribute: YardDisplayItem): void {
        this._viewDisplayDic.set(key, displayAttribute);
    }

    protected removeYardDisplay(key: string): void {
        this._viewDisplayDic.delete(key);
    }

    protected getYardDisplay(key: string): YardDisplayItem | undefined {
        return this._viewDisplayDic.get(key);
    }

    protected clearDisplayAttribute(): void {
        this._viewDisplayDic.clear();
    }

    protected getDefaultCarrierDirColor(): Map<string, Color> {
        const map = new Map<string, Color>();
        map.set("YT", Color.Yellow());
        map.set("RT", Color.Blue());
        map.set("SC", Color.Green());

        return map;
    }

    isEmptySlot<TEntityContainer, TEntitySlot>(dragX: number, dragY: number): boolean {
        const list = SearchUtil.getGeometryListByMemberPoint(this.MyDrawArea.getDefaultDrawList().getDrawList(), "IDrawableGeometry", true, true, new Point(dragX, dragY));

        if (list.length === 0) {
            return false;
        }

        const checkList: IDrawableGeometry[] = [];

        list.forEach(element => {
            if (element as any as TEntityContainer) {
                checkList.push(element);
            }
        });

        if (checkList.length > 0) {
            return false;
        }

        checkList.length = 0;
        list.forEach(element => {
            if (element as any as TEntitySlot) {
                checkList.push(element);
            }
        });

        if (checkList.length > 0) {
            return false;
        }

        return true;
    }

    getSlotItem(dragX: number, dragY: number): BlockSlotItem | undefined {
        const list = SearchUtil.getGeometryListByMemberPoint(this.MyDrawArea.getDefaultDrawList().getDrawList(), "TBaseSlot", true, true, new Point(dragX, dragY));
        if (list.length === 0) {
            return undefined;
        }

        const slot = list[0] as TBaseSlot;
        return new BlockSlotItem(slot.block, slot.bay, slot.row, slot.tier);
    }

    addBoundary(bi: BoundaryItem): void {
        
    }

    getSelectedBoundaryItems(): BoundaryItem[] {
        const selectedList: BoundaryItem[] = [];

        if (this.getDrawArea().isChildDrawableObjectSelect) {
            const boundaryList = this.getDrawArea().getDefaultDrawList().getGeometryList("TBoundary", true, true);
            boundaryList.forEach(boundary => {
                if (boundary.isSelected) {
                    selectedList.push((boundary as TBoundary).boundary);
                }
            });
        }

        return selectedList;
    }

    setSelectableBoundaryMode(selectableBoundaryMode: BoundaryMode | undefined): void {
        if (this._boundaryProperty.selectableBoundaryMode !== selectableBoundaryMode) {
            this._boundaryProperty.selectableBoundaryMode = selectableBoundaryMode;
            this.getBaseBoundaryHandler().setSelectionValue(false);
        }
    }

    getSelectableBoundaryMode(): BoundaryMode | undefined {
        return this._boundaryProperty.selectableBoundaryMode;
    }

    abstract getBaseBoundaryHandler(): BaseBoundaryHandler;
}

export default BaseYardView;