import BaseDataItem from "../../../common/items/BaseDataItem";
import TPCoverageItem from "./TPCoverageItem";

class BufferItem extends BaseDataItem {
    private _buffer = "";
    private _sortedTpCoverageList = new Map<string, TPCoverageItem>();

    block = "";
    bayIdx = 0;
    rowIdx = 0;
    tpType = "";
    mxTier = 0;
    passTier = 0;

    getBuffer(): string {
        return this._buffer;
    }

    setBuffer(buffer: string): void {
        this._buffer = buffer;
        this.key = buffer;
    }

    getTPCoverageList(): Map<string, TPCoverageItem> {
        return new Map([...Array.from(this._sortedTpCoverageList.entries())].sort());
    }

    setTPCoverageList(map: Map<string, TPCoverageItem>): void {
        this._sortedTpCoverageList = map;
    }
}

export default BufferItem;