import DrawableObject from "../../drawing/elements/DrawableObject";
import DrawLine from "../../drawing/elements/DrawLine";
import DrawRectangle from "../../drawing/elements/DrawRectangle";
import GeometryText from "../../drawing/elements/GeometryText";
import IBaseGeometry from "../../drawing/elements/IBaseGeometry";
import { Color, Size, Point, ContentAlignment, FontStyles, FrozenTypes, Rectangle } from "../../drawing/structures";
import FontUtil from "../../utils/FontUtil";
import GeneralWeightHatchCoverItem from "./items/GeneralWeightHatchCoverItem";
import GeneralWeightRowNoItem from "./items/GeneralWeightRowNoItem";
import { AlongSide, BayViewMode, CubeType, GeneralBayType, HatchDefine, ZoomRatioInfo } from "./structures";
import TBaseGeneral from "./TBaseGeneral";
import TBayProperty from "./TBayProperty";
import TSlot from "./TSlot";
import TValueBoundary from "./TValueBoundary";
import CalculateHighCubeSize from "./utils/CalculateHighCubeSize";
import ShipUtil from "./utils/ShipUtil";

class TGeneralBay extends TBaseGeneral {
    static SP_COLOR = Color.Transparent();
    readonly BoundMode;
    readonly BayIndex;
    readonly IsOverlap;

    private _prevTierFocus = -99;
    private _prevRowFocus = -99;
    private _indicatorWidth;
    private _deckAreaHeight;
    private _equipmentNo = '';
    private _virtualSlotMap = new Map<string, DrawRectangle>();
    private _slotMap = new Map<string, IBaseGeometry>();
    private _containerMap = new Map<string, IBaseGeometry>();
    private _stackWeightMap = new Map<string, GeneralWeightRowNoItem>();
    private _hatchCoverWeightMap = new Map<string, GeneralWeightHatchCoverItem>();
    private _deckRowNoMap = new Map<string, GeometryText>();
    private _holdRowNoMap = new Map<string, GeometryText>();
    private _tierNoMap = new Map<string, GeometryText>();
    private _hatchWeightMap = new Map<string, GeometryText>();
    private _deckStackWeightMap = new Map<string, GeometryText>();
    private _holdStackWeightMap = new Map<string, GeometryText>();
    private _hatchCoverClearMap = new Map<string, DrawLine>();
    private _holdRowNoClear = new DrawRectangle(HatchDefine.PREFIX_HROW_NO_KEY + "Clear");
    private _deckRowNoClear = new DrawRectangle(HatchDefine.PREFIX_DRAW_NO_KEY + "Clear");
    private _hatchCoverClear = new DrawRectangle(HatchDefine.PREFIX_HATCH_COVER_CLEAR_KEY + "Clear");
    private _holdStackWeightNoClear = new DrawRectangle(HatchDefine.PREFIX_DSW_NO_KEY + "Clear");
    private _deckStackWeightNoClear = new DrawRectangle(HatchDefine.PREFIX_HSW_NO_KEY + "Clear");
    private _calculateContainerSize = new CalculateHighCubeSize();
    private _hatchCoverClearHeight: number[] = [];
    private _deckTopMargin = 0;
    private _holdTopMargin = 0;
    private _maxHatchCoverClearHeight = 0;
    private _deckStartRowIndex = -1;
    private _deckEndRowIndex = -1;
    private _indicatorGap = -1;
    private _isDrawByVisibleBoundary = false;
    private _bayNo = '';

    viewContainerSize;
    generalBayType = GeneralBayType.OnlyBay;

    constructor (key: string, boundMode: number, bayIndex: number, zoomRatioInfo: ZoomRatioInfo
        , isOverlap: boolean, viewContainerSize: number, bayProperty: TBayProperty) {
        super(key, bayProperty);
        this.zoomRatioInfo = zoomRatioInfo;
        this.BoundMode = boundMode;
        this.BayIndex = bayIndex;
        this.IsOverlap = isOverlap;
        this._indicatorWidth = this.getSlotLocUtil().getSlotSize().width * 0.8;
        this._deckAreaHeight = this.getSlotLocUtil().getSlotPosY((this.VESSEL_DEFINE.vslParticular.maxDeckTier - (this.VESSEL_DEFINE.vslBays[this.BayIndex].holdTopTierIdx - 1))) + this.getDeckRowNoSize().height;
        this.viewContainerSize = viewContainerSize;
        
        this._holdRowNoClear.isForceDraw = true;
        this._holdRowNoClear.attribute.lineColor = Color.White();
        this._holdRowNoClear.attribute.fillColor = Color.White();
        this.addGeomObject(this._holdRowNoClear);

        this._deckRowNoClear.isForceDraw = true;
        this._deckRowNoClear.attribute.lineColor = Color.White();
        this._deckRowNoClear.attribute.fillColor = Color.White();
        this.addGeomObject(this._deckRowNoClear);

        this._hatchCoverClear.isForceDraw = true;
        this._hatchCoverClear.attribute.lineColor = Color.White();
        this._hatchCoverClear.attribute.fillColor = Color.White();
        if (this.VESSEL_DEFINE.vslBays[this.BayIndex].hatchCoverNo <= 0) {
            this._hatchCoverClear.visible = false;
        }
        this.addGeomObject(this._hatchCoverClear);

        this._holdStackWeightNoClear = new DrawRectangle(HatchDefine.PREFIX_DSW_NO_KEY + "_Clear");
        this._holdStackWeightNoClear.isForceDraw = true;
        this.addGeomObject(this._holdStackWeightNoClear);
        this._holdStackWeightNoClear.attribute.lineColor = Color.White();
        this._holdStackWeightNoClear.attribute.fillColor = Color.White();

        this._deckStackWeightNoClear = new DrawRectangle(HatchDefine.PREFIX_HSW_NO_KEY + "Clear");
        this._deckStackWeightNoClear.isForceDraw = true;
        this.addGeomObject(this._deckStackWeightNoClear);
        this._deckStackWeightNoClear.attribute.lineColor = Color.White();
        this._deckStackWeightNoClear.attribute.fillColor = Color.White();

        this.initialize();
    }

    protected initialize(): void {
        this.padding = this.PROPERTY.bayPadding;
        this.initializeBay();

        this.attribute.isOutLine = true;
        this.attribute.outLineColor = Color.LightGray();
    }

    initializeBay(): void {
        if (this.parentGeometry) {
            (this.parentGeometry as DrawableObject).clearMemoryCache();
        }

        this.clearSlotLocUtil();
        this.calculateHighCubeMargin();

        if (this.PROPERTY.visibleBerthingSide) {
            if (this.PROPERTY.alongSide === AlongSide.Port) {
                this._indicatorGap = this._indicatorWidth;
            } else {
                this._indicatorGap = 0;
            }
        }

        this.drawTitle();
        this.drawDeckRowNo();
        this.drawDeckStackWeight();
        this.drawSlotVesselDefine();
        this.drawHatchCover();
        this.drawHoldStackWeight();
        this.drawHoldRowNo();
        // this.drawTierNo();
        // this.drawBerthingSideIndicator();

        // if (this.PROPERTY.cubeType === CubeType.None) {
        //     this.removeHatchCoverClear();
        // } else {
        //     this.addHatchCoverClear();
        // }

        // this.valicateContainerLocation();
        // this.caculateTitleLocation();
        // this.calculateCranePosInfo();
        // this.redrawRowDisplayInfo();

        this.updateMBR();
    }

    setCellWithWeight(value: boolean): void {
        HatchDefine.IsCellWithWeight = value;

        if (!this.PROPERTY.newLineStackWeight) {
            for (let index = this.VESSEL_DEFINE.vslParticular.portRowWidth;
                index <= this.VESSEL_DEFINE.vslParticular.starRowWidth; index++) {
                this.removeDeckStackWeight(index);
                this.removeHoldStackWeight(index);

                if ((!this._deckStackWeightMap || this._deckStackWeightMap.entries.length === 0)
                && (!this._holdStackWeightMap || this._holdStackWeightMap.entries.length === 0)) {
                    break;
                }
            }

            this.drawDeckRowNo();
            this.drawHoldRowNo();
        } else {
            this.drawDeckStackWeight();
            this.drawHoldStackWeight();
        }
    }

