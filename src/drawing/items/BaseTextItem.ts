import { Color } from "../structures";
import BaseTextStyleItem from "./BaseTextStyleItem";

class BaseTextItem extends BaseTextStyleItem {
    text = '';
    fontSize = 7;
    autoFontSize = true;
    fontName = "tahoma";

    constructor() {
        super(false, false, Color.Black());
    }
}

export default BaseTextItem;