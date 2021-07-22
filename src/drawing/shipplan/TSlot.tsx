import DrawRectangle from "../elements/DrawRectangle";
import DrawText from "../elements/DrawText";
import GeometryEllipse from "../elements/GeometryEllipse";
import GeometryText from "../elements/GeometryText";
import GeometryTriangle from "../elements/GeometryTriangle";
import IBaseGeometry from "../elements/IBaseGeometry";
import { Color, FontStyles, Point, Rectangle, Size } from "../structures";
import ContentAlignment from "../structures/ContentAlignment";
import IGeomMarking from "./IGeomMarking";
import ContainerGeneralItem from "./items/ContainerGeneralItem";
import { CubeType, HatchDefine, MarkingTypes } from "./structures";
import TBaseGeneral from "./TBaseGeneral";
import TBayProperty from "./TBayProperty";

class TSlot extends TBaseGeneral implements IGeomMarking {
    bay;
    row;
    tier;
    enable = true;
    isAllocation;
    containerItem = new ContainerGeneralItem();

    private _isDeck;
    private _defaultBorderColor = Color.Black();
    private _markingBorderColor = Color.Blue();
    private _markingBackColor = Color.Blue();
    private _markingType = MarkingTypes.CIRCLE;
    private _borderColor = Color.Black();
    private _marked = false;
    private _lineThick = 0;

    markingSizeRatio = 2;

    constructor(name: string, bay: number, row: number, tier: number, isDeck: boolean, tBayProperty: TBayProperty) {
        super(name, tBayProperty);
        this.bay = bay;
        this.row = row;
        this.tier = tier;
        this._isDeck = isDeck;
        this._size = new Size(30, 30);
        this.isAllocation = false;
        this._defaultBorderColor = this.getSlotBoardColor(bay, row, tier);
    }

    getIsDeck(): boolean {
        return this._isDeck;
    }

    getBorderColor(): Color {
        return this._borderColor;
    }

    getMarked(): boolean {
        return this._marked;
    }

    setEnable(enable: boolean): void {
        this.enable = enable;

        if (this.enable) {
            this._borderColor = this._defaultBorderColor;
        } else {
            this._borderColor = HatchDefine.LIGHT_GRAY;
        }
    }

    addValue(): void {
        const value = new DrawText("SlotDisplayValue");
        this.addGeomObject(value);
        this.moveFirst(value);
    }

    getValue(): IBaseGeometry | undefined {
        return this.getGeomObject("SlotDisplayValue");
    }

    drawDetail(ctx: CanvasRenderingContext2D, pageScale: number, canvasBoundary: Rectangle): void {
        if (!this.isForceDraw && !this.objectInCanvas(pageScale, canvasBoundary)) return;
        this.drawSlot(ctx);
    }

    private drawSlot(ctx: CanvasRenderingContext2D): void {
        const outLine = new DrawRectangle(this.name + "_O");
        outLine.setLocation(this.getCurrentLocation());
        outLine.setSize(this.getSize());
        outLine.attribute.lineColor = this._borderColor;
        outLine.attribute.fillColor = Color.White();
        outLine.attribute.lineThick = this.PROPERTY.slotLineThick;
        outLine.draw(ctx);

        if (this.isAllocation && this.PROPERTY.cubeType === CubeType.HighContainer) {
            const origin = ctx.strokeStyle;
            ctx.strokeStyle = Color.Red().toRGBA();
            ctx.setLineDash([6]);
            ctx.strokeRect(outLine.getLocation().x + 2, outLine.getLocation().y + 2, outLine.getSize().width - 4, outLine.getSize().height - 4);
            ctx.strokeStyle = origin;
        }

        // if (this.PROPERTY.visibleReeferSlotMark) {
        //     if (this.VESSEL_DEFINE.vslBays[this.bay].slotItem.rfCheck[this.row][this.tier]) {
        //         const rfCheck = new DrawText(this.name + "_RF");
        //         rfCheck.setLocation(this.getCurrentLocation());
        //         rfCheck.setSize(this.currentSize);
        //         rfCheck.attribute.textAlign = ContentAlignment.MiddleCenter;
        //         rfCheck.attribute.fontName = HatchDefine.CASP_SMALL_FONT;
        //         rfCheck.attribute.fontSize = 6.75;
        //         rfCheck.attribute.fontStyle = FontStyles.normal;
        //         rfCheck.attribute.lineColor = Color.Blue;
        //         rfCheck.text = "*";
        //         rfCheck.draw(ctx);
        //     }
        // }

        this.drawGeometry(ctx);

        if (this._marked) {
            this.drawMark(ctx);
        }
    }

    private drawMark(ctx: CanvasRenderingContext2D): void {
        let geomSlotMark = undefined;

        switch (this._markingType) {
            case MarkingTypes.CIRCLE:
                geomSlotMark = new GeometryEllipse("SlotMark", 0, 0, 1, 1);
                break;
            case MarkingTypes.TRIANGLE:
                geomSlotMark = new GeometryTriangle("SlotMark", 0, 0, 1, 1);
                break;
            case MarkingTypes.INVERT_TRIANGLE:
                geomSlotMark = new GeometryTriangle("SlotMark", 0, 0, 1, 1);
                break;
        }

        geomSlotMark.setSize(new Size(this.getCurrentSize().height * this.markingSizeRatio / 10, this.getCurrentSize().height * this.markingSizeRatio / 10));
        geomSlotMark.setLocation(this.getRealLocation(new Point(0, 0)));
        geomSlotMark.attribute.lineThick = 3 * this.zoomRatioInfo.zoomRatio + 0.5 + this._lineThick;

        const radius = geomSlotMark.getMBR().width / 2;

        geomSlotMark.attribute.fillColor = this._markingBackColor;
        geomSlotMark.attribute.lineColor = this._markingBorderColor;
        geomSlotMark.setLocation(new Point(this.getCurrentLocation().x + this.getCurrentSize().width / 2 - radius, this.getCurrentLocation().y + this.getCurrentSize().height / 2 - radius));

        if (this._markingType === MarkingTypes.INVERT_TRIANGLE) {
            geomSlotMark.rotate(180);
        }

        geomSlotMark.draw(ctx);
    }

    setMarking(visible: boolean): void {
        this.setMarkingBorderThickByType(visible, this._markingBackColor, this._markingBorderColor, this._markingType, 0);
    }

    setMarkingByType(visible: boolean, markingType: MarkingTypes): void {
        this.setMarkingBorderThickByType(visible, this._markingBackColor, this._markingBorderColor, markingType, 0);
    }

    setMarkingColor(visible: boolean, backColor: Color, borderColor: Color): void {
        this.setMarkingBorderThickByType(visible, backColor, borderColor, this._markingType, 0);
    }

    setMarkingBorderByType(visible: boolean, backColor: Color, borderColor: Color, markingType: MarkingTypes): void {
        this.setMarkingBorderThickByType(visible, backColor, borderColor, markingType, 0);
    }

    setMarkingBorderThickByType(visible: boolean, backColor: Color, borderColor: Color, markingType: MarkingTypes, lineThick: number): void {
        this._marked = visible;
        this._markingBackColor = backColor;
        this._markingBorderColor = borderColor;
        this._markingType = markingType;
        this._lineThick = lineThick;
    }
}

export default TSlot;