    setVisibleHatchCoverClearance(value: boolean): void {
        HatchDefine.VisibleHatchCoverClearance = value;
        this.drawHatchCover();
    }

    protected drawHatchCover(): void {
        this.drawHatchCoverDeckTier(this.VESSEL_DEFINE.vslParticular.maxDeckTier - this.VESSEL_DEFINE.vslBays[this.BayIndex].holdTopTierIdx - 1);
    }

    protected drawHatchCoverDeckTier(hatchCoverDeckTier: number): void {
        if (this.VESSEL_DEFINE.vslBays[this.BayIndex].hatchCoverNo > 0) {
            let pointX = 0;
            let weightValue = 0;
            const hatchCoverNO = this.VESSEL_DEFINE.vslBays[this.BayIndex].hatchCoverNo;
            const leftMarginOfHold = this.getLeftMarginOfHold();
            const slotSize = new Size(this.getSlotLocUtil().getSlotSize().width, this.zoomRatioInfo.hatchThick);
            const startPos = this.getHatchCoverStartPos();
            startPos.y = (startPos.y + 1) + this.getSlotLocUtil().getSlotPosY(hatchCoverDeckTier) + this.PROPERTY.hatchCoverMargin + this.getDeckTopMargin();

            if (this.PROPERTY.bayViewMode === BayViewMode.Hold) startPos.y -= this._deckAreaHeight;

            for (let hatchCoverIndex = 1; hatchCoverIndex <= hatchCoverNO; hatchCoverIndex++) {
                if (this.PROPERTY.isDisplayPiledHatch) {
                    const upHatchCover = this.doDrawHatchCover(hatchCoverIndex, startPos.y, slotSize, true);
                    const downHatchCover = this.doDrawHatchCover(hatchCoverIndex, startPos.y, slotSize, false);

                    if (upHatchCover && downHatchCover) {
                        if (upHatchCover.getSize().width > downHatchCover.getSize().width) {
                            upHatchCover.setSize(new Size(upHatchCover.getSize().width, upHatchCover.getSize().height / 3));
                        } else if (upHatchCover.getSize().width < downHatchCover.getSize().width) {
                            downHatchCover.setSize(new Size(downHatchCover.getSize().width, downHatchCover.getSize().height / 3));
                            downHatchCover.setLocation(new Point(downHatchCover.getLocation().x, startPos.y + this.zoomRatioInfo.hatchThick - downHatchCover.getSize().height));
                        }
                    }
                } else {
                    this.doDrawHatchCover(hatchCoverIndex, startPos.y, slotSize, true);
                }
            }

            if (HatchDefine.VisibleHatchCoverClearance) {
                let weightHatchCoverItem: GeneralWeightHatchCoverItem | undefined;
                let hatchWeightTxt: GeometryText | undefined;

                for (let rowIndex = this.VESSEL_DEFINE.vslParticular.portRowWidth;
                    rowIndex <= this.VESSEL_DEFINE.vslParticular.starRowWidth; rowIndex++) {

                    if (this.zoomRatioInfo.zoomRatio <= 2) {
                        this.removeHatchWeight(rowIndex);
                        continue;
                    }

                    hatchWeightTxt = this.getHatchWeight(rowIndex);

                    pointX = leftMarginOfHold + this.getSlotLocUtil().getSlotPosX(this.VESSEL_DEFINE.vslBays[this.BayIndex].box[rowIndex]) / 4;

                    weightHatchCoverItem = this.getHatchCoverWeightItem(this.BoundMode, this.BayIndex, rowIndex);
                    weightValue = this.getHatchCoverWeight(this.BoundMode, this.BayIndex, rowIndex);

                    if (weightValue === 0) continue;

                    if (!hatchWeightTxt) {
                        hatchWeightTxt = new GeometryText(HatchDefine.PREFIX_HATCH_WEIGHT_KEY + rowIndex, 0, 0, '');
                        hatchWeightTxt.attribute.textAlign = ContentAlignment.BottomCenter;

                        this.addHatchWeightGeomObject(hatchWeightTxt);
                    }

                    hatchWeightTxt.attribute.fontName = HatchDefine.CASP_SMALL_FONT;
                    hatchWeightTxt.attribute.fontStyle = FontStyles.normal;
                    hatchWeightTxt.attribute.fontSize = 6.75;
                    hatchWeightTxt.text = (weightValue === 0) ? "" : weightValue.toString();
                    
                    if (weightHatchCoverItem) {
                        this.setHatchCoverWeightColor(weightHatchCoverItem, hatchWeightTxt);
                    }

                    hatchWeightTxt.isChanged = true;
                    hatchWeightTxt.setLocation(new Point(pointX + this._indicatorGap, startPos.y));
                    hatchWeightTxt.setSize(slotSize);
                }
            } else {
                for (let rowIndex = this.VESSEL_DEFINE.vslParticular.portRowWidth;
                    rowIndex <= this.VESSEL_DEFINE.vslParticular.starRowWidth; rowIndex++) {
                    this.removeHatchWeight(rowIndex);
                }
            }

            this.setHatchCoverClearLocation(startPos.y);
        }
    }

    protected getHatchCoverStartPos(): Point {
        const textMetrics = this.getTitleBaySize();
        return new Point(this.padding.left, this.padding.top + (textMetrics ? textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent : 0) + this.getDeckRowNoSize().height + this.getStackWeightSize(false).height + this.getValueBoundaryArea(1).height);
    }

    protected doDrawHatchCover(hatchCoverIndex: number, startY: number, slotSize: Size, isUp: boolean): DrawRectangle | undefined {
        let hatchCover: DrawRectangle;
        let xs = 0, xf = 0;
        let dataSet = [];
        const leftMarginOfHold = this.getLeftMarginOfHold();
        let hatchCoverKey = '';

        if (isUp) {
            dataSet = this.VESSEL_DEFINE.vslBays[this.BayIndex].specialHatchItem.uhc;
            hatchCoverKey = hatchCoverIndex.toString();
        } else {
            dataSet = this.VESSEL_DEFINE.vslBays[this.BayIndex].specialHatchItem.lhc;
            hatchCoverKey = hatchCoverIndex.toString() + HatchDefine.PREFIX_HATCH_COVER_LOW;
        }

        xs = leftMarginOfHold + this.getSlotLocUtil().getSlotPosX(dataSet[hatchCoverIndex * 2 - 1]) / 4;
        xf = leftMarginOfHold + this.getSlotLocUtil().getSlotPosX(dataSet[hatchCoverIndex * 2]) / 4 + slotSize.width / 4;

        if (xs < 0 || xf < 0) {
            return undefined;
        }

        const baseGeometry = this.getHatchCover(hatchCoverKey);
        if (baseGeometry) {
            hatchCover = baseGeometry as DrawRectangle;
        } else {
            hatchCover = new DrawRectangle(HatchDefine.PREFIX_HATCH_COVER_KEY + hatchCoverKey);
            hatchCover.isForceDraw = true;
            this.addGeomObject(hatchCover);
        }

        hatchCover.setLocation(new Point(xs + this._indicatorGap, startY));
        hatchCover.setSize(new Size(xf - xs, slotSize.height));
        hatchCover.attribute.lineColor = (HatchDefine.VisibleHatchCoverClearance) ? Color.DarkGray() : Color.Black();
        hatchCover.attribute.fillColor = (HatchDefine.VisibleHatchCoverClearance) ? Color.DarkGray() : Color.Black();
        hatchCover.isChanged = true;

        return hatchCover;
    }

    getHatchCover(tierIndex: string): IBaseGeometry | undefined {
        return this.find(HatchDefine.PREFIX_HATCH_COVER_KEY + tierIndex);
    }

