import DrawableObject from "../../drawing/elements/DrawableObject";
import IBlinkable from "../../drawing/elements/IBlinkable";
import ISearchable from "../../drawing/elements/ISearchable";

class TBaseContainer extends DrawableObject implements ISearchable, IBlinkable {
    searchKey = "";

    constructor(name: string) {
        super(name);
        this.searchKey = name;
    }

    onMouseDown(sender: any, event: MouseEvent): void {
        
    }
    onMouseMove(sender: any, event: MouseEvent): void {
        
    }
    onMouseUp(sender: any, event: MouseEvent): void {
        
    }
    onSelected(sender: any, event: MouseEvent): void {
        
    }
    onMouseHover(sender: any, event: MouseEvent): void {
        
    }
    onMouseLeave(sender: any, event: MouseEvent): void {
        
    }
    onMouseClick(sender: any, event: MouseEvent): void {
        
    }
    onResize(sender: any, event: MouseEvent): void {
        
    }
}

export default TBaseContainer;