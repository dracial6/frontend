import VesselItem from "./VesselItem"

class HatchRelationItem extends VesselItem {
    public hangLeft: number[] = [];
    public hangRight: number[] = [];
    public hatchCoverType = 0;
}

export default HatchRelationItem;