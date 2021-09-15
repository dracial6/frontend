import { Point, Rectangle, Size } from "../../../drawing/structures";
import EquipmentSideItem from "../items/EquipmentSideItem";
import ViewDirection from "../structures/ViewDirection";
import EquipmentSideVertex from "./EquipmentSideVertex";
import TBaseEquipmentSide from "./TBaseEquipmentSide";

class TEquipmentSideOther extends TBaseEquipmentSide {
    private _legWidth;
    private _blankHeight;

    constructor(key: string, viewType: ViewDirection, equipment: EquipmentSideItem
        , equipmentSize: Size, legWidth: number, blankHeight: number, wheelHeight: number) {
        super(key, viewType, equipment, equipmentSize, wheelHeight);
        this._legWidth = legWidth;
        this._blankHeight = blankHeight;
    }

    getEquipmentVertex() : Point[] {
        const calculatePolygon = new EquipmentSideVertex();
        const width = this.equipmentSize.width;
        const height = this.getEquipmentBodyHeight();
        return calculatePolygon.getOtherVertex(width, height, this._legWidth, this._blankHeight);
    }

    getEquipmentBodyHeight() : number {
        return this.equipmentSize.height - this.wheelHeight;
    }

    getLeftLegStartPos() : Point {
        const calculatePolygon = new EquipmentSideVertex();
        const width = this.equipmentSize.width;
        const height = this.getEquipmentBodyHeight();
        return calculatePolygon.getOtherLeftLegStartPos(width, height);
    }
    
    getRightLegStartPos() : Point {
        const calculatePolygon = new EquipmentSideVertex();
        const width = this.equipmentSize.width;
        const height = this.getEquipmentBodyHeight();
        return calculatePolygon.getOtherRightLegStartPos(width, height, this._legWidth);
    }

    getLabelDisplayBounds() : Rectangle {
        const size = new Size(this.equipmentSize.width, this.equipmentSize.height - this.wheelHeight);
        return new Rectangle(0, 0, size.width, size.height);
    }

    getWheelCount() : number {
        return 1;
    }

    getLegWidth() : number {
        return this._legWidth;
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

export default TEquipmentSideOther;