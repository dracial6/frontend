import { Padding, Point, Size } from "../structures";
import GeneralQCScheduleItem from "./items/GeneralQCScheduleItem";
import { BayType, GeneralBayType, HatchDefine, ZoomRatioInfo } from "./structures";
import TBaseBay from "./TBaseBay";
import TBayProperty from "./TBayProperty";
import TGeneralBay from "./TGeneralBay";
import ShipUtil from "./utils/ShipUtil";

class TBay extends TBaseBay {
    private _generalBay?: TGeneralBay;

    readonly BayIndex: number;

    constructor(key: string, boundMode: number, bay: number, zoomRatioInfo: ZoomRatioInfo
        , tBayProperty: TBayProperty, isMakeScheduleInfo: boolean) {
        super(key, bay, BayType.Bay, isMakeScheduleInfo, tBayProperty);

        this.BayIndex = bay;
        this.imagePadding = new Padding(1, 1, 1, 1);
        this.boundMode = boundMode;
        this.zoomRatioInfo = zoomRatioInfo;

        this.initialize();
    }

    protected initialize(): void {
        if (ShipUtil.invalidateVesselDefineData(this.VESSEL_DEFINE)) return;

        // Check overlap
        const hatchIndex = this.VESSEL_DEFINE.vslBays[this.BayIndex].hatchIdx;
        const startBay = this.VESSEL_DEFINE.vslHatchs[hatchIndex].startBay;
        const endBay = this.VESSEL_DEFINE.vslHatchs[hatchIndex].endBay;
        
        let isOverlap = false;
        if (startBay != this.BayIndex) {
            if (ShipUtil.getBayNo(this.VESSEL_DEFINE, this.BayIndex) % 2 != 0) {
                isOverlap = true;
            }
        }

        this._generalBay = new TGeneralBay(HatchDefine.PREFIX_GENERAYBAY_KEY + this.BayIndex, this.boundMode
            , this.BayIndex, this.zoomRatioInfo, isOverlap, HatchDefine.CONTAINER_SIZE_20, this.PROPERTY);
        this._generalBay.generalBayType = GeneralBayType.OnlyBay;
        this.addGeomObject(this._generalBay);
        this.initializeBay();
    }

    initializeBay(): void {
        if(!this._generalBay) return;

        this._generalBay.initializeBay();
        this._generalBay.setLocation(new Point(0, 0));
        this.drawBaySchedule(0, this._generalBay.getSize().height);
        const baySchedule = this.getBaySchedule();
        
        if (baySchedule) {
            baySchedule.setSize(new Size(this._generalBay.getSize().width, baySchedule.getSize().height));
        }

        if (baySchedule && baySchedule.visible) {
            this.setSize(new Size(this._generalBay.getSize().width, this._generalBay.getSize().height + baySchedule.getSize().height));
        } else {
            this.setSize(this._generalBay.getSize());
        }
    }

    setCellWithWeight(value: boolean): void {
        this._generalBay?.setCellWithWeight(value);
        this.initializeBay();
    }

    setVisibleHatchCoverClearance(value: boolean): void {
        this._generalBay?.setVisibleHatchCoverClearance(value);
    }

    setZoomRatioInfo(zoomRatioInfo: ZoomRatioInfo): void {
        this.zoomRatioInfo = zoomRatioInfo;
        if (this._generalBay) this._generalBay.zoomRatioInfo = zoomRatioInfo;
        this.initializeBay();
    }

    setHatchSequence(qcScheduleItem: GeneralQCScheduleItem): void {
        const baySchedule = this.getBaySchedule();

        if (baySchedule) {
            baySchedule.selectQCScheduleHatchBtn(qcScheduleItem);
        }
    }

    getTGeneralBay(): TGeneralBay | undefined {
        return this._generalBay;
    }

    
}

export default TBay;