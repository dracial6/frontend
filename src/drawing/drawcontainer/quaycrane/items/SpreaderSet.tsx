import DrawEllipse from "../../../elements/DrawEllipse";
import DrawLine from "../../../elements/DrawLine";
import TSpreader from "../TSpreader";
import QCSideSpreaderItem from "./QCSideSpreaderItem";

class SpreaderSet {
    spreaderItem = new QCSideSpreaderItem();
    spreader?: TSpreader;
    spreaderLine?: DrawLine;
    spreaderEllipse: DrawEllipse[] = [];
}

export default SpreaderSet;