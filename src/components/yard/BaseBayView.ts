import { TEvent } from "../../common";
import BoundaryEventArgs from "../common/events/BoundaryEventArgs";
import EquipmentEventArgs from "../common/events/EquipmentEventArgs";
import BaseBoundaryHandler from "../common/plan/BaseBoundaryHandler";
import BaseYardView from "./BaseYardView";
import AlignmentBayRowStyles from "./structures/AlignmentBayRowStyles";

type EquipmentEventHandlerDelegate = (sender: any, args: EquipmentEventArgs) => void;
type BoundaryEventDelegate = (sender: any, args: BoundaryEventArgs) => void;

class EquipmentEventHandler extends TEvent {
    protected events: EquipmentEventHandlerDelegate[] = [];
    addEvent(eventHandler: EquipmentEventHandlerDelegate): void {
        this.events.push(eventHandler);
    }

    removeEvent(eventHandler: EquipmentEventHandlerDelegate): void {
        if (this.isEmpty()) return;
        this.events.splice(this.events.indexOf(eventHandler), 1);
    }

    doEvent(sender: any, args: EquipmentEventArgs): void {
        this.events.forEach(eventHandler => {
            eventHandler(sender, args);
        });
    }
}

class BaseBayView extends BaseYardView {
    alignmentBayRowName = AlignmentBayRowStyles.LeftToRight;
    alignmentBayRowGroup = AlignmentBayRowStyles.LeftToRight;

    getBaseBoundaryHandler(): BaseBoundaryHandler {
        throw new Error("Method not implemented.");
    }
}

export default BaseBayView;
export { EquipmentEventHandler };