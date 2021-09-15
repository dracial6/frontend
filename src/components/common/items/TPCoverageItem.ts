import BaseDataItem from "../../../common/items/BaseDataItem";

class TPCoverageItem extends BaseDataItem {
    private _bay = 0;
    private _row = 0;

    tp = "";
    block = "";

    getBay(): number {
        return this._bay;
    }

    setBay(bay: number): void {
        this._bay = bay;
        this.key = this.tp + this.block + this._bay.toString().padStart(3, '0') + this._row.toString().padStart(3, '0');
    }

    getRow(): number {
        return this._row;
    }

    setRow(row: number): void {
        this._row = row;
        this.key = this.tp + this.block + this._bay.toString().padStart(3, '0') + this._row.toString().padStart(3, '0');
    }
}

export default TPCoverageItem;