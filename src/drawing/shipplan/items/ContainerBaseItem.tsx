import { Color } from "../../structures";
import BaseItem from "./BaseItem";

class ContainerBaseItem extends BaseItem {
    block = '';
    bay = 0;
    row = 0;
    tier = 0;
    XBay = 0;
    backColor = Color.Transparent();
    borderColor = Color.Black();
    useMultiDataModel = false;
    searchKey = this.block + "_" + this.bay + "_" + this.row + "_" + this.tier;
}

export default ContainerBaseItem;