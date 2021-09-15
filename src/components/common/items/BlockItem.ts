import BaseDataItem from "../../../common/items/BaseDataItem";
import { Color } from "../../../drawing/structures";
import BayItem from "./BayItem";
import RowItem from "./RowItem";
import YSlotItem from "./YSlotItem";
import BlockUseItem from "./BlockUseItem";
import BlockTierPriItem from "./BlockTierPriItem";
import CarrierDirItem from "./CarrierDirItem";
import BufferItem from "./BufferItem";
import YSlotUsageItem from "./YSlotUsageItem";

class BlockItem extends BaseDataItem {
    readonly BAYROW_TYPE_BAY = "B";
    readonly BAYROW_TYPE_ROW = "R";

    private _name = "";
    private _sortedBayList = new Map<number, BayItem>();
    private _sortedRowList = new Map<number, RowItem>();
    private _sortedYSlotList = new Map<string, YSlotItem>();
    private _sortedYSlotUsageList = new Map<string, YSlotUsageItem>();
    private _sortedBlockUseSourceList = new Map<number, BlockUseItem>();
    private _sortedBlockTierPriSourceList = new Map<number, BlockTierPriItem>();
    private _sortedCarrierTypeSourceList = new Map<string, CarrierDirItem>();
    private _sortedBufferSourceList = new Map<string, BufferItem>();

    index = 0;
    maxBay = 0;
    maxRow = 0;
    maxTier = 0;
    passTier = 0;
    facility = "";
    ytPos = "";
    ytEnter = "";
    yt_acc_dir = "";
    rt_acc_dir = "";
    rtPos = "";
    rtEnter = "";
    bayDir = "";
    rowDir = "";
    wdChk = "";
    icChck = "";
    cDir = "";
    autoCheck = "";
    laneID = "";
    laneSeq = 0;
    x = 0;
    y = 0;
    w = 0;
    l = 0;
    deg = 0;
    rfPlug = 0;
    symmetry = "";
    capacity = 0;
    tgs = 0;
    sqm = 0;
    yardID = "";
    foreColor = Color.Black();
    backColor = Color.White();
    sideLift = "";
    remark = "";
    carrierType = "";
    bayPatten = "";
    rowPatten = "";
    horizontalGap = 0; // bay gap
    verticalGap = 0; // row gap
    yardLocks: boolean[][] = [];
    slotLength = 0;
    slotWidth = 0;
    maxWeight20 = 0;
    maxWeight40 = 0;
    maxWeight45 = 0;
    maxWeightTier = 0;
    masterBlock = 0;
    joinPos = 0;
    laneIdx = 0;

    getName(): string {
        return this._name;
    }

    setName(name: string): void {
        this._name = name;
        this.key = name;
    }

    getBayList(): Map<number, BayItem> {
        return new Map(Array.from(this._sortedBayList.entries()).sort());
    }

    setBayList(map: Map<number, BayItem>): void {
        this._sortedBayList = map;
    }

    getRowList(): Map<number, RowItem> {
        return new Map(Array.from(this._sortedRowList.entries()).sort());
    }

    setRowList(map: Map<number, RowItem>): void {
        this._sortedRowList = map;
    }

    getYSlotList(): Map<string, YSlotItem> {
        return new Map(Array.from(this._sortedYSlotList.entries()).sort());
    }

    setYSlotList(map: Map<string, YSlotItem>): void {
        this._sortedYSlotList = map;
    }

    getYSlotUsageList(): Map<string, YSlotUsageItem> {
        return new Map(Array.from(this._sortedYSlotUsageList.entries()).sort());
    }

    setYSlotUsageList(map: Map<string, YSlotUsageItem>): void {
        this._sortedYSlotUsageList = map;
    }

    getBlockUseSourceList(): Map<number, BlockUseItem> {
        return new Map(Array.from(this._sortedBlockUseSourceList.entries()).sort());
    }

    setBlockUseSourceList(map: Map<number, BlockUseItem>): void {
        this._sortedBlockUseSourceList = map;
    }

    getBlockTierPriSourceList(): Map<number, BlockTierPriItem> {
        return new Map(Array.from(this._sortedBlockTierPriSourceList.entries()).sort());
    }

    setBlockTierPriSourceList(map: Map<number, BlockTierPriItem>): void {
        this._sortedBlockTierPriSourceList = map;
    }

    getCarrierTypeSourceList(): Map<string, CarrierDirItem> {
        return new Map(Array.from(this._sortedCarrierTypeSourceList.entries()).sort());
    }

