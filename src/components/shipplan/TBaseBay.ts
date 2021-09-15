import { Color, Point, Size } from "../../drawing/structures";
import GeneralPRFSEQCountItem from "./items/GeneralPRFSEQCountItem";
import GeneralQCScheduleItem from "./items/GeneralQCScheduleItem";
import { BayType } from "./structures";
import TBaseGeneral from "./TBaseGeneral";
import TBayProperty from "./TBayProperty";
import TBaySchedule from "./TBaySchedule";

class TBaseBay extends TBaseGeneral {
    private _bay: number;
    private _baySchedule?: TBaySchedule;
    private _bayType: BayType
    private _isMakeScheduleInfo = true;

    boundMode = 0;

    constructor(key: string, bay: number, bayType: BayType, isMakeScheduleInfo: boolean, tBayProperty: TBayProperty) {
        super(key, tBayProperty);
        this._bay = bay;
        this._bayType = bayType;
        this._isMakeScheduleInfo = isMakeScheduleInfo;
    }

    protected initialize() {
        this.drawBaySchedule(0, 0);
    }

    protected drawBaySchedule(x: number, y: number): void {
        if (!this._isMakeScheduleInfo) return;
        const key = "TBaySchedule_" + this._bay;

        if (!this._baySchedule) {
            this._baySchedule = new TBaySchedule(key, this._bay, this._bayType, this.PROPERTY);
            this._baySchedule.updateMBR();
            this.addGeomObject(this._baySchedule);
        }

        this._baySchedule.setLocation(new Point(x, y));
        this._baySchedule.setSize(new Size(1, this._baySchedule.getSize().height));
        this._baySchedule.visible = true;
        
        if (this.zoomRatioInfo.zoomRatio === 1) {
            this._baySchedule.visible = false;
        }
    }

    setTitleColor(dhMode: number, foreColor: Color, backColor: Color): void {
        if (!this._baySchedule) return;
        this._baySchedule.setTitleColor(dhMode, foreColor, backColor);
    }

    selectContainerSizeButton(containerSize: number) {
        if (!this._baySchedule) return;
        this._baySchedule.selectContainerSizeButton(containerSize);
    }

    addQCScheduleHatch(qcScheduleItem: GeneralQCScheduleItem) {
        if (!this._baySchedule) return;
        this._baySchedule.addQCScheduleHatch(qcScheduleItem);
    }

    arrangeQCScheduleHatch() {
        if (!this._baySchedule) return;
        this._baySchedule.arrangeQCScheduleHatch();
    }

    removeQCScheduleHatch(qcScheduleItem: GeneralQCScheduleItem) {
        if (!this._baySchedule) return;
        this._baySchedule.removeQCScheduleHatch(qcScheduleItem);
    }

    setQCScheduleHatch(pRFSEQCountItem: GeneralPRFSEQCountItem) {
        if (!this._baySchedule) return;
        this._baySchedule.setQCScheduleHatch(pRFSEQCountItem);
    }

    clearQCScheduleHatch(deckHold: number) {
        if (!this._baySchedule) return;
        this._baySchedule.clearQCScheduleHatch(deckHold);
    }

    getBaySchedule() {
        return this._baySchedule;
    }
}

export default TBaseBay;