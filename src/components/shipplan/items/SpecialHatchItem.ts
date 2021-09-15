import VesselItem from "./VesselItem"

class SpecialHatchItem extends VesselItem {
    public hatchCoverNo = 0;
    public uhcNo = 0;
    public lhcNo = 0;
    public uhc: number[] = [];
    public lhc: number[] = [];
    public rsd: number[] = [];
    public ursd: number[] = [];
    public lrsd: number[] = [];
    public rsh: number[] = [];
    public ursh: number[] = [];
    public lrsh: number[] = [];
}

export default SpecialHatchItem;