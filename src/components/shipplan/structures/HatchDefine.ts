import { Color, FontStyles } from "../../../drawing/structures";
import ZoomRatioInfo from "./ZoomRatioInfo";

class HatchDefine {
    zoomRatioInfos: ZoomRatioInfo[] = [];
    static IsCellWithWeight = false;
    static VisibleHatchCoverClearance = false;

    static readonly ROW_GAP = 2;
    static readonly COLUMN_GAP = 2;
    static readonly QCSEQ_CELLW = 22;
    static readonly QCSEQ_CELLH = 16;
    static readonly PRFSEQ_WIDTH = 48;
    static readonly BOOKMARK_IMAGE_SIZE = 16;

    static readonly CONTAINER_SIZE_20 = 20;
    static readonly CONTAINER_SIZE_40 = 40;

    static readonly CASP_SMALL_FONT = "serif";
    static readonly CASP_LARGE_FONT = "Georgia, serif";
    static readonly JRC_LARGE_FONT = "tahoma";
    static readonly ROW_TIER_FONT = "arial";

    static BORDER_DARK: Color = Color.Gray();
    static BORDER_COLOR: Color = Color.Silver();
    static LIGHT_GRAY: Color = new Color(255, 228, 226, 228);
    static plSys_BackColor: Color = Color.White();

    static readonly PREFIX_HATCH_KEY = "Hatch";
    static readonly PREFIX_GENERAYBAY_KEY = "GeneralBay";
    static readonly PREFIX_REPORTBAY_KEY = "TBay_";
    static readonly PREFIX_BAY_SCHEDULE_KEY = "BaySchedule";

    static readonly PREFIX_BULK_TITLE_KEY = "BulkTitle";
    static readonly PREFIX_BAY_TITLE_KEY = "HBayno";

    static readonly PREFIX_BAY_CONTAINER_QTY_KEY       = "BayCntrQty";
    static readonly PREFIX_BAY_CONTAINER_TOTAL_QTY_KEY = "BayCntrTotalQty";
    static readonly PREFIX_BAY_FULL_CONTAINER_QTY_KEY  = "BayFullCntrQty";
    static readonly PREFIX_BAY_EMPTY_CONTAINER_QTY_KEY = "BayEmptyCntrQty";

    static readonly PREFIX_DRAW_NO_KEY = "RNoD";
    static readonly PREFIX_HROW_NO_KEY = "RNoH";
    static readonly PREFIX_TIER_NO_KEY = "TNo";

    static readonly PREFIX_DSW_NO_KEY = "Dswno";
    static readonly PREFIX_HSW_NO_KEY = "Hswno";

    static readonly PREFIX_CONTAINER_TITLE_KEY = "Cntr";
    static readonly PREFIX_SLOT_KEY = "Slot";
    static readonly PREFIX_HATCH_COVER_KEY = "HatchCover";
    static readonly PREFIX_HATCH_WEIGHT_KEY = "HatchWeight";
    static readonly PREFIX_HATCH_COVER_LOW = "Low";

    static readonly PREFIX_HATCH_COVER_CLEAR_KEY = "HCClear";

    static readonly PREFIX_BOOKMARK_BTN_KEY = "BookMarkButton";
    static readonly PREFIX_DECKHOUSE_KEY = "DeckHouse";
    static readonly PREFIX_FUNNEL_KEY = "Funnel";

    static readonly PREFIX_LASHING_CHECKBOX_KEY = "LashingCheckBox";

    static readonly PREFIX_REPORT_TITLE_KEY = "BayTitle";
    static readonly PREFIX_REPORT_BUNDLE_CNTR_KEY = "BaseBundleCNTRTable";

    static readonly PREFIX_BAY = "BAY ";
    static readonly PREFIX_GENERAYBAY_NO = '/';

    constructor() {
        this.initializeBaseZoomRatioInfos();
    }

