import { Color, FontStyles, Size } from "../../../drawing/structures";

class TSelectionMarkProperty {
    size = Size.empty();
    foreColor = Color.Transparent();
    backColor = Color.Transparent();
    borderColor = Color.Transparent();
    zoomRate = 1;
    fontSize = 8;
    fontName = "tahoma";
    fontStyle = FontStyles.bold;
    visibleBorder = false;
}

export default TSelectionMarkProperty;