    private removeHatchWeight(rowIndex: number): void {
        this.removeGeom(this._hatchWeightMap, HatchDefine.PREFIX_HATCH_WEIGHT_KEY + rowIndex);
    }

    getHatchWeight(rowIndex: number): GeometryText | undefined {
        const key = HatchDefine.PREFIX_HATCH_WEIGHT_KEY + rowIndex;
        if (this._hatchWeightMap.has(key)) {
            return this._hatchWeightMap.get(key);
        }
    }

    getHatchCoverWeightItem(boundMode: number, bayIndex: number, rowIndex: number): GeneralWeightHatchCoverItem | undefined {
        const key = boundMode + "_" + bayIndex + "_" + rowIndex;
        if (this._hatchCoverWeightMap.has(key)) {
            return this._hatchCoverWeightMap.get(key);
        }
    }

    getHatchCoverWeight(boundMode: number, bayIndex: number, rowIndex: number): number {
        const key = boundMode + "_" + bayIndex + "_" + rowIndex;

        if (this._hatchCoverWeightMap.has(key)) {
            const item  = this._hatchCoverWeightMap.get(key);
            if (item) return item.weightValue;
        }

        return 0;
    }

    protected addHatchWeightGeomObject(rowName: GeometryText): void {
        if (this._hatchWeightMap.has(rowName.name)) {
            this._hatchWeightMap.set(rowName.name, rowName);
        }
        
        this.addGeomObject(rowName);
    }

    private setHatchCoverWeightColor(item: GeneralWeightHatchCoverItem, rowName: GeometryText): void {
        if (!item || !rowName) return;
        
        if (item.isWeightColorCustom) {
            rowName.attribute.lineColor = item.weightColor;
        } else {
            rowName.attribute.lineColor = (item.weightValue < 0) ? Color.Red() : Color.Black();
        }
    }

    private setHatchCoverClearLocation(y: number): void {
        if (this._hatchCoverClear) {
            this._hatchCoverClear.setLocation(new Point(this.padding.left + this._indicatorGap, y));
            this._hatchCoverClear.setSize(new Size(this.getRowWidth(), this.zoomRatioInfo.hatchThick));
            this._hatchCoverClear.isChanged = true;
        }
    }

    protected drawTitle(): void {
        this.drawBulkTitle();
        this.drawBayNo();
    }

    protected drawBulkTitle(): void {
        if (this.PROPERTY.isBulkHeads) {
            let bulkTitle: GeometryText | undefined = this.getTBulkTitle();

            if (!bulkTitle) {
                bulkTitle = new GeometryText(HatchDefine.PREFIX_BULK_TITLE_KEY, 0, 0, '');
                bulkTitle.attribute.fillColor = Color.White();
                this.addGeomObject(bulkTitle);
            }

            bulkTitle.attribute.textAlign = ContentAlignment.BottomCenter;
            bulkTitle.attribute.fontName = this.zoomRatioInfo.fontName;
            bulkTitle.attribute.fontStyle = this.zoomRatioInfo.titleFontStyle;
            bulkTitle.attribute.fontSize = this.zoomRatioInfo.titleFontSize;
            bulkTitle.attribute.lineColor = Color.Red();
            bulkTitle.text = this.getBulkTitleText();
        }
    }

    getTBulkTitle(): GeometryText | undefined {
        const baseGeometry = this.find(HatchDefine.PREFIX_BULK_TITLE_KEY);

        if (baseGeometry)
            return baseGeometry as GeometryText;
        
        return undefined;
    }

    private getBulkTitleText(): string {
        if (this.PROPERTY.isBulkHeads) {
            let text = this.VESSEL_DEFINE.vslBays[this.VESSEL_DEFINE.vslHatchs[this.VESSEL_DEFINE.vslBays[this.BayIndex].hatchIdx].startBay].holdNo.toString();
            
            if (text.length === 1)
                text = "0" + text;
            
            return "H " + text;
        }

        return '';
    }

    private getBulkEndBlank(): string {
        let bulkBlank = "";

        if (this.PROPERTY.isBulkHeads) {
            bulkBlank = "  ";
        }

        return bulkBlank;
    }

    protected drawBayNo(): GeometryText {
        let bayTitle = this.getTBayTitle();

        if (!bayTitle) {
            bayTitle = new GeometryText(HatchDefine.PREFIX_BAY_TITLE_KEY, 0, 0, '');
            bayTitle.attribute.fillColor = Color.White();
            bayTitle.setLocation(new Point(0, 0));
            bayTitle.setSize(new Size(0, 0));
            this.addGeomObject(bayTitle);
        }

        bayTitle.attribute.textAlign = this.PROPERTY.bayTitleAlignment;
        bayTitle.attribute.fontName = this.zoomRatioInfo.fontName;
        bayTitle.attribute.fontStyle = this.zoomRatioInfo.titleFontStyle;
        bayTitle.attribute.fontSize = this.zoomRatioInfo.titleFontSize;
        bayTitle.text = this.getBayTitle();
        this._bayNo = bayTitle.text.replace(HatchDefine.PREFIX_BAY, "");

        bayTitle.isChanged = true;

        const tsize = bayTitle.getRealTextSize();
        bayTitle.setLocation(new Point(0, 0));
        bayTitle.setSize(new Size(tsize.width, tsize.height + 5));

        if (this.PROPERTY.isFixBayNo) {
            bayTitle.frozenTypes = FrozenTypes.Top;
        }

        return bayTitle;
    }

    getTBayTitle(): GeometryText | undefined {
        const baseGeometry = this.find(HatchDefine.PREFIX_BAY_TITLE_KEY);
        if (baseGeometry)
            return baseGeometry as GeometryText;
        
        return undefined;
    }

    protected drawDeckRowNo(): void {
        this.drawDeckRowNoHeight(this.getSlotLocUtil().getSlotSize().height / 2);
    }

    protected drawDeckRowNoHeight(displayHeight: number): void {
        let count = 0;
        const startPos = this.getDeckRowNoStartPos();

        if (this._deckRowNoClear) {
            this._deckRowNoClear.visible = true;
            if (this.zoomRatioInfo.zoomRatio === 1) {
                this._deckRowNoClear.visible = false;
            }
        }

        const slotSize = this.getSlotLocUtil().getSlotSize();
        
        for (let rowIndex = this.VESSEL_DEFINE.vslParticular.portRowWidth;
            rowIndex <= this.VESSEL_DEFINE.vslParticular.starRowWidth; rowIndex++) {
            if (this.zoomRatioInfo.zoomRatio === 1) {
                this.removeDeckRowNo(rowIndex);
                continue;
            }

            const stackWeightItem = this.getStackWeightItem(this.BoundMode, 1, this.BayIndex, rowIndex);
            const weightValue = this.getStackWeight(this.BoundMode, 1, this.BayIndex, rowIndex);
            let rowName = this.getDeckRowNo(rowIndex);

            if (!rowName) {
                rowName = new GeometryText(HatchDefine.PREFIX_DRAW_NO_KEY + rowIndex, 0, 0, '');
                if (this.PROPERTY.isFixRowNo) {
                    rowName.frozenTypes = FrozenTypes.Top;

                    if (this.PROPERTY.isFixBayNo) {
                        rowName.frozenLineIndex = 1;
                    }
                }

                rowName.attribute.textAlign = ContentAlignment.MiddleCenter;
                this.addDeckRowNoGeomObject(rowName);
            }

            if (this.isCellWithWeight() && this.zoomRatioInfo.zoomRatio > 2 && !this.PROPERTY.newLineStackWeight) {
                rowName.attribute.fontName = HatchDefine.CASP_SMALL_FONT;
                rowName.attribute.fontStyle = FontStyles.normal;
                rowName.attribute.fontSize = 6.75;
                rowName.text = (weightValue === 0) ? "" : weightValue.toString().padStart(3);

                if (stackWeightItem) {
                    this.setStackWeightColor(stackWeightItem, rowName);
                }
            } else {
                const rowNo = this.getRealRowNo(this.BayIndex, 1, rowIndex);
                rowName.attribute.fontName = this.zoomRatioInfo.rowFontName;
                rowName.attribute.fontStyle = this.zoomRatioInfo.rowFontStyle;
                rowName.attribute.fontSize = this.zoomRatioInfo.rowFontSize;
                rowName.text = rowNo;
                rowName.attribute.lineColor = weightValue < 0 ? Color.Red() : Color.Black();
            }

            rowName.setLocation(new Point(this.getSlotLocUtil().getSlotPosX(count) + startPos.x, startPos.y));
            rowName.setSize(new Size(slotSize.width - 1, displayHeight));
            rowName.visible = this.PROPERTY.bayViewMode !== BayViewMode.Hold;
            this.selectMark(rowName, false);
            rowName.isChanged = true;
            count++;
        }

        this.setDeckRowNoClearBounds();
    }

