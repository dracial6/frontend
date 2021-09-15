import { TEvent } from "../../../common";
import BaseDraw from "../../../drawing/elements/BaseDraw";
import DrawableObject from "../../../drawing/elements/DrawableObject";
import DrawLine from "../../../drawing/elements/DrawLine";
import DrawPolygon from "../../../drawing/elements/DrawPolygon";
import DrawRectangle from "../../../drawing/elements/DrawRectangle";
import DrawText from "../../../drawing/elements/DrawText";
import GeometryObject from "../../../drawing/elements/GeometryObject";
import GeometryText from "../../../drawing/elements/GeometryText";
import IBaseGeometry from "../../../drawing/elements/IBaseGeometry";
import LayerDrawableObject from "../../../drawing/elements/LayerDrawableObject";
import { Color, ContentAlignment, DisplayLayer, FontStyles, Padding, Point, Rectangle, Size } from "../../../drawing/structures";
import GeneralLogger from "../../../logger/GeneralLogger";
import DrawableUtil from "../../../utils/DrawableUtil";
import TCloseButton from "../../common/button/TCloseButton";
import BayItem from "../../common/items/BayItem";
import BlockItem from "../../common/items/BlockItem";
import BoundaryItem from "../../common/items/BoundaryItem";
import ContainerBayItem from "../../common/items/ContainerBayItem";
import RowItem from "../../common/items/RowItem";
import SpreaderItem from "../../common/items/SpreaderItem";
import YardDisplayItem from "../../common/items/YardDisplayItem";
import YSlotItem from "../../common/items/YSlotItem";
import YSlotUsageItem from "../../common/items/YSlotUsageItem";
import BoundaryUtil from "../../common/plan/BoundaryUtil";
import IBoundaryContainer from "../../common/plan/IBoundaryContainer";
import ChassisDisplayPosition from "../../common/structures/ChassisDisplayPosition";
import TierType from "../../common/structures/TierType";
import ViewDirection from "../../common/structures/ViewDirection";
import YTLaneLocTypes from "../../common/structures/YTLaneLocTypes";
import TBoundary from "../../common/TBoundary";
import BlockDisplayType from "../structures/BlockDisplayType";
import HorizontalArrange from "../structures/HorizontalArrange";
import ViewDisplayUtil from "../utils/ViewDisplayUtil";
import YardUtil from "../utils/YardUtil";
import YardConstant from "../YardConstant";
import TBayProperty from "./TBayProperty";
import TBayRowBar from "./TBayRowBar";
import TBayRowGroup from "./TBayRowGroup";
import TBayRowNo from "./TBayRowNo";
import TChassis from "./TChassis";
import TContainer from "./TContainer";
import TSelectionMark from "./TSelectionMark";
import TSelectionMarkProperty from "./TSelectionMarkProperty";
import TSlot from "./TSlot";
import TSpreader from "./TSpreader";

type ResetContainerEventDelegate = () => void;
type SpreaderMoveEventDelegate = (spreader: SpreaderMoveInfo) => void;

class ResetContainerEventHandler extends TEvent {
    protected events: ResetContainerEventDelegate[] = [];

    addEvent(eventHandler: ResetContainerEventDelegate): void {
        this.events.push(eventHandler);
    }

    removeEvent(eventHandler: ResetContainerEventDelegate): void {
        if (this.isEmpty()) return;
        this.events.splice(this.events.indexOf(eventHandler), 1);
    }

    doEvent(): void {
        this.events.forEach(eventHandler => {
            eventHandler();
        });
    }
}

class SpreaderMoveEventHandler extends TEvent {
    protected events: SpreaderMoveEventDelegate[] = [];

    addEvent(eventHandler: ResetContainerEventDelegate): void {
        this.events.push(eventHandler);
    }

    removeEvent(eventHandler: ResetContainerEventDelegate): void {
        if (this.isEmpty()) return;
        this.events.splice(this.events.indexOf(eventHandler), 1);
    }

    doEvent(info: SpreaderMoveInfo): void {
        this.events.forEach(eventHandler => {
            eventHandler(info);
        });
    }
}

class SpreaderMoveInfo {
    locked = false;
    containerNo = '';
    prevBay = 0;
    prevRow = 0;
    prevTier = 0;
    prevSpreaderYTLaneLocTypes = YTLaneLocTypes.None;
    newBay = 0;
    newRow = 0;
    newTier = 0;
    spreaderName = '';
    spreaderYTLaneLocTypes = YTLaneLocTypes.None;
}

class TCraneButton extends DrawableObject {
    private _backRect?: DrawRectangle;
    private _myLine1?: DrawLine;
    private _myLine2?: DrawLine;
    private _myLine3?: DrawLine;
    private _myLine4?: DrawLine;
    private _myLine5?: DrawLine;
    private _btnSize = 0;
    private _lineThick = 0;
    private _isPressed = false;

    block = '';
    bayRow = 0;
    viewType = ViewDirection.Front;

    getIsPressed(): boolean {
        return this._isPressed;
    }

    setIsPressed(isPressed: boolean): void {
        this._isPressed = isPressed;

        if (this._backRect) {
            if (this._isPressed) {
                this._backRect.attribute.fillColor = Color.Gray();
            } else {
                this._backRect.attribute.fillColor = Color.White();
            }
        }
    }

    constructor(viewType: ViewDirection, block: string, bayRow: number, size: number, lineThick: number) {
        super("CraneButton");
        this.viewType = viewType;
        this.block = block;
        this.bayRow = bayRow;
        this._btnSize = size;
        this._lineThick = lineThick;
        this._isPressed = false;

        this.initialize();
        this.setSize(new Size(size, size));
    }

    private initialize(): void {
        this.clearGeomObject();

        this._backRect = new DrawRectangle(this.name + "R");
        this._backRect.attribute.lineColor = Color.DarkGray();
        this._backRect.attribute.fillColor = Color.White();
        this._backRect.setSize(new Size(this._btnSize, this._btnSize));
        this.addGeomObject(this._backRect);
        this.setSize(this._backRect.getSize());

        this._myLine1 = new DrawLine(this.name + "_L1", this._btnSize * 0.1, this._btnSize * 0.3, this._btnSize * 0.9, this._btnSize * 0.3);
        this._myLine1.attribute.lineThick = this._lineThick;
        this._myLine1.attribute.lineColor = Color.Red();
        this.addGeomObject(this._myLine1);

        this._myLine2 = new DrawLine(this.name + "_L2", this._btnSize * 0.5, this._btnSize * 0.1, this._btnSize * 0.5, this._btnSize * 0.9);
        this._myLine2.attribute.lineThick = this._lineThick;
        this._myLine2.attribute.lineColor = Color.Red();
        this.addGeomObject(this._myLine2);

        this._myLine3 = new DrawLine(this.name + "_L3", this._btnSize * 0.5, this._btnSize * 0.1, this._btnSize * 0.7, this._btnSize * 0.3);
        this._myLine3.attribute.lineThick = this._lineThick;
        this._myLine3.attribute.lineColor = Color.Red();
        this.addGeomObject(this._myLine3);

        this._myLine4 = new DrawLine(this.name + "_L4", this._btnSize * 0.7, this._btnSize * 0.3, this._btnSize * 0.7, this._btnSize * 0.9);
        this._myLine4.attribute.lineThick = this._lineThick;
        this._myLine4.attribute.lineColor = Color.Red();
        this.addGeomObject(this._myLine4);

        this._myLine5 = new DrawLine(this.name + "_L5", this._btnSize * 0.5, this._btnSize * 0.6, this._btnSize * 0.7, this._btnSize * 0.6);
        this._myLine5.attribute.lineThick = this._lineThick;
        this._myLine5.attribute.lineColor = Color.Red();
        this.addGeomObject(this._myLine5);
    }

    onMouseDown(sender: any, event: MouseEvent): void {
        
    }
    onMouseMove(sender: any, event: MouseEvent): void {
        
    }
    onMouseUp(sender: any, event: MouseEvent): void {
        
    }
    onSelected(sender: any, event: MouseEvent): void {
        
    }
    onMouseHover(sender: any, event: MouseEvent): void {
        
    }
    onMouseLeave(sender: any, event: MouseEvent): void {
        
    }
    onMouseClick(sender: any, event: MouseEvent): void {
        
    }
    onResize(sender: any, event: MouseEvent): void {
        
    }
}

class TBay extends LayerDrawableObject implements IBoundaryContainer {
    TBay = 0;

    private _initialized = false;
    private _applyBufferSlot = false;
    private _bayRowNoSize = Size.empty();
    private _visibleSlotCargoType = false;
    private _visibleRowTierSlotCargoType = false;
    private _slotDic = new Map<string, TSlot>();
    private _bayRowNoList = new Map<number, string>();
    private _viewType = ViewDirection.Front;
    private _tierType = TierType.MaxTier;
    private _maxBayRow = 0;
    private _maxTier = 0;
    private _bayRowDirection = HorizontalArrange.LeftToRight;
    private _ytLaneL = false;
    private _ytLaneR = false;
    private _slotWidth = 0;
    private _slotHeight = 0;
    private _block = '';
    private _bayRow = 0;
    private _bayRowName = "";
    private _slotGap = 0;
    private _craneButton?: TCraneButton;
    private _blockDefine?: BlockItem;
    private _tierNoFontSize = 12;
    private _bayRowNoFontSize = 12;
    private _titleMoveY = 0;
    private _zoomRate = 0;
    private _leftMargin = 0;
    private _topMargin = 0;
    private _visibleTitle = true;
    private _onlyBayRowCaption = false;
    private _visibleAccessDirection = false;
    private _visibleCloseButton = false;
    private _visibleCraneButton = false;
    private _bufferGaps: number[] = [];
    private _yardSlotList = new Map<string, YSlotItem>();
    private _bayProperty = new TBayProperty();
    private _displayAttributeItem = new YardDisplayItem();
    
    resetContainerEvent = new ResetContainerEventHandler();
    spreaderMoveEvent = new SpreaderMoveEventHandler();
    caption = "";
    IBoundaryContainer = 0; // For Type Check.
    passTier = 0;
    fixedBayRowTierFontSize = false;
    sortIndex = 0;

    constructor(name: string) {
        super(name);
    }

