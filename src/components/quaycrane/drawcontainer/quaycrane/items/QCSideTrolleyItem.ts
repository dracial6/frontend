import TrolleyJobTypes from "../structures/TrolleyJobTypes";
import QCSideCabinItem from "./QCSideCabinItem";
import QCSideSpreaderItem from "./QCSideSpreaderItem";

class QCSideTrolleyItem {
    jobType = TrolleyJobTypes.Main;
    spreader: QCSideSpreaderItem[] = [];
    trolleyPosition = 0;
    cabin = new QCSideCabinItem();
}

export default QCSideTrolleyItem;