import TEvent from "./TEvent";

type EventDelegate = (args: string) => void;

class PropertyChangedEvent extends TEvent{
    protected events: EventDelegate[] = [];
    
    addEvent(eventHandler: EventDelegate): void {
        this.events.push(eventHandler);
    }

    removeEvent(eventHandler: EventDelegate): void {
        if (this.isEmpty()) return;
        this.events.splice(this.events.indexOf(eventHandler), 1);
    }

    doEvent(propertyName: string): void {
        this.events.forEach(eventHandler => {
            eventHandler(propertyName);
        });
    }
}

export default PropertyChangedEvent;