    setDataItem(viewType: ViewDirection, blockItem: BlockItem, bayRow: number, slotWidth: number, slotHeight: number
        , slotGap: number, zoomRate: number, visibleAccessDirection: boolean, visibleCloseButton: boolean, visibleCraneButton: boolean
        , bayRowDirection: HorizontalArrange, displayAttribute: YardDisplayItem, caption: string, tierType: TierType, applyBufferSlot: boolean
        , visibleSlotCargoType: boolean, visibleRowTierSlotCargoType: boolean, bayProperty: TBayProperty, visibleTitle: boolean, fixedBayRowTierNoFontSize: boolean, bayRowNoFontSize: number
        , tierNoFontSize: number, onlyBayRowCaption: boolean, visibleYTLaneL: boolean, visibleYTLaneR: boolean, margin: Padding, bayRowName: string, maxBayRow: number, maxTier: number, bayRowNoList: Map<number, string> | undefined): void {
        this.name = "TBay_" + blockItem.getName() + "_" + bayRow.toString();
        this._block = blockItem.getName();
        this._bayRow = bayRow;
        this._slotHeight = slotHeight;
        this._slotWidth = slotWidth;
        this._slotGap = slotGap;
        this._viewType = viewType;
        this._blockDefine = blockItem;
        this._zoomRate = zoomRate;
        this._visibleAccessDirection = visibleAccessDirection;
        this._visibleCloseButton = visibleCloseButton;
        this._visibleCraneButton = visibleCraneButton;
        this._bayRowDirection = bayRowDirection;
        this._topMargin = (margin.top * this._zoomRate) < 15 ? 15 : (margin.top * this._zoomRate);
        this._leftMargin = (margin.left * this._zoomRate) < 10 ? 10 : (margin.left * this._zoomRate);
        this._displayAttributeItem = displayAttribute;
        this.caption = caption;
        this._tierType = tierType;
        this._applyBufferSlot = applyBufferSlot;
        this._visibleSlotCargoType = visibleSlotCargoType;
        this._visibleRowTierSlotCargoType = visibleRowTierSlotCargoType;
        this._visibleTitle = visibleTitle;
        this._onlyBayRowCaption = onlyBayRowCaption;
        this.fixedBayRowTierFontSize = fixedBayRowTierNoFontSize;
        this._bayRowNoFontSize = bayRowNoFontSize;
        this._tierNoFontSize = tierNoFontSize;
        this._ytLaneL = visibleYTLaneL;
        this._ytLaneR = visibleYTLaneR;
        this._bayRowName = bayRowName;
        this._maxBayRow = maxBayRow;
        this._maxTier = maxTier;
        if (bayRowNoList) this._bayRowNoList = bayRowNoList;

        if (this._blockDefine) {
            this._yardSlotList = this._blockDefine.getYSlotList();
            this._maxTier = this._blockDefine.maxTier;
            this.passTier = this._blockDefine.passTier;

            if (this._tierType === TierType.MaxTier) {
                this.passTier = this._maxTier;
            }

            let tBayItem = undefined;
            let tRowItem = undefined;

            if (this._viewType === ViewDirection.Front) {
                tBayItem = this._blockDefine.getBayList().get(this._bayRow) as BayItem;
                this._maxBayRow = tBayItem.getMaxRow();
            } else {
                tRowItem = this._blockDefine.getRowList().get(this._bayRow) as RowItem;
                this._maxBayRow = tRowItem.getMaxBay();
            }
        }

        if (!bayProperty) {
            bayProperty = new TBayProperty();
        }

        this._bayProperty = bayProperty;
        this.initialize();
    }

    initialize(): void {
        this._slotDic.clear();
        this._initialized = false;
        this.initializeBayRowSlot();
        this._initialized = true;
    }
    
    getBlock(): string {
        return this._block;
    }

    getBayRow(): number {
        return this._bayRow;
    }

    getBayRowName(): string {
        return this._bayRowName;
    }

    getCraneButton(): TCraneButton | undefined {
        return this._craneButton;
    }

    getBlockDefine(): BlockItem | undefined {
        return this._blockDefine;
    }

    getSlotWidth(): number {
        return this._slotWidth;
    }

    getSlotHeight(): number {
        return this._slotHeight;
    }

    getSlotGap(): number {
        return this._slotGap;
    }

    getSortedBayRowNoList(): Map<number, string> {
        return this._bayRowNoList;
    }

    getViewType(): ViewDirection {
        return this._viewType;
    }

    getMaxBayRow(): number {
        return this._maxBayRow;
    }

    getMaxTier(): number {
        return this._maxTier;
    }

    getBayRowDirection(): HorizontalArrange {
        return this._bayRowDirection;
    }

    getYTLaneL(): boolean {
        return this._ytLaneL;
    }

    setYTLaneL(ytLaneL: boolean): void {
        if (this._ytLaneL !== ytLaneL) {
            this._ytLaneL = ytLaneL;
            this.initializeBayRowSlot();
            super.updateMBR();
        }
    }

    getYTLaneR(): boolean {
        return this._ytLaneR;
    }

    setYTLaneR(ytLaneR: boolean): void {
        if (this._ytLaneR !== ytLaneR) {
            this._ytLaneR = ytLaneR;
            this.initializeBayRowSlot();
            super.updateMBR();
        }
    }

    getTierNoFontSize(): number {
        return this._tierNoFontSize;
    }

    setTierNoFontSize(tierNoFontSize: number): void {
        if (this._tierNoFontSize !== tierNoFontSize) {
            this._tierNoFontSize = tierNoFontSize;
            this.initializeBayRowSlot();
            super.updateMBR();
        }
    }

    getBayRowNoFontSize(): number {
        return this._bayRowNoFontSize;
    }

    setBayRowNoFontSize(rowNoFontSize: number): void {
        if (this._bayRowNoFontSize !== rowNoFontSize) {
            this._bayRowNoFontSize = rowNoFontSize;
            this.initializeBayRowSlot();
            super.updateMBR();
        }
    }

    getTitleMoveY(): number {
        return this._titleMoveY;
    }

    getButtonBarPosY(): number {
        return this._slotHeight + this.passTier + this._topMargin + this._slotGap * (this.passTier - 1) + 1 + this._slotGap + this.getBayRowBarFirstSlotGap();
    }

    initializeBayRowSlot(): void {
        this.clearGeomObject();
        if (this._blockDefine) {
            this.setRMGBlockTier();
        }

        this.drawTitle(this.getTitle());

        for (let i = 1; i <= this._maxBayRow; i++) {
            for (let j = 1; j <= this.passTier; j++) {
                this.addSlot("", i, j);
            }
        }

        if (this._visibleCraneButton) { 
            this.addCraneButton(); 
        }

        // Add CloseButton
        if (this._visibleCloseButton) {
            this.addCloseButton(); 
        }

        // Tier No
        this.drawTierNo();

        this.drawBottomBar();

        // Row Bar, Row No
        this.drawBayRowNo();

        if (this._blockDefine) {
            // Access Direction
            this.drawAccessDirection();
        }

        if (this._ytLaneR === true) {
            this.padding.right = (this._slotGap * 2) + this.getYTLaneWidth(YTLaneLocTypes.Right);
        }
    }

    setBaseLineColor(baseLine: number, backColor: Color, borderColor: Color): void {
        const keyName = this.getBottomBarKey(baseLine);

        const iGeom = super.getGeomObject(keyName);
        if (iGeom) {
            if (iGeom instanceof BaseDraw) {
                const itemObj = iGeom as BaseDraw;
                itemObj.attribute.fillColor = backColor;
                itemObj.attribute.lineColor = borderColor;
            } else if (iGeom instanceof GeometryObject) {
                const geomObj = iGeom as GeometryObject;
                geomObj.attribute.fillColor = backColor;
                geomObj.attribute.lineColor = borderColor;
            }
        }
    }

    private getBottomBarKey(bayRowIndex: number): string {
        return "BAR_" + bayRowIndex;
    }

    private drawAccessDirection(): void {
        if (this._visibleAccessDirection) {
            const carrierDirItems = this._blockDefine?.getCarrierTypeSourceList();

            if (carrierDirItems && carrierDirItems.size > 0) {
                let accessDir = "";
                let lineIdx = 0;
                let arrowGap = 0;
                const size = this.getSize();
                
                carrierDirItems.forEach(item => {
                    if (this._viewType === ViewDirection.Front) {
                        accessDir = item.pos;
                    } else {
                        accessDir = item.enter;
                    }

                    let visibleLeftArrow = false;
                    let visibleRightArrow = false;

                    if (accessDir === "B") {
                        visibleLeftArrow = true;
                        visibleRightArrow = true;
                    } else {
                        if (this._bayRowDirection === HorizontalArrange.LeftToRight && accessDir === "S") {
                            visibleLeftArrow = true;
                        } else if (this._bayRowDirection === HorizontalArrange.RightToLeft && accessDir === "E") {
                            visibleLeftArrow = true;
                        }
                        
                        if (this._bayRowDirection === HorizontalArrange.LeftToRight && accessDir === "E") {
                            visibleRightArrow = true;
                        } else if (this._bayRowDirection === HorizontalArrange.RightToLeft && accessDir === "S") {
                            visibleRightArrow = true;
                        }
                    }

                    let length = 16 * this._zoomRate;

                    if (length % 8 > 2) {
                        length += 8 - length % 8;
                    } else if (length % 8 > 0 && length % 8 <= 2) {
                        length -= length % 8;
                    }

                    let fillColor = (item.getType() === "SC") ? Color.Yellow() : Color.Green();
                    const arrowPosY = size.height - this._bayRowNoSize.height - (lineIdx * length) - arrowGap;

                    if (visibleRightArrow) {
                        this.paintArrowLeft(size.width + this._slotGap, arrowPosY, length, fillColor);
                    }

                    if (visibleLeftArrow) {
                        this.paintArrowRight(0, arrowPosY, length, fillColor);
                    }
                    
                    lineIdx++;
                    arrowGap = 2;
                });
            }
        }
    }

    private paintArrowRight(x1: number, y1: number, length: number, fillColor: Color): void {
        const x2 = x1 + length;
        const y2 = y1 + length;

        const tPoints: Point[] = [];
        tPoints.push(new Point(x1, y1 + length / 8 * 2));
        tPoints.push(new Point(x1 + length / 2, y1 + length / 8 * 2));
        tPoints.push(new Point(x1 + length / 2, y1));
        tPoints.push(new Point(x2, y1 + length / 2));
        tPoints.push(new Point(x1 + length / 2, y2));
        tPoints.push(new Point(x1 + length / 2, y1 + length / 8 * 6));
        tPoints.push(new Point(x1, y1 + length / 8 * 6));

        const arrowRight = new DrawPolygon("arrowRight", tPoints);
        arrowRight.attribute.lineColor = Color.Black();
        arrowRight.attribute.lineThick = (this._zoomRate < 1) ? 1 : this._zoomRate;
        arrowRight.attribute.fillColor = fillColor;
        arrowRight.visible = this._visibleAccessDirection;
        arrowRight.setLocation(new Point(x1, y1));

        super.addGeomObject(arrowRight);
    }

