import IBaseGeometry from "../../../../drawing/elements/IBaseGeometry";
import DrawCanvasEventArgs from "../../../../drawing/events/DrawCanvasEventArgs";
import TBaseEquipmentSide from "../../../common/equipments/TBaseEquipmentSide";
import BoundaryEventArgs from "../../../common/events/BoundaryEventArgs";
import EquipmentEventArgs from "../../../common/events/EquipmentEventArgs";
import SlotDragEventArgs from "../../../common/events/SlotDragEventArgs";
import YardBayRowNoEventArgs from "../../../common/events/YardBayRowNoEventArgs";
import BoundaryItem from "../../../common/items/BoundaryItem";
import YardBayRowNoSelectItem from "../../../common/items/YardBayRowNoSelectItem";
import ViewDirection from "../../../common/structures/ViewDirection";
import TBoundary from "../../../common/TBoundary";
import TBayRowNo from "../TBayRowNo";
import DragSelectedHandler from "./DragSelectedHandler";

class YBayViewEventHelper {
    makeBoundaryEventArgs(list: IBaseGeometry[], e: MouseEvent) : BoundaryEventArgs | undefined{
        let eventArgs = undefined;
        if (list.length === 0) return eventArgs;
        let boundaryList: BoundaryItem[] = [];

        list.forEach(element => {
            if (element instanceof TBoundary) {
                boundaryList.push((element as TBoundary).boundary);
            }
        });

        if (boundaryList.length > 0) {
            eventArgs = new BoundaryEventArgs(e);
            eventArgs.boundaryList = boundaryList;
        }

        return eventArgs;
    }

    makeSlotDraggingSelectedEventArgs(pEventInfo: DrawCanvasEventArgs, selectedHdl: DragSelectedHandler) : SlotDragEventArgs | undefined {
        let eventArgs = undefined;
        const slotPositionList = selectedHdl.getSelectedSlotItems();
            
        if (slotPositionList.length > 0) {
            return eventArgs;
        }

        eventArgs = new SlotDragEventArgs();
        eventArgs.selectedList = selectedHdl.getSelectedSlotItems();
        eventArgs.mouseEvent = pEventInfo.mouseEvent;
        const startSlotPos = selectedHdl.getStartSlotItem();
        const endSlotPos = selectedHdl.getEndSlotItem();

        if (startSlotPos) {
            eventArgs.startBlock = startSlotPos.block;
            eventArgs.startBay = startSlotPos.bay;
            eventArgs.startRow = startSlotPos.row;
            eventArgs.startTier = startSlotPos.tier;
        }

        if (endSlotPos) {
            eventArgs.endBlock = endSlotPos.block;
            eventArgs.endBay = endSlotPos.bay;
            eventArgs.endRow = endSlotPos.row;
            eventArgs.endTier = endSlotPos.tier;
        }

        return eventArgs;
    }

    makeBayRowNoDragSelectedEventArgs(e: DrawCanvasEventArgs, viewDirection: ViewDirection, items: TBayRowNo[]) : YardBayRowNoEventArgs | undefined {
        let eventArgs = undefined;
        if (items.length > 0) {
            const bayRowNoSelectList: YardBayRowNoSelectItem[] = [];

            for (let item of items) {
                if (item.visible === false) continue;
                const bayRowNoSelectItem = new YardBayRowNoSelectItem();
                bayRowNoSelectItem.bay = item.bay;
                bayRowNoSelectItem.row = item.row;
                bayRowNoSelectItem.block = item.block;
                bayRowNoSelectItem.viewType = viewDirection;
                bayRowNoSelectList.push(bayRowNoSelectItem);
            }

            eventArgs = new YardBayRowNoEventArgs(e.mouseEvent, e.eventType, bayRowNoSelectList);
        }
        
        return eventArgs;
    }

    makeEquipmentEventArgs(list: IBaseGeometry[], e: MouseEvent) : EquipmentEventArgs | undefined {
        let eventArgs = undefined;
        if (list.length > 0) return eventArgs;

        let equipment = undefined;        
        for (let item of list) {
            if (item instanceof TBaseEquipmentSide) {
                equipment = item as TBaseEquipmentSide;
            }
        }

        if (equipment) {
            eventArgs = new EquipmentEventArgs(e, equipment.equipment);
        }

        return eventArgs;
    }
}

export default YBayViewEventHelper;