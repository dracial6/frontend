import BoundaryItem from "../items/BoundaryItem";
import BoundaryMode from "../structures/BoundaryMode";

class BoundaryUtil {
    static getBoundaryKey(b: BoundaryItem): string {
        return BoundaryUtil.getBoundaryKeyDetail(b.block, b.startBay, b.startRow, b.startTier, b.endBay, b.endRow, b.endTier, b.seq, b.boundaryType, b.userDefineKey);
    }

    static getBoundaryKeyDetail(block: string, startBay: number, startRow: number, startTier: number, endBay: number, endRow: number, endTier: number, seq: number, boundaryType: BoundaryMode, userDefineKey: string): string {
        if (userDefineKey.length > 0) {
            return userDefineKey;
        }

        return block
        + "_" + startBay.toString()
        + "_" + startRow.toString()
        + "_" + startTier.toString()
        + "_" + endBay.toString()
        + "_" + endRow.toString()
        + "_" + endTier.toString()
        + "_" + seq.toString()
        + "_" + boundaryType.toString();
    }
}

export default BoundaryUtil;