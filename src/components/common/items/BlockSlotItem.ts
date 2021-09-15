import BaseSlotItem from "./BaseSlotItem";

class BlockSlotItem extends BaseSlotItem {
    block = '';

    constructor(block: string, bay: number, row: number, tier: number) {
        super(bay, row, tier);
        this.block = block;
    }
}

export default BlockSlotItem;