    protected drawHoldRowNo(): void {
        const textMetrics = this.getTitleBaySize();
        let startY = this.padding.top + (textMetrics ? textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent : 0)
               + this.getDeckRowNoSize().height + this.getStackWeightSize(true).height + this.getValueBoundaryArea(1).height + this.getSlotAreaSize().height + this.getHatchCoverSize().height + 2
               + this.getDeckTopMargin() + this.getHoldTopMargin() + (this.PROPERTY.switchRowNoWeight ? 0 : this.getDeckStackWeightSize().height) + this.getValueBoundaryArea(2).height - ((this.PROPERTY.bayViewMode === BayViewMode.Hold) ? this._deckAreaHeight : 0);

        if (this.PROPERTY.cubeType !== CubeType.None) {
            if (this.getMaxHatchCoverClearHeight() !== 0) {
                startY = startY + this.getMaxHatchCoverClearHeight();
            }
        }

        this.drawHoldRowNoHeight(this.getSlotLocUtil().getSlotSize().height / 2, startY);
    }

    protected drawHoldRowNoHeight(displayHeight: number, startY: number): void {
        if (this.PROPERTY.bayViewMode === BayViewMode.Deck) return;

        let pointX = 0;
        let pointY = 0;
        const startX = this.padding.left;
        let weightValue = 0;
        let rowName: GeometryText | undefined;
        let stackWeightItem: GeneralWeightRowNoItem | undefined;
        let rowNo = '';
        const baseHeight = displayHeight;

        // Hold Row No. Start Point Mark
        let startPoint: DrawRectangle;
        const baseGeometry = this.find("Hrowno_SP");

        if (baseGeometry) {
            startPoint = baseGeometry as DrawRectangle;
        } else {
            startPoint = new DrawRectangle("Hrowno_SP");
            startPoint.attribute.lineColor = Color.Transparent();
            startPoint.setSize(new Size(1, 1));
            this.addGeomObject(startPoint);
        }

        startPoint.setLocation(new Point(startX, startY));

        // Clear 
        if (this._holdRowNoClear) {
            this._holdRowNoClear.visible = true;
            if (this.zoomRatioInfo.zoomRatio === 1)
            {
                this._holdRowNoClear.visible = false;
            }
        }

        const slotSize = this.getSlotLocUtil().getSlotSize();
        const leftMarginOfHold = this.getLeftMarginOfHold();
        for (let rowIndex = this.VESSEL_DEFINE.vslParticular.portRowWidth;
            rowIndex <= this.VESSEL_DEFINE.vslParticular.starRowWidth; rowIndex++) {

            if (this.zoomRatioInfo.zoomRatio === 1) {
                this.removeHoldRowNo(rowIndex);
                continue;
            }

            stackWeightItem = this.getStackWeightItem(this.BoundMode, 2, this.BayIndex, rowIndex);
            weightValue = this.getStackWeight(this.BoundMode, 2, this.BayIndex, rowIndex);
            rowName = this.getHoldRowNo(rowIndex);

            if (!rowName) {
                rowName = new GeometryText(HatchDefine.PREFIX_HROW_NO_KEY + rowIndex, 0, 0, '');
                if (this.PROPERTY.isFixRowNo) {
                    rowName.frozenTypes = FrozenTypes.Bottom;
                }
                rowName.attribute.textAlign = ContentAlignment.MiddleCenter;

                this.addHoldRowNoGeomObject(rowName);
            }

            if (this.isCellWithWeight() && this.zoomRatioInfo.zoomRatio > 2 && this.PROPERTY.newLineStackWeight === false) {
                rowName.attribute.fontName = HatchDefine.CASP_SMALL_FONT;
                rowName.attribute.fontStyle = FontStyles.normal;
                rowName.attribute.fontSize = 6.75;
                rowName.text = (weightValue === 0) ? "" : weightValue.toString().padStart(3);

                if (stackWeightItem) {
                    this.setStackWeightColor(stackWeightItem, rowName);
                }
            } else {
                rowNo = this.getRealRowNo(this.BayIndex, 2, rowIndex);

                rowName.attribute.fontName = this.zoomRatioInfo.rowFontName;
                rowName.attribute.fontStyle = this.zoomRatioInfo.rowFontStyle;
                rowName.attribute.fontSize = this.zoomRatioInfo.rowFontSize;
                rowName.text = rowNo;
                rowName.attribute.lineColor = (weightValue < 0) ? Color.Red() : Color.Black();
            }

            pointX = leftMarginOfHold + (this.getSlotLocUtil().getSlotPosX(this.VESSEL_DEFINE.vslBays[this.BayIndex].box[rowIndex]) / 4);

            if (pointX < 0) {
                pointX = 0;
            }

            pointY = startY;
            rowName.setLocation(new Point(pointX + this._indicatorGap, pointY));
            rowName.setSize(new Size(slotSize.width - 1, baseHeight));

            this.selectMark(rowName, false);

            rowName.isChanged = true;
            rowName.attribute.isOutLine = true;
        }

        this.setHoldRowNoClearBounds();
    }

    private removeHoldRowNo(rowIndex: number): void {
        if (this._holdRowNoMap) return;
        this.removeGeom(this._holdRowNoMap, HatchDefine.PREFIX_HROW_NO_KEY + rowIndex);
    }

    getHoldRowNo(rowIndex: number): GeometryText | undefined {
        if (!this._holdRowNoMap) return undefined;

        const key = HatchDefine.PREFIX_HROW_NO_KEY + rowIndex;
        if (this._holdRowNoMap.has(key)) {
            return this._holdRowNoMap.get(key);
        }

        return undefined;
    }

    protected addHoldRowNoGeomObject(rowName: GeometryText) {
        if (!this._holdRowNoMap.has(rowName.name)) {
            this._holdRowNoMap.set(rowName.name, rowName);
        }

        this.addGeomObject(rowName);
    }

    private setHoldRowNoClearBounds(): void {
        const textMetrics = this.getTitleBaySize();
        const y = this.padding.top + (textMetrics ? textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent : 0)
            + this.getDeckRowNoSize().height + this.getValueBoundaryArea(1).height + this.getSlotAreaSize().height + this.getHatchCoverSize().height + 2
            + this.getDeckTopMargin() + this.getHoldTopMargin() + this.getHoldStackWeightSize().height + this.getValueBoundaryArea(2).height - ((this.PROPERTY.bayViewMode === BayViewMode.Hold) ? this._deckAreaHeight : 0);

        const slotSize = this.getSlotLocUtil().getSlotSize();
        const baseHeight = this.getHoldRowNoSize().height;

        const deckRowNoTxtSize = new Size(slotSize.width, this.getRowTextHeight(baseHeight));

        if (this._holdRowNoClear) {
            this._holdRowNoClear.setLocation(new Point(this.padding.left + this._indicatorGap, y));
            this._holdRowNoClear.setSize(new Size(this.getRowWidth(), deckRowNoTxtSize.height));
            this._holdRowNoClear.isChanged = true;
        }
    }

