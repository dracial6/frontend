import { Color } from "../../../drawing/structures";
import BaseItem from "../../common/items/BaseItem";

class GeneralWeightRowNoItem extends BaseItem {
    weightValue = 0;
    boundMove = 0;
    bayIndex = 0;
    deckHoldMode = 0;
    rowIndex = 0;
    weightColor = Color.Black();
    isWeightColorCustom = false;
}

export default GeneralWeightRowNoItem;