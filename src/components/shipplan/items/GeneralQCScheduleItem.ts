import { Color } from "../../../drawing/structures";
import BaseItem from "../../common/items/BaseItem";

class GeneralQCScheduleItem extends BaseItem {
    hatchBayIndex = 0;
    boundMode = 0;
    dhMode = 0;
    qcSEQ = 0;
    qc = '';
    backColor = Color.Transparent();
    foreColor = Color.Black();
}

export default GeneralQCScheduleItem;