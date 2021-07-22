import { Size } from "../../structures";
import ZoomRatioInfo from "../structures/ZoomRatioInfo";

class SlotLocationUtil {
    private _zoomRatioInfo: ZoomRatioInfo;

    constructor(zoomRatioInfo: ZoomRatioInfo) {
        this._zoomRatioInfo = zoomRatioInfo;
    }

    public getSlotSize(): Size {
        return new Size(this._zoomRatioInfo.slotWidth, this._zoomRatioInfo.slotHeight);
    }

    public getSlotPosX(row: number): number {
        return this._zoomRatioInfo.slotWidth * row;
    }

    public getSlotPosY(tier: number): number {
        return this._zoomRatioInfo.slotHeight * tier;
    }    

    public getSlotWidth(): number {
        return this._zoomRatioInfo.slotWidth;
    }

    public getSlotHeight(): number {
        return this._zoomRatioInfo.slotHeight;
    }
}

export default SlotLocationUtil;