import DrawLine from "../../../drawing/elements/DrawLine";
import DrawRectangle from "../../../drawing/elements/DrawRectangle";
import DrawText from "../../../drawing/elements/DrawText";
import GeometryEllipse from "../../../drawing/elements/GeometryEllipse";
import GeometryObject from "../../../drawing/elements/GeometryObject";
import GeometryTriangle from "../../../drawing/elements/GeometryTriangle";
import { Color, ContentAlignment, Point, Rectangle, Size } from "../../../drawing/structures";
import IGeomMarking from "../../shipplan/IGeomMarking";
import { MarkingTypes } from "../../shipplan/structures";
import TBaseSlot from "../TBaseSlot";

class TSlot extends TBaseSlot implements IGeomMarking {
    TSlot = 0;

    private _borderColor = Color.LightGray();
    private _isEquipmentPassSlot = false;
    private _typeInfo = "";
    private _isViewMarking = false;
    private _markingBorderColor = Color.Blue();
    private _markingBackColor = Color.Blue();
    private _occupiedPlanColor = Color.Transparent();
    private _visibleOccupiedPlan = false;
    private _markingType = MarkingTypes.CIRCLE;
    private _lineThick = 0;
    private _zoomRate = 1;
    private _marked = false;
    
    borderColor = Color.LightGray();
    markingSizeRatio = 0;

    constructor(name: string, block: string, bay: number, row: number, tier: number, isEquipmentPassSlot: boolean, zoomRate: number) {
        super(name);
        this.block = block;
        this.bay = bay;
        this.row = row;
        this.tier = tier;
        this._isEquipmentPassSlot = isEquipmentPassSlot;
        this._zoomRate = zoomRate;
        super.setSize(new Size(30, 30));
        this.markingSizeRatio = 2;
    }

    private drawSlot(ctx: CanvasRenderingContext2D) : void {
        // if (this._isEquipmentPassSlot) {
        //     HatchBrush hatchBrush = new HatchBrush(HatchStyle.Percent20, _borderColor, Color.White);
        //     ctx.FillRectangle(hatchBrush, new Rectangle(this.CurrentLocation, this.CurrentSize));
        //     hatchBrush.Dispose();
        // }

        const myRect = new DrawRectangle(this.name + "_R");
        myRect.setLocation(this.getCurrentLocation());
        myRect.setSize(this.getCurrentSize());
        myRect.attribute.lineColor = this._borderColor;
        myRect.draw(ctx);
        
        if (this._typeInfo.length > 0) {
            const typeInfo = new DrawText("TypeInfo");
            typeInfo.attribute.fontName = "Tahoma";
            typeInfo.attribute.textAlign = ContentAlignment.BottomLeft;
            typeInfo.attribute.fontSize = this.getSize().width *  0.17;
            typeInfo.setLocation(this.getRealLocation(new Point(0, 0)));
            typeInfo.setSize(this.getSize());
            typeInfo.text = this._typeInfo;
            typeInfo.draw(ctx);
        }

        if (this._isViewMarking) {
            this.drawMark(ctx);
        }

        if (this._visibleOccupiedPlan) {
            this.drawOccupiedPlan(ctx);
        }
    }

    private drawMark(ctx: CanvasRenderingContext2D) : void {
        let geomSlotMark: GeometryObject;
        switch (this._markingType) {
            case MarkingTypes.CIRCLE:
                geomSlotMark = new GeometryEllipse("SlotMark", 0, 0, 0, 0);
                break;
            case MarkingTypes.TRIANGLE:
                geomSlotMark = new GeometryTriangle("SlotMark", 0, 0, 0, 0);
                break;
            case MarkingTypes.INVERT_TRIANGLE:
                geomSlotMark = new GeometryTriangle("SlotMark", 0, 0, 0, 0);
                break;
        }
        
        const currentSize = this.getCurrentSize();
        const currentLocation = this.getCurrentLocation();

        if (currentSize.width === currentSize.height) {
            geomSlotMark.setSize(new Size(currentSize.width * this.markingSizeRatio / 10, currentSize.height * this.markingSizeRatio / 10));
        } else {
            geomSlotMark.setSize(new Size(currentSize.height * this.markingSizeRatio / 10, currentSize.height * this.markingSizeRatio / 10));
        }

        geomSlotMark.attribute.lineThick = 3 * this._zoomRate + this._lineThick;
        geomSlotMark.setLocation(this.getRealLocation(new Point(0, 0)));
        const radius = geomSlotMark.getMBR().width / 2;
        geomSlotMark.attribute.fillColor = this._markingBackColor;
        geomSlotMark.attribute.lineColor = this._markingBorderColor;
        geomSlotMark.setLocation(new Point(currentLocation.x + currentSize.width / 2 - radius, currentLocation.y + currentSize.height / 2 - radius));
        
        if (this._markingType == MarkingTypes.INVERT_TRIANGLE) {
            geomSlotMark.rotate(180);
        }

        geomSlotMark.draw(ctx);
    }

