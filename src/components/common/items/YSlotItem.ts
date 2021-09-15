import BaseDataItem from "../../../common/items/BaseDataItem";

class YSlotItem extends BaseDataItem {
    private _bay = 0;
    private _row = 0;
    
    akChk = "";
    block = "";
    cpo = 0;
    atMxTier = 0;
    dgChk = "";
    rfChk = "";
    niu_Rsn = "";
    ex20_Chk = "";
    ex30_Chk = "";
    ex40_Chk = "";
    ex45_Chk = "";
    allowTwin = "";
    x = 0;
    y = 0;
    endX = 0;
    endY = 0;
    maxWeight20 = 0;
    maxWeight40 = 0;
    maxWeight45 = 0;
    wgt_Grp_E = "";
    wgt_Grp_L = "";
    wgt_Grp_M = "";
    wgt_Grp_H = "";
    wgt_Grp_X = "";
    maxHeight = 0;
    washRepairChk = "";

    getBay(): number {
        return this._bay;
    }

    setBay(bay: number): void {
        this._bay = bay;
        this.key = this._bay.toString().padStart(3, '0') + this._row.toString().padStart(3, '0');
    }

    getRow(): number {
        return this._row;
    }

    setRow(row: number): void {
        this._row = row;
        this.key = this._bay.toString().padStart(3, '0') + this._row.toString().padStart(3, '0');
    }
}

export default YSlotItem;