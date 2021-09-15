import { TEvent } from "../../common";
import BaseGeometry from "../elements/BaseGeometry";

type EventDelegate = (geom: BaseGeometry) => void;

class GeometryEvent extends TEvent { 
    readonly events: EventDelegate[] = [];
    
    addEvent(eventHandler: EventDelegate): void {
        this.events.push(eventHandler);
    }

    removeEvent(eventHandler: EventDelegate): void {
        if (this.isEmpty()) return;
        this.events.splice(this.events.indexOf(eventHandler), 1);
    }

    doEvent(geom: BaseGeometry): void {
        this.events.forEach(eventHandler => {
            eventHandler(geom);
        });
    }
}

export default GeometryEvent;