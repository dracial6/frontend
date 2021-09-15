import { Color } from "../../../drawing/structures";
import BaseItem from "./BaseItem";

class ContainerBaseItem extends BaseItem {
    block = '';
    bay = 0;
    row = 0;
    tier = 0;
    xBay = 0;
    backColor = Color.Transparent();
    borderColor = Color.Black();
    useMultiDataModel = false;
    searchKey = this.block + "_" + this.bay + "_" + this.row + "_" + this.tier;
}

export default ContainerBaseItem;