    private getHoldStackWeightSize(): Size {
        let returnValue = new Size(0, 0);
        if (this.PROPERTY.newLineStackWeight) {
            const slotSize = this.getSlotLocUtil().getSlotSize();
            returnValue = new Size(slotSize.width, this.getStackWeightTextHeight(slotSize.height / 2));
        }

        return returnValue;
    }

    private selectMark(text: GeometryText, isSelect: boolean): void {
        if (!text) return;

        text.attribute.isOutLine = true;
        text.attribute.outLineColor = (isSelect) ? new Color(125, 162, 206, 1) : Color.White();
        text.attribute.fillColor = (isSelect) ? new Color(220, 235, 252, 1) : Color.White();
        text.attribute.isFill = isSelect;
        text.isChanged = true;
    }

    private setDeckRowNoClearBounds(): void {
        if (!this._deckRowNoClear) return;

        const startPos = this.getDeckRowNoStartPos();
        const slotSize = this.getSlotLocUtil().getSlotSize();
        const baseHeight = this.getDeckRowNoSize().height;        
        const deckRowNoTxtSize = new Size(slotSize.width, this.getRowTextHeight(baseHeight));

        this._deckRowNoClear.setLocation(startPos);
        this._deckRowNoClear.setSize(new Size(this.getRowWidth(), deckRowNoTxtSize.height));
        this._deckRowNoClear.isChanged = true;
    }

    private getRowWidth(): number {
        return this.getSlotLocUtil().getSlotPosX(this.VESSEL_DEFINE.vslParticular.starRowWidth - this.VESSEL_DEFINE.vslParticular.portRowWidth + 1);
    }

    protected getRealRowNo(bayIndex: number, deckHold: number, rowIndex: number): string {
        try {
            if (this.IsOverlap && this.viewContainerSize === 40) {
                bayIndex = bayIndex - 1;
            }
    
            return this.VESSEL_DEFINE.vslBays[bayIndex].rowItem.rowNo[deckHold][rowIndex];
        } catch (error) {
            return '';
        }        
    }

    private setStackWeightColor(item: GeneralWeightRowNoItem, rowName: GeometryText) {
        if (!item || !rowName) return;

        if (item.isWeightColorCustom) {
            rowName.attribute.lineColor = item.weightColor;
        } else {
            rowName.attribute.lineColor = item.weightValue < 0 ? Color.Red() : Color.Black();
        }
    }

    protected addDeckRowNoGeomObject(rowName: GeometryText): void {
        if (!this._deckRowNoMap.has(rowName.name)) {
            this._deckRowNoMap.set(rowName.name, rowName);
        }

        this.addGeomObject(rowName);
    }

    getStackWeightItem(boundMode: number, deckHoldMode: number, bayIndex: number, rowIndex: number): GeneralWeightRowNoItem | undefined {
        if (this.IsOverlap && this.viewContainerSize === 40) {
            bayIndex = bayIndex - 1;
        }

        const key = boundMode + "_" + deckHoldMode + "_" + bayIndex + "_" + rowIndex;

        if (this._stackWeightMap.has(key)) {
            return this._stackWeightMap.get(key);
        }

        return undefined;
    }

    protected getDeckRowNoStartPos(): Point {
        const textMetrics = this.getTitleBaySize();
        return new Point(this.padding.left, this.padding.top + (textMetrics ? textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent : 0) + (this.PROPERTY.switchRowNoWeight ? this.getDeckStackWeightSize().height : 0))
    }

    protected getDeckStackWeightSize(): Size {
        if (this.PROPERTY.newLineStackWeight) {
            const slotSize = this.getSlotLocUtil().getSlotSize();
            return new Size(slotSize.width, this.getStackWeightTextHeight(slotSize.height / 2));
        }

        return Size.empty();
    }

    getStackWeight(boundMode: number, deckHoldMode: number, bayIndex: number, rowIndex: number): number {
        if (this.IsOverlap && this.viewContainerSize === 40) {
            bayIndex = bayIndex - 1;
        }

        const key = boundMode + "_" + deckHoldMode + "_" + bayIndex + "_" + rowIndex;

        if (this._stackWeightMap.has(key)) {
            const item = this._stackWeightMap.get(key);
            if (item) return item.weightValue;
        }

        return 0;
    }

    protected getStackWeightTextHeight(defaultHeight: number): number {
        if (this.zoomRatioInfo.zoomRatio !== 1) {
            const stringSize = FontUtil.measureText("00", this.zoomRatioInfo.rowFontName
                                            , this.zoomRatioInfo.rowFontSize
                                            , this.zoomRatioInfo.rowFontStyle);
            
            if (stringSize && defaultHeight < stringSize.actualBoundingBoxAscent + stringSize.actualBoundingBoxDescent) {
                defaultHeight = stringSize.actualBoundingBoxAscent + stringSize.actualBoundingBoxDescent;
            }
        }

        return defaultHeight;
    }

    private removeDeckRowNo(rowIndex: number): void {
        if (this._deckRowNoMap.entries.length === 0) return;
        const key = HatchDefine.PREFIX_DRAW_NO_KEY + rowIndex;
        this.removeGeom(this._deckRowNoMap, key);
    }

    private removeGeom(dataMap: Map<string, GeometryText>, key: string): void {
        if (dataMap.has(key)) {
            const geomText = dataMap.get(key);
            dataMap.delete(key);
            if (geomText) this.removeGeomObject(geomText);
        }
    }

    getDeckRowNo(rowIndex: number): GeometryText | undefined {
        if (this._deckRowNoMap.entries.length === 0) return undefined;

        const key = HatchDefine.PREFIX_DRAW_NO_KEY + rowIndex;

        if (this._deckRowNoMap.has(key)) {
            return this._deckRowNoMap.get(key);
        }

        return undefined;
    }

    private calculateHighCubeMargin(): void {
        this.calculateDeckTopMargin();
        this.calculateHoldTopMargin();
        this.calculateMaxHatchCoverClearHeight();
    }

    private calculateDeckTopMargin(): void {
        this._deckTopMargin = 0;
    }

    private calculateHoldTopMargin(): void {
        this._holdTopMargin = 0;

        if (this.PROPERTY.cubeType !== CubeType.None) {
            const slotSize = this.getSlotLocUtil().getSlotSize();
            const hatchCoverClear = this.VESSEL_DEFINE.vslBays[this.BayIndex].cogItem.hatchCoverClear;
            this._hatchCoverClearHeight = this._calculateContainerSize.getDeckLoadingTopHeight(slotSize.height, hatchCoverClear);
            this._holdTopMargin = this._calculateContainerSize.getMaxHatchCoverClearHeight(slotSize.height);
        }
    }

    private calculateMaxHatchCoverClearHeight(): void {
        this._maxHatchCoverClearHeight = 0;

        if (this.PROPERTY.cubeType !== CubeType.None) {
            const slotSize = this.getSlotLocUtil().getSlotSize();
            this._maxHatchCoverClearHeight = this._calculateContainerSize.getMaxHatchCoverClearHeightBayItem(this.VESSEL_DEFINE.vslBays, slotSize.height) - this.getHoldTopMargin();

            if (this._maxHatchCoverClearHeight < 0) {
                this._maxHatchCoverClearHeight = 0;
            }
        }
    }

    protected getDeckTopMargin(): number {
        return this._deckTopMargin;
    }

    protected getHoldTopMargin(): number {
        return this._holdTopMargin;
    }

    protected getMaxHatchCoverClearHeight(): number {
        return this._maxHatchCoverClearHeight;
    }

    protected getBayTitle(): string {
        let hatchTitle = '';
        const bayNo = ShipUtil.getViewBayNo(this.VESSEL_DEFINE.vslBays[this.BayIndex].bayNo);
        
        if (this.IsOverlap && this.generalBayType === GeneralBayType.BayofHatch) {
            hatchTitle = "(" + this.VESSEL_DEFINE.vslBays[this.BayIndex - 1].bayNo + ")";
        }

        return this.getBulkEndBlank() + HatchDefine.PREFIX_BAY + bayNo + hatchTitle + this.getEquipmentNo();
    }    

