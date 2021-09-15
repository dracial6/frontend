import BaseTextStyleItem from "../../../drawing/items/BaseTextStyleItem";
import { Color, GeometryAttribute } from "../../../drawing/structures";
import FontUtil from "../../../utils/FontUtil";
import YardDisplayItem from "../../common/items/YardDisplayItem";
import BlockDisplayType from "../structures/BlockDisplayType";

class ViewDisplayUtil {
    static SetStyle(blockDisplayType: BlockDisplayType, attribute: GeometryAttribute, blockDisplay: YardDisplayItem) : void {
        if (!blockDisplay) return;
        switch (blockDisplayType) {
            case BlockDisplayType.BlockNo:
                ViewDisplayUtil.SetTextStyle(attribute, blockDisplay.blockNo as BaseTextStyleItem); break;
            case BlockDisplayType.BayNo:
                ViewDisplayUtil.SetTextStyle(attribute, blockDisplay.bayNo as BaseTextStyleItem); break;
            case BlockDisplayType.RowNo:
                ViewDisplayUtil.SetTextStyle(attribute, blockDisplay.rowNo as BaseTextStyleItem); break;
            case BlockDisplayType.Tier:
                ViewDisplayUtil.SetTextStyle(attribute, blockDisplay.tier as BaseTextStyleItem); break;
            case BlockDisplayType.RTPass:
                ViewDisplayUtil.SetColor(attribute, blockDisplay.rtPassingDirColor); break;
            case BlockDisplayType.YTPass:
                ViewDisplayUtil.SetColor(attribute, blockDisplay.ytPassingDirColor); break;
        }
    }
    
    private static SetTextStyle(attribute: GeometryAttribute, txtStyle: BaseTextStyleItem) : void {
        if (!txtStyle) return;
        attribute.fontStyle = FontUtil.makeFontStyle(txtStyle.bold, txtStyle.italic);
        attribute.lineColor = txtStyle.textColor;
    }

    private static SetColor(attribute: GeometryAttribute, color: Color) : void {
        if (color.toRGBA() === Color.Transparent().toRGBA()) return;
        attribute.lineColor = color;
        attribute.fillColor = color;
    }

}

export default ViewDisplayUtil;