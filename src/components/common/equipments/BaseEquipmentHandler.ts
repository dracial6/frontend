import EquipmentSideItem from "../items/EquipmentSideItem";

class BaseEquipmentHandler {
    private _equipmentInfo: Map<string, EquipmentSideItem>;

    constructor() {
        this._equipmentInfo = new Map<string, EquipmentSideItem>();
    }

    protected addEquipmentItem(key: string, item: EquipmentSideItem) : void {
        this._equipmentInfo.set(key, item);
    }

    protected removeEquipmentItemByKey(name: string) : void {
        const removeList = Array.from(this._equipmentInfo.values()).filter(ct => ct.getName() === name);
        this.removeEquipmentItemList(removeList);
    }
    
    protected removeEquipmentItemDetail(name: string, blockName: string, fromBay: number, fromRow: number, toBay: number, toRow: number) : void {
        try {
            const removeList = Array.from(this._equipmentInfo.values()).filter(ct => ct.getName() === name && ct.block === blockName
                && ct.fromBay === fromBay && ct.fromRow === fromRow && ct.toBay === toBay && ct.toRow === toRow);
            this.removeEquipmentItemList(removeList);
        } catch (ex) {
            throw ex;
        }
    }

    private removeEquipmentItemList(list: EquipmentSideItem[]) : void {
        if (list.length > 0) {
            for (let item of list) {
                this._equipmentInfo.delete(this.getEquipmentKey(item.getName(), item.block, item.fromBay, item.fromRow, item.toBay, item.toRow));
            }
        }
    }

    getEquipmentItem(name: string, blockName: string, fromBay: number, fromRow: number, toBay: number, toRow: number) : EquipmentSideItem | undefined {
        let item = undefined;
        
        if (this._equipmentInfo.size > 0) {
            const key = this.getEquipmentKey(name, blockName, fromBay, fromRow, toBay, toRow);
            if (this._equipmentInfo.has(key)) {
                item = this._equipmentInfo.get(key);
            }
        }

        return item;
    }

    protected getEquipmentKey(name: string, blockName: string, fromBay: number, fromRow: number, toBay: number, toRow: number) : string {
        return "EQ_" + name + "_" + blockName + "_" + fromBay + "_" + fromRow + "_" + toBay + "_" + toRow;
    }

    protected getEquipmentInfo() : Map<string, EquipmentSideItem> {
        return this._equipmentInfo;
    }
    
    protected getEquipmentInfoByName(name: string) : EquipmentSideItem[] {
        let list:EquipmentSideItem[] = [];

        if (this._equipmentInfo.size > 0) {
            list = Array.from(this._equipmentInfo.values()).filter(ct => ct.getName() === name);
        }

        return list;
    }

    clear(): void {
        if (this._equipmentInfo.size > 0) {
            this._equipmentInfo.clear();
        }
    }
}

export default BaseEquipmentHandler;