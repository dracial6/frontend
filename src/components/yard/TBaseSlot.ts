import DrawableObject from "../../drawing/elements/DrawableObject";

class TBaseSlot extends DrawableObject {
    protected TBaseSlot = 0; // For Type Check
    block = '';
    bay = 0;
    row = 0;
    tier = 0;

    constructor(name: string) {
        super(name);
    }

    onMouseDown(sender: any, event: MouseEvent): void {
        throw new Error("Method not implemented.");
    }
    onMouseMove(sender: any, event: MouseEvent): void {
        throw new Error("Method not implemented.");
    }
    onMouseUp(sender: any, event: MouseEvent): void {
        throw new Error("Method not implemented.");
    }
    onSelected(sender: any, event: MouseEvent): void {
        throw new Error("Method not implemented.");
    }
    onMouseHover(sender: any, event: MouseEvent): void {
        throw new Error("Method not implemented.");
    }
    onMouseLeave(sender: any, event: MouseEvent): void {
        throw new Error("Method not implemented.");
    }
    onMouseClick(sender: any, event: MouseEvent): void {
        throw new Error("Method not implemented.");
    }
    onResize(sender: any, event: MouseEvent): void {
        throw new Error("Method not implemented.");
    }
}

export default TBaseSlot;