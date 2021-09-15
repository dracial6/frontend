import IDrawableGeometry from "../../../../drawing/elements/IDrawableGeometry";
import IGeometry from "../../../../drawing/elements/IGeometry";
import DrawCanvasEventArgs from "../../../../drawing/events/DrawCanvasEventArgs";
import GeneralLogger from "../../../../logger/GeneralLogger";
import SearchUtil from "../../../../utils/SearchUtil";
import SlotPositionItem from "../../../common/items/SlotPositionItem";
import ViewDirection from "../../../common/structures/ViewDirection";
import DragSelectManager from "../../../common/utils/DragSelectManager";
import TBay, { TCraneButton } from "../TBay";
import TBayRowNo from "../TBayRowNo";
import TSlot from "../TSlot";
import YBayView from "../YBayView";

class DragSelectedHandler {
    private _yBayView : YBayView;
    private _selectedSlotList : IGeometry[] = [];
    private _selectedBayRowNoList : TBayRowNo[] = [];
    private _currentTBay? : TBay = undefined;
    private _isMultiSelectedBay = false;
    private _startSlotItem? : SlotPositionItem;
    private _endSlotItem? : SlotPositionItem;
    private _selectedSlotItems : SlotPositionItem[] = [];
    private _selectedCraneButton? : TCraneButton;

    constructor(yBayView: YBayView, pEventInfo: DrawCanvasEventArgs) {
        this._yBayView = yBayView;
        this.initializeData(pEventInfo);
    }

    private initializeData(pEventInfo: DrawCanvasEventArgs) : void {
        try {
            const startPos = this._yBayView.getDrawArea().getCurrentMousePoint();
            const selectedBoundary = pEventInfo.dragSelectBoundary;
            const bayList: TBay[] = [];
            const selectionList = pEventInfo.selectionList;

            for (let geometry of selectionList) {
                if (geometry instanceof TBay) {
                    if (this._currentTBay !== undefined) {
                        this._isMultiSelectedBay = true;
                        if (this._yBayView.allowMultiSelection === false) break;
                    }
                    
                    this._currentTBay = geometry as TBay;
                    this._selectedBayRowNoList = SearchUtil.getGeometryListByMemberSelected((geometry as TBay).getGeomListByMember("IDrawableGeometry") as IDrawableGeometry[], "TBayRowNo", true, true, false) as TBayRowNo[];
                    bayList.push(this._currentTBay);
                } else if (geometry instanceof TSlot) {
                    this._selectedSlotList.push(geometry as TSlot);
                } else if (geometry instanceof TCraneButton) {
                    this._selectedCraneButton = geometry as TCraneButton;
                }
            }

            if (this._selectedSlotList.length > 0) {
                const dragSelectManager = new DragSelectManager();
                dragSelectManager.getSortList(pEventInfo, this._yBayView.slotDragPriority
                , this._yBayView.slotDragHDirection, this._yBayView.slotDragVDirection, this._selectedSlotList);
                
                if (this._isMultiSelectedBay && this._yBayView.allowMultiSelection) {
                    const distributedList: IGeometry[][] = [];
                    
                    for (const bayRow of bayList) {
                        const list = this._selectedSlotList.filter(c => (bayRow.getViewType() === ViewDirection.Front) ? (c as TSlot).bay === bayRow.getBayRow() : (c as TSlot).row === bayRow.getBayRow());
                        if(list.length > 0) distributedList.push(list);
                    }

                    this._selectedSlotList.length = 0;

                    if (distributedList.length > 0) {
                        for (let i = distributedList.length - 1; i >= 0; i--) {
                            dragSelectManager.getSortList(pEventInfo, this._yBayView.slotDragPriority
                            , this._yBayView.slotDragHDirection, this._yBayView.slotDragVDirection, distributedList[i]);
                            this._selectedSlotList.push(...distributedList[i]);
                        }
                    }
                }

                this._selectedSlotItems = [];
                
                let tempSlot = undefined;
                let slotPostion: SlotPositionItem;
                
                for (let item of this._selectedSlotList) {
                    if (item.visible === false) continue;
                    tempSlot = item as TSlot;
                    slotPostion = new SlotPositionItem();
                    slotPostion.bay = tempSlot.bay;
                    slotPostion.row = tempSlot.row;
                    slotPostion.tier = tempSlot.tier;
                    slotPostion.block = tempSlot.block;
                    this._selectedSlotItems.push(slotPostion);
                }

                this._startSlotItem = this.getMinSlotPosition(this._selectedSlotItems);
                this._endSlotItem = this.getMaxSlotPosition(this._selectedSlotItems);
            }
        } catch (ex) {
            GeneralLogger.error(ex);
        }
    }

    getSelectedSlotList() : IGeometry[] {
        return this._selectedSlotList;
    }

    getSelectedBayRowNoList() : TBayRowNo[] {
        return this._selectedBayRowNoList;
    }

    getCurrentTBay() : TBay | undefined{
        return this._currentTBay;
    }

    isMultiSelectedBay() : boolean {
        return this._isMultiSelectedBay;
    }

    getSelectedSlotItems() : SlotPositionItem[] {
        return this._selectedSlotItems;
    }

    getStartSlotItem() : SlotPositionItem | undefined {
        return this._startSlotItem;
    }

    getEndSlotItem() : SlotPositionItem | undefined {
        return this._endSlotItem;
    }

    getSelectedCraneButton() : TCraneButton | undefined {
        return this._selectedCraneButton;
    }

    existSelectedSlot() : boolean {
        if (this._selectedSlotList.length > 0 && this._selectedSlotList.length > 0) {
            return true;
        }

        return false;
    }

    existSelectedBayRowNo() : boolean {
        if (this._selectedBayRowNoList.length > 0 && this._selectedBayRowNoList.length > 0) {
            return true;
        }

        return false;
    }

    private getMinSlotPosition(selectedList: SlotPositionItem[]) : SlotPositionItem {
        const slotPos = new SlotPositionItem();
        slotPos.block = "";
        slotPos.bay = 0;
        slotPos.row = 0;
        
        if (selectedList === undefined) {
            return slotPos;
        }

        slotPos.bay = 9999;
        slotPos.row = 9999;
        slotPos.tier = 9999;

        for (let item of selectedList) {
            slotPos.block = item.block;
            if (slotPos.bay > item.bay) {
                slotPos.bay = item.bay;
            }
            if (slotPos.row > item.row) {
                slotPos.row = item.row;
            }
            if (slotPos.tier > item.tier) {
                slotPos.tier = item.tier;
            }
        }

        return slotPos;
    }

    private getMaxSlotPosition(selectedList: SlotPositionItem[]) : SlotPositionItem {
        const slotPos = new SlotPositionItem();
        slotPos.block = "";
        slotPos.bay = 0;
        slotPos.row = 0;
        slotPos.tier = 0;

        if (selectedList === undefined) {
            return slotPos;
        }

        for (let item of selectedList) {
            slotPos.block = item.block;
            if (slotPos.bay < item.bay) {
                slotPos.bay = item.bay;
            }
            if (slotPos.row < item.row) {
                slotPos.row = item.row;
            }
            if (slotPos.tier < item.tier) {
                slotPos.tier = item.tier;
            }
        }
        return slotPos;
    }
}

export default DragSelectedHandler;