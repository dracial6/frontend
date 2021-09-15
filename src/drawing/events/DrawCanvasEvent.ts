import { TEvent } from "../../common";
import BaseDrawArea from "../BaseDrawArea";
import DrawCanvasEventArgs from "./DrawCanvasEventArgs";

type EventDelegate = (sender: BaseDrawArea, args: DrawCanvasEventArgs) => void;

class DrawCanvasEvent extends TEvent {
    protected events: EventDelegate[] = [];

    addEvent(eventHandler: EventDelegate): void {
        this.events.push(eventHandler);
    }

    removeEvent(eventHandler: EventDelegate): void {
        if (this.isEmpty()) return;
        this.events.splice(this.events.indexOf(eventHandler), 1);
    }

    doEvent(sender: BaseDrawArea, args: DrawCanvasEventArgs): void {
        this.events.forEach(eventHandler => {
            eventHandler(sender, args);
        });
    }
}

export default DrawCanvasEvent;