import { TEvent } from "../../common";
import BaseDrawArea from "../BaseDrawArea";
import DrawDragEventArgs from "./DrawDragEventArgs";

type EventDelegate = (sender: BaseDrawArea, args: DrawDragEventArgs) => void;

class DrawDragEvent extends TEvent {
    protected events: EventDelegate[] = [];

    addEvent(eventHandler: EventDelegate): void {
        this.events.push(eventHandler);
    }

    removeEvent(eventHandler: EventDelegate): void {
        if (this.isEmpty()) return;
        this.events.splice(this.events.indexOf(eventHandler), 1);
    }

    doEvent(sender: BaseDrawArea, args: DrawDragEventArgs): void {
        this.events.forEach(eventHandler => {
            eventHandler(sender, args);
        });
    }
}

export default DrawDragEvent;