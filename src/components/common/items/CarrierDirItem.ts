import BaseDataItem from "../../../common/items/BaseDataItem";

class CarrierDirItem extends BaseDataItem {
    private _type = "";

    yardID = "";
    block = "";
    pos = "";
    enter = "";
    
    getType(): string {
        return this._type;
    }

    setType(type: string): void {
        this._type = type;
        this.key = this.block + "/" + this._type;
    }
}

export default CarrierDirItem;