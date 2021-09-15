import ViewDirection from "../structures/ViewDirection";
import BaseItem from "./BaseItem";

class YardBayRowNoSelectItem extends BaseItem {
    block = "";
    bay = 0;
    row = 0;
    viewType = ViewDirection.Front;
}

export default YardBayRowNoSelectItem;