import { Color } from "../../structures";
import BaseItem from "./BaseItem";

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