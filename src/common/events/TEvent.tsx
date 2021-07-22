abstract class TEvent {
    protected abstract events: any[];

    abstract addEvent(eventHandler: any): void;
    abstract removeEvent(eventHandler: any): void;
    abstract doEvent(...args: any): void;

    isEmpty(): boolean {
        return this.events.length === 0;
    }
}

export default TEvent;