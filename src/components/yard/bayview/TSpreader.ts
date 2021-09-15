import DrawableObject from "../../../drawing/elements/DrawableObject";
import GeometryLine from "../../../drawing/elements/GeometryLine";
import GeometryPolygon from "../../../drawing/elements/GeometryPolygon";
import GeometryRectangle from "../../../drawing/elements/GeometryRectangle";
import IGeometryToolTip from "../../../drawing/elements/IGeometryToolTip";
import { Color, Point, Size } from "../../../drawing/structures";
import DrawableUtil from "../../../utils/DrawableUtil";
import SpreaderItem from "../../common/items/SpreaderItem";
import YTLaneLocTypes from "../../common/structures/YTLaneLocTypes";

class TSpreader extends DrawableObject implements IGeometryToolTip {
    private _leftLock!: GeometryRectangle;
    private _rightLock!: GeometryRectangle;
    private _body!: GeometryPolygon;
    private _leftWire!: GeometryLine;
    private _centerWire!: GeometryLine;
    private _rightWire!: GeometryLine;
    private _locked = true;
    private _lockBackColor: Color;
    private _backColor: Color;
    
    spreaderSize = -1;
    tooltipText = "";
    tooltipGroup = "";
    block = "";
    bay = 0;
    row = 0;
    tier = 0;
    lockedContainerNo = "";
    ytLaneLocTypes = YTLaneLocTypes.None;

    constructor(item: SpreaderItem) {
        super(item.name);
        this.spreaderSize = item.size;
        this._backColor = item.backColor;
        this._lockBackColor = item.lockBackColor;
        this._locked = item.locked;
        this.block = item.block;
        this.bay = item.bayIndex;
        this.row = item.rowIndex;
        this.tier = item.tierIndex;

        this.addComponent(item);
        this.updateMBR();
    }

    getLocked(): boolean {
        return this._locked;
    }

    setLocked(locked: boolean): void {
        if (this._locked !== locked) {
            this._locked = locked;

            if (locked) {
                this._leftLock.attribute.fillColor = this._lockBackColor;
                this._rightLock.attribute.fillColor = this._lockBackColor;
            } else {
                this._leftLock.attribute.fillColor = this._backColor;
                this._rightLock.attribute.fillColor = this._backColor;
            }
        }
    }

    getLockBackColor(): Color {
        return this._lockBackColor;
    }

    setLockBackColor(color: Color): void {
        if (this._lockBackColor !== color) {
            if (this._locked) {
                this._leftLock.attribute.fillColor = color;
                this._rightLock.attribute.fillColor = color;
            }
        }
    }

    private addComponent(item: SpreaderItem): void {
        const points: Point[] = []
        this._body = new GeometryPolygon(item.name + "_Body", points);
        this._body.attribute.fillColor = item.backColor;
        this._body.attribute.isOutLine = false;
        this._leftLock = new GeometryRectangle(item.name + "_LeftLock", 0, 0, 0, 0);
        this._rightLock = new GeometryRectangle(item.name + "_RightLock", 0, 0, 0, 0);
        this._leftWire = new GeometryLine(item.name + "_LeftWire", 0, 0, 0, 0);
        this._centerWire = new GeometryLine(item.name + "_CenterWire", 0, 0, 0, 0);
        this._rightWire = new GeometryLine(item.name + "_CenterWire", 0, 0, 0, 0);

        if (item.locked) {
            this._leftLock.attribute.fillColor = item.lockBackColor;
            this._rightLock.attribute.fillColor = item.lockBackColor;
        } else {
            this._leftLock.attribute.fillColor = item.backColor;
            this._rightLock.attribute.fillColor = item.backColor;
        }

        this.visible = item.visible;

        this.addGeomObject(this._body);
        this.addGeomObject(this._leftWire);
        this.addGeomObject(this._centerWire);
        this.addGeomObject(this._rightWire);
        this.addGeomObject(this._leftLock);
        this.addGeomObject(this._rightLock);
    }

    setComponent(slotLocation: Point, slotSize: Size, slotGap: number): void {
        let bodyHeight = slotSize.height / 4;
        const size = this._body.getSize();
        this._body.setDataList(this.getBodyData(slotLocation, slotSize, slotGap));
        this._leftLock.setSize(new Size(size.width / 8, size.height));
        this._leftLock.setLocation(new Point(0, slotLocation.y - bodyHeight));
        this._rightLock.setSize(this._leftLock.getSize());
        this._rightLock.setLocation(new Point(size.width - this._leftLock.getSize().width, this._leftLock.getLocation().y));
        this._leftWire.setData(0, 0, 0, slotLocation.y - bodyHeight);
        this._leftWire.attribute.lineThick = 4;
        this._centerWire.setData(size.width / 2, 0, size.width / 2, slotLocation.y - size.height);
        this._centerWire.attribute.lineThick =4;
        this._rightWire.setData(size.width, 0, size.width, slotLocation.y - bodyHeight);
        this.setLocation(new Point(slotLocation.x, 0));
    }

    private getBodyData(slotLocation: Point, slotSize: Size, slotGap: number): Point[] {
        const data: Point[] = [];
        const defaultSpreaderSize = 20;
        let spreaderWidth = 0;

        if (this.ytLaneLocTypes === YTLaneLocTypes.None) {
            const gapCount = Math.ceil(this.spreaderSize / 20 - 1);
            spreaderWidth = slotSize.width * (this.spreaderSize / defaultSpreaderSize) + (gapCount * slotGap);
        } else {
            spreaderWidth = slotSize.width;
        }

        const spreaderCenterX = spreaderWidth / 2;
        const bodyHeight = slotSize.height / 4;
        const headHeight = bodyHeight / 2;

        data.push(new Point(0, slotLocation.y - bodyHeight));
        data.push(new Point(spreaderCenterX / 2, slotLocation.y - bodyHeight));
        data.push(new Point(spreaderCenterX * 3 / 4, slotLocation.y - bodyHeight - headHeight));
        data.push(new Point(spreaderCenterX * 5 / 4, slotLocation.y - bodyHeight - headHeight));
        data.push(new Point(spreaderCenterX + spreaderCenterX / 2, slotLocation.y - bodyHeight));
        data.push(new Point(spreaderWidth, slotLocation.y - bodyHeight));
        data.push(new Point(spreaderWidth, slotLocation.y));
        data.push(new Point(0, slotLocation.y));

        return data;
    }

    pointInObject(point: Point): boolean {
        let isContain = false;

        if (this._leftLock.contains(point) || this._rightLock.contains(point)
        || DrawableUtil.isContainPoint(this._body.getPointArray(), point.x, point.y)) {
            isContain = true;
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

export default TSpreader;