import GeometryText from "../../../drawing/elements/GeometryText";
import IGeometryToolTip from "../../../drawing/elements/IGeometryToolTip";
import { Color } from "../../../drawing/structures";
import ViewDirection from "../../common/structures/ViewDirection";

class TBayRowNo extends GeometryText implements IGeometryToolTip {    
    TBayRowNo = "";
    
    tooltipText = "";
    tooltipGroup = "";

    block = "";
    bay = 0;
    row = 0;
    viewType = ViewDirection.Front;

    setSelectedMark(boardColor: Color, backgroundColor: Color): void {
        this.attribute.isOutLine = true;
        this.attribute.outLineColor = boardColor;
        this.attribute.fillColor = backgroundColor;
    }

    resetSelectedMark(): void {
        this.attribute.isOutLine = true;
        this.attribute.outLineColor = Color.Transparent();
        this.attribute.fillColor = Color.Transparent();
    }
}

export default TBayRowNo;