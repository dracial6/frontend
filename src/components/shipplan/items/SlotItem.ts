import VesselItem from "./VesselItem";

class SlotItem extends VesselItem {
    public cpo: Array<number>[] = [];
    public expanded: Array<number>[] = [];
    public ex20Check: Array<boolean>[] = [];
    public ex40Check: Array<boolean>[] = [];
    public ex45Check: Array<boolean>[] = [];
    public rfCheck: Array<boolean>[] = [];
    public slimCellGuide: Array<boolean>[] = [];
}

export default SlotItem;