import VesselDefine from "./items/VesselDefine";
import SlotLocationUtil from "./utils/SlotLocationUtil";
import ZoomRatioInfo from "./structures/ZoomRatioInfo";
import TBayProperty from "./TBayProperty";
import DrawableObject from "../../drawing/elements/DrawableObject";
import { Color } from "../../drawing/structures";

class TBaseGeneral extends DrawableObject {
    readonly PROPERTY: TBayProperty;
    readonly VESSEL_DEFINE: VesselDefine;

    private _slotLocationUtil: SlotLocationUtil | undefined;
    public zoomRatioInfo: ZoomRatioInfo = new ZoomRatioInfo();

    constructor(key: string, property: TBayProperty){
        super(key);
        this.PROPERTY = property;
        this.VESSEL_DEFINE = property.vesselDefine;
    }

    protected getSlotLocUtil(): SlotLocationUtil {
        if (!this._slotLocationUtil) {
            this._slotLocationUtil = new SlotLocationUtil(this.zoomRatioInfo);
        }

        return this._slotLocationUtil;
    }

    protected clearSlotLocUtil(): void {
        this._slotLocationUtil = undefined;
    }

    protected getSlotBoardColor(bay: number, row: number, tier: number): Color {
        const isDisplaySlimCellGuide = this.visibleSlimCellGuide(bay, row, tier);

        if (isDisplaySlimCellGuide === false) {
            return Color.Black();
        }

        return this.PROPERTY.slimCellGuideBoardColor;
    }

    private visibleSlimCellGuide(bay: number, row: number, tier: number): boolean {
        if (this.PROPERTY.visibleSlimCellGuide === false) return false;

        return this.VESSEL_DEFINE.vslBays[bay].slotItem.slimCellGuide[row][tier];
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

export default TBaseGeneral;