    drawOccupiedPlan(ctx: CanvasRenderingContext2D) : void {
        const size = this.getSize();
        const currentLocation = this.getCurrentLocation();

        const sX = size.width * 1 / 10;
        const sY = size.height * 1 / 10;
        const eX = size.width - sX;
        const eY = size.height - sY;
        const line1 = new DrawLine(this.name + "_L1"
            , sX + currentLocation.x
            , sY + currentLocation.y
            , eX + currentLocation.x
            , eY + currentLocation.y);
        line1.attribute.lineThick = 3 * this._zoomRate;
        line1.attribute.lineColor = this._occupiedPlanColor;
        line1.visible = true;
        line1.draw(ctx);

        const sX1 = sX;
        const sY1 = eY;
        const eX1 = eX;
        const eY1 = sY;
        const line2 = new DrawLine(this.name + "_L2"
            , sX1 + currentLocation.x
            , sY1 + currentLocation.y
            , eX1 + currentLocation.x
            , eY1 + currentLocation.y);

        line2.attribute.lineThick = 3 * this._zoomRate;
        line2.attribute.lineColor = this._occupiedPlanColor;
        line2.visible = true;
        line2.draw(ctx);
    }

    setType(slotCargoType: string) : void { 
        this._typeInfo = slotCargoType;
    }

    setMarking(visible: boolean) : void {
        this._isViewMarking = visible;
    }

    setMarkingByType(visible: boolean, markingType: MarkingTypes) : void {
        this._isViewMarking = visible;
        this._markingType = markingType;
    }

    setMarkingColor(visible: boolean, backColor: Color, borderColor: Color) : void {
        this._isViewMarking = visible;
        this._markingBackColor = backColor;
        this._markingBorderColor = borderColor;
    }

    setMarkingBorderByType(visible: boolean, backColor: Color, borderColor: Color, markingType: MarkingTypes) : void {
        this._isViewMarking = visible;
        this._markingBackColor = backColor;
        this._markingBorderColor = borderColor;
        this._markingType = markingType;
    }

    setMarkingBorderThickByType(visible: boolean, backColor: Color, borderColor: Color, markingType: MarkingTypes, lineThick: number) : void {
        this._isViewMarking = visible;
        this._markingBackColor = backColor;
        this._markingBorderColor = borderColor;
        this._markingType = markingType;
        this._lineThick = lineThick;
    }

    getMarked(): boolean {
        return this._marked;
    }

    setOccupiedPlan(visible: boolean) : void {
        this._visibleOccupiedPlan = visible;
    }

    setOccupiedPlanVisible(color: Color, visible: boolean) : void {
        this._occupiedPlanColor = color;
        this._visibleOccupiedPlan = visible;
    }

    drawDetail(ctx: CanvasRenderingContext2D, pageScale: number, canvasBoundary: Rectangle, isMemoryCatch: boolean) : void {
        this.drawSlot(ctx);
    }

    onMouseDown(sender: any, e: MouseEvent) : void  { }
    onMouseMove(sender: any, e: MouseEvent) : void  { }
    onMouseUp(sender: any, e: MouseEvent) : void  { }
    onSelected(sender: any, e: MouseEvent) : void  { }
    onMouseHover(sender: any, e: MouseEvent) : void  { }
    onMouseLeave(sender: any, e: MouseEvent) : void  { }
    onMouseClick(sender: any, e: MouseEvent) : void  { }
    onResize(sender: any, e: MouseEvent) : void  { }
}

export default TSlot;   