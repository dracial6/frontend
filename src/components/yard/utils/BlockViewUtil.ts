import ViewDirection from "../../common/structures/ViewDirection";

class BlockViewUtil {
    static isOutSideContainer(row: number, tier: number) : boolean {
        if (row * tier === 0) return true;
        return false;
    }

    static isOutSideContainerRightSide(row: number, tier: number) : boolean {
        if (row === 1 && tier === 0) return true;
        return false;
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
}

export default BlockViewUtil;