    private getEquipmentNo(): string {
        if (!this._equipmentNo || this._equipmentNo === '') return '';
        return "-" + this._equipmentNo;
    }

    protected getTitleBaySize(): TextMetrics | undefined {
        return FontUtil.measureText(this.getBayTitle(), this.zoomRatioInfo.fontName, this.zoomRatioInfo.titleFontSize, this.zoomRatioInfo.titleFontStyle);
    }

    protected getDeckRowNoSize(): Size {
        const slotSize = this.getSlotLocUtil().getSlotSize();
        return new Size(slotSize.width, this.getRowTextHeight(slotSize.height / 2));
    }

    protected getHoldRowNoSize(): Size {
        const slotSize = this.getSlotLocUtil().getSlotSize();
        return new Size(slotSize.width, this.getRowTextHeight(slotSize.height / 2));
    }

    protected getSlotAreaSize(): Size {
        const tierCount = (this.VESSEL_DEFINE.vslParticular.maxDeckTier - this.VESSEL_DEFINE.vslParticular.maxHoldTier) + 1;
        const rowCount = (this.VESSEL_DEFINE.vslParticular.starRowWidth - this.VESSEL_DEFINE.vslParticular.portRowWidth) + 1;

        return new Size(this.getSlotLocUtil().getSlotPosX(rowCount), this.getSlotLocUtil().getSlotPosY(tierCount));
    }

    protected getHatchCoverSize(): Size {
        const slotAreaSize = this.getSlotAreaSize();
        return new Size(slotAreaSize.width, this.zoomRatioInfo.hatchThick + (this.PROPERTY.hatchCoverMargin * 2));
    }

    protected getRowTextHeight(defaultHeight: number): number {
        let rowNoHeight = defaultHeight;
        let stringSize = new Size(0, 0);
        let fontSize = 5;

        if (this.isCellWithWeight() === false || this.PROPERTY.newLineStackWeight) {
            fontSize = this.zoomRatioInfo.rowFontSize;
        } else {
            if (this.zoomRatioInfo.zoomRatio > 2) {
                fontSize = 6.75;
            } else {
                fontSize = 8;
            }
        }

        if (this.zoomRatioInfo.zoomRatio !== 1) {
            const textMetrics = FontUtil.measureText("00", this.zoomRatioInfo.fontName, this.zoomRatioInfo.titleFontSize, this.zoomRatioInfo.titleFontStyle);
            
            if (textMetrics) {
                stringSize = new Size(textMetrics.width, textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent);

                if (rowNoHeight < stringSize.height) {
                    rowNoHeight = stringSize.height;
                }
            }
        }

        return rowNoHeight;
    }

    protected isCellWithWeight(): boolean {
        return HatchDefine.IsCellWithWeight;
    }

    protected drawDeckStackWeight(): void {
        let visible = true;
        let displaySize = new Size(0, 0);

        if (this.PROPERTY.newLineStackWeight) {
            if (this.zoomRatioInfo.zoomRatio === 1) {
                visible = false;
            }

            displaySize = this.getStackWeightSize(false);
        } else {
            visible = false;
        }

        this.drawDeckStackWeightVisible(displaySize.height, visible);
    }

    protected getStackWeightSize(forceCalculate: boolean): Size {
        if (this.PROPERTY.bayViewMode === BayViewMode.Hold && !forceCalculate) return Size.empty();

        if (this.PROPERTY.newLineStackWeight) {
            const slotSize = this.getSlotLocUtil().getSlotSize();
            return new Size(slotSize.width, this.getStackWeightTextHeight(slotSize.height / 2));
        }

        return Size.empty();
    }

    protected drawDeckStackWeightVisible(displayHeight: number, visible: boolean): void {
        if (this.PROPERTY.bayViewMode === BayViewMode.Hold) return;

        let count = 0;
        const startPos = this.getDeckStackWeightStartPos();

        if (this._deckStackWeightNoClear) {
            this._deckStackWeightNoClear.visible = true;
            if (!visible) {
                this._deckStackWeightNoClear.visible = false;
            }
        }

        const slotSize = this.getSlotLocUtil().getSlotSize();
        const fontSize = this.getStackWeightFontSize();

        for (let rowIndex = this.VESSEL_DEFINE.vslParticular.portRowWidth;
            rowIndex <= this.VESSEL_DEFINE.vslParticular.starRowWidth; rowIndex++) {
            if (!visible) {
                this.removeDeckStackWeight(rowIndex);
                continue;
            }

            const stackWeightItem = this.getStackWeightItem(this.BoundMode, 1, this.BayIndex, rowIndex);
            const weightValue = this.getStackWeight(this.BoundMode, 1, this.BayIndex, rowIndex);
            let stackWeightName = this.getDeckStackWeight(rowIndex);

            if (!stackWeightItem) {
                stackWeightName = new GeometryText(HatchDefine.PREFIX_DSW_NO_KEY + rowIndex, 0, 0, '');
                stackWeightName.attribute.textAlign = ContentAlignment.MiddleCenter;
                stackWeightName.attribute.fillColor = Color.White();
                this.addDeckRowNoGeomObject(stackWeightName);
            }

            if (stackWeightName && this.zoomRatioInfo.zoomRatio > 1) {
                stackWeightName.attribute.fontName = HatchDefine.CASP_SMALL_FONT;
                stackWeightName.attribute.fontStyle = FontStyles.normal;
                stackWeightName.attribute.fontSize = fontSize;
                stackWeightName.text = weightValue === 0 ? "" : weightValue.toString().padStart(3);

                if (stackWeightItem) {
                    this.setStackWeightColor(stackWeightItem, stackWeightName);
                }
            }

            if (stackWeightName) {
                stackWeightName.setLocation(new Point(this.getSlotLocUtil().getSlotPosX(count) + startPos.x, startPos.y));
                stackWeightName.setSize(new Size(slotSize.width - 1, displayHeight));
                stackWeightName.isChanged = true;
            }

            count++;
        }

        this.setDeckRowNoClearBounds();
    }

    private getStackWeightFontSize(): number {
        if (this.zoomRatioInfo.zoomRatio > 1) {
            if (this.zoomRatioInfo.zoomRatio === 2) {
                return 4.75;
            } else {
                return 6.75;
            }
        } else {
            return 8;
        }
    }

    public getDeckStackWeight(rowIndex: number): GeometryText | undefined {
        if (this._deckStackWeightMap.entries.length === 0) return undefined;
        const key = HatchDefine.PREFIX_DSW_NO_KEY + rowIndex;

        if (this._deckStackWeightMap.has(key)) {
            return this._deckStackWeightMap.get(key);
        }

        return undefined;
    }

    protected drawHoldStackWeight(): void {
        let visible = true;
        let displaySize = new Size(0, 0);
        
        if (this.PROPERTY.newLineStackWeight) {
            if (this.zoomRatioInfo.zoomRatio === 1) {
                visible = false;
            }

            displaySize = this.getStackWeightSize(false);
        } else {
            visible = false;
        }

        this.drawHoldStackWeightVisible(displaySize.height, visible);
    }

