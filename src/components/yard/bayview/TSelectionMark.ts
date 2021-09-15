import DrawableObject from "../../../drawing/elements/DrawableObject";
import DrawRectangle from "../../../drawing/elements/DrawRectangle";
import DrawText from "../../../drawing/elements/DrawText";
import { ContentAlignment, DashStyles, Point, Size } from "../../../drawing/structures";
import TSelectionMarkProperty from "./TSelectionMarkProperty";

class TSelectionMark extends DrawableObject {
    TSelectionMark = 0;

    private _property: TSelectionMarkProperty;
    private _sequenceNo = "";
    private _bayRowIndex = 0;
    private _tier = 0;
    private _occupiedSlotCount = 0;

    getBayRowIndex(): number {
        return this._bayRowIndex;
    }

    getTier(): number {
        return this._tier;
    }

    getOccupiedSlotCount(): number {
        return this._occupiedSlotCount;
    }

    constructor(key: string, sequenceNo: string, bayRowIndex: number, tier: number, occupiedSlotCount: number, property: TSelectionMarkProperty) {
        super(key);
        this._property = property;
        this._sequenceNo = sequenceNo;
        this._bayRowIndex = bayRowIndex;
        this._tier = tier;
        this._occupiedSlotCount = occupiedSlotCount;
        this.initialize();
    }

    initialize(): void {
        this.setSize(this._property.size);
        if (this._property.visibleBorder) {
            this.drawBorder();
        }
        this.drawSeqNo();
    }

    private drawBorder(): void {
        let x = 0;
        let y = 0;
        
        let geomCntrBoundary = new DrawRectangle(this.name + "_SizeBoundary");
        let boundaryMargin = this.getBorderMargin();
        geomCntrBoundary.setLocation(new Point(x + boundaryMargin, y + boundaryMargin));
        geomCntrBoundary.setSize(new Size(this.getSize().width - boundaryMargin * 2, this.getSize().height - boundaryMargin * 2));
        geomCntrBoundary.attribute.lineColor = this._property.borderColor;
        geomCntrBoundary.attribute.lineThick = this.getBorderLineThick();
        geomCntrBoundary.attribute.dashStyle = DashStyles.Dash;
        this.addGeomObject(geomCntrBoundary);
    }

    private drawSeqNo(): void {
        let x = 0;
        let y = 0;

        let geomText = null;
        let geomRect = null;

        geomText = new DrawText(this.name + "_SeqNo");
        geomText.attribute.fontName = this._property.fontName;
        geomText.attribute.fontStyle = this._property.fontStyle;
        geomText.attribute.fontSize = this._property.fontSize;
        geomText.attribute.lineColor = this._property.foreColor;

        geomText.attribute.textAlign = ContentAlignment.TopRight;
        if (this._sequenceNo.length === 0) {
            geomText.text = "9";
            geomText.visible = false;
        } else {
            geomText.text = this._sequenceNo;
            geomText.visible = true;
        }

        geomText.setLocation(new Point(x + this.getSize().width - geomText.getTextSize().width, y + (1 * this._property.zoomRate + 0.5)));

        geomRect = new DrawRectangle(this.name + "_SeqBackColor");
        geomRect.setLocation(new Point(x + this.getSize().width - geomText.getMBR().width, y + (2 * this._property.zoomRate + 0.5)));
        geomRect.attribute.lineColor = this._property.backColor;
        geomRect.attribute.fillColor = this._property.backColor;
        geomRect.setSize(new Size(geomText.getMBR().width - (2 * this._property.zoomRate + 0.5), geomText.getMBR().height - (6 * this._property.zoomRate + 0.5)));

        this.addGeomObject(geomRect);
        this.addGeomObject(geomText);
    } 

    private getBorderMargin(): number {
        let borderMargin = 5 * this._property.zoomRate + 0.5;
        if (borderMargin < 3) {
            borderMargin = 3;
        }

        return borderMargin;
    }

    private getBorderLineThick(): number {
        let lineThick = 2 * this._property.zoomRate + 0.5;
        if (lineThick < 1) {
            lineThick = 1;
        }

        return lineThick;
    }

    isContainSlot(bayRowIndex: number, tier: number): boolean {
        let isContain = false;

        if (tier === this._tier) {
            if (this._bayRowIndex <= bayRowIndex && this._bayRowIndex + (this._occupiedSlotCount - 1) >= bayRowIndex) {
                isContain = true;
            }
            
        }
        return isContain;
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

export default TSelectionMark;