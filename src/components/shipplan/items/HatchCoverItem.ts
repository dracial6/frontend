import VesselItem from "./VesselItem";

class HatchCoverItem extends VesselItem {
    public smallHatchCoverPos: number[] = [];
    public hatchCoverPos: number[] = [];
    public hatchCoverRstDeck: number[] = [];
    public hatchCoverRstHold: number[] = [];
    public holdNo: number[] = [];
}

export default HatchCoverItem;