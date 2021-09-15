import BaseDataItem from "../../../common/items/BaseDataItem";

class BlockUseItem extends BaseDataItem {
    private _seq = 0;

    block = "";
    use = "";
    startBay = 0;
    endBay = 0;
    reservedSlot = 0;

    getSeq(): number {
        return this._seq;
    }

    setSeq(seq: number): void {
        this._seq = seq;
    }

    getStartBayStr(): string | undefined {
        if (this.startBay < 1) {
            return undefined;
        } else {
            return this.startBay.toString();
        }
    }

    setStartBayStr(startBay: string): void {
        let index = 0;
        
        if (startBay.length > 0) {
            index = parseInt(startBay);
        }

        if (index !== this.startBay) {
            this.startBay = index;
            this.notifyPropertyChanged("StartBay");
        }
    }

    getEndBayStr(): string | undefined {
        if (this.endBay < 1) {
            return undefined;
        } else {
            return this.endBay.toString();
        }
    }

    setEndBayStr(endBay: string): void {
        let index = 0;
        
        if (endBay.length > 0) {
            index = parseInt(endBay);
        }

        if (index !== this.endBay) {
            this.endBay = index;
            this.notifyPropertyChanged("EndBay");
        }
    }
}

export default BlockUseItem;