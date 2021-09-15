import IBaseGeometry from "../../drawing/elements/IBaseGeometry";
import { CEHeightTypes } from "./structures";
import CETandemFlags from "./structures/CETandemFlags";

interface IGeomContainer extends IBaseGeometry {
    isTandemClose: boolean;
    getBlock(): string;
    getBay(): number;
    getRow(): number;
    getTier(): number;
    getHeightType(): CEHeightTypes;
    getTandemDir(): CETandemFlags;
}

export default IGeomContainer;