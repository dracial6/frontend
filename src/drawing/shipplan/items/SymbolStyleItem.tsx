import { Color, DashStyles } from "../../structures";
import { HatchStyle } from "../structures";

class SymbolStyleItem {
    borderColor = Color.Transparent();
    backColor = Color.Transparent();
    width = 0.5;
    borderDashStyle = DashStyles.Solid;
    isApplyBackHatchStyle = false;
    backHatchStyle?: HatchStyle;
}

export default SymbolStyleItem;