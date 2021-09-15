class BaseSlotItem {
    bay = 0;
    row = 0;
    tier = 0;

    constructor(bay: number, row: number, tier: number) {
        this.bay = bay;
        this.row = row;
        this.tier = tier;
    }
}

export default BaseSlotItem;