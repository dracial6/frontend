import BaseItemList from "../../../common/items/BaseItemList";
import TerminalCapacityItem from "./TerminalCapacityItem";

class TerminalItem {    
    tmnlCD = "";
    tmnlName = "";
    port = "";
    length = 0;
    height = 0;
    extX = 0;
    extY = 0;
    emptyChar = "";
    unSegregationChk = "";
    strgVsl = "";
    teu = 0;
    terminalCapacitySourceList = new BaseItemList<TerminalCapacityItem>([], false);
    berthDir = "";
    layoutAxis = "";
    norYSlotHGap = 0;
    norYSlotVGap = 0;
    scYSlotHGap = 0;
    scYSlotVGap = 0;
    qcCoverageByBitt = "";
    useYSlotUsage = "";
}

export default TerminalItem;