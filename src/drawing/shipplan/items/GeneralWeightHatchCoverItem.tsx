import { Color } from "../../structures";
import BaseItem from "./BaseItem";

class GeneralWeightHatchCoverItem extends BaseItem {
    weightValue = 0;
    boundMode = 0;
    bayIndex = 0;
    rowIndex = 0;
    tierIndex = 0;
    weightColor = Color.Black();
    isWeightColorCustom = false;
}

export default GeneralWeightHatchCoverItem;