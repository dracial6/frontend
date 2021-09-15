import DrawableObject from "../../../drawing/elements/DrawableObject";
import GeometryPolygon from "../../../drawing/elements/GeometryPolygon";
import GeometryText from "../../../drawing/elements/GeometryText";
import IDragable from "../../../drawing/elements/IDragable";
import IGeometryToolTip from "../../../drawing/elements/IGeometryToolTip";
import { ContentAlignment, Point, Rectangle, Size } from "../../../drawing/structures";
import DrawableUtil from "../../../utils/DrawableUtil";
import FontUtil from "../../../utils/FontUtil";
import EquipmentSideItem from "../items/EquipmentSideItem";
import EquipmentWheelType from "../structures/EquipmentWheelType";
import ViewDirection from "../structures/ViewDirection";
import TWheelRail from "./TWheelRail";
import TWheelTire from "./TWheelTire";

abstract class TBaseEquipmentSide extends DrawableObject implements IGeometryToolTip, IDragable {
    TBaseEquipmentSide = 0;
    
    private _body?: GeometryPolygon;
    
    tooltipText = "";
    tooltipGroup = "";
    isDragable = true;
    equipment: EquipmentSideItem;
    equipmentSize: Size;
    readonly viewType: ViewDirection;
    readonly wheelHeight: number;

    constructor(key: string, viewType: ViewDirection, equipment: EquipmentSideItem, equipmentSize: Size, wheelHeight: number) {
        super(key);
        this.viewType = viewType;
        this.equipment = equipment;
        this.tooltipText = equipment.toolTipText;
        this.equipmentSize = equipmentSize;
        this.wheelHeight = wheelHeight;
    }

    protected addBody(): void {
        const pointList = this.getEquipmentVertex();
        this._body = new GeometryPolygon("Body", pointList);
        this._body.attribute.lineColor = this.equipment.borderColor;
        this._body.attribute.fillColor = this.equipment.backColor;
        this.addGeomObject(this._body);
    }

    protected addWheel(): void {
        if (this.equipment.wheelType === EquipmentWheelType.Rail) {
            this.addWheelRail();
        } else {
            this.addWheelTire();
        }
    }

    private addWheelTire(): void {
        const legLeftStartPos = this.getLeftLegStartPos();
        const legRightStartPos = this.getRightLegStartPos();
        const legWidth = this.getLegWidth();
        const wheelCount = this.getWheelCount();

        const leftWheel = new TWheelTire("LW", this.wheelHeight, wheelCount, this.equipment.wheelBackColor);
        leftWheel.setLocation(new Point(legLeftStartPos.x + (legWidth - leftWheel.getSize().width) / 2, this.equipmentSize.height - this.wheelHeight));
        this.addGeomObject(leftWheel);

        const rightWheel = new TWheelTire("RW", this.wheelHeight, wheelCount, this.equipment.wheelBackColor);
        rightWheel.setLocation(new Point(legRightStartPos.x + (legWidth - leftWheel.getSize().width) / 2, this.equipmentSize.height - this.wheelHeight));
        this.addGeomObject(rightWheel);
    }

    private addWheelRail(): void {
        const legWidth = this.getLegWidth();

        const legLeftStartPos = this.getLeftLegStartPos();
        const legRightStartPos = this.getRightLegStartPos();


        const wheelWidth = legWidth;
        const railWidth = legWidth + (0.8 * legWidth);
        const railHeight = this.wheelHeight;

        const leftWheel = new TWheelRail("LW", wheelWidth, railWidth, railHeight, this.equipment.wheelBackColor);
        leftWheel.setLocation(new Point(legLeftStartPos.x + (legWidth - leftWheel.getSize().width) / 2, this.equipmentSize.height - this.wheelHeight));
        this.addGeomObject(leftWheel);

        const rightWheel = new TWheelRail("RW", wheelWidth, railWidth, railHeight, this.equipment.wheelBackColor);
        rightWheel.setLocation(new Point(legRightStartPos.x + (legWidth - leftWheel.getSize().width) / 2, this.equipmentSize.height - this.wheelHeight));
        this.addGeomObject(rightWheel);
    }

    protected addEquipmentName(): void {
        const displayBounds = this.getLabelDisplayBounds();
        const name = new GeometryText("Name", 0, 0, this.equipment.getName());
        name.setLocation(displayBounds.getLocation());
        name.setSize(displayBounds.getSize());
        name.attribute.textAlign = ContentAlignment.MiddleCenter;
        name.attribute.fontName = "tahoma";
        this.equipment.fontSize = this.getFitFontSize(this.equipment.fontSize, name.attribute.fontName, this.equipment.getName(), displayBounds);
        name.attribute.fontSize = this.equipment.fontSize;
        name.attribute.fontStyle = this.equipment.nameStyle.getTextStyle();
        name.attribute.lineColor = this.equipment.nameStyle.textColor;
        name.text = this.equipment.getName();

        this.addGeomObject(name);
    }

    private getFitFontSize(defaultFontSize: number, fontName: string, text: string, displayBounds: Rectangle): number {
        let textMetrics = undefined;
        let isOkay = false;
        let size = defaultFontSize;

        while (isOkay == false) {
            textMetrics = FontUtil.measureText(text, fontName, size, this.equipment.nameStyle.textStyle);

            if (textMetrics) {
                const textSize = new Size(textMetrics.width, textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent);
                if (textSize.width <= displayBounds.width) {
                    isOkay = true;
                } else {
                    size = size - 0.1;
                }

                if (size <= 4) {
                    isOkay = true;
                }
            }
        }

        return size;
    }

    abstract getEquipmentVertex(): Point[];
    abstract getEquipmentBodyHeight(): number;
    abstract getLeftLegStartPos(): Point;
    abstract getRightLegStartPos(): Point;
    abstract getLabelDisplayBounds(): Rectangle;
    abstract getWheelCount(): number;
    abstract getLegWidth(): number;

    getDragData(): any {
        return this.equipment;
    }

    pointInObject(point: Point): boolean {
        if (!this._body) {
            return super.pointInObject(point);
        } else {
            const pointArray = this._body.getPointArray();
            if (DrawableUtil.isContainPoint(pointArray, point.x, point.y)) {
                return true;
            }

            return false;
        }
    }
}

export default TBaseEquipmentSide;