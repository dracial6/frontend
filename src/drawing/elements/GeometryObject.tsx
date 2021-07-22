import GeometryEvent from "../events/GeometryEvent";
import BaseGeometry from "./BaseGeometry";

abstract class GeometryObject extends BaseGeometry {
    resizeEvent: GeometryEvent = new GeometryEvent();
    moveEvent: GeometryEvent = new GeometryEvent();
    
    constructor (name: string) {
        super(name);
    }

    protected fillDrawObjectFields(): GeometryObject {
        return JSON.parse(JSON.stringify(this));
    }

    protected onResizeGeometry(): void {
        this.resizeEvent.doEvent(this);
    }

    protected onMoveGeometry(): void {
        this.moveEvent.doEvent(this);
    }

    abstract clone(): GeometryObject;

    onMouseDown(sender: any, event: MouseEvent): void {}
    onMouseMove(sender: any, event: MouseEvent): void {}
    onMouseUp(sender: any, event: MouseEvent): void {}
    onSelected(sender: any, event: MouseEvent): void {}
    onMouseHover(sender: any, event: MouseEvent): void {}
    onMouseLeave(sender: any, event: MouseEvent): void {}
    onResize(sender: any, event: MouseEvent): void {}
}

export default GeometryObject;