    private paintArrowLeft(x1: number, y1: number, length: number, fillColor: Color): void {
        const x2 = x1 + length;
        const y2 = y1 + length;

        const tPoints: Point[] = [];
        tPoints.push(new Point(x1, y1 + length / 2));
        tPoints.push(new Point(x1 + length / 2, y1));
        tPoints.push(new Point(x1 + length / 2, y1 + length / 8 * 2));
        tPoints.push(new Point(x2, y1 + length / 8 * 2));
        tPoints.push(new Point(x2, y1 + length / 8 * 6));
        tPoints.push(new Point(x1 + length / 2, y1 + length / 8 * 6));
        tPoints.push(new Point(x1 + length / 2, y2));

        const arrowLeft = new DrawPolygon("arrowLeft", tPoints);
        arrowLeft.attribute.lineColor = Color.Black();
        arrowLeft.attribute.lineThick = (this._zoomRate < 1) ? 1 : this._zoomRate;
        arrowLeft.attribute.fillColor = fillColor;
        arrowLeft.visible = this._visibleAccessDirection;
        arrowLeft.setLocation(new Point(x1, y1));

        super.addGeomObject(arrowLeft);
    }

    setDisplayAttribute(displayAttribute: YardDisplayItem): void {
        this._displayAttributeItem = displayAttribute;
        this.drawTitle(this.getTitle());
        this.drawTierNo();
        this.drawBayRowNo();
    }

    private drawTierNo() : void {
        let tierNo: DrawText | undefined = undefined;
        let key = "";

        for (let i = 1; i <= this.passTier; i++) {
            tierNo = undefined;
            key = this.getTierNoKey(i);
            if (this._initialized) {
                tierNo = super.getGeomObject(key) as DrawText;
            }

            if (!tierNo) {
                tierNo = new DrawText(key);
                tierNo.attribute.textAlign = ContentAlignment.MiddleRight;
                tierNo.attribute.fontName = "tahoma";
                tierNo.attribute.fontSize = (this._tierNoFontSize * this._zoomRate < 6) ? 6 : this._tierNoFontSize * this._zoomRate;
                tierNo.text = i.toString();
                const ytLaneLWidth = this.getYTLaneWidth(YTLaneLocTypes.Left);
                const tierLocX = this._leftMargin + ytLaneLWidth;// -(tierNo.GetMBR().Width + 2);
                let tierLocY = (this.getSlot(1, i) as TSlot).getLocation().y + this._slotHeight / 2;
                const tierNoWidth = tierNo.getRealTextSize().width;
                tierLocY = tierLocY - (tierNo.getRealTextSize().height / 2);
                tierNo.setLocation(new Point(tierLocX, tierLocY));
                super.addGeomObject(tierNo);
            }

            tierNo.attribute.fontStyle = FontStyles.bold;
            tierNo.attribute.lineColor = Color.Black();
            ViewDisplayUtil.SetStyle(BlockDisplayType.Tier, tierNo.attribute, this._displayAttributeItem);
        }
    }

    private getTierNoKey(index: number) : string {
        return "tier" + index;
    }

    getTierNoLocationX() : number {
        let locationX = 0;

        try {
            const ytLaneLWidth = this.getYTLaneWidth(YTLaneLocTypes.Left);
            locationX = this._leftMargin + ytLaneLWidth;
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }

        return locationX;
    }

    private getBayRowNoText(idx: number) : string {
        let bayRowNoText = "";
        try {
            if (this._blockDefine) {
                bayRowNoText = this.getBayRowNoTextByYardDefine(idx);
            } else {
                bayRowNoText = this.getBayRowNoTextByUserDefine(idx);
            }
        } catch (ex) {
            GeneralLogger.error(ex);
        }

        return bayRowNoText;
    }

    private getBayRowNoTextByUserDefine(idx: number) : string {
        let bayRowNoText = "";
        if (this._bayRowNoList.has(idx)) {
            bayRowNoText = this._bayRowNoList.get(idx) as string;
        } else {
            bayRowNoText = idx.toString();
        }

        return bayRowNoText;
    }

    private getBayRowNoTextByYardDefine(idx: number) : string {
        let bayRowNoText = "";

        if (!this._blockDefine) return bayRowNoText;
        const rowItem = this._blockDefine.getRowList().get(idx);
        const bayItem = this._blockDefine.getBayList().get(idx);

        if (this._viewType === ViewDirection.Front && rowItem) {
            bayRowNoText = rowItem.name;
        } else if (bayItem) {
            if (bayItem.name4 === ""
                || bayItem.name2 === bayItem.name4) {
                bayRowNoText = bayItem.name2;
            } else {
                bayRowNoText = bayItem.name2 + "(" + bayItem.name4 + ")";
            }
        }

        return bayRowNoText;
    }

    private drawBayRowNo() : void {
        this._bayRowNoSize = Size.empty();
        const movePosY = this.getBayRowBarFirstSlotGap();
        let bayRowNoKey = undefined;
        let bayRowNo: TBayRowNo | undefined;

        for (let i = 1; i <= this._maxBayRow; i++) {
            bayRowNo = undefined;
            bayRowNoKey = this.getBayRowNoKey(i);
            
            if (this._initialized) {
                bayRowNo = super.getGeomObject(bayRowNoKey) as TBayRowNo;
            }

            if (!bayRowNo) {
                bayRowNo = new TBayRowNo(bayRowNoKey, 0, 0, "");
                bayRowNo.block = this._block;

                if (this._viewType === ViewDirection.Front) {
                    bayRowNo.bay = this._bayRow;
                    bayRowNo.row = i;
                } else {
                    bayRowNo.bay = i;
                    bayRowNo.row = this._bayRow;
                }

                bayRowNo.viewType = this._viewType;
                bayRowNo.attribute.textAlign = ContentAlignment.MiddleCenter;
                bayRowNo.attribute.fontName = "tahoma";
                bayRowNo.attribute.fontSize = (this._bayRowNoFontSize * this._zoomRate < 6) ? 6 : this._bayRowNoFontSize * this._zoomRate;
                bayRowNo.text = this.getBayRowNoText(i);
                const barBounds = this.getBottomBarBounds(i);
                const bayRowLocY = barBounds.getLocation().y + barBounds.getSize().height;
                bayRowNo.setLocation(new Point(barBounds.getLocation().x, bayRowLocY));
                bayRowNo.setSize(new Size(this._slotWidth, bayRowNo.getTextSize().height));
                
                super.addGeomObjectBackground(bayRowNo, false);
            }

            bayRowNo.attribute.fontStyle = FontStyles.bold;
            bayRowNo.attribute.lineColor = Color.Black();
            
            if (Size.isEmpty(this._bayRowNoSize)) {
                this._bayRowNoSize = bayRowNo.getRealTextSize();
            }

            if (this._viewType == ViewDirection.Front) {
                ViewDisplayUtil.SetStyle(BlockDisplayType.RowNo, bayRowNo.attribute, this._displayAttributeItem);
            } else {
                ViewDisplayUtil.SetStyle(BlockDisplayType.BayNo, bayRowNo.attribute, this._displayAttributeItem);
            }
        }
    }

    private getBayRowBarFirstSlotGap(): number {
        let movePosY = 0;

        if (this.isChassisDisplay()) {
            movePosY = this.getChassisDisplayHeight() + this._bayProperty.wheelDeckGap + 2;
        } else {
            movePosY = this._slotGap;
        }

        return movePosY;
    }

    getChassisDisplayHeight(): number {
        return this._slotHeight / 4;
    }

    private getBayRowNoKey(bayRowIndex: number) : string {
        if (this._viewType == ViewDirection.Front) {
            return "rowno" + bayRowIndex.toString();
        } else {
            return "bayno" + bayRowIndex.toString();
        }
    }

    isChassisDisplay(): boolean {
        if (this._bayProperty.visibleWheelDeck === false) return false;
        if (!this._blockDefine) return false;
        if (this._blockDefine.wdChk.length === 0) return false;

        return (this._blockDefine.wdChk === "Y") ? true : false;
    }

    getBottomBarBounds(bayRowIndex: number): Rectangle {
        let tmpResult = bayRowIndex;
        if (this._bayRowDirection === HorizontalArrange.RightToLeft) {
            tmpResult = this._maxBayRow + 1 - bayRowIndex;
        }

        const ytLaneLWidth = this.getYTLaneWidth(YTLaneLocTypes.Left);
        const tierNoWidth = this.getTierNoSize().width + 8;
        const title = super.getGeomObject("viewtitle");
        let titleHeight = 0;
        if (title) {
            titleHeight = title.getMBR().height;
        }

        const location = new Point(this._slotWidth * (tmpResult - 1) + this._leftMargin + ytLaneLWidth + tierNoWidth + this._slotGap * (tmpResult - 1) + this.getBufferSlotGap(tmpResult), this._slotHeight * this.passTier + this._topMargin + titleHeight + this._slotGap * (this.passTier - 1) + 1 + this._slotGap + this.getBayRowBarFirstSlotGap());
        const size = new Size(this._slotWidth, (5 * this._zoomRate) < 3 ? 3 : 5 * this._zoomRate);

        return new Rectangle(location.x, location.y, size.width, size.height);
    }

    getBottomBarPosY(): number {
        return this._slotHeight * this.passTier + this._topMargin + this._slotGap * (this.passTier - 1) + 1 + this._slotGap + this.getBayRowBarFirstSlotGap();
    }

    private setRMGBlockTier(): void {
        if (!this._applyBufferSlot) return;
        if (!this._blockDefine) return;

        if (this._viewType === ViewDirection.Side) {
            const bufferItem = YardUtil.getRMGBlockInfo(this._viewType, this._blockDefine, this._bayRow, this._tierType);
            
            if (bufferItem) {
                this._maxTier = bufferItem.mxTier;
                this.passTier = bufferItem.passTier;
            }
        }
    }

    private getBufferSlotGap(bayRow: number): number {
        if (!this._applyBufferSlot || !this._blockDefine) return 0;
        if (this._viewType === ViewDirection.Side) return 0;

        if (!this._bufferGaps) {
            const defaultSlotGap = YardUtil.getDefaultSlotGap(this._slotGap, this._slotWidth);
            this._bufferGaps = YardUtil.getRMGSlotGaps(this._viewType, this._bayRowDirection, this._blockDefine, defaultSlotGap);
        }

        if (this._bufferGaps.length === 0) return 0;

        let tempBayRow = bayRow;
        if (this._bayRowDirection === HorizontalArrange.RightToLeft) {
            tempBayRow = this._maxBayRow + 1 - bayRow;
        }

        if (bayRow - 1 < 0 || bayRow > this._bufferGaps.length) return 0;

        return this._bufferGaps[tempBayRow - 1];
    }

    private resetTitle(): void {
        if (this._initialized) {
            this.removeGeomObjectKey("viewtitle");
            this.drawTitle(this.getTitle());
        }
    }

