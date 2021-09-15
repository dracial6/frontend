import GeneralLogger from "../../../logger/GeneralLogger";
import BlockItem from "../../common/items/BlockItem";
import BufferItem from "../../common/items/BufferItem";
import YSlotItem from "../../common/items/YSlotItem";
import YSlotUsageItem from "../../common/items/YSlotUsageItem";
import TierType from "../../common/structures/TierType";
import ViewDirection from "../../common/structures/ViewDirection";
import AlignmentBayRowStyles from "../structures/AlignmentBayRowStyles";
import HorizontalArrange from "../structures/HorizontalArrange";

class YardUtil {
    static isEquipmentPassSlot(tier: number, maxTier: number) {
        return (maxTier < tier) ? true : false;
    }

    static getRMGBlockInfo(viewDir: ViewDirection, blockDefine: BlockItem, row: number, tierType: TierType): BufferItem | undefined {
        const map = blockDefine.getBufferSourceList();

        if (viewDir === ViewDirection.Side) {
            const key = blockDefine.getName() + "1/" + row.toString();

            if (map.has(key)) {
                return map.get(key) as BufferItem;
            }
        }
    }

    static getRowNameDirection(alignmentBayRowName: AlignmentBayRowStyles, viewDir: ViewDirection, blockItem: BlockItem | undefined) : HorizontalArrange {
        let horizontalArrange = HorizontalArrange.LeftToRight;
        if (alignmentBayRowName === AlignmentBayRowStyles.AsDesigned) {
            if (blockItem) {
                if (viewDir === ViewDirection.Side) {
                    horizontalArrange = (blockItem.bayDir === "L") ? HorizontalArrange.LeftToRight : HorizontalArrange.RightToLeft;
                } else {
                    horizontalArrange = (blockItem.rowDir === "L") ? HorizontalArrange.LeftToRight : HorizontalArrange.RightToLeft;
                }
            }
        } else
        
        if (alignmentBayRowName === AlignmentBayRowStyles.LeftToRight) {
            horizontalArrange = HorizontalArrange.LeftToRight;
        } else if (alignmentBayRowName === AlignmentBayRowStyles.RightToLeft) {
            horizontalArrange = HorizontalArrange.RightToLeft;
        }

        return horizontalArrange;
    }

    static getVisibleByBufferSlot(viewDir: ViewDirection, blockItem: BlockItem, bay: number, row: number, tier: number, tierType: TierType) : boolean {
        const bufferList = blockItem.getBufferSourceList();
        if (viewDir === ViewDirection.Front) {
            const key = blockItem.getName() + bay.toString().padStart(3, '0') + row.toString().padStart(3, '0');
            if (bufferList.has(key)) {
                const item = bufferList.get(key) as BufferItem;
                let tempTier = item.passTier;

                if (tierType === TierType.MaxTier) {
                    tempTier = item.mxTier;
                }
                
                if (tier > tempTier) {
                    return false;
                }                
            }
        }

        return true;
    }

    static getRMGSlotGapTotal(viewDir: ViewDirection, rowDir: string, blockItem: BlockItem, bufferSlotGap: number) : number {
        if (!blockItem) return 0;       
        const bufferList = blockItem.getBufferSourceList();
        if (!bufferList) return 0;
        let gap1 = 0;
        let gap2 = 0;

        if (bufferList.has(blockItem.getName() + "001" + "001")) {
            gap1 = bufferSlotGap;
        }

        if (bufferList.has(blockItem.getName() + "001" + blockItem.maxRow.toString())) {
            gap2 = bufferSlotGap;
        }

        return gap1 + gap2;
    }

    static getRMGSlotGapsBlock(blockItem: BlockItem, bufferSlotGap: number) : number[] {
        let bayRowDirection = HorizontalArrange.LeftToRight;
        if (blockItem.rowDir === "R") {
            bayRowDirection = HorizontalArrange.RightToLeft;
        }
        return YardUtil.getRMGSlotGaps(ViewDirection.Front, bayRowDirection, blockItem, bufferSlotGap);
    }

    static getDefaultSlotGap(slotGap: number, slotSize: number) : number {
        return slotGap + slotSize / 4;
    }

