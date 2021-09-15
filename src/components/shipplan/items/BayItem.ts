import { OnBoardCraneType } from "../structures";
import CenterOfGravityItem from "./CenterOfGravityItem";
import HatchCoverItem from "./HatchCoverItem";
import HatchRelationItem from "./HatchRelationItem";
import IMDGItem from "./IMDGItem";
import RowItem from "./RowItem";
import SlotItem from "./SlotItem";
import SOLASItem from "./SOLASItem";
import SpecialHatchItem from "./SpecialHatchItem";
import TierItem from "./TierItem";
import VesselItem from "./VesselItem";

class BayItem extends VesselItem {
    public bayIdx = 0;
    public bayNo = '';
    public userNo = '';
    public hatchIdx = 0;
    public hatchCoverNo = 0;
    public deckLCG = 0;
    public holdLCG = 0;
    public holdTopTierIdx = 0;
    public holdNo = 0;
    public box: number[] = [];
    public hatchCoverPos: number[] = [];
    public hatchCoverRstHold: number[] = [];
    public hatchCoverRstDeck: number[] = [];
    public isNotLoaded40Cntr = false;
    public chkCrane = "N";
    public cranePosition: OnBoardCraneType = OnBoardCraneType.NONE;
    public rowItem: RowItem = new RowItem();
    public tierItem: TierItem = new TierItem();
    public slotItem: SlotItem = new SlotItem();
    public hatchCoverItem: HatchCoverItem = new HatchCoverItem();
    public imdgItem: IMDGItem = new IMDGItem();
    public solasItem: SOLASItem = new SOLASItem();
    public cogItem: CenterOfGravityItem = new CenterOfGravityItem();
    public specialHatchItem: SpecialHatchItem = new SpecialHatchItem();
    public hatchRelationItem: HatchRelationItem = new HatchRelationItem();
}

export default BayItem;