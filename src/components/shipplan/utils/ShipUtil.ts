import BayItem from "../items/BayItem";
import VesselDefine from "../items/VesselDefine";

class ShipUtil {
    static getViewBayNo(bayNo: string): string {
        if (!bayNo || bayNo === '') {
            return "-";
        }

        return bayNo;
    }

    static isHold(vesselDefine: VesselDefine, bayIndex: number, tierIndex: number): boolean {
        if (bayIndex === 0 || tierIndex === 0) return false;
        return (vesselDefine.vslBays[bayIndex].holdTopTierIdx <= tierIndex) ? false : true;
    }

    static invalidateVesselDefineData(vesselDefine: VesselDefine) {
        if (!vesselDefine) return true;
        if (!vesselDefine.vslBays) return true;
        if (!vesselDefine.vslHatchs) return true;
        if (!vesselDefine.vslParticular) return true;

        return false;
    }

    static getBayNo(vesselDefine: VesselDefine, bayIndex: number): number {
        let tempBayNo = -1;
        const hatchIndex = vesselDefine.vslBays[bayIndex].hatchIdx;
        const startBay = vesselDefine.vslHatchs[hatchIndex].startBay;
        const endBay = vesselDefine.vslHatchs[hatchIndex].endBay;

        if (vesselDefine.vslBays[bayIndex].bayNo) {
            tempBayNo = parseInt(vesselDefine.vslBays[bayIndex].bayNo);
            return (tempBayNo === 0) ? bayIndex : tempBayNo;
        } else {
            // Make Virtual bay number
            if (startBay - endBay !== 0) {
                // Case 01
                //한 hatch가 3개의 Bay로 구성되는 것이 일반적이고 Name이 Null인 경우가 허용되지 않으나
                //KLine에서는 Bay 01/02/Null로 구성되는 경우가 있음.
                //즉, 3개 Bay로 구성된 Hatch의 맨 마지막 Bay Name이 Null로 구성됨.
                tempBayNo = 1;
            } else {
                // Case 02
                //한 Hatch에 하나의 Bay로 구성된 Bay를 전용 Bay라고 부르는데 40 전용 Bay의 경우,
                //Bay Name이 Null인 경우가 있음.
                tempBayNo = 2;
            }
        }

        return tempBayNo;
    }
}

export default ShipUtil;