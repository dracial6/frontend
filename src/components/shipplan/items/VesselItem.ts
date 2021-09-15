import BaseDataItem from "../../../common/items/BaseDataItem";

class VesselItem extends BaseDataItem {
    public vslCd = '';
    public vslName = '';
    public callSign = '';
    public inmarsatNo = '';
    public lloydNo = '';
    public loa = 0;
    public lbp = 0;
    public width = 0;
    public depth = 0;
    public topTierHeight = 0;
    public antennaHeight = 0;
    public summerDraft = 0;
    public summerDisplacement = 0;
    public summerDeadWeight = 0;
    public deckRowWidth = 0;
    public holdRowWidth = 0;
    public starRowWidth = 0;
    public portRowWidth = 0;
    public maxRows = 0;
    public maxHoldTier = 0;
    public maxDeckTier = 0;
    public maxTiers = 0;
    public maxHatchNo = 0;
    public deckHousePos = 0;
    public maxBays = 0;
    public vslType1 = '';
}

export default VesselItem;