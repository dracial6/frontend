import GeometryRectangle from "../../../drawing/elements/GeometryRectangle";
import IGeometryToolTip from "../../../drawing/elements/IGeometryToolTip";
import ViewDirection from "../../common/structures/ViewDirection";

class TBayRowBar extends GeometryRectangle implements IGeometryToolTip {    
    TBayRowNo = "";
    
    tooltipText = "";
    tooltipGroup = "";

    block = "";
    bay = 0;
    row = 0;
    viewType = ViewDirection.Front;
}

export default TBayRowBar;