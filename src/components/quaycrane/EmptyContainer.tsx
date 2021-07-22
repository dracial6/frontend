import DrawableObject from "../../drawing/elements/DrawableObject";

class EmptyContainer extends DrawableObject {
    constructor(name: string) {
        super(name);
    }

    onMouseDown(sender: any, event: MouseEvent): void {
        console.log("onMouseDown");
    }
    onMouseMove(sender: any, event: MouseEvent): void {
        console.log("onMouseMove");
    }
    onMouseUp(sender: any, event: MouseEvent): void {
        console.log("onMouseUp");
    }
    onSelected(sender: any, event: MouseEvent): void {
        console.log("onSelected");
    }
    onMouseHover(sender: any, event: MouseEvent): void {
        console.log("onMouseHover");
    }
    onMouseLeave(sender: any, event: MouseEvent): void {
        
    }
    onMouseClick(sender: any, event: MouseEvent): void {
        console.log("onMouseClick");
    }
    onResize(sender: any, event: MouseEvent): void {
        console.log("onResize");
    }
}

export default EmptyContainer;