    private resetSlots() : void {
        if (this._initialized) {
            const slots = super.getGeomListByMember("TSlot");
            for (let i = 0; i < slots.length; i++) {
                super.removeGeomObject(slots[i]);
            }

            for (let i = 1; i <= this._maxBayRow; i++) {
                for (let j = 1; j <= this.passTier; j++) {
                    this.addSlot("", i, j);
                }
            }
        }

        return;
    }

    private addCraneButton() : void {
        const size = (30 * this._zoomRate) < 10 ? 10 : (30 * this._zoomRate);
        const lineThick = (2 * this._zoomRate) < 1 ? 1 : (2 * this._zoomRate);
        let moveX = 0;
        let moveY = 0;
        if (this._bayRowDirection === HorizontalArrange.LeftToRight) {
            const location = (this.getSlot(this._maxBayRow, this.passTier) as TSlot).getLocation();
            moveX = location.x + this._slotWidth - size;
            moveY = location.y - size;
        } else if (this._bayRowDirection === HorizontalArrange.RightToLeft) {
            const location = (this.getSlot(1, this.passTier) as TSlot).getLocation();
            moveX = location.x + this._slotWidth - size;
            moveY = location.y - size;
        }

        this._craneButton = new TCraneButton(this._viewType, this._block, this._bayRow, size, lineThick);
        let tempX = moveX, tempY = 0;
        if (this._visibleCloseButton) {
            tempX = moveX - (size + this._slotGap * 2);
        }
        tempY = moveY - this._slotGap;
        this._craneButton.setLocation(new Point(tempX, tempY));
        this.addGeomObjectBackground(this._craneButton, false);
    }

    private resetCraneButton() : void {
        if (this._initialized) {
            if (this._craneButton) super.removeGeomObject(this._craneButton);
            if (this._visibleCraneButton) {
                this.addCraneButton();
            }
        }
        return;
    }

    setTotalQtyText(totalQty: string) : void {
        const geomTotalQty = this.getGeomObject("TotalQty_" + this._block + "_" + this._bayRow);
        if (geomTotalQty !== undefined && (geomTotalQty instanceof GeometryText)) {
            const gtTotalQty = geomTotalQty as GeometryText;
            const beforeSize = gtTotalQty.getRealTextSize().width;
            gtTotalQty.text = totalQty;
            const totalQtySize = gtTotalQty.getRealTextSize().width;
            gtTotalQty.setLocation(new Point(gtTotalQty.getBounds().x - (totalQtySize - beforeSize), gtTotalQty.getBounds().y));
            gtTotalQty.setSize(Size.empty());
        } else {
            const gtTotalQty = new GeometryText("TotalQty_" + this._block + "_" + this._bayRow, 0, 0, "");
            const btnSize = (30 * this._zoomRate + 0.5) < 10 ? 10 : (30 * this._zoomRate + 0.5);
            let x = 0;
            let y = 0;
            gtTotalQty.attribute.textAlign = ContentAlignment.MiddleCenter;
            gtTotalQty.attribute.fontName = "Tahoma";
            gtTotalQty.attribute.fontSize = ((20 * this._zoomRate + 0.5) < 7) ? 7 : (20 * this._zoomRate + 0.5);
            gtTotalQty.text = totalQty;
            let totalQtySize = gtTotalQty.getRealTextSize().width;
            if (this.getBayRowDirection() === HorizontalArrange.LeftToRight) {
                const slot = this.getSlot(this._maxBayRow, this.passTier);
                if (slot) {
                    x = slot.getLocation().x + this._slotWidth - totalQtySize;
                    y = slot.getLocation().y - btnSize - this._slotGap;
                }
            } else if (this.getBayRowDirection() === HorizontalArrange.RightToLeft) {
                const slot = this.getSlot(this._maxBayRow, this.passTier);
                if (slot) {
                    x = slot.getLocation().x + this._slotWidth - totalQtySize;
                    y = slot.getLocation().y - btnSize - this._slotGap;
                }
            }

            if (this._visibleCloseButton) {
                x -= (btnSize + this._slotGap);
            }

            if (this._visibleCraneButton) {
                x -= (btnSize + this._slotGap);
            }

            gtTotalQty.setLocation(new Point(x, y));

            gtTotalQty.setCurrentLocation(new Point(this.getCurrentLocation().x + gtTotalQty.getLocation().x, this.getCurrentLocation().y + gtTotalQty.getLocation().y));
            this.addGeomObjectBackground(gtTotalQty, true);
        }
    }

    private addCloseButton(): void {
        let tCloseBtn = undefined;
        const size = (30 * this._zoomRate + 0.5) < 10 ? 10 : (30 * this._zoomRate + 0.5);
        const lineThick = (2 * this._zoomRate + 0.5) < 1 ? 1 : (2 * this._zoomRate + 0.5);
        let moveX = 0;
        let moveY = 0;

        if (this._bayRowDirection === HorizontalArrange.LeftToRight) {
            moveX = (this.getSlot(this._maxBayRow, this.passTier) as TSlot).getLocation().x + this._slotWidth - size;
            moveY = (this.getSlot(this._maxBayRow, this.passTier) as TSlot).getLocation().y - size;
        } else if (this._bayRowDirection === HorizontalArrange.RightToLeft) {
            moveX = (this.getSlot(1, this.passTier) as TSlot).getLocation().x + this._slotWidth - size;
            moveY = (this.getSlot(1, this.passTier) as TSlot).getLocation().y - size;
        }

        tCloseBtn = new TCloseButton(this._viewType, this._block, this._bayRow, size, lineThick);
        tCloseBtn.setLocation(new Point(moveX, moveY - this._slotGap));
        super.addGeomObjectBackground(tCloseBtn, false);
    }
    
    private resetCloseButton() : void {
        if (this._initialized) {
            const closeButtons = this.getGeomListByMember("TCloseButton");
            for (let i = 0; i < closeButtons.length; i++) {
                super.removeGeomObject(closeButtons[i]);
            }

            this.addCloseButton();
        }
        return;
    }

    private resetTierNo() : void {
        if (this._initialized) {
            for (let i = 1; i <= this.passTier; i++) {
                const key = this.getTierNoKey(i);
                super.removeGeomObjectKey(key);
            }

            this.drawTierNo();
        }
        return;
    }

    private drawBottomBar(): void {
        for (let i = 1; i <= this._maxBayRow; i++) {
            let bottomBar = undefined;
            const key = this.getBottomBarKey(i);

            if (this._initialized) {
                bottomBar = super.getGeomObject(key) as TBayRowBar;
            }

            if (!bottomBar) {
                const barBounds = this.getBottomBarBounds(i);
                bottomBar = new TBayRowBar(key, barBounds.x, barBounds.y, barBounds.width, barBounds.height);
                bottomBar.block = this._block;
                bottomBar.viewType = this._viewType;

                if (this._viewType === ViewDirection.Front) {
                    bottomBar.bay = this._bayRow;
                    bottomBar.row = i;
                } else {
                    bottomBar.bay = i;
                    bottomBar.row = this._bayRow;
                }

                super.addGeomObject(bottomBar);
            }

            bottomBar.attribute.lineColor = Color.Gray();
            bottomBar.attribute.fillColor = Color.Gray()
        }
    }

    private resetBottomBar() : void {
        if (this._initialized) {
            for (let i = 1; i <= this._maxBayRow; i++) {
                const key = this.getBottomBarKey(i);
                this.removeGeomObjectKey(key);
            }
            this.drawBottomBar();
        }
        return;
    }

    private resetBayRowNo() : void {
        if (this._initialized) {
            for (let i = 1; i <= this._maxBayRow; i++) {
                const bayRowNoKey = this.getBayRowNoKey(i);
                this.removeGeomObjectKey(bayRowNoKey);
            }
            this.drawBayRowNo();
        }
        return;
    }

    private resetAccessDirection() : void {
        if (this._initialized) {
            super.removeGeomObjectKey("arrowleft");
            super.removeGeomObjectKey("arrowright");
            this.drawAccessDirection();
        }
        return;
    }

    private drawTitle(title: string): void {
        let viewTitle = undefined;

        if (this._initialized) {
            viewTitle = super.getGeomObject("viewtitle");
        }

        if (!viewTitle) {
            viewTitle = new DrawText("viewtitle");
            viewTitle.attribute.textAlign = ContentAlignment.TopLeft;
            viewTitle.attribute.fontName = "tahoma";
            viewTitle.attribute.fontSize = ((20 * this._zoomRate) < 7) ? 7 : 20 * this._zoomRate;
            viewTitle.text = title;
            viewTitle.setLocation(this.getTitleDefaultLocation());
            this.addGeomObject(viewTitle);
        }

        viewTitle.attribute.fontStyle = FontStyles.bold;
        viewTitle.attribute.lineColor = Color.Black();
    }

    private getTitle(): string {
        if (this._blockDefine) {
            return this.getTitleByYardDefine();
        } else {
            return this.getTitleByUserDefine();
        }
    }
    
    private getTitleByYardDefine(): string {
        let title = "";
        
        if (this._viewType === ViewDirection.Front) {
            const map = this._blockDefine?.getBayList() as Map<number, BayItem>;
            title = map.get(this._bayRow)?.name2 as string;

            if (map.get(this._bayRow)?.name2 !== map.get(this._bayRow)?.name4) {
                title += "(" + map.get(this._bayRow)?.name4 + ")";
            }
        } else {
            title = this._blockDefine?.getRowList().get(this._bayRow)?.name as string;
        }

        if (this.caption.length === 0) {
            title = this._block + " - " + title;
        } else {
            if (this._onlyBayRowCaption) {
                title = this.caption;
            } else {
                title = this._block + " - " + title + " " + this.caption;
            }
        }

        return title;
    }

    private getTitleByUserDefine(): string {
        return this._block + " - " + this._bayRowName;
    }

    getTitleObject(): IBaseGeometry | undefined {
        if (this._initialized) {
            return super.getGeomObject("viewtitle") as DrawText;
        }

        return undefined;
    }

    private getTitleDefaultLocation(): Point {
        return new Point(this._leftMargin + this.getYTLaneWidth(YTLaneLocTypes.Left) + this.getTierNoSize().width + 8, this._topMargin);
    }

    private getTierNoSize(): Size {
        const tempText = new DrawText("");
        tempText.text = "1";
        tempText.attribute.fontSize = this._tierNoFontSize < 7 ? 6 : this._tierNoFontSize;

        return tempText.getRealTextSize();
    }

    private getYTLaneWidth(ytLaneLocType: YTLaneLocTypes): number {
        return this.getYTLaneWidthBySpreaderSize(ytLaneLocType, -1);
    }

