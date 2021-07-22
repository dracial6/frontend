import BayItem from "./BayItem";
import HatchItem from "./HatchItem";
import VesselParticularItem from "./VesselParticularItem";

class VesselDefine {
    vslParticular: VesselParticularItem = new VesselParticularItem();
    vslHatchs: HatchItem[] = [];
    vslBays: BayItem[] = [];

    isEmpty(): boolean {
        return this.vslHatchs.length === 0 || this.vslBays.length === 0;
    }

    setVesselDefine(apiResult: any): void {
        if (apiResult.vslParticularList && apiResult.vslParticularList.length > 0) {
            const apiVslParticular = apiResult.vslParticularList[0];
            this.vslParticular.vslCd = apiVslParticular.vslCd;
            this.vslParticular.inmarsatNo = apiVslParticular.inmarsatNo;
            this.vslParticular.lloydNo = apiVslParticular.lloydNo;
            this.vslParticular.loa = apiVslParticular.loa;
            this.vslParticular.lbp = apiVslParticular.lbp;
            this.vslParticular.width = apiVslParticular.width;
            this.vslParticular.depth = apiVslParticular.depth;
            this.vslParticular.topTierHeight = apiVslParticular.topTierHeight;
            this.vslParticular.antennaHeight = apiVslParticular.antennaHeight;
            this.vslParticular.summerDraft = apiVslParticular.summerDraft;
            this.vslParticular.summerDisplacement = apiVslParticular.summerDisplacement;
            this.vslParticular.summerDeadWeight = apiVslParticular.summerDeadWeight;
            this.vslParticular.deckRowWidth = apiVslParticular.deckRowWidth;
            this.vslParticular.holdRowWidth = apiVslParticular.holdRowWidth;
            this.vslParticular.starRowWidth = apiVslParticular.starRowWidth;
            this.vslParticular.portRowWidth = apiVslParticular.portRowWidth;
            this.vslParticular.maxRows = apiVslParticular.maxRows;
            this.vslParticular.maxHoldTier = apiVslParticular.maxHoldTier;
            this.vslParticular.maxDeckTier = apiVslParticular.maxDeckTier;
            this.vslParticular.maxTiers = apiVslParticular.maxTiers;
            this.vslParticular.maxHatchNo = apiVslParticular.maxHatchNo;
            this.vslParticular.deckHousePos = apiVslParticular.deckHousePos;
            this.vslParticular.maxBays = apiVslParticular.maxBays;
            this.vslParticular.vslType1 = apiVslParticular.vslType1;
            this.vslParticular.hydroStart = apiVslParticular.hydroStart;
            this.vslParticular.hydroInterval = apiVslParticular.hydroInterval;
            this.vslParticular.knStart = apiVslParticular.knStart;
            this.vslParticular.knInterval = apiVslParticular.knInterval;
            this.vslParticular.bonjeanStart = apiVslParticular.bonjeanStart;
            this.vslParticular.bonjeanInterval = apiVslParticular.bonjeanInterval;
            this.vslParticular.sValueStart = apiVslParticular.svalueStart;
            this.vslParticular.sValueInterval = apiVslParticular.svalueInterval;
            this.vslParticular.maxDraft = apiVslParticular.maxDraft;
            this.vslParticular.maxDZ = apiVslParticular.maxDZ;
            this.vslParticular.windPressureStart = apiVslParticular.windPressureStart;
            this.vslParticular.windPressureInterval = apiVslParticular.windPressureInterval;
            this.vslParticular.trimStart = apiVslParticular.trimStart;
            this.vslParticular.trimInterval = apiVslParticular.trimInterval;
            this.vslParticular.stressType = apiVslParticular.stressType;
            this.vslParticular.userBayType = apiVslParticular.userBayType;
            this.vslParticular.trimKMT = apiVslParticular.trimKMT;
            this.vslParticular.trimKN = apiVslParticular.trimKN;
            this.vslParticular.trimHydro = apiVslParticular.trimHydro;
            this.vslParticular.knCurveType = apiVslParticular.knCurveType;
            this.vslParticular.maxBM = apiVslParticular.maxBM;
            this.vslParticular.sValue = apiVslParticular.svalue;
            this.vslParticular.longitudinalPermitType = apiVslParticular.longitudinalPermitType;
            this.vslParticular.torque = apiVslParticular.torque;
            this.vslParticular.minGM = apiVslParticular.minGM;
            this.vslParticular.propeller = apiVslParticular.propeller;
            this.vslParticular.searchForceManipulateType = apiVslParticular.searchForceManipulateType;
            this.vslParticular.windPressure = apiVslParticular.windPressure;
            this.vslParticular.trimOptimization = apiVslParticular.trimOptimization;
            this.vslParticular.remarkAllow1 = apiVslParticular.remarkAllow1;
            this.vslParticular.remarkAllow2 = apiVslParticular.remarkAllow2;
            this.vslParticular.autoDeckHouse = apiVslParticular.autoDeckHouse;
            this.vslParticular.hatchless = apiVslParticular.hatchless;
            this.vslParticular.corrMaxSF = apiVslParticular.corrMaxSF;
            this.vslParticular.boGanBoyDis = apiVslParticular.boGanBoyDis;
        }

        if (apiResult.vslHatchList && apiResult.vslHatchList.length > 0) {
            apiResult.vslHatchList.forEach((element: any) => {
                const hatchItem = new HatchItem();
                hatchItem.hatchIndex = element.hatchIndex;
                hatchItem.startBay = element.startBay;
                hatchItem.endBay = element.endBay;
                hatchItem.x = element.x;
                hatchItem.y = element.y;
                hatchItem.type = element.hatchType;
                this.vslHatchs.push(hatchItem);
            })
        }

        if (apiResult.vslBayList && apiResult.vslBayList.length > 0) {
            apiResult.vslBayList.forEach((element: any) => {
                const bayItem = new BayItem();
                bayItem.vslCd = element.vslCd;
                bayItem.bayNo = element.bayNo;
                bayItem.userNo = element.userNo;
                bayItem.hatchIdx = element.hatchIdx;
                bayItem.hatchCoverNo = element.hatchCoverNo;
                bayItem.deckLCG = element.deckLCG;
                bayItem.holdLCG = element.holdLCG;
                bayItem.holdTopTierIdx = element.holdTopTierIdx;
                bayItem.holdNo = element.holdNo;
                bayItem.chkCrane = element.chkCrane;
                bayItem.isNotLoaded40Cntr = element.isNotLoaded40Cntr;
                this.vslBays.push(bayItem);
            })
        }
    }
}

export default VesselDefine;