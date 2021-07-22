import VesselItem from "./VesselItem";

class SOLASItem extends VesselItem {
    public code: string[] = [];
    public holdDeck: string[] = [];
    public bayNo = '';
    public rowNo = '';
    public tierNo = '';
}

export default SOLASItem;