    setCarrierTypeSourceList(map: Map<string, CarrierDirItem>): void {
        this._sortedCarrierTypeSourceList = map;
    }

    getBufferSourceList(): Map<string, BufferItem> {
        return new Map(Array.from(this._sortedBufferSourceList.entries()).sort());
    }

    setBufferSourceList(map: Map<string, BufferItem>): void {
        this._sortedBufferSourceList = map;
    }

    getYSlotUsage(bayIndex: number, rowIndex: number, tierIndex: number): YSlotUsageItem | undefined {
        return this._sortedYSlotUsageList.get(bayIndex.toString().padStart(3, '0') + rowIndex.toString().padStart(3, '0') + tierIndex.toString().padStart(3, '0'));
    }

    getYSlot(bayIndex: number, rowIndex: number): YSlotItem | undefined {
        return this._sortedYSlotList.get(bayIndex.toString().padStart(3, '0') + rowIndex.toString().padStart(3, '0'));
    }

    getBay(bayIndex: number): BayItem | undefined {
        return this._sortedBayList.get(bayIndex);
    }

    getRow(rowIndex: number): RowItem | undefined {
        return this._sortedRowList.get(rowIndex);
    }

    countBay(): number {
        return this._sortedBayList.size;
    }

    countRow(): number {
        return this._sortedRowList.size;
    }

    getBayNos(): string[] {
        const bayNos: string[] = [];
        this._sortedBayList.forEach(bay => {
            bayNos.push(bay.name2);
        });

        return bayNos;
    }

    getBay4Nos(): string[] {
        const bayNos: string[] = [];
        this._sortedBayList.forEach(bay => {
            bayNos.push(bay.name4);
        });

        return bayNos;
    }

    getRowNos(): string[] {
        const rowNos: string[] = [];
        this._sortedRowList.forEach(row => {
            rowNos.push(row.name);
        });

        return rowNos;
    }

    reInitialize(): void {
        this._sortedBlockUseSourceList.clear();
        this._sortedBayList.clear();
        this._sortedRowList.clear();
        this._sortedYSlotList.clear();
        this._sortedYSlotUsageList.clear();
        this._sortedBufferSourceList.clear();
    }

    getBayNo(bayIndex: number, occ: number): string {
        let bayNo = "";

        if (bayIndex > 0 && bayIndex <= this.maxBay) {
            const bayItem = this.getBay(bayIndex);
            
            if (!bayItem) return bayNo;
            
            if (occ > 1) {
                bayNo = bayItem.name4;
                if (bayNo.length === 0) bayNo = bayItem.name2;
            } else {
                bayNo = bayItem.name2;
            }
        }

        return bayNo;
    }

    getBayIndex(bayNo: string): number {        
        let bayIndex = 0;
        
        for (let i = 1; i <= this.maxBay; i++) {
            const bayItem = this.getBay(i);

            if (bayItem && (bayItem.name2 === bayNo || bayItem.name4 === bayNo)) {
                bayIndex = i;
                break;
            }
        }

        return bayIndex;
    }

    getRowNo(rowIndex: number): string {
        let rowNo = "";

        if (rowIndex > 0 && rowIndex <= this.maxRow) {
            const rowItem = this.getRow(rowIndex);
            if (rowItem) rowNo = rowItem.name;
        }

        return rowNo;
    }

    getRowIndex(rowNo: string): number {        
        let rowIndex = 0;
        
        for (let i = 1; i <= this.maxRow; i++) {
            const rowItem = this.getRow(i);

            if (rowItem && rowItem.name === rowNo) {
                rowIndex = i;
                break;
            }
        }

        return rowIndex;
    }

    getBayRowType(): string {
        if (this.facility === "S") {
            return this.BAYROW_TYPE_ROW;
        }

        return this.BAYROW_TYPE_BAY;
    }

    getMaxRow(bayRowType: string): number {
        if (bayRowType === this.BAYROW_TYPE_BAY) {
            return this.maxRow;
        }

        return this.maxBay;
    }

    getMaxBay(bayRowType: string): number {
        if (bayRowType === this.BAYROW_TYPE_BAY) {
            return this.maxBay;
        }

        return this.maxRow;
    }

    isUnusableYSlot(bay: number, row: number): boolean {
        if (this._sortedYSlotList.size > 0) {
            const yslotItem = this.getYSlot(bay, row);
            if (!yslotItem || yslotItem.cpo === 0) {
                return true;
            }
        }

        return false;
    }
}

export default BlockItem;