    private getYTLaneWidthBySpreaderSize(ytLaneLocType: YTLaneLocTypes, spreaderSize: number): number {
        let rtnValue = 0;
        let ytLane = false;

        if (ytLaneLocType === YTLaneLocTypes.Left) {
            ytLane = this._ytLaneL;
        } else if (ytLaneLocType === YTLaneLocTypes.Right) {
            ytLane = this._ytLaneR
        }

        if (ytLane) {
            let defaultSpreaderSize = 20;
            let maxSpreaderSize = 0;

            if (spreaderSize !== -1) {
                maxSpreaderSize = spreaderSize;
            } else {
                maxSpreaderSize = this.getMaxSpreaderSizeInYTLane(ytLaneLocType);
            }

            if (maxSpreaderSize < defaultSpreaderSize) {
                maxSpreaderSize = defaultSpreaderSize;
            }

            rtnValue = this.getSpreaderWidth(maxSpreaderSize);
        }

        return rtnValue;
    }

    private getMaxSpreaderSizeInYTLane(ytLaneLocTypes: YTLaneLocTypes): number {
        const list = this.getGeomList();
        let maxSpreaderSize = 0;

        for (let item of list) {
            if (item instanceof TSpreader) {
                const spreader = item as TSpreader;
                if (spreader.ytLaneLocTypes === ytLaneLocTypes) {
                    if (maxSpreaderSize < spreader.spreaderSize) {
                        maxSpreaderSize = spreader.spreaderSize;
                    }
                }
            }
        }

        return maxSpreaderSize;
    }

    private getSpreaderWidth(spreaderSize: number) {
        return (this._slotWidth * 2 / 3 * (spreaderSize / 20));
    }

    private isResizeYTLaneWidth(targetYTLaneLocTypes: YTLaneLocTypes, beforeYTLaneLocTypes: YTLaneLocTypes, afterYTLaneLocTypes: YTLaneLocTypes, spreaderSize: number) : boolean {
        let isResize = false;
        if (targetYTLaneLocTypes !== YTLaneLocTypes.None && beforeYTLaneLocTypes !== afterYTLaneLocTypes) {
            if (beforeYTLaneLocTypes === targetYTLaneLocTypes || afterYTLaneLocTypes === targetYTLaneLocTypes) {
                const maxSpreaderSizeInYTLane = this.getMaxSpreaderSizeInYTLane(targetYTLaneLocTypes);
                if (maxSpreaderSizeInYTLane !== spreaderSize) {
                    isResize = true;
                }
            }
        }

        return isResize;
    }

    addBoundary(boundary: BoundaryItem): TBoundary | undefined {
        let startBayRowIdx = boundary.startRow;
        let endBayRowIdx = boundary.endRow;

        if (this._viewType === ViewDirection.Side) {
            startBayRowIdx = boundary.startBay;
            endBayRowIdx = boundary.endBay;
        }

        const startSlot = this.getSlot(startBayRowIdx, boundary.startTier);
        const endSlot = this.getSlot(endBayRowIdx, boundary.endTier);

        if (startSlot && endSlot) {
            const key = this.getBoundaryKey(boundary);
            const startLocation = startSlot.getLocation();
            const startSize = startSlot.getSize();
            const endLocation = endSlot.getLocation();
            const endSize = endSlot.getSize();
            const startBounds = new Rectangle(startLocation.x, startLocation.y, startSize.width, startSize.height);
            const endBounds = new Rectangle(endLocation.x, endLocation.y, endSize.width, endSize.height);
            const boundary1 = Rectangle.union(startBounds, endBounds);
            let tBoundary = this.getBoundary(boundary);

            if (tBoundary === undefined) {
                tBoundary = new TBoundary(key, boundary);
            }

            tBoundary.boundary = boundary;
            tBoundary.setLocation(boundary1.getLocation());
            tBoundary.setSize(boundary1.getSize());

            this.addGeomObjectLayer(tBoundary, DisplayLayer.Two);

            DrawableUtil.calculateAncher(this, tBoundary);
        }

        return undefined;
    }

    private getBoundaryKey(boundary: BoundaryItem): string {
        return BoundaryUtil.getBoundaryKey(boundary);
    }

    getBoundary(boundary: BoundaryItem): TBoundary | undefined {
        const key = this.getBoundaryKey(boundary);
        const baseGeometry = this.getGeomObjectLayer(key, DisplayLayer.Two);

        if (baseGeometry) {
            return baseGeometry as TBoundary;
        }

        return undefined;
    }

    getSlot(bayRow: number, tier: number): TSlot | undefined {
        const key = this.getSlotKey(bayRow, tier);

        if (this._slotDic.has(key)) {
            return this._slotDic.get(key) as TSlot;
        }

        if (bayRow <= this._maxBayRow && tier <= this.passTier) {
            return this.getGeomObject("TSlot_" + bayRow + tier) as TSlot;
        }

        return undefined;
    }

    private getSlotKey(bayRow: number, tier: number): string {
        return "TSlot_" + bayRow + tier;
    }

    removeBoundary(boundary: BoundaryItem): void {
        this.removeGeomObjectLayerKey(this.getBoundaryKey(boundary), DisplayLayer.Two);
    }

    removeAllBoundary(): void {
        this.clearGeomObjectLayer(DisplayLayer.Two);
    }

    setVisibleBoundary(visible: boolean): void {
        if (visible) {
            this.hiddenLayer = undefined;
        } else {
            this.hiddenLayer = DisplayLayer.Two;
        }
    }

    setVisibleBoundaryItem(boundary: BoundaryItem, visible: boolean): void {
        const tBoundary = this.getBoundary(boundary);

        if (tBoundary) {
            tBoundary.visible = visible;
        }
    }

    addSlot(slotNo: string, bayRow: number, tier: number): void {
        const isEquipmentPassSlot = YardUtil.isEquipmentPassSlot(tier, this._maxTier);

        if (slotNo.length === 0) slotNo = this.getSlotKey(bayRow, tier);

        let tempSlot: TSlot;
        if (this._viewType === ViewDirection.Front)
            tempSlot = new TSlot(slotNo, this._block, this._bayRow, bayRow, tier, isEquipmentPassSlot, 1);
        else
            tempSlot = new TSlot(slotNo, this._block, bayRow, this._bayRow, tier, isEquipmentPassSlot, 1);
        
        tempSlot.setSize(new Size(this._slotWidth, this._slotHeight));

        if (this._visibleSlotCargoType) {
            const ySlotItem = this.getSlotItem(tempSlot.bay, tempSlot.row);
            if (ySlotItem) {
                tempSlot.setType(YardUtil.getSlotCargoTypeYSlotItem(ySlotItem, " "));
            }
        } else if (this._visibleRowTierSlotCargoType) {
            let ySlotUsageItem = undefined;
            if (this._blockDefine) {
                const map = this._blockDefine.getYSlotUsageList();

                for (let key in map) {
                    const value = map.get(key) as YSlotUsageItem;
                    if (value.getBay() === tempSlot.bay && value.getRow() === tempSlot.row && value.getTier() === tempSlot.tier) {
                        ySlotUsageItem = value;
                        break;
                    }
                }

                if (ySlotUsageItem) {
                    tempSlot.setType(YardUtil.getSlotCargoTypeYSlotUsageItem(ySlotUsageItem, " "));
                }
            }      
        }

        tempSlot.setLocation(this.getSlotLocation(bayRow, tier));
        tempSlot.visible = this.getVisibleByBufferSlot(bayRow, tier);

        this.addGeomObject(tempSlot);
        this._slotDic.set(tempSlot.name, tempSlot);
    }

    private getSlotItem(bayIndex: number, rowIndex: number): YSlotItem | undefined {
        const key = bayIndex.toString().padStart(3, '0') + rowIndex.toString().padStart(3, '0');

        if (this._yardSlotList.has(key)) {
            return this._yardSlotList.get(key);
        }

        return undefined;
    }

    getSlotLocation(bayRow: number, tier: number): Point {
        return new Point(this.getSlotLocationX(bayRow), this.getSlotLocationY(tier));
    }

    private getSlotLocationX(bayRow: number): number {
        if (this._bayRowDirection === HorizontalArrange.RightToLeft) {
            bayRow = this._maxBayRow + 1 - bayRow;
        }
        const tierNoWidth = this.getTierNoSize().width + 8;

        return (this._slotWidth + this._slotGap) * (bayRow - 1) + this._leftMargin + this.getBufferSlotGap(bayRow) + this.getYTLaneWidth(YTLaneLocTypes.Left) + tierNoWidth;
    }

    private getSlotLocationY(tier: number): number {
        const title = super.getGeomObject("viewtitle");
        const titleHeight = (title) ? title.getMBR().height : 0;
        return (this._slotHeight + this._slotGap) * (this.passTier - tier) + this._topMargin + titleHeight;
    }

    private getVisibleByBufferSlot(bayRow: number, tier: number): boolean {
        if (!this._blockDefine) return true;
        if (!this._applyBufferSlot) return true;
        if (this._viewType === ViewDirection.Side) return true;

        return YardUtil.getVisibleByBufferSlot(this._viewType, this._blockDefine, this._bayRow, bayRow, tier, this._tierType);
    }

    setSelection(viewDir: ViewDirection, seqNo: string, block: string, bay: number, row: number, tier: number, occupiedSlotCount: number, markProperty: TSelectionMarkProperty): void {
        const bayRowIndex = YardUtil.getBayRowIndexAtYAxis(this.getViewType(), bay, row);
        const startPoint = this.getSlotLocation(bayRowIndex, tier);
        const endPoint = this.getSlotLocation(bayRowIndex + occupiedSlotCount - 1, tier);
        const slotSize = new Size(this._slotWidth, this._slotHeight);
        const startBounds = new Rectangle(startPoint.x, startPoint.y, slotSize.width, slotSize.height);
        const endBounds = new Rectangle(endPoint.x, endPoint.y, slotSize.width, slotSize.height);
        const boundary1 = Rectangle.union(startBounds, endBounds);
        markProperty.size = boundary1.getSize();
        this.removeSelectionWithTier(block, bay, row, tier);
        const keyName = this.getSelectionMarkKey(block, bay, row, tier);
        const tSelectionMark = new TSelectionMark(keyName, seqNo, bayRowIndex, tier, occupiedSlotCount, markProperty);
        tSelectionMark.setLocation(boundary1.getLocation());
        tSelectionMark.setSize(boundary1.getSize());
        this.addGeomObject(tSelectionMark);
        DrawableUtil.calculateAncher(this, tSelectionMark);
    }

    removeSelectionWithTier(block: string, bay: number, row: number, tier: number): void {
        super.removeGeomObjectKey(this.getSelectionMarkKey(block, bay, row, tier));
    }

    private getSelectionMarkKey(block: string, bay: number, row: number, tier: number): string {
        return "SM" + block + bay.toString() + row.toString() + tier.toString();
    }

