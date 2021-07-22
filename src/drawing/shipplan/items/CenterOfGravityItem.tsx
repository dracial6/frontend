import BaseDataItem from "../../../common/items/BaseDataItem"

class CenterOfGravityItem extends BaseDataItem {
    public vcg: number[] = [];
    public tcgDeck: number[] = [];
    public tcgHold: number[] = [];
    public stackWeightDeck: number[] = [];
    public stackWeightHold: number[] = [];
    public hatchCoverClear: number[] = [];
    public cellGuideClear: number[] = [];
}

export default CenterOfGravityItem;