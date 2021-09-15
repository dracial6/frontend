import DrawableObject from "../../../../drawing/elements/DrawableObject";
import { Point, Size } from "../../../../drawing/structures";
import QCSideMachineryHouseItem from "./items/QCSideMachineryHouseItem";

class TMachineryHouse extends DrawableObject {
    constructor(name: string, item: QCSideMachineryHouseItem, startX: number, startY: number) {
        super(name);
        this.setLocation(new Point(startX, startY));
        this.setSize(new Size(item.width, item.height));
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
        console.log("onMouseLeave");
    }
    onMouseClick(sender: any, event: MouseEvent): void {
        console.log("onMouseClick");
    }
    onResize(sender: any, event: MouseEvent): void {
        console.log("onResize");
    }
}

export default TMachineryHouse;