    setSelectionBayRowNo(bay: number, row: number, boardColor: Color, backgroundColor: Color): void {
        let bayRowIndex = row;

        if (this._viewType === ViewDirection.Side) {
            bayRowIndex = bay;
        }

        const bayRowNoKey = this.getBayRowNoKey(bayRowIndex);
        const TBayRowNo = super.getGeomObject(bayRowNoKey) as TBayRowNo;

        if (TBayRowNo) {
            TBayRowNo.setSelectedMark(boardColor, backgroundColor);
        }
    }

    resetSelectionBayRowNo(bay: number, row: number) : void {
        let bayRowIndex = row;
        if (this._viewType === ViewDirection.Side) {
            bayRowIndex = bay;
        }

        const bayRowNoKey = this.getBayRowNoKey(bayRowIndex);
        const tBayRowNo = super.getGeomObject(bayRowNoKey) as TBayRowNo;
        if (tBayRowNo) {
            tBayRowNo.resetSelectedMark();
        }
    }

    resetAllSelectionBayRowNo() : void {
        const bayRowNoList = this.getGeomListByMember("TBayRowNo");
        if (bayRowNoList.length === 0) return;
        for (let item of bayRowNoList) {
            (item as TBayRowNo).resetSelectedMark();
        }
    }

    setBayRowNoToolTip(bay: number, row: number, tooltipText: string) : void {
        let bayRowIndex = row;
        if (this._viewType === ViewDirection.Side) {
            bayRowIndex = bay;
        }
        const bayRowNoKey = this.getBayRowNoKey(bayRowIndex);
        const tBayRowNo = super.getGeomObject(bayRowNoKey) as TBayRowNo;
        if (tBayRowNo) {
            tBayRowNo.tooltipText = tooltipText;
        }
    }
    
    setBayRowBarToolTip(bay: number, row: number, tooltipText: string) : void {
        let bayRowIndex = row;
        if (this._viewType === ViewDirection.Side) {
            bayRowIndex = bay;
        }
        const bayRowBarKey = this.getBottomBarKey(bayRowIndex);
        const tBayRowBar = super.getGeomObject(bayRowBarKey) as TBayRowBar;
        if (tBayRowBar) {
            tBayRowBar.tooltipText = tooltipText;
        }
    }

    addContainer(key: string, slot: ContainerBayItem, slotPadding: number, containerValidation: boolean, fontRate: number, allowDuplication: boolean) : void {
        if (super.getGeomObject(key)) return;

        try {
            let tCntr = undefined;
            const containerSize = this.getContainerSize(slot, slotPadding, containerValidation);
            let slotSizeGap = slotPadding * 2;
            tCntr = new TContainer(key, slot, containerSize.width, this._slotWidth - slotSizeGap, containerSize.height, this._zoomRate, fontRate);
            tCntr.enableResizable = false;
            tCntr.setLocation(this.getContainerLocation(slot, slotPadding, containerValidation));

            if (containerValidation) {
                const yBayRow = YardUtil.getBayRowIndexAtYAxis(this._viewType, slot.bay, slot.row);
                const tSlot = this.getSlot(yBayRow, slot.tier);
                if (tSlot) {
                    tCntr.visible = tSlot.visible;
                } else {
                    tCntr.visible = false;
                }
            }

            if (allowDuplication == false) {
                super.removeGeomObjectKey(key);
            }

            super.addGeomObjectBackground(tCntr, false);
            this.isChanged = true;
            DrawableUtil.calculateAncher(this, tCntr);
        } catch (ex) {
            throw ex;
        }
    }

    setContainerLocation(geomContainer: IBaseGeometry, pSlot: ContainerBayItem, slotPadding: number, containerValidation: boolean) : void {
        geomContainer.setLocation(this.getContainerLocation(pSlot, slotPadding, containerValidation));
    }

    private getContainerLocation(pSlot: ContainerBayItem, slotPadding: number, containerValidation: boolean) : Point {
        let rtnLocation = Point.empty();
        if (pSlot) {
            let pBayRow = YardUtil.getBayRowIndexAtYAxis(this._viewType, pSlot.bay, pSlot.row);
            if (this._viewType === ViewDirection.Side && pSlot.getOccupiedSlotCount() > 1 && this._bayRowDirection === HorizontalArrange.RightToLeft) {
                pBayRow = pBayRow + pSlot.getOccupiedSlotCount() - 1;
            }

            const slot = this.getSlot(pBayRow, pSlot.tier);
            let tempLocation;

            if (slot) {
                tempLocation = slot.getLocation();
            } else {
                tempLocation = this.getSlotLocation(pBayRow, pSlot.tier);
            }

            tempLocation = new Point(tempLocation.x + slotPadding, tempLocation.y + slotPadding);

            if (pSlot.ytLaneLocTypes !== YTLaneLocTypes.None) {
                let x = -1;
                if ((this._bayRowDirection === HorizontalArrange.LeftToRight && pSlot.ytLaneLocTypes === YTLaneLocTypes.Left) ||
                    (this._bayRowDirection === HorizontalArrange.RightToLeft && pSlot.ytLaneLocTypes === YTLaneLocTypes.Right)) {
                    x = this._leftMargin;
                } else if ((this._bayRowDirection === HorizontalArrange.LeftToRight && pSlot.ytLaneLocTypes === YTLaneLocTypes.Right) ||
                         (this._bayRowDirection === HorizontalArrange.RightToLeft && pSlot.ytLaneLocTypes === YTLaneLocTypes.Left)) {
                    let maxBayRow = -1;

                    if (this._bayRowDirection === HorizontalArrange.LeftToRight) {
                        maxBayRow = this._maxBayRow;
                    } else {
                        maxBayRow = 1;
                    }

                    const maxBayRowSlot = this.getSlot(maxBayRow, 1);
                    if (maxBayRowSlot) x = (maxBayRowSlot.getLocation().x + maxBayRowSlot.getSize().width + (this._slotGap * 2));
                }

                tempLocation = new Point(x, tempLocation.y);
            }

            rtnLocation = tempLocation;
        }
        return rtnLocation;
    }

    setContainerSize(geomContainer: IBaseGeometry, pSlot: ContainerBayItem, slotPadding: number, containerValidation: boolean) : void {
        geomContainer.setSize(this.getContainerSize(pSlot, slotPadding, containerValidation));
    }

    getContainerSize(pSlot: ContainerBayItem, slotPadding: number, containerValidation: boolean) : Size {
        let containerWidth = 0;
        let containerHeight = 0;
        const slotSizeGap = slotPadding * 2;
        const pBayRow = YardUtil.getBayRowIndex(this._viewType, pSlot.bay, pSlot.row);
        const tempWidth = this.getContainerWidth(pBayRow, pSlot.tier, pSlot);
        
        if (pSlot.ytLaneLocTypes !== YTLaneLocTypes.None) {
            containerWidth = this.getYTLaneWidth(pSlot.ytLaneLocTypes);
        } else {
            containerWidth = tempWidth - slotSizeGap;
        }

        containerHeight = this._slotHeight - slotSizeGap;
        return new Size(containerWidth, containerHeight);
    }

    getContainerLocationByWidth(pSlot: ContainerBayItem, slotPadding: number, containerValidation: boolean, displayWidth: number) : Point {
        if (pSlot.getOccupiedSlotCount() > YardConstant.MIN_OccupiedSlotCount) {
            return this.getContainerLocation_NEW(pSlot, slotPadding, containerValidation, displayWidth);
        }

        return this.getContainerLocation_OLD(pSlot, slotPadding, containerValidation);
    }

    getContainerLocation_NEW(pSlot: ContainerBayItem, slotPadding: number, containerValidation: boolean, displayWidth: number) : Point {
        let moveToLeft = 0;
        let moveX = 0;
        let moveY = 0;
        const slotLocGap = slotPadding;
        let pBayRow = YardUtil.getBayRowIndexAtYAxis(this._viewType, pSlot.bay, pSlot.row);
        const pTier = pSlot.tier;
        
        if (this._bayRowDirection === HorizontalArrange.RightToLeft) {
            moveToLeft = moveToLeft - (displayWidth - this._slotWidth);
            pBayRow = this._maxBayRow + 1 - pBayRow;
        }

        const ytLaneLWidth = this.getYTLaneWidth(YTLaneLocTypes.Left);
        const tierNoWidth = this.getTierNoSize().width + 8;
        moveX = (this._slotWidth + this._slotGap) * (pBayRow - 1) + this._leftMargin + moveToLeft;
        const title = super.getGeomObject("viewtitle");
        let titleHeight = 0;
        
        if (title) {
            titleHeight = title.getMBR().height;
        }

        moveY = (this._slotHeight + this._slotGap) * (this.passTier - pTier) + this._topMargin + titleHeight;
        moveX = moveX + this.getBufferSlotGap(pBayRow) + ytLaneLWidth + tierNoWidth;
        return new Point(moveX + slotLocGap, moveY + slotLocGap);
    }

    getContainerLocation_OLD(pSlot: ContainerBayItem, slotPadding: number, containerValidation: boolean) : Point {
        let moveToLeft = 0;
        let moveX = 0;
        let moveY = 0;
        const slotLocGap = slotPadding;
        if (this._viewType === ViewDirection.Side) {
            let cntrSize = (pSlot.sizeType.text.length === 0) ? pSlot.size.text : pSlot.sizeType.text;
            if (cntrSize.length === 0) cntrSize = "2";

            switch (cntrSize.substring(0, 1)) {
                case YardConstant.CNTR_SIZE_20: // 20
                    break;
                case YardConstant.CNTR_SIZE_30: // 30
                case YardConstant.CNTR_SIZE_40: // 40
                    if (this._bayRowDirection === HorizontalArrange.RightToLeft) {
                        moveToLeft = moveToLeft - (this._slotGap + this._slotWidth);
                    }
                    break;
                case YardConstant.CNTR_SIZE_45:
                case YardConstant.CNTR_SIZE_48:
                case YardConstant.CNTR_SIZE_L: // 45
                case YardConstant.CNTR_SIZE_M: // 48
                case YardConstant.CNTR_SIZE_P: // 53
                    if (pSlot.xBay !== 0 && pSlot.xBay !== pSlot.bay) {
                        if (pSlot.xBay < pSlot.bay) {
                            moveToLeft = -(this._slotWidth / 4 + this._slotGap);
                            if (this._bayRowDirection === HorizontalArrange.RightToLeft) {
                                moveToLeft = -(this._slotGap + this._slotWidth);
                            }
                        } else {
                            if (this._bayRowDirection === HorizontalArrange.RightToLeft) {
                                moveToLeft = -(this._slotWidth / 4 + this._slotGap);
                                moveToLeft = -(this._slotGap + this._slotWidth - moveToLeft);
                            }
                        }
                    } else {
                        if (this._bayRowDirection === HorizontalArrange.RightToLeft) {
                            moveToLeft = moveToLeft - (this._slotGap + this._slotWidth);
                        }
                    }
                    break;
                default: break;
            }
        }
        let pBayRow = YardUtil.getBayRowIndexAtYAxis(this._viewType, pSlot.bay, pSlot.row);
        const pTier = pSlot.tier;
        if (this._bayRowDirection === HorizontalArrange.RightToLeft) {
            pBayRow = this._maxBayRow + 1 - pBayRow;
        }

        const ytLaneLWidth = this.getYTLaneWidth(YTLaneLocTypes.Left);
        const tierNoWidth = this.getTierNoSize().width + 8;
        moveX = (this._slotWidth + this._slotGap) * (pBayRow - 1) + this._leftMargin + moveToLeft;
        const title = this.getGeomObject("viewtitle");
        let titleHeight = 0;
        if (title) {
            titleHeight = title.getMBR().height;
        }
        moveY = (this._slotHeight + this._slotGap) * (this.passTier - pTier) + this._topMargin + titleHeight;
        moveX = moveX + this.getBufferSlotGap(pBayRow) + ytLaneLWidth + tierNoWidth;
        return new Point(moveX + slotLocGap, moveY + slotLocGap);
    }

