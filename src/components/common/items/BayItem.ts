import BaseDataItem from "../../../common/items/BaseDataItem";

class BayItem extends BaseDataItem {
    private _index = 0;
    private _maxRow = 0;
    
    block = "";
    name2 = "";
    name4 = "";
    maxTier = 0;
    accessDir = "";
    nosVoid = 0;
    isLocked = false;
    ex20_Chk = "";
    ex40_Chk = "";
    ex45_Chk = "";
    cPOs: number[] = [];

    getIndex(): number {
        return this._index;
    }

    setIndex(index: number): void {
        this._index = index;
        this.key = index.toString();
    }

    getDisplayName(): string {
        if (this.name2.length === 0 || this.name4.length === 0) {
            return this.name2 + this.name4;
        } else if (this.name2 !== this.name4) {
            return this.name2 + "/" + this.name4;
        } else {
            return this.name2;
        }
    }

    getMaxRow(): number {
        return this._maxRow;
    }

    setMaxRow(maxRow: number): void {
        this._maxRow = maxRow;
        this.cPOs = [];
        if (this._maxRow >= 1) {
            
            for (let i = 0; i < this._maxRow; i++) {
                this.cPOs.push(1);
            }
        }
    }
}

export default BayItem;