    static getRMGSlotGaps(viewDir: ViewDirection, bayRowDirection: HorizontalArrange, blockItem: BlockItem, bufferSlotGap: number) : number[] {
        let gaps: number[] = [];
        const bufferList = blockItem.getBufferSourceList();
        if (bufferList.size === 0) return [];

        try {
            let gap1 = 0;
            let gap2 = 0;

            if (bufferList.has(blockItem.getName() + "001" + "001")) {
                gap1 = bufferSlotGap;
            }

            if (bufferList.has(blockItem.getName() + "001" + blockItem.maxRow.toString())) {
                gap2 = bufferSlotGap;
            }

            if (bayRowDirection === HorizontalArrange.LeftToRight) {
                for (let i = 1; i <= blockItem.maxRow; i++) {
                    let gap = 0;
                    if (i > 1 && i !== blockItem.maxRow) {
                        gap = gap1;
                    } else if (i === blockItem.maxRow) {
                        gap = gap1 + gap2;
                    }
                    gaps.push(gap);
                }
            } else {
                for (let i = blockItem.maxRow; i >= 1; i--) {
                    let gap = 0;
                    if (i > 1 && i !== blockItem.maxRow) {
                        gap = gap2;
                    } else
                     if (i === blockItem.maxRow) {
                        gap = gap1 + gap2;
                    }
                    gaps.push(gap);
                }
            }
        } catch (e) {
            GeneralLogger.error(e);
        }

        return gaps;
    }

    static getBayRowIndex(viewPoint: ViewDirection, pBayIndex: number, pRowIndex: number) : number {
        if (viewPoint === ViewDirection.Front) {
            return pBayIndex;
        }

        return pRowIndex;
    }

    static getBayRowIndexAtYAxis(viewPoint: ViewDirection, pBayIndex: number, pRowIndex: number) : number {
        if (viewPoint === ViewDirection.Front) {
            return pRowIndex;
        }
        
        return pBayIndex;
    }

    static getSlotCargoTypeBlockItem(blockDefine: BlockItem, bayIndex: number, rowIndex: number, delimiter: string) : string {
        const ySlotItem = this.getSlotItem(blockDefine, bayIndex, rowIndex);
        return (ySlotItem) ? this.getSlotCargoTypeYSlotItem(ySlotItem, delimiter) : "";
    }

    static getSlotCargoTypeYSlotItem(ySlotItem: YSlotItem, delimiter: string) : string {
        let typeInfo = "";
        
        try {
            const dgCheck = ySlotItem.dgChk;
            const rfCheck = ySlotItem.rfChk;
            const akCheck = ySlotItem.akChk;
            let tempTypeInfo = "";
            
            if (dgCheck === "N" && rfCheck === "N" && akCheck === "N") {
                return typeInfo;
            }

            if (akCheck === "Y") {
                tempTypeInfo = tempTypeInfo + "A";
            }

            if (dgCheck === "Y") {
                tempTypeInfo = tempTypeInfo + "D";
            }

            if (rfCheck === "Y") {
                tempTypeInfo = tempTypeInfo + "R";
            }

            if (tempTypeInfo.length > 0) {
                for (let str of tempTypeInfo) {
                    typeInfo = typeInfo + str + delimiter;
                }
                typeInfo = typeInfo.trim();
            }
        } catch (e) {
            GeneralLogger.error(e);
        }

        return typeInfo;
    }

    static getSlotItem(blockDefine: BlockItem, bayIndex: number, rowIndex: number) : YSlotItem | undefined{
        let item: YSlotItem | undefined = undefined;

        if (!blockDefine) {
            return item;
        }

        const map = blockDefine.getYSlotList();
        if (map.size === 0) {
            return item;
        }

        const key = bayIndex.toString().padStart(3, '0') + rowIndex.toString().padStart(3, '0');
        if (map.has(key)) {
            item = map.get(key);
        }
        
        return item;
    }

    static getSlotCargoTypeYSlotUsageItem(ySlotUsageItem: YSlotUsageItem, delimiter: string) : string {
        let typeInfo = "";
        try {
            const dgCheck = ySlotUsageItem.dgChk;
            const rfCheck = ySlotUsageItem.rfChk;
            const akCheck = ySlotUsageItem.akChk;
            let tempTypeInfo = "";

            if (dgCheck === "N" && rfCheck === "N" && akCheck === "N") {
                return typeInfo;
            }

            if (akCheck === "Y") {
                tempTypeInfo = tempTypeInfo + "A";
            }

            if (dgCheck === "Y") {
                tempTypeInfo = tempTypeInfo + "D";
            }

            if (rfCheck === "Y") {
                tempTypeInfo = tempTypeInfo + "R";
            }

            if (tempTypeInfo.length > 0) {
                for (let str of tempTypeInfo) {
                    typeInfo = typeInfo + str + delimiter;
                }

                typeInfo = typeInfo.trim();
            }
        } catch (e) {
            GeneralLogger.error(e);
        }
        return typeInfo;
    }
}

export default YardUtil;