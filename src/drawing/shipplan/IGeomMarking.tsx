import { Color } from "../structures";
import { MarkingTypes } from "./structures";

interface IGeomMarking {
    markingSizeRatio: number;
    getMarked(): boolean;
    setMarking(visible: boolean): void;
    setMarkingByType(visible: boolean, markingType: MarkingTypes): void;
    setMarkingColor(visible: boolean, backColor: Color, borderColor: Color): void;
    setMarkingBorderByType(visible: boolean, backColor: Color, borderColor: Color, markingType: MarkingTypes): void;
    setMarkingBorderThickByType(visible: boolean, backColor: Color, borderColor: Color, markingType: MarkingTypes, lineThick: number): void;
}

export default IGeomMarking;