    private getContainerWidth(pBayRow: number, pTier: number, pSlot: ContainerBayItem) : number {
        if (pSlot.getOccupiedSlotCount() > YardConstant.MIN_OccupiedSlotCount) {
            return this.getContainerWidth_NEW(pBayRow, pTier, pSlot);
        }
        return this.getContainerWidth_OLD(pBayRow, pTier, pSlot);
    }

    private getContainerWidth_NEW(pBayRow: number, pTier: number, pSlot: ContainerBayItem) : number {
        let tempWidth = this._slotWidth;
        if (this._viewType === ViewDirection.Side) {
            const occupiedSlotCount = pSlot.getOccupiedSlotCount();
            const realWidth = (this._slotWidth * occupiedSlotCount) + (this._slotGap * (occupiedSlotCount - 1));
            tempWidth = realWidth;
        }
        return tempWidth;
    }

    private getContainerWidth_OLD(pBayRow: number, pTier: number, pSlot: ContainerBayItem) : number {
        let tempWidth = this._slotWidth;
        if (this._viewType == ViewDirection.Side) {
            let nosVoid = 2;
            let cntrSize = (pSlot.sizeType.text.length == 0) ? pSlot.size.text : pSlot.sizeType.text;
            if (cntrSize.length == 0) cntrSize = YardConstant.CNTR_SIZE_20;
            switch (cntrSize.substring(0, 1)) {
                case YardConstant.CNTR_SIZE_20: // 20
                    tempWidth = this._slotWidth;
                    break;
                case YardConstant.CNTR_SIZE_30: // 30
                case YardConstant.CNTR_SIZE_40: // 40
                    tempWidth = this._slotWidth * 2 + this._slotGap;
                    break;
                case YardConstant.CNTR_SIZE_45:
                case YardConstant.CNTR_SIZE_48:
                case YardConstant.CNTR_SIZE_L: // 45
                case YardConstant.CNTR_SIZE_M: // 48
                case YardConstant.CNTR_SIZE_P: // 53
                    if (pSlot.xBay !== 0 && pSlot.xBay !== pSlot.bay) {
                        tempWidth = this._slotWidth * 2.25 + this._slotGap * 2;
                    } else {
                        if (this._blockDefine) nosVoid = (this._blockDefine.getBayList().get(pSlot.bay) as BayItem).nosVoid;
                        tempWidth = this._slotWidth * nosVoid + this._slotGap * (nosVoid - 1);
                    }
                    break;
                default: tempWidth = this._slotWidth; break;
            }
        }
        return tempWidth;
    }

    addSpreader(viewDir: ViewDirection, item: SpreaderItem) : void {
        let spreader = this.getGeomObject(item.name) as TSpreader;
        if (spreader) {
            if (viewDir === ViewDirection.Front) {
                item.size = 20;
            }

            spreader = new TSpreader(item);
            const isResizeYTLaneWidth = this.isResizeYTLaneWidth(spreader.ytLaneLocTypes, YTLaneLocTypes.None, spreader.ytLaneLocTypes, spreader.spreaderSize);
            spreader.ytLaneLocTypes = item.ytLaneLocTypes;
            spreader.bay = item.bayIndex;
            spreader.row = item.rowIndex;
            spreader.tier = item.tierIndex;
            super.addGeomObject(spreader);
            this.isChanged = true;

            if (isResizeYTLaneWidth) {
                if (spreader.ytLaneLocTypes === YTLaneLocTypes.Left || spreader.ytLaneLocTypes === YTLaneLocTypes.Right) {
                    this.resetTitle();
                    this.resetSlots();
                    if (this._visibleCraneButton) {
                        this.resetCraneButton();
                    }

                    if (this._visibleCloseButton) {
                        this.resetCloseButton();
                    }
                    this.resetBottomBar();
                    this.resetTierNo();
                    this.resetBayRowNo();

                    if (this._visibleAccessDirection) {
                        this.resetAccessDirection();
                    }

                    if (this.resetContainerEvent.isEmpty() === false) {
                        this.resetContainerEvent.doEvent();
                    }
                }

                super.updateMBR();
            }

            this.locateSpreader(spreader, viewDir, item.bayIndex, item.rowIndex, item.tierIndex, item.ytLaneLocTypes);
            spreader.tooltipText = item.tooltipValue;
            
            if (isResizeYTLaneWidth) {
                if (spreader.ytLaneLocTypes === YTLaneLocTypes.Right) {
                    this.padding.right = (this._slotGap * 2);
                    super.updateMBR();
                }
            }
        }
        return;
    }

    removeSpreader(spreaderName: string) : void {
        const spreader = this.getGeomObject(spreaderName) as TSpreader;
        
        if (spreader) {
            this.removeGeomObject(spreader);
            this.isChanged = true;
            
            if (spreader.ytLaneLocTypes === YTLaneLocTypes.Left || spreader.ytLaneLocTypes === YTLaneLocTypes.Right) {
                const isResizeYTLaneLWidth = this.isResizeYTLaneWidth(YTLaneLocTypes.Left, YTLaneLocTypes.None, spreader.ytLaneLocTypes, spreader.spreaderSize);
                const isResizeYTLaneRWidth = this.isResizeYTLaneWidth(YTLaneLocTypes.Right, YTLaneLocTypes.None, spreader.ytLaneLocTypes, spreader.spreaderSize);
                
                if (isResizeYTLaneLWidth || isResizeYTLaneRWidth) {
                    this.resetTitle();
                    this.resetSlots();
                    if (this._visibleCraneButton) {
                        this.resetCraneButton();
                    }

                    if (this._visibleCloseButton) {
                        this.resetCloseButton();
                    }

                    this.resetBottomBar();
                    this.resetTierNo();
                    this.resetBayRowNo();
                    if (this._visibleAccessDirection) {
                        this.resetAccessDirection();
                    }

                    if (this.resetContainerEvent.isEmpty() === false) {
                        this.resetContainerEvent.doEvent();
                    }

                    if (isResizeYTLaneRWidth) {
                        this.padding.right = (this._slotGap * 2) + this.getYTLaneWidth(YTLaneLocTypes.Right);
                    }

                    super.updateMBR();
                }
            }
        }
        return;
    }

    moveSpreader(viewDir: ViewDirection, spreaderName: string, bay: number, row: number, tier: number, spreaderYTLaneType: YTLaneLocTypes) : void {
        const spreader = this.getGeomObject(spreaderName) as TSpreader;
        
        if (spreader) {
            let isResizeYTLaneLWidth = false;
            let isResizeYTLaneRWidth = false;
            const beforeSpreaderYTLaneType = spreader.ytLaneLocTypes;
            if (spreaderYTLaneType === YTLaneLocTypes.Left) {
                isResizeYTLaneLWidth = this.isResizeYTLaneWidth(YTLaneLocTypes.Left, spreader.ytLaneLocTypes, spreaderYTLaneType, spreader.spreaderSize);
            } else if (spreaderYTLaneType === YTLaneLocTypes.Right) {
                isResizeYTLaneRWidth = this.isResizeYTLaneWidth(YTLaneLocTypes.Right, spreader.ytLaneLocTypes, spreaderYTLaneType, spreader.spreaderSize);
            }

            spreader.ytLaneLocTypes = spreaderYTLaneType;
            if (beforeSpreaderYTLaneType === YTLaneLocTypes.Left) {
                isResizeYTLaneLWidth = this.isResizeYTLaneWidth(YTLaneLocTypes.Left, beforeSpreaderYTLaneType, spreaderYTLaneType, spreader.spreaderSize);
            } else if (beforeSpreaderYTLaneType === YTLaneLocTypes.Right) {
                isResizeYTLaneRWidth = this.isResizeYTLaneWidth(YTLaneLocTypes.Right, beforeSpreaderYTLaneType, spreaderYTLaneType, spreader.spreaderSize);
            }

            if (isResizeYTLaneLWidth || isResizeYTLaneRWidth) {
                this.resetTitle();
                this.resetSlots();
                
                if (this._visibleCraneButton) {
                    this.resetCraneButton();
                }

                if (this._visibleCloseButton) {
                    this.resetCloseButton();
                }

                this.resetBottomBar();
                this.resetTierNo();
                this.resetBayRowNo();

                if (this._visibleAccessDirection) {
                    this.resetAccessDirection();
                }

                if (this.resetContainerEvent.isEmpty() === false) {
                    this.resetContainerEvent.doEvent();
                }
            }

            this.locateSpreader(spreader, viewDir, bay, row, tier, spreaderYTLaneType);

            if (this.spreaderMoveEvent.isEmpty() === false) {
                const info = new SpreaderMoveInfo();
                info.containerNo = spreader.lockedContainerNo;
                info.prevBay = spreader.bay;
                info.prevRow = spreader.row;
                info.prevTier = spreader.tier;
                info.prevSpreaderYTLaneLocTypes = beforeSpreaderYTLaneType;
                info.newBay = bay;
                info.newRow = row;
                info.newTier = tier;
                info.locked = spreader.getLocked();
                info.spreaderName = spreader.name;
                info.spreaderYTLaneLocTypes = spreaderYTLaneType;
                this.spreaderMoveEvent.doEvent(info);
            }

            spreader.bay = bay;
            spreader.row = row;
            spreader.tier = tier;
            if (isResizeYTLaneLWidth || isResizeYTLaneRWidth) {
                if (isResizeYTLaneRWidth) {
                    const maxSpreaderSizeInYTLaneR = this.getMaxSpreaderSizeInYTLane(YTLaneLocTypes.Right);
                    const defaultSpreaderSize = 20;
                    this.padding.right = this._slotGap * 2;

                    if (spreaderYTLaneType === YTLaneLocTypes.Right) {
                        if (maxSpreaderSizeInYTLaneR < defaultSpreaderSize) {
                            this.padding.right += this.getSpreaderWidth(defaultSpreaderSize) - this.getSpreaderWidth(maxSpreaderSizeInYTLaneR);
                        }
                    } else {
                        if (maxSpreaderSizeInYTLaneR < defaultSpreaderSize) {
                            this.padding.right += this.getSpreaderWidth(defaultSpreaderSize) - this.getSpreaderWidth(maxSpreaderSizeInYTLaneR);
                        }
                    }
                }

                super.updateMBR();
            }
        }
        return;
    }
    
