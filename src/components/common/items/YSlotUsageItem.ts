import BaseDataItem from "../../../common/items/BaseDataItem";

class YSlotUsageItem extends BaseDataItem {
    private _bay = 0;
    private _row = 0;
    private _tier = 0;
    private _niu_Rsn = "";

    block = "";
    cpo = 0;
    dgChk = "";
    rfChk = "";
    akChk = "";
    cntr_Height86 = "";
    cntr_Height96 = "";
    plug_dir = "";
    
    isSpecialSlot(): boolean {
        return (this.dgChk.length > 0 || this.rfChk.length > 0 || this.akChk.length > 0);
    }

    isNecessaryRecord(): boolean {
        if (this.cpo === 0 && this._niu_Rsn.length > 0) return true;
        if (this.akChk.length > 0 || this.dgChk.length > 0 || this.rfChk.length > 0) return true;
        if (this.cntr_Height86.length > 0 || this.cntr_Height96.length > 0) return true;
        if (this.plug_dir.length > 0) return true;

        return false;
    }

    getBay(): number {
        return this._bay;
    }

    setBay(bay: number): void {
        this._bay = bay;
        this.key = this._bay.toString().padStart(3, '0') + this._row.toString().padStart(3, '0') + this._tier.toString().padStart(3, '0');
    }

    getRow(): number {
        return this._row;
    }

    setRow(row: number): void {
        this._row = row;
        this.key = this._bay.toString().padStart(3, '0') + this._row.toString().padStart(3, '0') + this._tier.toString().padStart(3, '0');
    }

    getTier(): number {
        return this._tier;
    }

    setTier(tier: number): void {
        this._tier = tier;
        this.key = this._bay.toString().padStart(3, '0') + this._row.toString().padStart(3, '0') + this._tier.toString().padStart(3, '0');
    }

    getNiu_Rsn(): string {
        return this._niu_Rsn;
    }

    setNiu_Rsn(niu_Rsn: string): void {
        if (this._niu_Rsn !== niu_Rsn) {
            this._niu_Rsn = niu_Rsn;

            if (this._niu_Rsn.length === 0) {
                this.cpo = 1;
            } else {
                this.cpo = 0;
            }
        }
    }
}

export default YSlotUsageItem;