    protected drawHoldStackWeightVisible(displayHeight: number, visible: boolean): void {
        if (this.PROPERTY.bayViewMode === BayViewMode.Deck) return;

        let pointX = 0;
        let pointY = 0;

        let count = 0;
        const startPos = this.getHoldStackWeightStartPos();
        pointY = startPos.y;
        let weightValue = 0;

        let stackWeightName: GeometryText | undefined;
        let stackWeightItem: GeneralWeightRowNoItem | undefined;
        const baseHeight = displayHeight;

        if (this._holdStackWeightNoClear) {
            this._holdStackWeightNoClear.visible = true;
            if (visible === false) {
                this._holdStackWeightNoClear.visible = false;
            }
        }

        const slotSize = this.getSlotLocUtil().getSlotSize();
        const leftMarginOfHold = this.getLeftMarginOfHold();
        const fontSize = this.getStackWeightFontSize();
        for (let rowIndex = this.VESSEL_DEFINE.vslParticular.portRowWidth;
            rowIndex <= this.VESSEL_DEFINE.vslParticular.starRowWidth; rowIndex++) {
            
            if (visible === false) {
                this.removeHoldStackWeight(rowIndex);
                continue;
            }

            stackWeightItem = this.getStackWeightItem(this.BoundMode, 2, this.BayIndex, rowIndex);
            weightValue = this.getStackWeight(this.BoundMode, 2, this.BayIndex, rowIndex);
            stackWeightName = this.getHoldStackWeight(rowIndex);

            if (!stackWeightName) {
                stackWeightName = new GeometryText(HatchDefine.PREFIX_HSW_NO_KEY + rowIndex, 0, 0, '');
                stackWeightName.attribute.textAlign = ContentAlignment.MiddleCenter;
                stackWeightName.attribute.fillColor = Color.White();

                this.addHoldStackWeightGeomObject(stackWeightName);
            }

            if (this.zoomRatioInfo.zoomRatio > 1) {
                stackWeightName.attribute.fontName = HatchDefine.CASP_SMALL_FONT;
                stackWeightName.attribute.fontStyle = FontStyles.normal;
                stackWeightName.attribute.fontSize = fontSize;
                stackWeightName.text = (weightValue === 0) ? "" : weightValue.toString().padStart(3);

                if (stackWeightItem) {
                    this.setStackWeightColor(stackWeightItem, stackWeightName);
                }
            }

            pointX = leftMarginOfHold + (this.getSlotLocUtil().getSlotPosX(this.VESSEL_DEFINE.vslBays[this.BayIndex].box[rowIndex]) / 4);

            if (pointX < 0) {
                pointX = 0;
            }

            stackWeightName.setLocation(new Point(pointX + this._indicatorGap, pointY));
            stackWeightName.setSize(new Size(slotSize.width - 1, baseHeight));

            stackWeightName.isChanged = true;

            count++;
        }

        this.setHoldStackWeightClearBounds();
    }

    protected addHoldStackWeightGeomObject(rowName: GeometryText): void {
        if (!this._holdStackWeightMap.has(rowName.name)) {
            this._holdStackWeightMap.set(rowName.name, rowName);
        }

        this.addGeomObject(rowName);
    }

    getHoldStackWeight(rowIndex: number): GeometryText | undefined {
        if (this._holdStackWeightMap.entries.length === 0) return undefined;

        const key = HatchDefine.PREFIX_HSW_NO_KEY + rowIndex;
        if (this._holdStackWeightMap.has(key)) {
            return this._holdStackWeightMap.get(key);
        }

        return undefined;
    }

    protected getHoldStackWeightStartPos(): Point {
        const textMetrics = this.getTitleBaySize();
        const y = this.padding.top + (textMetrics ? textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent : 0)
            + this.getDeckRowNoSize().height + this.getStackWeightSize(true).height + this.getValueBoundaryArea(1).height + this.getSlotAreaSize().height + this.getHatchCoverSize().height + 2
            + this.getDeckTopMargin() + this.getHoldTopMargin() + this.getValueBoundaryArea(2).height + (this.PROPERTY.switchRowNoWeight ? this.getDeckStackWeightSize().height : 0) - ((this.PROPERTY.bayViewMode === BayViewMode.Hold) ? this._deckAreaHeight : 0);

        return new Point(this.padding.left + this._indicatorGap, y);
    }

    private setHoldStackWeightClearBounds(): void {
        const startPos = this.getHoldStackWeightStartPos();
        const slotSize = this.getSlotLocUtil().getSlotSize();
        const baseHeight = this.getHoldStackWeightSize().height;
        const holdStackWeightNoTxtSize = new Size(slotSize.width, this.getRowTextHeight(baseHeight));

        if (this._holdStackWeightNoClear) {
            this._holdStackWeightNoClear.setLocation(startPos);
            this._holdStackWeightNoClear.setSize(new Size(this.getRowWidth(), holdStackWeightNoTxtSize.height));
            this._holdStackWeightNoClear.isChanged = true;
        }
    }

    private removeDeckStackWeight(rowIndex: number) {
        if (this._deckStackWeightMap.entries.length === 0) return;
        const key = HatchDefine.PREFIX_DSW_NO_KEY + rowIndex;
        this.removeGeom(this._deckStackWeightMap, key);
    }

    protected getDeckStackWeightStartPos(): Point {
        const textMetrics = this.getTitleBaySize();
        return new Point(this.padding.left + this._indicatorGap, this.padding.top + (textMetrics ? textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent : 0) + (this.PROPERTY.switchRowNoWeight ? 0 : this.getDeckStackWeightSize().height));
    }

    private removeHoldStackWeight(rowIndex: number) {
        if (!this._holdStackWeightMap || this._holdStackWeightMap.entries.length === 0) return;
        this.removeGeom(this._holdStackWeightMap, HatchDefine.PREFIX_HSW_NO_KEY + rowIndex);
    }

    protected drawSlotVesselDefine() {
        const tierCount = this.VESSEL_DEFINE.vslParticular.maxDeckTier - this.VESSEL_DEFINE.vslParticular.maxHoldTier + 1;
        const startTier = this.VESSEL_DEFINE.vslParticular.maxHoldTier;
        const endTier = this.VESSEL_DEFINE.vslParticular.maxDeckTier;

        const rowCount = this.VESSEL_DEFINE.vslParticular.starRowWidth - this.VESSEL_DEFINE.vslParticular.portRowWidth + 1;
        const startRow = this.VESSEL_DEFINE.vslParticular.portRowWidth;
        const endRow = this.VESSEL_DEFINE.vslParticular.starRowWidth;

        this.drawSlot(rowCount, tierCount, startTier, endTier, startRow, endRow);
    }