    moveSpreaderToTop(spreaderName: string) : void {
        const spreader = this.getGeomObject(spreaderName) as TSpreader;
        if (spreader) {
            this.moveToIndex(spreader, 0);
        }

        this.isChanged = true;
        return;
    }

    private locateSpreader(spreader: TSpreader, viewDir: ViewDirection, slotBay: number, slotRow: number, slotTier: number, spreaderYTLaneLocTypes: YTLaneLocTypes) : void {
        if (spreader) {
            let bayRow = -1;
            if (viewDir == ViewDirection.Front) {
                bayRow = slotRow;
            } else if (viewDir == ViewDirection.Side) {
                bayRow = slotBay;
            }

            let location = Point.empty();
            let size = Size.empty();
            if (spreaderYTLaneLocTypes == YTLaneLocTypes.None) {
                const slot = this.getSlot(bayRow, slotTier);
                if (slot) {
                    location = slot.getLocation();
                    size = slot.getSize();
                }
            } else {
                let x  = -1;
                if ((this._bayRowDirection === HorizontalArrange.LeftToRight && spreaderYTLaneLocTypes === YTLaneLocTypes.Left) ||
                    (this._bayRowDirection === HorizontalArrange.RightToLeft && spreaderYTLaneLocTypes === YTLaneLocTypes.Right)) {
                    x = this._leftMargin;
                } else if ((this._bayRowDirection === HorizontalArrange.LeftToRight && spreaderYTLaneLocTypes === YTLaneLocTypes.Right) ||
                         (this._bayRowDirection === HorizontalArrange.RightToLeft && spreaderYTLaneLocTypes === YTLaneLocTypes.Left)) {
                    let maxBayRow = -1;
                    if (this._bayRowDirection === HorizontalArrange.LeftToRight) {
                        maxBayRow = this._maxBayRow;
                    } else {
                        maxBayRow = 1;
                    }

                    const maxBayRowSlot = this.getSlot(maxBayRow, 1);
                    if (maxBayRowSlot) x = (maxBayRowSlot.getLocation().x + maxBayRowSlot.getSize().width + (this._slotGap * 2));
                }

                location = new Point(x, this.getSlotLocationY(slotTier));
                size = new Size(this.getSpreaderWidth(spreader.spreaderSize), this._slotHeight);
            }

            spreader.setComponent(location, size, this._slotGap);
            this.isChanged = true;
            spreader.updateMBR();
            this.moveToIndex(spreader, 0);
        }

        return;
    }

    setSpreaderSize(viewDir: ViewDirection, spreaderName: string, size: number) : void {
        const spreader = this.getGeomObject(spreaderName) as TSpreader;
        if (spreader) {
            const isResizeYTLaneWidth = this.isResizeYTLaneWidth(spreader.ytLaneLocTypes, YTLaneLocTypes.None, spreader.ytLaneLocTypes, size);
            spreader.spreaderSize = size;
            this.locateSpreader(spreader, viewDir, spreader.bay, spreader.row, spreader.tier, spreader.ytLaneLocTypes);
            
            if (isResizeYTLaneWidth) {
                if (spreader.ytLaneLocTypes === YTLaneLocTypes.Left || spreader.ytLaneLocTypes === YTLaneLocTypes.Right) {
                    this.resetTitle();
                    this.resetSlots();
                    
                    if (this._visibleCraneButton) {
                        this.resetCraneButton();
                    }

                    if (this._visibleCloseButton) {
                        this.resetCloseButton();
                    }

                    this.resetBottomBar();
                    this.resetTierNo();
                    this.resetBayRowNo();

                    if (this._visibleAccessDirection) {
                        this.resetAccessDirection();
                    }

                    if (this.resetContainerEvent.isEmpty() === false) {
                        this.resetContainerEvent.doEvent();
                    }
                }

                if (spreader.ytLaneLocTypes === YTLaneLocTypes.Right) {
                    this.padding.right = (this._slotGap * 2);
                    const maxSpreaderSizeInYTLaneR = this.getMaxSpreaderSizeInYTLane(YTLaneLocTypes.Right);
                    const defaultSpreaderSize = 20;
                    if (maxSpreaderSizeInYTLaneR < defaultSpreaderSize) {
                        this.padding.right += this.getSpreaderWidth(defaultSpreaderSize) - this.getSpreaderWidth(maxSpreaderSizeInYTLaneR);
                    }
                }

                super.updateMBR();
                this.isChanged = true;
            }
        }
        return;
    }

    getLockedContainerNo(spreaderName: string) : string {
        let containerNo = "";
        const spreader = this.getGeomObject(spreaderName) as TSpreader;
        if (spreader) {
            containerNo = spreader.lockedContainerNo;
        }

        return containerNo;
    }

    getTitleLeftMargin(): number {
        return this._leftMargin + this.getYTLaneWidth(YTLaneLocTypes.Left) + this.getTierNoSize().width + 8;
    }

    getAnyChassisTopTierTopSide(): TChassis | undefined  {
        return this.getAnyChassis(this._maxTier, ChassisDisplayPosition.Top);
    }

    getAnyChassisBottomTierBottomSide(): TChassis | undefined {
        return this.getAnyChassis(1, ChassisDisplayPosition.Bottom);
    }

    moveTitleChassisTopSide(topSideChassis: TChassis) : void {
        let titleObj = undefined;
        let chassisGap = 0;
        let originTitleLocation = Point.empty();
        let shouldMoveTitle = false;
        let moveY = 0;
        let movedLocation = Point.empty();
        let bayRowGroup = undefined;
        try {
            titleObj = this.getTitleObject();
            if (titleObj === undefined) return;
            chassisGap = this._bayProperty.chassisGap;
            originTitleLocation = this.getTitleDefaultLocation();
            shouldMoveTitle = titleObj.getLocation().y + titleObj.getSize().height !== topSideChassis.getLocation().y;
            if (shouldMoveTitle) {
                moveY = topSideChassis.getSize().height + chassisGap;
                this._titleMoveY = moveY;
                movedLocation = new Point(titleObj.getLocation().x, titleObj.getLocation().y - moveY);
                titleObj.setLocation(movedLocation);
                this.moveContainsAllGeometry(0, moveY);
                if (this.parentGeometry instanceof TBayRowGroup) {
                    bayRowGroup = this.parentGeometry as TBayRowGroup;
                    bayRowGroup.updateMBR();
                }
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    resetTitleChassisTopSide(moveY: number) : void {
        const titleObj = this.getTitleObject();
        const chassis = this.getAnyChassisTopTierTopSide();
        if (chassis !== undefined) return;
        if (titleObj === undefined) return;
        titleObj.setLocation(new Point(titleObj.getLocation().x, titleObj.getLocation().y + moveY));
        this.moveContainsAllGeometry(0, - moveY);
        this._titleMoveY = 0;
    }

    moveContainsAllGeometry(x: number, y: number) : void {
        const geoms = this.getGeometryAll();
        let bayRowGroup = undefined;
        let parentGeoms = undefined;

        for(let geom of geoms) {
            geom.setLocation(new Point(geom.getLocation().x + x, geom.getLocation().y + y));
        }

        if (this.parentGeometry instanceof TBayRowGroup) {
            bayRowGroup = this.parentGeometry as TBayRowGroup;
            parentGeoms = bayRowGroup.getGeomList();
            for (let parentGeom of parentGeoms) {
                if (parentGeom !== this) {
                    parentGeom.setLocation(new Point(parentGeom.getLocation().x + x, parentGeom.getLocation().y + y));
                }
            }
        }

        if (Point.isEmpty(this.getLocation())) {
            this.setLocation(new Point(0, 0));
        }

        this.updateMBR();
    }


    private getAnyChassis(tier: number, chassisDisplayPosition: ChassisDisplayPosition): TChassis | undefined {
        let rtnChassis = undefined;
        const chassisList = this.getGeomListByMember("TChassis");

        for (let item of chassisList) {
            const chassis = item as TChassis;
            const isTopSide = chassis.getDwItem().displayPosition === chassisDisplayPosition;
            const isTopTier = chassis.getDwItem().tier === tier;

            if (isTopSide && isTopTier) {
                rtnChassis = chassis;
                break;
            }
        }

        return rtnChassis;
    }

    isSelectedSlot(bay: number, row: number, tier: number): boolean {
        let isSelectedSlot = false;
        const bayRowIndex = YardUtil.getBayRowIndexAtYAxis(this._viewType, bay, row);
        const markList = this.getGeomListByMember("TSelectionMark") as TSelectionMark[];

        for (let mark of markList) {
            if (mark.isContainSlot(bayRowIndex, tier)) {
                isSelectedSlot = true;
                break;
            }
        }

        return isSelectedSlot;
    }

    getOccupiedSlotCount(bay: number, row: number, tier: number): number {
        let occupiedSlotCount = 0;
        const bayRowIndex = YardUtil.getBayRowIndexAtYAxis(this._viewType, bay, row);
        const markList = this.getGeomListByMember("TSelectionMark") as TSelectionMark[];

        for (let mark of markList) {
            if (mark.getBayRowIndex() === bayRowIndex) {
                occupiedSlotCount = mark.getOccupiedSlotCount();
                break;
            }
        }

        return occupiedSlotCount;
    }

    drawDetail(ctx: CanvasRenderingContext2D, pageScale: number, canvasBoundary: Rectangle, isMemoryCache: boolean): void {
        super.drawDetail(ctx, pageScale, canvasBoundary, isMemoryCache);
        this.drawCntrOuterSideSymbol(ctx);
    }

    private drawCntrOuterSideSymbol(ctx: CanvasRenderingContext2D): void {
        const cntrList = this.getGeomListByMember("TContainer") as TContainer[];
        if (cntrList.length > 0) {
            for (let item of cntrList) {
                item.drawOuterSideSymbol(ctx);
            }
        }
    }
}

export default TBay;
export { TCraneButton };