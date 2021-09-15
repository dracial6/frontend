import BaseTextItem from "../../../drawing/items/BaseTextItem";
import TextBoxItem from "../../../drawing/items/TextBoxItem";
import { Color } from "../../../drawing/structures";
import ChassisDisplayPosition from "../structures/ChassisDisplayPosition";

class ChassisDisplayItem {
    name: BaseTextItem;
    sizeType = "";
    type = "";
    state = "";
    block = "";
    bay = 0;
    row = 0;
    tier = 0;
    borderColor = Color.Transparent();
    backColor = Color.Transparent();
    displayPosition = ChassisDisplayPosition.Bottom;
    guideName = new TextBoxItem();
    
    constructor(name: string) {
        this.name = new BaseTextItem();
        this.name.fontSize = 9.5;
        this.name.text = name;
        this.borderColor = Color.Black();
        this.backColor = Color.Transparent();
    }
}

export default ChassisDisplayItem;