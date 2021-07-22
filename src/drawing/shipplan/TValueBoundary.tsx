import DrawableObject from "../elements/DrawableObject";
import DrawText from "../elements/DrawText";
import IBaseGeometry from "../elements/IBaseGeometry";
import RowItem from "./items/RowItem";

class TValueBoundary extends DrawableObject {
    displayRowIndex = -1;
    holdDeckMode = 1;

    constructor(key: string) {
        super(key);        
    }

    private getValueKey(row: number): string {
        return "RowDisplayValue_" + row;
    }

    private getTitleKey(): string {
        return "RowDisplayTitle"
    }

    addValue(row: number): void {
        this.addGeomObject(new DrawText(this.getValueKey(row)));
    }

    getValue(row: number): IBaseGeometry | undefined {
        return this.getGeomObject(this.getValueKey(row));
    }

    addTitle(): void {
        this.addGeomObject(new DrawText(this.getTitleKey()));
    }

    getTitle(): IBaseGeometry | undefined {
        return this.getGeomObject(this.getTitleKey());
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
    onResize(sender: any, event: MouseEvent): void {
        
    }
    onMouseClick(sender: any, event: MouseEvent): void {
        
    }
}

export default TValueBoundary;