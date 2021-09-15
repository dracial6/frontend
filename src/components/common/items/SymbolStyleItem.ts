import { Color, DashStyles } from "../../../drawing/structures";

class SymbolStyleItem {
    borderColor: Color;
    backColor: Color;
    width: number;
    borderDashStyle = DashStyles.Solid;
    
    constructor(borderColor: Color, backColor: Color, width: number) {
        this.borderColor = borderColor;
        this.backColor = backColor;
        this.width = width;
    }
}

export default SymbolStyleItem;