import { Color, DashStyles, Point } from "../structures";
import BaseTextItem from "./BaseTextItem";

class TextBoxItem extends BaseTextItem {
    backColor = Color.Transparent();
    borderColor = Color.Black();
    borderDashStyle = DashStyles.Solid;
    additionalLocation = Point.Empty();
}

export default TextBoxItem;