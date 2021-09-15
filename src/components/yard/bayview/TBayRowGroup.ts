import GeometryRectangle from "../../../drawing/elements/GeometryRectangle";
import LayerDrawableObject from "../../../drawing/elements/LayerDrawableObject";
import { Color, DisplayLayer, Point, Rectangle, Size } from "../../../drawing/structures";
import DrawableUtil from "../../../utils/DrawableUtil";
import TBaseEquipmentSide from "../../common/equipments/TBaseEquipmentSide";
import TEquipmentSideOther from "../../common/equipments/TEquipmentSideOther";
import EquipmentSideItem from "../../common/items/EquipmentSideItem";
import EquipmentType from "../../common/structures/EquipmentType";
import ViewDirection from "../../common/structures/ViewDirection";
import BlockViewUtil from "../utils/BlockViewUtil";
import TBay from "./TBay";

class TBayRowGroup extends LayerDrawableObject {
    private _boundsGeom?: GeometryRectangle;

    sortIndex = 0;
    block = '';
    bayRow = 0;
    readonly tBay: TBay;

    constructor(tBay: TBay, visibleEquipment: boolean) {
        super("TBay_" + tBay.getBlock() + "_" + tBay.getBayRow().toString());
        this.tBay = tBay;
        this.tBay.updateMBR();
        this.block = this.tBay.getBlock();
        this.bayRow = this.tBay.getBayRow();
        this.initialize();
        this.makeEquipmentMargin(visibleEquipment);
        this.updateMBR();
    }

    protected initialize(): void {
        this.addGeomObjectLayerBackground(this.tBay, false, DisplayLayer.One);
    }

    makeEquipmentMargin(visibleEquipment: boolean): void {
        let headHeight = 0;
        let legWidth = 0;

        let boundary1 = new Rectangle(0, 0, this.tBay.getSize().width, this.tBay.getSize().height);
        if (visibleEquipment) {
            headHeight = this.tBay.getSlotHeight();
            legWidth = this.getLegWidth();
            boundary1.width = boundary1.width + legWidth * 2;
            boundary1.height = boundary1.height + headHeight;
        }

        if (!this._boundsGeom) {
            this._boundsGeom = new GeometryRectangle("Bounds", 0, 0, 0, 0);
            this._boundsGeom.attribute.lineColor = Color.Transparent();
            this.addGeomObject(this._boundsGeom);
        }

        this._boundsGeom.setLocation(Point.empty());
        this._boundsGeom.setSize(boundary1.getSize());
        this.setSize(this._boundsGeom.getSize());
        this.tBay.setLocation(new Point(legWidth, headHeight));
        DrawableUtil.calculateAncher(this, this.tBay);
    }

    addEquipment(equipmentItem: EquipmentSideItem): void {
        equipmentItem.fontSize = this.tBay.getSlotHeight() / 2;

        switch (equipmentItem.equipmentType) {
            case EquipmentType.TC:
            case EquipmentType.TC2:
            case EquipmentType.TC2S:
            case EquipmentType.TC2E:
            case EquipmentType.SC:
                this.addTCAndSCEquipment(equipmentItem);
                break;
            default:
                this.addOtherEquipment(equipmentItem);
                break;
        }
    }

    addTCAndSCEquipment(equipmentItem: EquipmentSideItem) {
        const key = this.getEquipmentKey(equipmentItem.getName(), equipmentItem.block, equipmentItem.fromBay, equipmentItem.fromRow, equipmentItem.toBay, equipmentItem.toRow);
        const tBaseEquipment = this.getTBaseEquipment(key);

        if (tBaseEquipment) {
            const headHeight = this.tBay.getSlotHeight();
            const legWidth = this.getLegWidth();
            const wheelHeight = this.getWheelHeight();
            const boundary1 = this.getEquipmentSlotBounds(equipmentItem);
        }
    }

    addOtherEquipment(equipmentItem: EquipmentSideItem) : void {
        if (equipmentItem === undefined) {
            return;
        }

        const key = this.getEquipmentKey(equipmentItem.getName(), equipmentItem.block
                , equipmentItem.fromBay, equipmentItem.fromRow, equipmentItem.toBay, equipmentItem.toRow);

        let tBaseEquipment = this.getTBaseEquipment(key);
        if (!tBaseEquipment) {
            const legWidth = this.getLegWidth();
            const wheelHeight = this.getWheelHeight();
            const boundary1 = this.getEquipmentSlotBounds(equipmentItem);
            let equipSize = this.getEquipmentSize(equipmentItem, boundary1);
            let blankHeight = this.getBlankHeight(equipSize);
            tBaseEquipment = new TEquipmentSideOther(key, this.tBay.getViewType(), equipmentItem, equipSize, legWidth, blankHeight, wheelHeight);
            tBaseEquipment.updateMBR();
            const buttomBarBounds = this.tBay.getBottomBarBounds(equipmentItem.fromBay);
            tBaseEquipment.setLocation(new Point(boundary1.x - this.tBay.getSlotGap(), buttomBarBounds.y - tBaseEquipment.getSize().height));
            tBaseEquipment.setLocation(new Point(tBaseEquipment.getLocation().x + this.tBay.getLocation().x, tBaseEquipment.getLocation().y + this.tBay.getLocation().y + this.tBay.getTitleMoveY()));
            this.addGeomObjectLayerBackground(tBaseEquipment, false, DisplayLayer.Two);
            DrawableUtil.calculateAncher(this, tBaseEquipment);
        }
    }