    protected drawSlot(rowCount: number, tierCount: number, startTier: number, endTier: number, startRow: number, endRow: number): void {
        const hatchIndex = this.VESSEL_DEFINE.vslBays[this.BayIndex].hatchIdx;
        const slotSize = this.getSlotLocUtil().getSlotSize();
        const startPos = this.getSlotStartPos();
        let isDeck = true;

        for (let tierIndex = startTier; tierIndex <= endTier; tierIndex++) {
            const pointY = this.getSlotLocationY(startPos.y, tierIndex, endTier) - 5;
            isDeck = true;

            if (ShipUtil.isHold(this.VESSEL_DEFINE, this.BayIndex, tierIndex)) {
                if (this.PROPERTY.bayViewMode === BayViewMode.Deck) continue;
                isDeck = false;
            } else if (this.PROPERTY.bayViewMode === BayViewMode.Hold) {
                continue;
            }

            for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
                const pointX = this.getSlotLocationX(startPos.x, rowIndex, tierIndex);
                const key = this.getSlotKey(rowIndex, tierIndex);
                let baseGeometry: IBaseGeometry | undefined;
                let slot: TSlot | undefined;
                if (this._slotMap.has(key)) {
                    baseGeometry = this._slotMap.get(key);
                }

                //if (this.VESSEL_DEFINE.vslBays[this.BayIndex].slotItem.cpo[rowIndex][tierIndex] === 1) {
                if (key) {
                    if (baseGeometry) {
                        slot = baseGeometry as TSlot;
                    } else {
                        slot = new TSlot(this.getSlotKey(rowIndex, tierIndex), this.BayIndex, rowIndex, tierIndex, isDeck, this.PROPERTY);
                        this.addGeomObject(slot);
                        this._slotMap.set(slot.name, slot);
                    }

                    slot.enable = true;
                } else {
                    if (this.generalBayType === GeneralBayType.OnlyBayByCPO) {
                        continue;
                    }

                    if (!this.IsOverlap) {
                        if ((this.BayIndex === this.VESSEL_DEFINE.vslHatchs[hatchIndex].startBay)
                                && (this.VESSEL_DEFINE.vslHatchs[hatchIndex].startBay !== this.VESSEL_DEFINE.vslHatchs[hatchIndex].endBay)) {
                            const nextBayIndex = parseInt(this.VESSEL_DEFINE.vslBays[this.BayIndex + 1].bayNo);

                            if (nextBayIndex % 2 === 0) {
                                if (this.VESSEL_DEFINE.vslBays[this.BayIndex + 1].slotItem.cpo[rowIndex][tierIndex] === 1) {
                                    const key1 = this.getSlotKey(rowIndex, tierIndex);
                                    let virtualSlot = undefined;
                                    if (this._virtualSlotMap.has(key1)) {
                                        virtualSlot = this._virtualSlotMap.get(key1);
                                    }

                                    if (!virtualSlot) {
                                        virtualSlot = new DrawRectangle(key1);
                                        virtualSlot.attribute.lineColor = this.PROPERTY.virtualSlotColor;
                                        this._virtualSlotMap.set(key1, virtualSlot);
                                    }

                                    virtualSlot.setSize(slotSize);
                                    virtualSlot.setLocation(new Point(pointX + this._indicatorGap, pointY));
                                    virtualSlot.isChanged = true;
                                }
                            }
                        }
                    } else {
                        if (this.generalBayType === GeneralBayType.BayofHatch) {
                            const prevBayIndex = parseInt(this.VESSEL_DEFINE.vslBays[this.BayIndex - 1].bayNo);

                            if (prevBayIndex % 2 === 0) {
                                if (this.VESSEL_DEFINE.vslBays[this.BayIndex - 1].slotItem.cpo[rowIndex][tierIndex] === 1) {
                                    if (baseGeometry) {
                                        slot = baseGeometry as TSlot;
                                    } else {
                                        slot = new TSlot(this.getSlotKey(rowIndex, tierIndex), this.BayIndex, rowIndex, tierIndex, isDeck, this.PROPERTY);
                                        this.addGeomObject(slot);
                                        this._slotMap.set(slot.name, slot);
                                    }
                
                                    slot.enable = true;
                                }
                            }
                        }
                    }
                }

                if (slot) {
                    slot.setSize(slotSize);
                    slot.setLocation(new Point(pointX + this._indicatorGap, pointY));

                    if (this.PROPERTY.cubeType === CubeType.None) {
                        slot.isForceDraw = false;
                    } else {
                        slot.isForceDraw = true;
                    }

                    if (this.VESSEL_DEFINE.vslBays[this.BayIndex].holdTopTierIdx === tierIndex) {
                        if (this._deckStartRowIndex === -1) {
                            this._deckStartRowIndex = rowIndex;
                        }

                        this._deckEndRowIndex = rowIndex;
                    }

                    this.moveFirst(slot);
                }

                if (baseGeometry) this.changeSlotSizeByCubeType(baseGeometry, rowIndex, tierIndex);
            }
        }
    }

    protected changeSlotSizeByCubeType(baseGeometry: IBaseGeometry | undefined, rowIndex: number, tierIndex: number): void {
        if (!baseGeometry) {
            const key1 = this.getSlotKey(rowIndex, tierIndex);
            if (this._virtualSlotMap.has(key1)) {
                baseGeometry = this._virtualSlotMap.get(key1);
            }
        }

        // if (baseGeometry) {
        //     const key = this.getContainerKey(rowIndex, tierIndex);
        //     let containerGeometry = undefined;

        //     if (this._containerMap.has(key)) {
        //         containerGeometry = this._containerMap.get(key);
        //     }

        //     if (containerGeometry) {
        //         const tContainer = containerGeometry as TContainer;
                
        //         this.moveFirst(containerGeometry);
        //     }
        // }
    }

    protected getContainerKey(rowIndex: number, tierIndex: number) {
        return HatchDefine.PREFIX_CONTAINER_TITLE_KEY + this.BayIndex + "_" + rowIndex + "_" + tierIndex;
    }

    protected getSlotKey(rowIndex: number, tierIndex: number): string {
        return HatchDefine.PREFIX_SLOT_KEY + this.BayIndex + "_" + rowIndex + "_" + tierIndex;
    }

    protected getSlotLocationX(startX: number, rowIndex: number, tierIndex: number): number {
        if (ShipUtil.isHold(this.VESSEL_DEFINE, this.BayIndex, tierIndex)) {
            const rowX = ((rowIndex > 0) ? rowIndex - 1 : 0) * 4;
            return this.getLeftMarginOfHold() + this.getSlotLocUtil().getSlotPosX(rowX / 4); //this.getSlotLocUtil().getSlotPosX(this.VESSEL_DEFINE.vslBays[this.BayIndex].box[rowIndex]) / 4;
        } else {
            return startX + this.getSlotLocUtil().getSlotPosX(rowIndex - this.VESSEL_DEFINE.vslParticular.portRowWidth);
        }
    }

    protected getLeftMarginOfHold(): number {
        return -(this.VESSEL_DEFINE.vslParticular.portRowWidth - 1) * this.zoomRatioInfo.slotWidth + this.padding.left;
    }

    protected getSlotStartPos(): Point {
        const textMetrics = this.getBayTitleSize();
        const y = this.padding.top + (textMetrics ? textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent : 0) + this.getDeckRowNoSize().height + 1
            + this.getDeckTopMargin() + this.getStackWeightSize(false).height + this.getValueBoundaryArea(1).height;

        return new Point(this.padding.left, y);
    }

    protected getBayTitleSize(): TextMetrics | undefined {
        return FontUtil.measureText(this.getBayTitle(), this.zoomRatioInfo.fontName, this.zoomRatioInfo.titleFontSize, this.zoomRatioInfo.titleFontStyle);
    }

    protected getSlotLocationY(startY: number, tierIndex: number, maxDeckTier: number): number {
        if (ShipUtil.isHold(this.VESSEL_DEFINE, this.BayIndex, tierIndex)) {
            const returnValue = startY + this.getSlotLocUtil().getSlotPosY(maxDeckTier - tierIndex) + this.getHatchCoverSize().height + this.getHoldTopMargin();

            if (this.PROPERTY.bayViewMode !== BayViewMode.ALL) {
                return returnValue - this._deckAreaHeight;
            } else {
                return startY + this.getSlotLocUtil().getSlotPosY(maxDeckTier - tierIndex);
            }
        }

        return 0;
    }

    getValueBoundaryArea(holdDeckMode: number): Rectangle {
        let rtnBoundary = new Rectangle(0, 0, 0, 0);
        const valueBoundaryList = this.getGeomListByMember("displayRowIndex");
        let maxRowIndex = 0;

        for (let i = 0; i < valueBoundaryList.length; i++) {
            const valueBoundary = valueBoundaryList[i] as TValueBoundary;

            if (valueBoundary.holdDeckMode === holdDeckMode) {
                if (maxRowIndex < valueBoundary.displayRowIndex) {
                    rtnBoundary = valueBoundary.getBounds();
                    maxRowIndex = valueBoundary.displayRowIndex;
                }
            }
        }

        rtnBoundary = new Rectangle(rtnBoundary.x, rtnBoundary.y, rtnBoundary.width, rtnBoundary.height * maxRowIndex);

        return rtnBoundary;
    }

    getValueBoundaryMaxRowIndex(holdDeckMode: number): number {
        const valueBoundaryList = this.getGeomListByMember("displayRowIndex");
        let maxRowIndex = -1;

        for (let i = 0; i < valueBoundaryList.length; i++) {
            const valueBoundary = valueBoundaryList[i] as TValueBoundary;

            if (valueBoundary.holdDeckMode === holdDeckMode) {
                if (maxRowIndex < valueBoundary.displayRowIndex) {
                    maxRowIndex = valueBoundary.displayRowIndex;
                }
            }
        }

        return maxRowIndex;
    }
}

export default TGeneralBay;