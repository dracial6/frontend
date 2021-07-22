import { Color, Padding } from "../structures";
import ContentAlignment from "../structures/ContentAlignment";
import VesselDefine from "./items/VesselDefine";
import { AlongSide, BayViewMode, CubeType, ShipViewMode } from "./structures";

class TBayProperty {
    viewMode: ShipViewMode = ShipViewMode.IC_SEQ;
    thruPOD = 0;
    isBulkHeads = false;
    ischkPRFSEQ = false;
    isLenView = true;
    isPodPreFixView = false;
    isQcView = false;
    alongSide = AlongSide.Port;
    vesselDefine = new VesselDefine();
    cubeType = CubeType.None;
    // LashingProperty;
    // ReportBayProperty;

    bayPadding = new Padding(7, 2, 2, 2);
    hatchCoverMargin = 2;
    tierNoExtraWidth = 10;
    virtualSlotColor = Color.LightGray();
    visibleReeferSlotMark = true;
    visibleBerthingSide = false;
    bayTitleAlignment = ContentAlignment.BottomCenter;
    visibleSlimCellGuide = false;
    slimCellGuideBoardColor = Color.Red();
    newLineStackWeight = false;
    isFixRowNo = false;
    isFixBayNo = false;
    bayViewMode = BayViewMode.ALL;
    visibleContainerIcon = false;
    isDisplayPiledHatch = false;
    slotLineThick = 0.3;
    visibleShipCrane = true;
    switchRowNoWeight = false;
    berthingSideFillColor = Color.Transparent();
    berthingSideLineColor = Color.Black();    
}

export default TBayProperty;