    removeEquipmentByKey(name: string) : void {
        if (name.length > 0) {
            const list = this.getGeomListByMemberLayer("TBaseEquipmentSide", DisplayLayer.Two) as TBaseEquipmentSide[];
            if (list.length > 0) {
                const removeList = list.filter(ct => ct.equipment.getName() === name);
                this.removeEquipment(removeList);
            }
        }
    }
    
    removeEquipmentDetail(name: string, blockName: string, fromBay: number, fromRow: number, toBay: number, toRow: number) : void {
        if (name.length > 0) {
            const list = this.getGeomListByMemberLayer("TBaseEquipmentSide", DisplayLayer.Two) as TBaseEquipmentSide[];
            if (list) {
                const removeList = list.filter(ct => ct.equipment.getName() === name
                    && ct.equipment.block === blockName
                    && ct.equipment.fromBay === fromBay
                    && ct.equipment.fromRow === fromRow);
                this.removeEquipment(removeList);
            }
        }
    }

    private removeEquipment(removeList: TBaseEquipmentSide[]) : void {
        if (removeList.length > 0) {
            for (let item of removeList) {
                this.removeGeomObjectLayerKey(item.name, DisplayLayer.Two);
            }
        }
    }

    removeAllEquipment() : void {
        this.clearGeomObjectLayer(DisplayLayer.Two);
    }

    setVisibleEquipment(visible: boolean) : void {
        if (visible === true) {
            this.hiddenLayer = undefined;
        } else {
            this.hiddenLayer = DisplayLayer.Two;
        }
        this.makeEquipmentMargin(visible);
    }

    private getEquipmentSlotBounds(equipmentItem: EquipmentSideItem): Rectangle {
        const slotSize = new Size(this.tBay.getSlotWidth(), this.tBay.getSlotHeight());
        const startPos = this.tBay.getSlotLocation(BlockViewUtil.getBayRowIndexAtYAxis(this.tBay.getViewType(), equipmentItem.fromBay, equipmentItem.fromRow), 1);
        const endPos = this.tBay.getSlotLocation(BlockViewUtil.getBayRowIndexAtYAxis(this.tBay.getViewType(), equipmentItem.toBay, equipmentItem.toRow), equipmentItem.heightTier);

        const startBounds = new Rectangle(startPos.x, startPos.y, slotSize.width, slotSize.height);
        const endBounds = new Rectangle(endPos.x, endPos.y, slotSize.width, slotSize.height);

        return Rectangle.union(startBounds, endBounds);
    }

    private getLegWidth(): number {
        return this.tBay.getSlotWidth() * 0.4;
    }

    private getWheelHeight(): number {
        return this.tBay.getSlotHeight() * 0.4;
    }

    private getBlankHeight(equipSize: Size): number {
        return equipSize.height * 0.21;
    }

    private getEquipmentKey(name: string, blockName: string, fromBay: number, fromRow: number, toBay: number, toRow: number): string {
        return "EQ_" + name + "_" + blockName + "_" + fromBay + "_" + fromRow + "_" + toBay + "_" + toRow;
    }

    private getTBaseEquipment(key: string): TBaseEquipmentSide | undefined {
        const geom  = this.getGeomObjectLayer(key, DisplayLayer.Two);
        return (geom) ? this.getGeomObjectLayer(key, DisplayLayer.Two) as TBaseEquipmentSide : undefined;
    }

    private getEquipmentSize(equipmentItem: EquipmentSideItem, slotBounds: Rectangle) : Size {
        let equipSize = Size.empty();
        const legWidth = this.getLegWidth();
        const wheelHeight = this.getWheelHeight();
        const headHeight = this.tBay.getSlotHeight();

        switch (equipmentItem.equipmentType) {
            case EquipmentType.TC:
            case EquipmentType.TC2:
            case EquipmentType.TC2S:
            case EquipmentType.TC2E:
                equipSize = this.getTCSize(slotBounds, headHeight, legWidth); break;
            case EquipmentType.SC:
                equipSize = this.getSCSize(slotBounds, headHeight, legWidth); break;
            default:
                equipSize = this.getOtherSize(slotBounds, wheelHeight); break;
        }
        return equipSize;
    }

    private getTCSize(slotBounds: Rectangle, headHeight: number, legWidth: number) : Size {
        const equipSize = Size.empty();
        if (this.tBay.getViewType() === ViewDirection.Front) {
            slotBounds = new Rectangle(0, 0, this.tBay.getSize().width, this.tBay.getSize().height);
            equipSize.width = slotBounds.width + (legWidth * 2);
            equipSize.height = this.tBay.getButtonBarPosY() + headHeight;
        } else {
            equipSize.width = slotBounds.width + (legWidth * 2) + 2;
            equipSize.height = slotBounds.height + headHeight + (this.tBay.getSlotGap() + (this.tBay.getSlotHeight() * 0.7));
        }
        return equipSize;
    }

    private getSCSize(slotBounds: Rectangle, headHeight: number, legWidth: number) : Size {
        const equipSize = Size.empty();
        equipSize.width = slotBounds.width + (legWidth * 2) + 2;
        equipSize.height = slotBounds.height + headHeight + (this.tBay.getSlotGap() + (this.tBay.getSlotHeight() * 0.7));
        return equipSize;
    }

    private getOtherSize(slotBounds: Rectangle, wheelHeight: number) : Size {
        const equipSize = Size.empty();
        equipSize.width = slotBounds.width + (this.tBay.getSlotGap() * 2);
        equipSize.height = slotBounds.height + wheelHeight + (this.tBay.getSlotGap() + (this.tBay.getSlotHeight() * 0.5));
        return equipSize;
    }
}

export default TBayRowGroup;