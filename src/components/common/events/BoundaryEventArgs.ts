import BoundaryItem from "../items/BoundaryItem";

class BoundaryEventArgs {
    boundaryList: BoundaryItem[] = [];
    mouseEvent: MouseEvent;

    constructor(mouseEvent: MouseEvent) {
        this.mouseEvent = mouseEvent;
    }
}

export default BoundaryEventArgs;