    initializeBaseZoomRatioInfos(): void {
        this.zoomRatioInfos[5] = new ZoomRatioInfo();
        this.zoomRatioInfos[5].zoomRatio = 5;
        this.zoomRatioInfos[5].slotWidth = 58;
        this.zoomRatioInfos[5].slotHeight = 58;
        this.zoomRatioInfos[5].hatchThick = 13;
        this.zoomRatioInfos[5].titleFontSize = 11.25;
        this.zoomRatioInfos[5].titleFontStyle = FontStyles.bold;
        this.zoomRatioInfos[5].fontName = "tahoma";

        this.zoomRatioInfos[5].rowFontSize = 8;
        this.zoomRatioInfos[5].rowFontStyle = FontStyles.normal;
        this.zoomRatioInfos[5].rowFontName = HatchDefine.ROW_TIER_FONT;

        this.zoomRatioInfos[5].tierFontSize = 8;
        this.zoomRatioInfos[5].tierFontStyle = FontStyles.normal;
        this.zoomRatioInfos[5].tierFontName = HatchDefine.ROW_TIER_FONT;

        this.zoomRatioInfos[4] = new ZoomRatioInfo();
        this.zoomRatioInfos[4].zoomRatio = 4;
        this.zoomRatioInfos[4].slotWidth = 30;
        this.zoomRatioInfos[4].slotHeight = 30;
        this.zoomRatioInfos[4].hatchThick = 11;
        this.zoomRatioInfos[4].titleFontSize = 11.25;
        this.zoomRatioInfos[4].titleFontStyle = FontStyles.bold;
        this.zoomRatioInfos[4].fontName = "tahoma";

        this.zoomRatioInfos[4].rowFontSize = 8;
        this.zoomRatioInfos[4].rowFontStyle = FontStyles.normal;
        this.zoomRatioInfos[4].rowFontName = HatchDefine.ROW_TIER_FONT;

        this.zoomRatioInfos[4].tierFontSize = 8;
        this.zoomRatioInfos[4].tierFontStyle = FontStyles.normal;
        this.zoomRatioInfos[4].tierFontName = HatchDefine.ROW_TIER_FONT;

        this.zoomRatioInfos[3] = new ZoomRatioInfo();
        this.zoomRatioInfos[3].zoomRatio = 3;
        this.zoomRatioInfos[3].slotWidth = 26;
        this.zoomRatioInfos[3].slotHeight = 26;
        //this.zoomRatioInfos[3].hatchThick = 9;
        this.zoomRatioInfos[3].hatchThick = 10;
        this.zoomRatioInfos[3].titleFontSize = 11.25;
        this.zoomRatioInfos[3].titleFontStyle = FontStyles.bold;
        this.zoomRatioInfos[3].fontName = "tahoma";

        this.zoomRatioInfos[3].rowFontSize = 8;
        this.zoomRatioInfos[3].rowFontStyle = FontStyles.normal;
        this.zoomRatioInfos[3].rowFontName = HatchDefine.ROW_TIER_FONT;

        this.zoomRatioInfos[3].tierFontSize = 8;
        this.zoomRatioInfos[3].tierFontStyle = FontStyles.normal;
        this.zoomRatioInfos[3].tierFontName = HatchDefine.ROW_TIER_FONT;

        this.zoomRatioInfos[2] = new ZoomRatioInfo();
        this.zoomRatioInfos[2].zoomRatio = 2;
        this.zoomRatioInfos[2].slotWidth = 16;
        this.zoomRatioInfos[2].slotHeight = 16;
        this.zoomRatioInfos[2].hatchThick = 4;
        this.zoomRatioInfos[2].titleFontSize = 11.25;
        this.zoomRatioInfos[2].titleFontStyle = FontStyles.bold;
        this.zoomRatioInfos[2].fontName = "tahoma";

        this.zoomRatioInfos[2].rowFontSize = 8;
        this.zoomRatioInfos[2].rowFontStyle = FontStyles.normal;
        this.zoomRatioInfos[2].rowFontName = HatchDefine.ROW_TIER_FONT;

        this.zoomRatioInfos[2].tierFontSize = 8;
        this.zoomRatioInfos[2].tierFontStyle = FontStyles.normal;
        this.zoomRatioInfos[2].tierFontName = HatchDefine.ROW_TIER_FONT;

        this.zoomRatioInfos[1] = new ZoomRatioInfo();
        this.zoomRatioInfos[1].zoomRatio = 1;
        this.zoomRatioInfos[1].slotWidth = 8;
        this.zoomRatioInfos[1].slotHeight = 8;
        this.zoomRatioInfos[1].hatchThick = 0;
        this.zoomRatioInfos[1].titleFontSize = 7;
        this.zoomRatioInfos[1].titleFontStyle = FontStyles.normal;
        this.zoomRatioInfos[1].fontName = "Arial";

        this.zoomRatioInfos[1].rowFontSize = 8;
        this.zoomRatioInfos[1].rowFontStyle = FontStyles.normal;
        this.zoomRatioInfos[1].rowFontName = HatchDefine.ROW_TIER_FONT;

        this.zoomRatioInfos[1].tierFontSize = 8;
        this.zoomRatioInfos[1].tierFontStyle = FontStyles.normal;
        this.zoomRatioInfos[1].tierFontName = HatchDefine.ROW_TIER_FONT;
    }
}

export default HatchDefine;