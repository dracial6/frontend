import BaseDataItem from "../../../common/items/BaseDataItem";

class RowItem extends BaseDataItem {
    private _index = 0;
    private _maxBay = 0;
    
    block = "";
    name = "";
    maxTier = "";
    scDir = "";
    isLocked = false;
    cPOs: number[] = [];

    getIndex(): number {
        return this._index;
    }

    setIndex(index: number): void {
        this._index = index;
        this.key = index.toString();
    }

    getMaxBay(): number {
        return this._maxBay;
    }

    setMaxRow(maxBay: number): void {
        this._maxBay = maxBay;
        this.cPOs = [];
        if (this._maxBay >= 1) {
            
            for (let i = 0; i < this._maxBay; i++) {
                this.cPOs.push(1);
            }
        }
    }
}

export default RowItem;