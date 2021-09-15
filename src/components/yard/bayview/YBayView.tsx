import React,{ RefObject } from "react"
import { TEvent } from "../../../common"
import MouseButtons from "../../../common/structures/MouseButtons"
import DrawArea from "../../../drawing/DrawArea"
import DrawText from "../../../drawing/elements/DrawText"
import IBaseGeometry from "../../../drawing/elements/IBaseGeometry"
import IDrawableGeometry from "../../../drawing/elements/IDrawableGeometry"
import DrawCanvasEventArgs from "../../../drawing/events/DrawCanvasEventArgs"
import { Color, FontStyles, Padding, Point, Rectangle, Size, ZoomType } from "../../../drawing/structures"
import ArrangeDirection from "../../../drawing/structures/ArrangeDirection"
import GeneralLogger from "../../../logger/GeneralLogger"
import DrawableUtil from "../../../utils/DrawableUtil"
import FontUtil from "../../../utils/FontUtil"
import SearchUtil from "../../../utils/SearchUtil"
import TCloseButton from "../../common/button/TCloseButton"
import ContainerHandler from "../../common/equipments/ContainerHandler"
import EquipmentHandler from "../../common/equipments/EquipmentHandler"
import BoundaryEventArgs from "../../common/events/BoundaryEventArgs"
import ChassisDisplayEventArgs from "../../common/events/ChassisDisplayEventArgs"
import ChassisGuideEventArgs from "../../common/events/ChassisGuideEventArgs"
import SlotClickEventArgs from "../../common/events/SlotClickEventArgs"
import SlotDragEventArgs from "../../common/events/SlotDragEventArgs"
import YardBayRowBarEventArgs from "../../common/events/YardBayRowBarEventArgs"
import YardBayRowNoEventArgs from "../../common/events/YardBayRowNoEventArgs"
import BayItem from "../../common/items/BayItem"
import BlockItem from "../../common/items/BlockItem"
import BlockItemList from "../../common/items/BlockItemList"
import ChassisDisplayItem from "../../common/items/ChassisDisplayItem"
import ContainerBayItem from "../../common/items/ContainerBayItem"
import EquipmentSideItem from "../../common/items/EquipmentSideItem"
import RowItem from "../../common/items/RowItem"
import TerminalItem from "../../common/items/TerminalItem"
import YardBayRowNoSelectItem from "../../common/items/YardBayRowNoSelectItem"
import YardDisplayItem from "../../common/items/YardDisplayItem"
import YSlotItem from "../../common/items/YSlotItem"
import BaseBoundaryHandler from "../../common/plan/BaseBoundaryHandler"
import BoundaryMode from "../../common/structures/BoundaryMode"
import ChassisDisplayPosition from "../../common/structures/ChassisDisplayPosition"
import { YesNo } from "../../common/structures/CTBizConstant"
import DirectionPriority from "../../common/structures/DirectionPriority"
import HorizontalDirection from "../../common/structures/HorizontalDirection"
import ObjectSelectionEventType from "../../common/structures/ObjectSelectionEventType"
import TierType from "../../common/structures/TierType"
import VerticalDirection from "../../common/structures/VerticalDirection"
import ViewDirection from "../../common/structures/ViewDirection"
import YTLaneLocTypes from "../../common/structures/YTLaneLocTypes"
import IGeomMarking from "../../shipplan/IGeomMarking"
import { MarkingTypes } from "../../shipplan/structures"
import BlockLockType from "../../shipplan/structures/BlockLockType"
import BaseBayView, { EquipmentEventHandler } from "../BaseBayView"
import HorizontalArrange from "../structures/HorizontalArrange"
import YardUtil from "../utils/YardUtil"
import BoundaryHandler from "./handler/BoundaryHandler"
import DragSelectedHandler from "./handler/DragSelectedHandler"
import YBayViewEventHelper from "./handler/YBayViewEventHelper"
import TBay, { TCraneButton } from "./TBay"
import TBayProperty from "./TBayProperty"
import TBayRowBar from "./TBayRowBar"
import TBayRowGroup from "./TBayRowGroup"
import TBayRowNo from "./TBayRowNo"
import TChassis from "./TChassis"
import TChassisGuide from "./TChassisGuide"
import TContainer from "./TContainer"
import TSelectionMarkProperty from "./TSelectionMarkProperty"
import TSlot from "./TSlot"

type SlotEventHandlerDelegate = (sender: any, args: SlotClickEventArgs) => void;
type SlotDragHandlerDelegate = (sender: any, args: SlotDragEventArgs) => void;
type BoundaryEventHandlerDelegate = (sender: any, args: BoundaryEventArgs) => void;
type BayRowNoEventHandlerDelegate = (sender: any, args: YardBayRowNoEventArgs) => void;
type BayRowBarEventHandlerDelegate = (sender: any, args: YardBayRowBarEventArgs) => void;
type ChassisEventHandlerDelegate = (sender: any, args: ChassisDisplayEventArgs) => void;
type ChassisGuideEventHandlerDelegate = (sender: any, args: ChassisGuideEventArgs) => void;

class SlotEventHandler extends TEvent {
    protected events: SlotEventHandlerDelegate[] = [];
    addEvent(eventHandler: SlotEventHandlerDelegate): void {
        this.events.push(eventHandler);
    }

    removeEvent(eventHandler: SlotEventHandlerDelegate): void {
        if (this.isEmpty()) return;
        this.events.splice(this.events.indexOf(eventHandler), 1);
    }

    doEvent(sender: any, args: SlotClickEventArgs): void {
        this.events.forEach(eventHandler => {
            eventHandler(sender, args);
        });
    }
}

class SlotDragHandler extends TEvent {
    protected events: SlotDragHandlerDelegate[] = [];
    addEvent(eventHandler: SlotDragHandlerDelegate): void {
        this.events.push(eventHandler);
    }

    removeEvent(eventHandler: SlotDragHandlerDelegate): void {
        if (this.isEmpty()) return;
        this.events.splice(this.events.indexOf(eventHandler), 1);
    }

    doEvent(sender: any, args: SlotDragEventArgs): void {
        this.events.forEach(eventHandler => {
            eventHandler(sender, args);
        });
    }
}

class BoundaryEventHandler extends TEvent {
    protected events: BoundaryEventHandlerDelegate[] = [];
    addEvent(eventHandler: BoundaryEventHandlerDelegate): void {
        this.events.push(eventHandler);
    }

    removeEvent(eventHandler: BoundaryEventHandlerDelegate): void {
        if (this.isEmpty()) return;
        this.events.splice(this.events.indexOf(eventHandler), 1);
    }

    doEvent(sender: any, args: BoundaryEventArgs): void {
        this.events.forEach(eventHandler => {
            eventHandler(sender, args);
        });
    }
}

class BayRowNoEventHandler extends TEvent {
    protected events: BayRowNoEventHandlerDelegate[] = [];
    addEvent(eventHandler: BayRowNoEventHandlerDelegate): void {
        this.events.push(eventHandler);
    }

    removeEvent(eventHandler: BayRowNoEventHandlerDelegate): void {
        if (this.isEmpty()) return;
        this.events.splice(this.events.indexOf(eventHandler), 1);
    }

    doEvent(sender: any, args: YardBayRowNoEventArgs): void {
        this.events.forEach(eventHandler => {
            eventHandler(sender, args);
        });
    }
}

class BayRowBarEventHandler extends TEvent {
    protected events: BayRowBarEventHandlerDelegate[] = [];
    addEvent(eventHandler: BayRowBarEventHandlerDelegate): void {
        this.events.push(eventHandler);
    }

    removeEvent(eventHandler: BayRowBarEventHandlerDelegate): void {
        if (this.isEmpty()) return;
        this.events.splice(this.events.indexOf(eventHandler), 1);
    }

    doEvent(sender: any, args: YardBayRowBarEventArgs): void {
        this.events.forEach(eventHandler => {
            eventHandler(sender, args);
        });
    }
}

class ChassisEventHandler extends TEvent {
    protected events: ChassisEventHandlerDelegate[] = [];
    addEvent(eventHandler: ChassisEventHandlerDelegate): void {
        this.events.push(eventHandler);
    }

    removeEvent(eventHandler: ChassisEventHandlerDelegate): void {
        if (this.isEmpty()) return;
        this.events.splice(this.events.indexOf(eventHandler), 1);
    }

    doEvent(sender: any, args: ChassisDisplayEventArgs): void {
        this.events.forEach(eventHandler => {
            eventHandler(sender, args);
        });
    }
}

class ChassisGuideEventHandler extends TEvent {
    protected events: ChassisGuideEventHandlerDelegate[] = [];
    addEvent(eventHandler: ChassisGuideEventHandlerDelegate): void {
        this.events.push(eventHandler);
    }

    removeEvent(eventHandler: ChassisGuideEventHandlerDelegate): void {
        if (this.isEmpty()) return;
        this.events.splice(this.events.indexOf(eventHandler), 1);
    }

    doEvent(sender: any, args: ChassisGuideEventArgs): void {
        this.events.forEach(eventHandler => {
            eventHandler(sender, args);
        });
    }
}

class YBayView extends BaseBayView {
    equipmentClicked = new EquipmentEventHandler();
    viewClick = new SlotEventHandler();
    viewDoubleClick = new SlotEventHandler();
    viewMouseMove = new SlotEventHandler();
    bayAdded = new SlotEventHandler();
    bayRemoved = new SlotEventHandler();
    closeButtonClick = new SlotEventHandler();
    craneButtonClick = new SlotEventHandler();
    viewMouseBoundary = new SlotDragHandler();
    bayRowNoClick = new BayRowNoEventHandler();
    bayRowNoDragSelect = new BayRowNoEventHandler();
    bayRowBarClick = new BayRowBarEventHandler();
    slotDraggingSelected = new SlotDragHandler();
    boundaryClicked = new BoundaryEventHandler();
    chassisClicked = new ChassisEventHandler();
    chassisGuideClicked = new ChassisGuideEventHandler();

    private _drawAreaRef: RefObject<DrawArea>;
    protected _zoomRate = 1;
    protected _fontRate = 0.5;
    protected _bayRowList : TBayRowGroup[] = [];
    protected _slotDragVDirection = 0;
    protected _slotDragHDirection = 0;
    protected _slotDragPriority = DirectionPriority.Horizontal;
    protected _bayDragPriority = DirectionPriority.Horizontal;
    protected _zoomRatio = 100;
    protected _font = 0;
    protected _slotWidth = 0;
    protected _slotHeight = 0;
    protected _slotGap = 0;
    protected _block = "";
    protected _bayRow = 0
    protected _tierNoFontSize = 12
    protected _bayRowNoFontSize = 12
    protected _fixedBayRowTierFontSize = true
    protected _visibleTitle = true
    protected _visibleSlotCargoType = false
    protected _visibleRowTierSlotCargoType = false
    protected _containerValidation = false
    protected _bayProperty = new TBayProperty()
    protected _boundaryHandler?: BoundaryHandler;
    protected _visibleBoundary = false;
    protected _evtMakeHelper = new YBayViewEventHelper();
    protected _visibleEquipment = false;
    private _equipmentHandler? : EquipmentHandler;
    private _containerHandler? : ContainerHandler;
    private _terminalItem = new TerminalItem();
    private _shouldRefreshBounds = false
    private _allowScrollTitle = false
    private _canSort = false
    
    allowMultiSelection = false;
    slotDragPriority = DirectionPriority.Vertical;
    slotDragHDirection = HorizontalDirection.LeftToRight;
    slotDragVDirection = VerticalDirection.UpToDown;
    yardDefine? : BlockItemList;
    visibleAccessDirection = false;
    visibleCloseButton = false;
    visibleCraneButton = false;
    applySlotCPO = true;
    applyBayLock = true;
    tierType = TierType.MaxTier;
    blockLockType = BlockLockType.BayOrRow;
    totalQty = "";
    objectSelectionEventType = ObjectSelectionEventType.MouseClick;

    constructor(props: any) {
        super(props)
        this._drawAreaRef = React.createRef();

        this._terminalItem.berthDir = "RT";
        this._terminalItem.emptyChar = "E";
        this._terminalItem.height = 600;
        this._terminalItem.layoutAxis = "RT";
        this._terminalItem.length = 1300;
        this._terminalItem.port = "KRPUS";
        this._terminalItem.qcCoverageByBitt = "Y";
        this._terminalItem.strgVsl = "STRG";
        this._terminalItem.tmnlCD = "HJNC";
        this._terminalItem.tmnlName = "HANJIN BUSAN NEWPORT CO.";
        this._terminalItem.unSegregationChk = "Y";
        this._terminalItem.useYSlotUsage = "Y";
    }

    componentDidMount() {
        const drawArea = this._drawAreaRef.current;
        if (drawArea) {
            super.setDrawArea(drawArea);
            drawArea.setWidth(1300);
            drawArea.setHeight(1024);
            drawArea.isDrawableObjectResize = true;
            drawArea.isDrawableObjectMove = true;
            drawArea.isDrawableObjectMouseOver = true;
            drawArea.setArrangeDirection(ArrangeDirection.None);
            drawArea.arrangeFixCount = 2;
            this.addEventHandler();
        }
    }

    setTerminalItem(terminalItem: TerminalItem): void {
        this._terminalItem = terminalItem;
    }

    preprocess_Paint(): void {
        if (this._canSort) {
            const list = this.getDrawArea().getDefaultDrawList().getDrawList();
            list.sort((x1: IDrawableGeometry, x2: IDrawableGeometry) => {
                const bay1 = x1 as TBay;
                const bay2 = x2 as TBay;
                if (bay1.sortIndex > bay2.sortIndex) return -1;
                if (bay1.sortIndex == bay2.sortIndex) return 0;
                if (bay1.sortIndex < bay2.sortIndex) return 1;

                return -1;
            });

            this._canSort = false;
        }

        if (this._allowScrollTitle) {
            this.moveBayTitleLocXWithRefresh();
        }

        this.getDrawArea().arrangeDrawObject(true);
    }

    getAllowScrollTitle(): boolean {
        return this._allowScrollTitle;
    }

    setAllowScrollTitle(allowScrollTitle: boolean): void {
        if (this._allowScrollTitle !== allowScrollTitle) {
            this._allowScrollTitle = allowScrollTitle;

            if (allowScrollTitle) {
                this._shouldRefreshBounds = false;
                this.moveBayTitleLocXWithRefresh();
            } else {
                this.resetAllTBayTitleLocX();
                this.getDrawArea().refresh();
            }
        }
    }

    getZoomRatio(): number {
        return this._zoomRatio;
    }

    setZoomRatio(zoomRatio: number): void {
        this._zoomRatio = zoomRatio;
        this._zoomRate = this._zoomRatio / 100;
        this._slotWidth = 100 * this._zoomRate + 0.5;
        this._slotHeight = 100 * this._zoomRate + 0.5;
        this._slotGap = (3 * this._zoomRate + 0.5 < 2) ? 2 : 3 * this._zoomRate + 0.5;
        this.setArrangeTopMargin((this.getDrawArea().arrangeTopMargin * this._zoomRate + 0.5 < 15) ? 15 : this.getDrawArea().arrangeTopMargin * this._zoomRate + 0.5);
        this.setArrangeLeftMargin((this.getDrawArea().arrangeLeftMargin * this._zoomRate + 0.5 < 10) ? 10 : this.getDrawArea().arrangeLeftMargin * this._zoomRate + 0.5);
    }

    setFont(fontSize: number): void {
        this._font = fontSize;
        this._fontRate = fontSize / 5;
    }

    setVisibleSlotCargoType(visibleSlotCargoType: boolean): void {
        if (visibleSlotCargoType) {
            this._visibleRowTierSlotCargoType = false;
        }

        this._visibleSlotCargoType = visibleSlotCargoType;
    }

    setVisibleRowTierSlotCargoType(visibleRowTierSlotCargoType: boolean): void {
        if (visibleRowTierSlotCargoType) {
            this._visibleSlotCargoType = false;
        }

        this._visibleRowTierSlotCargoType = visibleRowTierSlotCargoType;
    }

    getBaseBoundaryHandler(): BaseBoundaryHandler {
        if (!this._boundaryHandler) {
            this._boundaryHandler = new BoundaryHandler(this);
        }

        return this._boundaryHandler
    }

    getBlockEquipmentHandler(): EquipmentHandler {
        if (!this._equipmentHandler) {
            this._equipmentHandler = new EquipmentHandler(this);
        }

        return this._equipmentHandler
    }

    getVisibleWheelDeck(): boolean {
        return this._bayProperty.visibleWheelDeck;
    }

    setVisibleWheelDeck(visibleWheelDeck: boolean): void {
        this._bayProperty.visibleWheelDeck = visibleWheelDeck;
    }

    getChassisGap(): number {
        return this._bayProperty.chassisGap;
    }

    setChassisGap(chassisGap: number): void {
        this._bayProperty.chassisGap = chassisGap;
    }

    getVisibleBoundary(): boolean {
        return this._visibleBoundary;
    }

    setVisibleBoundary(visible: boolean): void {
        this._visibleBoundary = visible;
        this.getBaseBoundaryHandler().setVisibleBoundary(visible);
    }

    getVisibleEquipment(): boolean {
        return this._visibleEquipment;
    }

    setVisibleEquipment(visible: boolean): void {
        this._visibleEquipment = visible;
        this.getBaseBoundaryHandler().setVisibleBoundary(visible);
        this.getDrawArea().arrangeDrawObject(true);
        this.getDrawArea().refresh();
    }

    getTBay(block: string, bay: number, row: number): TBay | undefined {
        let tBay = this._bayRowList.find(c => c.block === block && c.bayRow === bay);

        if (!tBay) {
            tBay = this._bayRowList.find(c => c.block === block && c.bayRow === row);
        }

        if (tBay) {
            return tBay.tBay;
        }

        return undefined;
    }

    getTBayRow(block: string, bayRow: number): TBay | undefined {
        let tBay = this._bayRowList.find(c => c.block === block && c.bayRow === bayRow);
        if (tBay) {
            return tBay.tBay;
        }

        return undefined;
    }

    getTBayViewDir(viewDir: ViewDirection, block: string, bay: number, row: number): TBay | undefined {
        let tBay = undefined;

        if (viewDir === ViewDirection.Side) {
            tBay = this._bayRowList.find(c => c.block === block && c.bayRow === row);
        } else {
            tBay = this._bayRowList.find(c => c.block === block && c.bayRow === bay);
        }

        if (tBay) {
            return tBay.tBay;
        }

        return undefined;
    }

    getTBayRowGroup(viewDir: ViewDirection, block: string, bay: number, row: number): TBayRowGroup | undefined {
        const index = YardUtil.getBayRowIndex(viewDir, bay, row);
        return this._bayRowList.find(c => c.block === block && c.bayRow === index);
    }

    doSort(pBlock: string, bayRow: number, sortIndex: number) : void {
        this._canSort = true;
        const sortableBay = this.getSortableBay(pBlock, bayRow);
        if (sortableBay) {
            sortableBay.sortIndex = sortIndex;
        }
    }

    private getSortableBay(pBlock: string, bayRow: number) : TBay | undefined {
        let sortableBay = undefined;
        const tBayRowGroupList = SearchUtil.getGeometryListByMember(this.getDrawArea().getDefaultDrawList().getDrawList(), "TBayRowGroup");
        if (tBayRowGroupList.length > 0) {
            sortableBay = tBayRowGroupList.find(i => i.name === ("TBay_" + pBlock + "_" + bayRow.toString()));
        }

        return sortableBay instanceof TBay ? sortableBay as TBay : undefined;
    }

    private moveBayTitleLocXWithRefresh() : void {
        if (this._shouldRefreshBounds) {
            this._shouldRefreshBounds = false;
        } else {
            let shownBounds = Rectangle.empty();       //줌인 줌아웃, 창 확대,창 축소까지 감안한 영역대비 현재화면
            let allTBayRowGroups: TBayRowGroup[] = [];   //DrawArea안의 모든 TBayRowGroup타입 DrawableObject를 담을 변수
            let shownTBayRowGroups: TBayRowGroup[] = []; //현재 보이는 영역의 TBayRowGroup타입 DrawableObject를 담을 변수
            let shownTitle = undefined;                    //shownTBayRowGroups안의 현재 보이는 Title을 담을 변수
            let isShownBoundsLower = false;       //현재 화면의 X축이 TBayRowGroup의 X값보다 큰 경우
            let isShownBoundsUpper = false;       //현재 화면의 X축이 TBayRowGroup의 X값보다 작은 경우
            let titleDistance = 0;              //현재 화면의 X축과 Title의 거리차이
            try {
                allTBayRowGroups = SearchUtil.getGeometryListByMember(this.getDrawArea().getDefaultDrawList().getDrawList(), "TBayRowGroup") as TBayRowGroup[];
                shownBounds = this.getDrawArea().getCurrentShownBounds();
                shownTBayRowGroups = this.getDrawArea().getDrawablesCurrentBounds<TBayRowGroup>(shownBounds, "TBayRowGroup");
                for (let shownTBayRowGroup of shownTBayRowGroups) {
                    shownTitle = shownTBayRowGroup.tBay.getTitleObject() as DrawText;
                    isShownBoundsLower = shownTBayRowGroup.getCurrentLocation().x * this.getPageScale() < shownBounds.x;
                    isShownBoundsUpper = (shownTBayRowGroup.getCurrentLocation().x + shownTBayRowGroup.getBounds().width) * this.getPageScale() > shownBounds.x;
                    if (isShownBoundsLower === false || isShownBoundsUpper === false) {
                        this.resetTBayTitleLocX(shownTBayRowGroup);
                        continue;
                    }

                    if (shownTitle.getCurrentLocation().x * this.getPageScale() < shownBounds.getLocation().x) {
                        titleDistance = shownBounds.getLocation().x - (shownTitle.getCurrentLocation().x * this.getPageScale()); //Title의 X좌표와 현재화면의 X좌표의 차이
                        if ((shownTBayRowGroup.getCurrentLocation().x * this.getPageScale()) + (shownTBayRowGroup.getBounds().width * this.getPageScale()) - (shownTitle.getSize().width * this.getPageScale()) < shownBounds.getLocation().x) {
                            shownTitle.setLocation(new Point(shownTBayRowGroup.getBounds().width - shownTitle.getSize().width, shownTitle.getLocation().y));
                        } else {
                            shownTitle.setLocation(new Point(shownTitle.getLocation().x + (titleDistance / this.getPageScale()), shownTitle.getLocation().y));
                        }
                        shownTBayRowGroup.updateMBR();
                    } else if (shownTitle.getCurrentLocation().x * this.getPageScale() > shownBounds.getLocation().x) {
                        if ((shownTBayRowGroup.getCurrentLocation().x + shownTBayRowGroup.tBay.getTitleLeftMargin()) * this.getPageScale() < shownBounds.getLocation().x) {
                            titleDistance = shownBounds.getLocation().x - (shownTitle.getCurrentLocation().x * this.getPageScale());
                            shownTitle.setLocation(new Point(shownTitle.getLocation().x + (titleDistance / this.getPageScale()), shownTitle.getLocation().y));
                            shownTBayRowGroup.updateMBR();
                        } else {
                            this.resetTBayTitleLocX(shownTBayRowGroup);
                        }
                    }
                }

                this._shouldRefreshBounds = true;
                this.getDrawArea().refresh();
            } catch (ex) {
                GeneralLogger.error(ex);
                throw ex;
            }

            return;
        }
    }

    private resetAllTBayTitleLocX() : void {
        try {
            const allTBayRowGroups = SearchUtil.getGeometryListByMember(this.getDrawArea().getDefaultDrawList().getDrawList(), "TBayRowGroup");
            for (let aTBay of allTBayRowGroups) {
                this.resetTBayTitleLocX(aTBay as TBayRowGroup);
            }
            this._shouldRefreshBounds = true;
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
        return;
    }

    private resetTBayTitleLocX(aTBay: TBayRowGroup) : void {
        const aTitle = aTBay.tBay.getTitleObject() as DrawText;
        aTitle.setLocation(new Point(aTBay.tBay.getTitleLeftMargin(), aTitle.getLocation().y)); //Title의 위치를 처음 상태로 되돌립니다.
        aTBay.updateMBR();
        return;
    }

    addBayRow(viewDir: ViewDirection, block: string, bayRow: number) : void {
        this.addBayRowWithCaption(viewDir, block, bayRow, "");
    }

    addDefaultBayRow(viewDir: ViewDirection, block: string, bayRowCaption: string) : void {
        this.addBayRowWithOnlyCaption(viewDir, block, 1, bayRowCaption, true);
    }

    addBayRowWithCaption(viewDir: ViewDirection, block: string, bayRow: number, bayRowCaption: string) : void {
        this.addBayRowWithOnlyCaption(viewDir, block, bayRow, bayRowCaption, false);
    }

    addBayRowWithOnlyCaption(viewDir: ViewDirection, block: string, bayRow: number, bayRowCaption: string, onlyBayRowCaption: boolean) : void {
        if (this.yardDefine === undefined) return;
        const horizontalArrange = YardUtil.getRowNameDirection(this.alignmentBayRowName, viewDir, this.yardDefine.getBlockByKey(block));
        this.addBayRowWithDirectionOnlyCaption(viewDir, horizontalArrange, block, bayRow, bayRowCaption, onlyBayRowCaption);
    }
    
    addBayRowWithBayRowDirection(viewDir: ViewDirection, bayRowDirection: HorizontalArrange, block: string, bayRow: number, bayRowCaption: string) : void {
        this.addBayRowWithDirectionOnlyCaption(viewDir, bayRowDirection, block, bayRow, bayRowCaption, false);
    }

    addBayRowWithDirectionOnlyCaption(viewDir: ViewDirection, bayRowDirection: HorizontalArrange, block: string, bayRow: number, bayRowCaption: string, onlyBayRowCaption: boolean) : void {
        this.addBayRowWithMargin(viewDir, bayRowDirection, block, bayRow, bayRowCaption, false, undefined, new Padding(25, 40, 0, 0));
    }

    addBayRowWithMargin(viewDir: ViewDirection, bayRowDirection: HorizontalArrange, block: string, bayRow: number, bayRowCaption: string, onlyBayRowCaption: boolean, tBay: TBay | undefined, margin: Padding) : void {
        try {
            if (!this.yardDefine) return;

            let tBay1 = undefined;
            let blockItem = this.yardDefine.getMap().get(block);

            if (!blockItem) return;

            if (tBay) {
                tBay1 = tBay;
            } else {
                tBay1 = new TBay("");
                tBay1.setDataItem(viewDir, blockItem, bayRow, this._slotWidth, this._slotHeight,
                    this._slotGap, this._zoomRate, this.visibleAccessDirection, this.visibleCloseButton, this.visibleCraneButton, bayRowDirection,
                    this.getDisplayAttribute(block, bayRow), bayRowCaption, this.tierType, this.applyBufferSlot, this._visibleSlotCargoType,
                    this._visibleRowTierSlotCargoType, this._bayProperty, this._visibleTitle, this._fixedBayRowTierFontSize, this._bayRowNoFontSize,
                    this._tierNoFontSize, onlyBayRowCaption, false, false, margin, "", 0, 0, undefined);
            }

            const tBayRowGroup = new TBayRowGroup(tBay1, this._visibleEquipment);
            const idx = this.getTBayIndex(block, bayRow);

            if (idx < 0) {
                this._bayRowList.push(tBayRowGroup);
            } else {
                this._bayRowList[idx] = tBayRowGroup;
            }

            const drawGeom = this.getGeomObjectInTCanvas(this.getBayKey(block, bayRow.toString()));
            if (drawGeom) {
                this.removeObjectInCanvas(this.getBayKey(block, bayRow.toString()));
                tBayRowGroup.setLocation(new Point(drawGeom.getLocation().x, drawGeom.getLocation().y));
            } else {
                tBayRowGroup.setLocation(new Point(0, 0));
            }

            if (this.applySlotCPO) {
                this.applySlotCPOForBayRow(viewDir, block, bayRow, blockItem, tBayRowGroup);
            }

            if (this.applyBayLock) {
                for (let i = 1; i <= tBayRowGroup.tBay.getMaxBayRow(); i++) {
                    let isLock = false;
                    if (viewDir === ViewDirection.Front) {
                        if (this.blockLockType === BlockLockType.BayOrRow) {
                            if ((blockItem.getBayList().get(bayRow) as BayItem).isLocked) {
                                isLock = true;
                            }
                        } else if (this.blockLockType === BlockLockType.BayAndRow) {
                            if (blockItem.yardLocks[bayRow][i]) {
                                isLock = true;
                            }
                        }
                    } else {
                        if (this.blockLockType === BlockLockType.BayOrRow) {
                            if ((blockItem.getRowList().get(bayRow) as RowItem).isLocked) {
                                isLock = true;
                            }
                        } else if (this.blockLockType === BlockLockType.BayAndRow) {
                            if (blockItem.yardLocks[i][bayRow]) {
                                isLock = true;
                            }
                        }
                    }

                    if (isLock) tBayRowGroup.tBay.setBaseLineColor(i, Color.Red(), Color.Red());
                }
            }

            this.getDrawArea().addDrawableObject(tBayRowGroup);
            this.addContainer(block, bayRow, viewDir);
            tBayRowGroup.updateMBR();
            this.getDrawArea().isChanged = true;

            if (this.bayAdded.isEmpty() === false) {
                const bayAddedArgs = new SlotClickEventArgs();
                bayAddedArgs.blockViewDirection = viewDir;
                bayAddedArgs.block = block;
                if (viewDir === ViewDirection.Side) {
                    bayAddedArgs.bay = -1;
                    bayAddedArgs.row = bayRow;
                } else {
                    bayAddedArgs.bay = bayRow;
                    bayAddedArgs.row = -1;
                }
                this.bayAdded.doEvent(this.getDrawArea(), bayAddedArgs);
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    private applySlotCPOForBayRow(viewDir: ViewDirection, block: string, bayRow: number, blockItem: BlockItem, tBayRowGroup: TBayRowGroup) : void {
        if (!this.yardDefine) return;
        
        if (this._terminalItem && this._terminalItem.useYSlotUsage === YesNo.YES) {
            if (viewDir === ViewDirection.Front) {
                for (let row = 1; row <= tBayRowGroup.tBay.getMaxBayRow(); row++) {
                    let isUnusableLine = false;
                    for (let tier = 1; tier <= tBayRowGroup.tBay.getMaxTier(); tier++) {
                        if (blockItem.isUnusableYSlot(bayRow, row)) {
                            const tSlot = tBayRowGroup.tBay.getSlot(row, tier);
                            if (tSlot) tSlot.visible = false;
                            isUnusableLine = true;
                        }
                    }

                    if (isUnusableLine)
                        tBayRowGroup.tBay.setBaseLineColor(row, Color.LightGray(), Color.LightGray());
                }
            } else {
                for (let bay = 1; bay <= tBayRowGroup.tBay.getMaxBayRow(); bay++) {
                    let isUnusableLine = false;
                    for (let tier = 1; tier <= tBayRowGroup.tBay.getMaxTier(); tier++) {
                        const slotUsageItem = blockItem.getYSlotUsage(bay, bayRow, tier);
                        if (blockItem.isUnusableYSlot(bay, bayRow)) {
                            const tSlot = tBayRowGroup.tBay.getSlot(bay, tier);
                            if (tSlot) tSlot.visible = false;
                            isUnusableLine = true;
                        }
                    }

                    if (isUnusableLine)
                        tBayRowGroup.tBay.setBaseLineColor(bay, Color.LightGray(), Color.LightGray());
                }
            }
        } else {
            if (viewDir === ViewDirection.Front) {
                for (let row = 1; row <= tBayRowGroup.tBay.getMaxBayRow(); row++) {
                    if (((this.yardDefine.getBlockByKey(block) as BlockItem).getYSlot(bayRow, row) as YSlotItem).cpo === 0) {
                        tBayRowGroup.tBay.setBaseLineColor(row, Color.LightGray(), Color.LightGray());
                        for (let tier = 1; tier <= tBayRowGroup.tBay.getMaxTier(); tier++)
                            (tBayRowGroup.tBay.getSlot(row, tier) as TSlot).visible = false;
                    }
                }
            } else {
                for (let bay = 1; bay <= tBayRowGroup.tBay.getMaxBayRow(); bay++) {
                    if (((this.yardDefine.getBlockByKey(block) as BlockItem).getYSlot(bay, bayRow) as YSlotItem).cpo === 0) {
                        tBayRowGroup.tBay.setBaseLineColor(bay, Color.LightGray(), Color.LightGray());
                        for (let tier = 1; tier <= tBayRowGroup.tBay.getMaxTier(); tier++)
                            (tBayRowGroup.tBay.getSlot(bay, tier) as TSlot).visible = false;
                    }
                }
            }
        }
    }

    addBayRowDetail(viewDir: ViewDirection, block: string, bayRow: number, bayRowName: string, maxBayRow: number, maxTier: number, sortedBayRowNoList: Map<number, string>): void{
        this.addBayRowDetailWithCaption(viewDir, block, bayRow, bayRowName, maxBayRow, maxTier, sortedBayRowNoList, "");
    }

    addBayRowDetailWithCaption(viewDir: ViewDirection, block: string, bayRow: number, bayRowName: string, maxBayRow: number, maxTier: number, sortedBayRowNoList: Map<number, string>, bayRowCaption: string): void {
        if (this.yardDefine === undefined) return;
        const horizontalArrange = YardUtil.getRowNameDirection(this.alignmentBayRowName, viewDir, this.yardDefine.getBlockByKey(block));
        this.addBayRowDetailWithMargin(viewDir, horizontalArrange, block, bayRow, bayRowName, maxBayRow, maxTier, sortedBayRowNoList, bayRowCaption, new Padding(25, 40, 0, 0));
    }

    addBayRowDetailWithMargin(viewDir: ViewDirection, bayRowDirection: HorizontalArrange, block: string, bayRow: number, bayRowName: string, maxBayRow: number, maxTier: number, bayRowNoList: Map<number, string>, bayRowCaption: string, margin: Padding) : void {
        try {
            if (bayRow === 0 || !this.yardDefine) return;
            const blockItem = this.yardDefine.getMap().get(block);
            if (!blockItem) return;
            const tBay1 = new TBay("");
            tBay1.setDataItem(viewDir, blockItem, bayRow, this._slotWidth, this._slotHeight, this._slotGap, this._zoomRate, this.visibleAccessDirection, this.visibleCloseButton, this.visibleCraneButton, bayRowDirection, this.getDisplayAttribute(block, bayRow), bayRowCaption, this.tierType, this.applyBufferSlot, this._visibleSlotCargoType, this._visibleRowTierSlotCargoType, this._bayProperty, this._visibleTitle, this._fixedBayRowTierFontSize, this._bayRowNoFontSize, this._tierNoFontSize, false, false, false, margin, bayRowName, maxBayRow, maxTier, bayRowNoList);
            const tBay = new TBayRowGroup(tBay1, this._visibleEquipment);
            const idx = this.getTBayIndex(block, bayRow);
            
            if (idx < 0) {
                this._bayRowList.push(tBay);
            } else {
                this._bayRowList[idx] = tBay;
            }

            const drawGeom = this.getGeomObjectInTCanvas(this.getBayKey(block, bayRow.toString()));
            if (drawGeom) {
                this.removeObjectInCanvas(this.getBayKey(block, bayRow.toString()));
                tBay.setLocation(new Point(drawGeom.getLocation().x, drawGeom.getLocation().y));
            } else {
                tBay.setLocation(Point.empty());
            }

            if (this.applySlotCPO) {
                this.applySlotCPOForBayRow(viewDir, block, bayRow, blockItem, tBay);
            }

            this.getDrawArea().addDrawableObject(tBay);
            this.addContainer(block, bayRow, viewDir);
            tBay.updateMBR();
            this.getDrawArea().isChanged = true;
            
            if (this.bayAdded.isEmpty() === false) {
                const bayAddedArgs = new SlotClickEventArgs();
                bayAddedArgs.blockViewDirection = viewDir;
                bayAddedArgs.block = block;
                if (viewDir === ViewDirection.Side) {
                    bayAddedArgs.bay = -1;
                    bayAddedArgs.row = bayRow;
                } else {
                    bayAddedArgs.bay = bayRow;
                    bayAddedArgs.row = -1;
                }
                this.bayAdded.doEvent(this.getDrawArea(), bayAddedArgs);
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    clearBlock(block: string, bayRow: number) : void {
        let bayAddedArgs = undefined;
        if (this.bayRemoved) {
            const bay = this.getTBayRow(block, bayRow);
            if (bay) {
                bayAddedArgs = new SlotClickEventArgs();
                bayAddedArgs.blockViewDirection = bay.getViewType();
                bayAddedArgs.block = block;
                if (bay.getViewType() === ViewDirection.Side) {
                    bayAddedArgs.bay = -1;
                    bayAddedArgs.row = bayRow;
                } else {
                    bayAddedArgs.bay = bayRow;
                    bayAddedArgs.row = -1;
                }
            }
        }

        this._bayRowList = this._bayRowList.filter(x => x.block !== block || x.bayRow !== bayRow);
        this.removeObjectInCanvas(this.getBayKey(block, bayRow.toString()));
        this.getDrawArea().isChanged = true;

        if (bayAddedArgs) {
            this.bayRemoved.doEvent(this.getDrawArea(), bayAddedArgs);
        }
    }

    focusSlot(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number) : void {
        const slot = this.getTSlot(viewDir, block, bay, row, tier);
        if (slot === undefined) return;
        const bounds = slot.getBounds();
        this.getDrawArea().moveScreenCenter(new Point(bounds.right() - bounds.width / 2, bounds.bottom() - bounds.height / 2));
    }

    getScrollPosition() : Point {
        return new Point(this.getDrawArea().getScrollX(), this.getDrawArea().getScrollY());
    }

    setSelectionWithDir(viewDir: ViewDirection, seqNo: string, block: string, bay: number, row: number, tier: number) : void {
        this.setSelectionWithColor(viewDir, seqNo, block, bay, row, tier, Color.DarkGray(), Color.Black());
    }

    setSelectionWithSeqNo(seqNo: string, block: string, bay: number, row: number, tier: number, backColor: Color, foreColor: Color) : void {
        const tBay = this.getTBay(block, bay, row);
        if (tBay) {
            this.setSelectionWithColor(tBay.getViewType(), seqNo, block, bay, row, tier, backColor, foreColor);
        }
    }

    setSelectionWithOccupiedSlotCount(seqNo: string, block: string, bay: number, row: number, tier: number, backColor: Color, foreColor: Color, occupiedSlotCount: number) : void {
        const tBay = this.getTBay(block, bay, row);
        if (tBay) {
            this.setSelectionDetail(tBay.getViewType(), seqNo, block, bay, row, tier, backColor, foreColor, occupiedSlotCount);
        }
    }

    setSelectionWithColor(viewDir: ViewDirection, seqNo: string, block: string, bay: number, row: number, tier: number, backColor: Color, foreColor: Color) : void {
        const markProperty = this.makeSelectionMarkProperty(foreColor, backColor);
        markProperty.visibleBorder = false;
        this.setSelection(viewDir, seqNo, block, bay, row, tier, 1, markProperty);
    }

    setSelectionDetail(viewDir: ViewDirection, seqNo: string, block: string, bay: number, row: number, tier: number, backColor: Color, foreColor: Color, occupiedSlotCount: number) : void {
        const markProperty = this.makeSelectionMarkProperty(foreColor, backColor);
        markProperty.visibleBorder = true;
        this.setSelection(viewDir, seqNo, block, bay, row, tier, occupiedSlotCount, markProperty);
    }

    private setSelection(viewDir: ViewDirection, seqNo: string, block: string, bay: number, row: number, tier: number, occupiedSlotCount: number, markProperty: TSelectionMarkProperty) : void {
        try {
            const tBay = this.getTBayViewDir(viewDir, block, bay, row);
            if (tBay) {
                tBay.setSelection(viewDir, seqNo, block, bay, row, tier, occupiedSlotCount, markProperty);
                this.getDrawArea().isChanged = true;
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    removeSelectionWithTier(block: string, bay: number, row: number, tier: number) : void {
        try {
            const tBay = this.getTBay(block, bay, row);
            if (tBay) {
                tBay.removeSelectionWithTier(block, bay, row, tier);
                this.getDrawArea().isChanged = true;
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    removeSelection(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number) : void {
        try {
            const tBay = this.getTBayViewDir(viewDir, block, bay, row);
            if (tBay) {
                tBay.removeSelectionWithTier(block, bay, row, tier);
                this.getDrawArea().isChanged = true;
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    isSelectedSlot(block: string, bay: number, row: number, tier: number) : boolean {
        const tbay = this.getTBay(block, bay, row);
        if (tbay) {
            return tbay.isSelectedSlot(bay, row, tier);
        }
        return false;
    }

    getOccupiedSlotCount(block: string, bay: number, row: number, tier: number) : number {
        const tbay = this.getTBay(block, bay, row);
        if (tbay) {
            return tbay.getOccupiedSlotCount(bay, row, tier);
        }
        return 0;
    }

    private makeSelectionMarkProperty(foreColor: Color, backColor: Color) : TSelectionMarkProperty {
        const markProperty = new TSelectionMarkProperty();
        markProperty.fontSize = 21 * this._zoomRate + 0.5;
        markProperty.foreColor = foreColor;
        markProperty.backColor = backColor;
        markProperty.borderColor = backColor;
        markProperty.visibleBorder = true;
        markProperty.zoomRate = this._zoomRate;
        return markProperty;
    }

    private addContainer(block: string, bayRow: number, viewDir: ViewDirection) : void {
        this.getContainerHandler().addContainer(block, bayRow, viewDir, this.slotPadding, this._containerValidation, this._fontRate);
    }

    containerAttribute(block: string, bay: number, row: number, tier: number): ContainerBayItem {
        return this.getContainerHandler().containerAttribute(block, bay, row, tier);
    }

    clearContainerMarking() : void {
        this.getContainerHandler().clearMarking();
    }

    removeMarking(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number) : void {
        this.removeMarkingWithYTLane(viewDir, block, bay, row, tier, YTLaneLocTypes.None);
    }

    removeMarkingWithYTLane(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number, ytLaneLocTypes: YTLaneLocTypes) : void {
        if (this.getContainerHandler().getContainerItemsWithYTLane(block, bay, row, tier, ytLaneLocTypes)) {
            this.getContainerHandler().removeMarkingByYTLane(viewDir, block, bay, row, tier, ytLaneLocTypes);
        } else {
            this.removeSlotMarking(viewDir, block, bay, row, tier);
        }
    }

    clearMarking() : void {
        this.clearContainerMarking();
        this.clearSlotMarking();
    }

    addMarking(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number, ytLaneLocTypes: YTLaneLocTypes, backColor: Color, borderColor: Color, markingType: MarkingTypes) : void {
        this.addMarkingWithLineThick(viewDir, block, bay, row, tier, ytLaneLocTypes, backColor, borderColor, markingType, 0);
    }

    addMarkingWithLineThick(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number, ytLaneLocTypes: YTLaneLocTypes, backColor: Color, borderColor: Color, markingType: MarkingTypes, lineThick: number) : void {
        if (this.getContainerHandler().getContainerItemWithYTLane(block, bay, row, tier, ytLaneLocTypes)) {
            this.addContainerMarkingWithYTLane(viewDir, block, bay, row, tier, ytLaneLocTypes, backColor, borderColor, markingType, lineThick);
        } else {
            this.addSlotMarkingWithLineThick(viewDir, block, bay, row, tier, backColor, borderColor, markingType, lineThick);
        }
    }

    addContainerMarking(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number, backColor: Color, borderColor: Color, markingType: MarkingTypes, lineThick: number) : void {
        this.getContainerHandler().addMarkingDetail(viewDir, block, bay, row, tier, YTLaneLocTypes.None, backColor, borderColor, markingType, lineThick);
    }

    addContainerMarkingWithYTLane(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number, ytLaneLocTypes: YTLaneLocTypes, backColor: Color, borderColor: Color, markingType: MarkingTypes, lineThick: number) : void {
        this.getContainerHandler().addMarkingDetail(viewDir, block, bay, row, tier, ytLaneLocTypes, backColor, borderColor, markingType, lineThick);
    }

    addSlotMarking(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number, backColor: Color, borderColor: Color, markingType: MarkingTypes) : void {
        this.addSlotMarkingWithLineThick(viewDir, block, bay, row, tier, backColor, borderColor, markingType, 0);
    }

    addSlotMarkingWithLineThick(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number, backColor: Color, borderColor: Color, markingType: MarkingTypes, lineThick: number) : void {
        const tSlot = this.getTSlot(viewDir, block, bay, row, tier);
        if (tSlot) {
            tSlot.markingSizeRatio = 2;
            tSlot.setMarkingBorderThickByType(true, backColor, borderColor, markingType, lineThick);
            this.getDrawArea().isChanged = true;
        }
    }

    removeSlotMarking(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number) : void {
        const tSlot = this.getTSlot(viewDir, block, bay, row, tier);
        if (tSlot) {
            tSlot.setMarking(false);
            this.getDrawArea().isChanged = true;
        }
    }

    clearSlotMarking() : void {
        for (let bayRowGroup of this._bayRowList) {
            if (bayRowGroup.tBay) {
                const slots = bayRowGroup.tBay.getGeomListByMember("TSlot") as TSlot[];
                for (let slot of slots) {
                    slot.setMarking(false);
                    this.getDrawArea().isChanged = true;
                }
            }
        }
    }

    setSlotMarking(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number, isVisible: boolean) : void {
        const tSlot = this.getTSlot(viewDir, block, bay, row, tier);
        if (tSlot) {
            tSlot.markingSizeRatio = 2;
            tSlot.setMarking(isVisible);
            this.getDrawArea().isChanged = true;
        }
    }

    setSlotMarkingWithColor(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number, isVisible: boolean, backColor: Color, borderColor: Color) : void {
        const tSlot = this.getTSlot(viewDir, block, bay, row, tier);
        if (tSlot) {
            tSlot.markingSizeRatio = 2;
            tSlot.setMarkingColor(isVisible, backColor, borderColor);
            this.getDrawArea().isChanged = true;
        }
    }

    setSlotMarkingType(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number, isVisible: boolean, backColor: Color, borderColor: Color, markingType: MarkingTypes) : void {
        this.setSlotMarkingTypeWithLineThick(viewDir, block, bay, row, tier, isVisible, backColor, borderColor, markingType, 0);
    }

    setSlotMarkingTypeWithLineThick(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number, isVisible: boolean, backColor: Color, borderColor: Color, markingType: MarkingTypes, lineThick: number) : void {
        const tSlot = this.getTSlot(viewDir, block, bay, row, tier);
        if (tSlot) {
            tSlot.markingSizeRatio = 2;
            tSlot.setMarkingBorderThickByType(isVisible, backColor, borderColor, markingType, lineThick);
            this.getDrawArea().isChanged = true;
        }
    }

    setSlotOccupiedPlan(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number, visible: boolean) : void {
        const tSlot = this.getTSlot(viewDir, block, bay, row, tier);
        if (tSlot) {
            tSlot.setOccupiedPlan(visible);
        }
    }

    setSlotOccupiedPlanWithColor(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number, color: Color, visible: boolean) : void {
        const tSlot = this.getTSlot(viewDir, block, bay, row, tier);
        if (tSlot) {
            tSlot.setOccupiedPlanVisible(color, visible);
        }
    }

    isMarking(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number) : boolean {
        return this.isMarkingYTLane(viewDir, block, bay, row, tier, YTLaneLocTypes.None);
    }

    isMarkingYTLane(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number, ytLaneLocTypes: YTLaneLocTypes) : boolean {
        let isMarked = this.getContainerHandler().isMarking(block, bay, row, tier, ytLaneLocTypes);
        if (isMarked === false) {
            const tSlot = this.getTSlot(viewDir, block, bay, row, tier) as IGeomMarking;
            if (tSlot) {
                isMarked = tSlot.getMarked();
            }
        }
        return isMarked;
    }

    setData(container: ContainerBayItem) : void {
        this.getContainerHandler().setData(container);
    }

    setDatas(containerList: ContainerBayItem[]) : void {
        this.getContainerHandler().setDatas(containerList);
    }

    clearContainerWithViewDir(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number) : void {
        this.getContainerHandler().clearByViewDir(viewDir, block, bay, row, tier);
    }

    clearContainer(block: string, bay: number, row: number, tier: number) : void {
        this.getContainerHandler().clearByBlock(block, bay, row, tier);
    }

    protected getContainerHandler() : ContainerHandler {
        if (this._containerHandler === undefined) {
            this._containerHandler = new ContainerHandler(this);
        }
        return this._containerHandler;
    }

    private getTSlot(viewDir: ViewDirection, block: string, bay: number, row: number, tier: number) : TSlot | undefined {
        const tBay = this.getTBayViewDir(viewDir, block, bay, row);
        if (tBay) {
            let tSlot = undefined;
            let bayRow = -1;
            if (viewDir === ViewDirection.Front) {
                bayRow = row;
            } else {
                bayRow = bay;
            }
            tSlot = tBay.getSlot(bayRow, tier);
            return tSlot;
        }
        return undefined;
    }

    draw(block: string, bay: number, row: number, tier: number) : void {
        this.getContainerHandler().draw(block, bay, row, tier, this.slotPadding, this._containerValidation, this._fontRate);
    }

    drawWithAllowDuplication(block: string, bay: number, row: number, tier: number, allowDuplication: boolean) : void {
        this.getContainerHandler().drawWithAllowDuplication(block, bay, row, tier, this.slotPadding, this._containerValidation, this._fontRate, allowDuplication);
    }

    drawWithFacility(block: string, bay: number, row: number, tier: number, facility: string) : void {
        this.getContainerHandler().drawWithFacility(block, bay, row, tier, facility, this.slotPadding, this._containerValidation, this._fontRate);
    }

    drawWithYTLaneFacility(block: string, bay: number, row: number, tier: number, ytLaneLocTypes: YTLaneLocTypes, facility: string) : void {
        this.getContainerHandler().drawWithYTLaneFacility(block, bay, row, tier, ytLaneLocTypes, facility, this.slotPadding, this._containerValidation, this._fontRate);
    }

    drawWithYTLaneAllowDuplication(block: string, bay: number, row: number, tier: number, ytLaneLocTypes: YTLaneLocTypes, allowDuplication: boolean) : void {
        this.getContainerHandler().drawWithYTLaneAllowDuplication(block, bay, row, tier, ytLaneLocTypes, this.slotPadding, this._containerValidation, this._fontRate, allowDuplication);
    }

    drawDetail() : void {
        this.getDrawArea().clear();
        try {
            for (let i = 0; i < this._bayRowList.length; i++) {
                if (this._bayRowList[i].tBay.getBlockDefine()) {
                    this.addBayRowWithCaption(this._bayRowList[i].tBay.getViewType(), this._bayRowList[i].block, this._bayRowList[i].bayRow, this._bayRowList[i].tBay.caption);
                } else {
                    this.addBayRowDetail(this._bayRowList[i].tBay.getViewType(), this._bayRowList[i].block, this._bayRowList[i].bayRow, this._bayRowList[i].tBay.getBayRowName(), this._bayRowList[i].tBay.getMaxBayRow(), this._bayRowList[i].tBay.getMaxBayRow(), this._bayRowList[i].tBay.getSortedBayRowNoList());
                    this.getDrawArea().addDrawableObject(this._bayRowList[i]);
                }
            }

            this.getContainerHandler().drawContainerItems(this.slotPadding, this._containerValidation, this._fontRate);
        } catch (ex) {
            throw ex;
        }

        for (let item of this._bayRowList) {
            item.updateMBR();
        }
        
        this.getDrawArea().refresh();
    }

    getBayKey(block: string, bayRow: string) : string {
        return "TBay_" + block + "_" + bayRow;
    }

    clear() : void {
        if (this._bayRowList) {
            this._bayRowList.length = 0;
        }
        if (this._boundaryHandler) {
            this._boundaryHandler.clear();
        }
        if (this._containerHandler) {
            this._containerHandler.clear();
        }
        if (this._equipmentHandler) {
            this._equipmentHandler.clear();
        }

        this.getDrawArea().clear();
        this.clearDisplayAttribute();
        this.getDrawArea().refresh();
    }

    clearAll() : void {
        this.clear();
        this._bayRowList = [];
        this._boundaryHandler = undefined;
        this._containerHandler = undefined;
        this._equipmentHandler = undefined;
        this.yardDefine = undefined;
    }

    clearBayView() : void {
        this.getDrawArea().clear();
        this._bayRowList.length = 0;
    }

    setBaseLineColor(block: string, bay: number, row: number, backColor: Color, BorderColor: Color) : void {
        try {
            const tbay = this.getTBay(block, bay, row);
            if (tbay) {
                if (tbay.getViewType() === ViewDirection.Front) {
                    tbay.setBaseLineColor(row, backColor, BorderColor);
                } else {
                    tbay.setBaseLineColor(bay, backColor, BorderColor);
                }
                this.getDrawArea().isChanged = true;
            }
        } catch (ex) {
            throw ex;
        }
    }

    setDisplayAttribute(block: string, bayRow: number, displayAttribute: YardDisplayItem) : void {
        let key = this.getBlockDisplayKey(block, bayRow);
        super.addYardDisplay(key, displayAttribute);
        key = this.getBayKey(block, bayRow.toString());
        const tbay = this.getDrawArea().findFirst(key) as TBayRowGroup;
        if (tbay) {
            tbay.tBay.setDisplayAttribute(displayAttribute);
        }
    }
    
    removeDisplayAttribute(block: string, bayRow: number) : void {
        let key = this.getBlockDisplayKey(block, bayRow);
        super.removeYardDisplay(key);
        key = this.getBayKey(block, bayRow.toString());
        const tbay = this.getDrawArea().findFirst(key) as TBayRowGroup;
        if (tbay) {
            tbay.tBay.setDisplayAttribute(new YardDisplayItem());
        }
    }

    private getDisplayAttribute(block: string, bayRow: number) : YardDisplayItem {
        const key = this.getBlockDisplayKey(block, bayRow);
        return super.getYardDisplay(key) as YardDisplayItem;
    }

    private getBlockDisplayKey(block: string, bayRow: number) : string {
        return block + "_" + bayRow;
    }

    isEmptySlot(dragX: number, dragY: number) : boolean {
        return super.isEmptySlot<TContainer, TSlot>(dragX, dragY);
    }
    
    private getChassisDisplayLocation(viewType: ViewDirection, tBay: TBay, chassisDisplayItem: ChassisDisplayItem, displayWidth: number) : Point {
        let posX = 0;
        let posY = 0;
        let tSlot = undefined;
        try {
            if (chassisDisplayItem === undefined) return Point.empty();
            if (tBay.getViewType() === ViewDirection.Front) {
                tSlot = tBay.getSlot(chassisDisplayItem.row, chassisDisplayItem.tier);
            } else {
                tSlot = tBay.getSlot(chassisDisplayItem.bay, chassisDisplayItem.tier);
            }
            if (tSlot === undefined) return Point.empty();
            
            posX = tSlot.getLocation().x;

            if (tBay.getBayRowDirection() === HorizontalArrange.RightToLeft) {
                posX = tSlot.getLocation().x - (displayWidth - this._slotWidth);
            }

            if (chassisDisplayItem.displayPosition === ChassisDisplayPosition.Top) {
                posY = tSlot.getLocation().y - tBay.getChassisDisplayHeight();
                posY -= this.getChassisGap();
            } else if (chassisDisplayItem.displayPosition === ChassisDisplayPosition.Bottom) {
                posY = tSlot.getLocation().y + this._slotHeight;
                posY += this._bayProperty.wheelDeckGap;
                posY += this.getChassisGap();
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }

        return new Point(posX, posY);
    }

    addChassis(item: ChassisDisplayItem) : void {
        let tBay = undefined;
        let chassisDisplayHeight = 0;
        let chassisDisplayWidth = 0;
        let location = Point.empty();
        let key = "";
        let tChassis = undefined;
        
        try {
            if (this.getVisibleWheelDeck() === false) return;
            tBay = this.getTBay(item.block, item.bay, item.row);
            if (tBay === undefined) return;
            if (this.invalidateTBay(tBay, item.bay, item.row)) return;
            chassisDisplayHeight = tBay.getChassisDisplayHeight();
            chassisDisplayWidth = this.getDisplayWidth(tBay.getViewType(), item.sizeType);
            location = this.getChassisDisplayLocation(tBay.getViewType(), tBay, item, chassisDisplayWidth);
            key = this.getChassisKey(item.block, item.bay, item.row, item.tier);
            tChassis = tBay.getGeomObject(key) as TChassis;

            if (tChassis === undefined) {
                tChassis = new TChassis(key, item, this._zoomRate, this._fontRate);
                tBay.addGeomObjectBackground(tChassis, false);
            } else {
                tChassis.setData(item);
            }

            tChassis.setLocation(location);
            tChassis.setSize(new Size(chassisDisplayWidth, chassisDisplayHeight));
            DrawableUtil.calculateAncher(tBay, tChassis);
            this.adjustTitleAndBounds(tBay, key);

            if (item.guideName && item.guideName.text.length > 0) {
                const list = tBay.getGeomListByMember("TChassisGuide") as TChassisGuide[];
                if (list && list.length > 0) {
                    for (let addedGuide of list) {
                        if (addedGuide.getChassGuideItem().text === item.guideName.text)
                            return;
                    }
                }
                
                const guide = new TChassisGuide(key + "_Guide", item.guideName, this._zoomRate, this._fontRate);
                guide.setLocation(new Point(tBay.getTierNoLocationX(), tChassis.getLocation().y));
                const textSize = FontUtil.measureText(item.guideName.text, item.guideName.fontName, item.guideName.fontSize, FontStyles.normal);
                if (textSize) guide.setSize(new Size(textSize.width + chassisDisplayHeight - (textSize.actualBoundingBoxAscent + textSize.actualBoundingBoxDescent), chassisDisplayHeight));
                tBay.addGeomObjectBackground(guide, false);
                DrawableUtil.calculateAncher(tBay, guide);
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    addChassisWithViewDirection(viewDirection: ViewDirection, item: ChassisDisplayItem) : void {
        let tBay = undefined;
        let chassisDisplayHeight = 0;
        let chassisDisplayWidth = 0;
        let location = Point.empty();
        let key = "";
        let tChassis = undefined;
        
        try {
            if (this.getVisibleWheelDeck() === false) return;
            tBay = this.getTBayViewDir(viewDirection, item.block, item.bay, item.row);
            if (tBay === undefined) return;
            if (this.invalidateTBay(tBay, item.bay, item.row)) return;
            chassisDisplayHeight = tBay.getChassisDisplayHeight();
            chassisDisplayWidth = this.getDisplayWidth(tBay.getViewType(), item.sizeType);
            location = this.getChassisDisplayLocation(tBay.getViewType(), tBay, item, chassisDisplayWidth);
            key = this.getChassisKey(item.block, item.bay, item.row, item.tier);
            tChassis = tBay.getGeomObject(key) as TChassis;

            if (tChassis === undefined) {
                tChassis = new TChassis(key, item, this._zoomRate, this._fontRate);
                tBay.addGeomObjectBackground(tChassis, false);
            } else {
                tChassis.setData(item);
            }

            tChassis.setLocation(location);
            tChassis.setSize(new Size(chassisDisplayWidth, chassisDisplayHeight));
            DrawableUtil.calculateAncher(tBay, tChassis);
            this.adjustTitleAndBounds(tBay, key);

            if (item.guideName && item.guideName.text.length > 0) {
                const list = tBay.getGeomListByMember("TChassisGuide") as TChassisGuide[];
                if (list && list.length > 0) {
                    for (let addedGuide of list) {
                        if (addedGuide.getChassGuideItem().text === item.guideName.text)
                            return;
                    }
                }
                
                const guide = new TChassisGuide(key + "_Guide", item.guideName, this._zoomRate, this._fontRate);
                guide.setLocation(new Point(tBay.getTierNoLocationX(), tChassis.getLocation().y));
                const textSize = FontUtil.measureText(item.guideName.text, item.guideName.fontName, item.guideName.fontSize, FontStyles.normal);
                if (textSize) guide.setSize(new Size(textSize.width + chassisDisplayHeight - (textSize.actualBoundingBoxAscent + textSize.actualBoundingBoxDescent), chassisDisplayHeight));
                tBay.addGeomObjectBackground(guide, false);
                DrawableUtil.calculateAncher(tBay, guide);
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    private adjustTitleAndBounds(tBay: TBay, key: string) : void {
        let topChassis = undefined;
        let bottomChassis = undefined;
        let bayRowGroup = undefined;

        try {
            topChassis = tBay.getAnyChassisTopTierTopSide();
            bottomChassis = tBay.getAnyChassisBottomTierBottomSide();
            bayRowGroup = tBay.parentGeometry as TBayRowGroup;
            if (topChassis && topChassis.name === key) {
                tBay.moveTitleChassisTopSide(topChassis);
            } else if (bottomChassis && bottomChassis.name === key) {
                if (Point.isEmpty(tBay.getLocation())) {
                    tBay.setLocation(new Point(0, 0));
                }
                tBay.updateMBR();
                if (tBay.parentGeometry instanceof TBayRowGroup) {
                    bayRowGroup.updateMBR();
                }
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    removeChassis(block: string, bay: number, row: number) : void {
        let tBay = undefined;
        let key = "";
        try {
            if (this.getVisibleWheelDeck() === false) return;
            tBay = this.getTBay(block, bay, row);
            if (tBay === undefined) return;
            if (tBay.isChassisDisplay() === false) return;
            key = this.getChassisKey(block, bay, row, 1);
            tBay.removeGeomObjectKey(key);
            
            if (Point.isEmpty(tBay.getLocation())) {
                tBay.setLocation(new Point(0, 0));
            }

            tBay.updateMBR();
            if (tBay.parentGeometry instanceof TBayRowGroup) {
                (tBay.parentGeometry as TBayRowGroup).updateMBR();
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    removeChassisWithViewDirection(viewDirection: ViewDirection, block: string, bay: number, row: number, tier: number) : void {
        let tBay = undefined;
        let key = undefined;
        let targetChassis = undefined;
        let topChassis = undefined;
        let targetChassisHeight = 0;
        let moveY = 0;
        let chassisDisplayPosition = ChassisDisplayPosition.Bottom;
        
        try {
            if (this.getVisibleWheelDeck() === false) return;
            tBay = this.getTBayViewDir(viewDirection, block, bay, row);            
            if (tBay === undefined) return;

            key = this.getChassisKey(block, bay, row, tier);
            targetChassis = tBay.getGeomObject(key) as TChassis;
            if (targetChassis === undefined) return;

            targetChassisHeight = targetChassis.getSize().height;

            if (targetChassis.getDwItem()) {
                chassisDisplayPosition = targetChassis.getDwItem().displayPosition;
            }
            
            tBay.removeGeomObjectKey(key);
            topChassis = tBay.getAnyChassisTopTierTopSide();
            
            if (topChassis === undefined && tier === tBay.getMaxTier() && chassisDisplayPosition === ChassisDisplayPosition.Top) {
                moveY = targetChassisHeight + this._bayProperty.chassisGap;
                tBay.resetTitleChassisTopSide(moveY);
            }

            if (Point.isEmpty(tBay.getLocation())) {
                tBay.setLocation(new Point(0, 0));
            }

            tBay.updateMBR();

            if (tBay.parentGeometry instanceof TBayRowGroup) {
                (tBay.parentGeometry as TBayRowGroup).updateMBR();
            }
        } catch (ex) {
            GeneralLogger.error(ex);
            throw ex;
        }
    }

    private getChassisKey(block: string, bay: number, row: number, tier: number) : string {
        return "TChassis_" + block + bay.toString() + row.toString() + tier.toString();
    }

    private getDisplayWidth(viewType: ViewDirection, sizeType: string) : number {
        let displayWidth = 0;
        try {
            if (viewType === ViewDirection.Front)
                displayWidth = this._slotWidth; else {
                if (sizeType.length === 0) {
                    sizeType = "2";
                }

                switch (sizeType.substring(0, 1)) {
                    case "2": // 20
                    default: // others
                        displayWidth = this._slotWidth;
                        break;
                    case "3":
                    case "4": // 40
                    case "5": // 45
                    case "8": // 48
                    case "L": // 45
                    case "M": // 48
                        displayWidth = this._slotWidth * 2 + this._slotGap;
                        break;
                }
            }
        } catch (ex) {
            throw ex;
        }

        return displayWidth;
    }

    private getDisplayLocation(viewType: ViewDirection, tBay: TBay, bay: number, row: number, tier: number, displayWidth: number) : Point {
        let posX = 0;
        let posY = 0;
        let tSlot = undefined;

        if (tBay.getViewType() === ViewDirection.Front) {
            tSlot = tBay.getSlot(row, tier);
        } else {
            tSlot = tBay.getSlot(bay, tier);
        }

        if (tSlot === undefined) return Point.empty();

        try {
            posX = tSlot.getLocation().x;
            posY = tSlot.getLocation().y + this._slotHeight;
            
            if (tBay.getBayRowDirection() === HorizontalArrange.RightToLeft) {
                posX = tSlot.getLocation().x - (displayWidth - this._slotWidth);
            }
        } catch (ex) {
            throw ex;
        }

        return new Point(posX, posY);
    }

    private invalidateTBay(tBay: TBay, bay: number, row: number) : boolean {
        if (tBay.getViewType() === ViewDirection.Front) {
            if (tBay.getBayRow() !== bay) return true;
        } else {
            if (tBay.getBayRow() !== row) return true;
        }
        return false;
    }
    
    setSelectionBayRowNo(block: string, bay: number, row: number, borderColor: Color, backgroundColor: Color) : void {
        let tBay = this.getTBay(block, bay, row);
        if (tBay === undefined) return;
        if (this.invalidateTBay(tBay, bay, row) === true) return;
        tBay.setSelectionBayRowNo(bay, row, borderColor, backgroundColor);
    }

    resetSelectionBayRowNo(block: string, bay: number, row: number) : void {
        let tBay = this.getTBay(block, bay, row);
        if (tBay === undefined) return;
        if (this.invalidateTBay(tBay, bay, row) === true) return;
        tBay.resetSelectionBayRowNo(bay, row);
    }

    resetAllSelectionBayRowNo() : void {
        const bayList = this.getDrawArea().getDefaultDrawList().getGeometryList("TBay", undefined, true) as TBay[];
        if (bayList === undefined) return;
        for (let item of bayList) {
            item.resetAllSelectionBayRowNo();
        }
    }

    removeBoundary(pViewDir: ViewDirection, pBlock: string, pBayRow: number) : void {
        this.getBoundaryHandler().removeBoundary(pViewDir, pBlock, pBayRow);
    }

    removeBoundaryWithBoundaryMode(pViewDir: ViewDirection, pBlock: string, pBayRow: number, boundaryType: BoundaryMode) : void {
        this.getBoundaryHandler().removeBoundaryWithBoundaryMode(pViewDir, pBlock, pBayRow, boundaryType);
    }

    private getBoundaryHandler() : BoundaryHandler {
        if (this._boundaryHandler === undefined) {
            this._boundaryHandler = new BoundaryHandler(this);
        }
        return this._boundaryHandler;
    }

    setBayRowNoToolTip(block: string, bay: number, row: number, toolTipText: string) : void {
        const tBay = this.getTBay(block, bay, row);
        if (tBay === undefined) return;
        if (this.invalidateTBay(tBay, bay, row)) return;
        tBay.setBayRowNoToolTip(bay, row, toolTipText);
    }

    setBayRowBarToolTip(block: string, bay: number, row: number, toolTipText: string) : void {
        const tBay = this.getTBay(block, bay, row);
        if (tBay === undefined) return;
        if (this.invalidateTBay(tBay, bay, row)) return;
        tBay.setBayRowBarToolTip(bay, row, toolTipText);
    }

    setContainerTotalQtyText(block: string, bayRow: number, totalQtyText: string) : void {
        const tBay = this.getTBayRow(block, bayRow);
        if (tBay) {
            tBay.setTotalQtyText(totalQtyText);
        }
    }
    
    addEquipment(viewDir: ViewDirection, equipmentItem: EquipmentSideItem) : void {
        if (this._visibleEquipment) {
            this.getBlockEquipmentHandler().addEquipment(viewDir, equipmentItem);
        }
    }

    removeEquipment(name: string) : void {
        if (this._visibleEquipment) {
            this.getBlockEquipmentHandler().removeEquipmentByKey(name);
        }
    }

    removeEquipmentDetail(viewDir: ViewDirection, name: string, blockName: string, fromBay: number, fromRow: number, toBay: number, toRow: number) : void {
        if (this._visibleEquipment) {
            this.getBlockEquipmentHandler().removeEquipmentDetail(viewDir, name, blockName, fromBay, fromRow, toBay, toRow);
        }
    }

    removeAllEquipment() : void {
        this.getBlockEquipmentHandler().removeAllEquipment();
    }

    getEquipmentItem(name: string, blockName: string, fromBay: number, fromRow: number, toBay: number, toRow: number) : EquipmentSideItem | undefined {
        return this.getBlockEquipmentHandler().getEquipmentItem(name, blockName, fromBay, fromRow, toBay, toRow);
    }

    private setVisibleEquipmentPrivate(visible: boolean) : void {
        this.getBlockEquipmentHandler().setVisibleEquipment(visible);
    }

    private drawArea_KeyUp(e: KeyboardEvent) : void {
        switch (e.key) {
            case "+":
                this.getDrawArea().zoomInOut(this.getDrawArea().getScale(ZoomType.PAGE_SCALE_IN));
                break;
            case "-":
                this.getDrawArea().zoomInOut(this.getDrawArea().getScale(ZoomType.PAGE_SCALE_OUT));
                break;
            default:
                break;
        }
    }

    private drawArea_MouseMove(e: MouseEvent) : void {
        if (!super.getDrawArea()) return;

        const eventArgs = new SlotClickEventArgs();
        eventArgs.mouseEvent = e;
        eventArgs.button = e.button;
        eventArgs.moveX = this.getDrawArea().getScrollX();
        eventArgs.moveY = this.getDrawArea().getScrollY();
        eventArgs.x = e.x - eventArgs.moveX;
        eventArgs.y = e.y - eventArgs.moveY;
        
        try {
            let point = new Point(e.x - eventArgs.x, e.y - eventArgs.y);
            const iList = this.getDrawArea().findAtPoint(point.x, point.y);
            for (let i = 0; i < iList.length; i++) {
                if (iList[i] instanceof TSlot) {
                    const tempSlot = iList[i] as TSlot;
                    eventArgs.block = tempSlot.block;
                    eventArgs.bay = tempSlot.bay;
                    eventArgs.row = tempSlot.row;
                    eventArgs.tier = tempSlot.tier;
                    break;
                } else if (iList[i] instanceof TContainer) {
                    const tContainer = iList[i] as TContainer;
                    eventArgs.block = tContainer.getContainerItem().block;
                    eventArgs.bay = tContainer.getContainerItem().bay;
                    eventArgs.row = tContainer.getContainerItem().row;
                    eventArgs.tier = tContainer.getContainerItem().tier;
                    break;
                }
            }

            if (this.viewMouseMove.isEmpty() === false) this.viewMouseMove.doEvent(this.getDrawArea(), eventArgs);
        } catch (ex) {
            throw ex;
        }
    }

    private proceedEvent(e: DrawCanvasEventArgs) : void {
        const slotClickArgs = new SlotClickEventArgs();
        slotClickArgs.mouseEvent = e.mouseEvent;
        slotClickArgs.button = e.mouseEvent.button;
        slotClickArgs.x = e.mouseEvent.x + this.getDrawArea().getScrollX();
        slotClickArgs.y = e.mouseEvent.y + this.getDrawArea().getScrollY();
        const buttonClickArgs = new SlotClickEventArgs();
        buttonClickArgs.mouseEvent = e.mouseEvent;
        buttonClickArgs.button = slotClickArgs.button;
        buttonClickArgs.x = slotClickArgs.x;
        buttonClickArgs.y = slotClickArgs.y;

        try {
            for (let i = 0; i < e.selectionList.length; i++) {
                if (e.selectionList[i] instanceof TSlot) {
                    this.setSlotEventArgs((e.selectionList[i] as TSlot), slotClickArgs);
                    break;
                } else if (e.selectionList[i] instanceof TBayRowNo) {
                    const tBayRowNo = e.selectionList[i] as TBayRowNo;
                    const bayRowNoEventArgs = this.makeBayRowNoClickEventArgs(e, tBayRowNo);
                    this.onBayRowNoClick(bayRowNoEventArgs);
                    break;
                } else if (e.selectionList[i] instanceof TBayRowBar) {
                    const tBayRowBar = e.selectionList[i] as TBayRowBar;
                    const bayRowBarEventArgs = this.makeBayRowBarClickEventArgs(e, tBayRowBar);
                    this.onBayRowBarClick(bayRowBarEventArgs);
                    break;
                } else if (e.selectionList[i] instanceof TBay) {
                    this.setBayEventArgs(e.selectionList[i] as TBay, slotClickArgs);
                    break;
                } else if (e.selectionList[i] instanceof TChassis) {
                    if (this.chassisClicked.isEmpty() === false) {
                        const chassis = e.selectionList[i] as TChassis;
                        const chassisDisplayEventArgs = new ChassisDisplayEventArgs(e.mouseEvent, chassis.getDwItem());
                        this.chassisClicked.doEvent(this, chassisDisplayEventArgs);
                    }
                    break;
                } else if (e.selectionList[i] instanceof TChassisGuide) {
                    if (this.chassisGuideClicked.isEmpty() === false) {
                        const chassisGuide = e.selectionList[i] as TChassisGuide;
                        const chassisGuideEventArgs = new ChassisGuideEventArgs(e.mouseEvent, chassisGuide.getChassGuideItem());
                        this.chassisGuideClicked.doEvent(this, chassisGuideEventArgs);
                    }
                    break;
                }
                
                if (e.mouseEvent.button === MouseButtons.Left) {
                    if (e.selectionList[i] instanceof TCloseButton) {
                        const tCloseButton = e.selectionList[i] as TCloseButton;
                        buttonClickArgs.block = tCloseButton.getBlock();
                        buttonClickArgs.blockViewDirection = tCloseButton.getViewType();
                        if (tCloseButton.getViewType() === ViewDirection.Side) {
                            buttonClickArgs.bay = -1;
                            buttonClickArgs.row = tCloseButton.getBayRow();
                        } else {
                            buttonClickArgs.bay = tCloseButton.getBayRow();
                            buttonClickArgs.row = -1;
                        }

                        this.clearBlock(tCloseButton.getBlock(), tCloseButton.getBayRow());
                        if (this.closeButtonClick.isEmpty() === false) this.closeButtonClick.doEvent(this.getDrawArea(), buttonClickArgs);
                        break;
                    }
                    
                    if (e.selectionList[i] instanceof TCraneButton) {
                        const tCraneButton = e.selectionList[i] as TCraneButton;
                        buttonClickArgs.block = tCraneButton.block;
                        if (tCraneButton.viewType === ViewDirection.Front)
                            buttonClickArgs.bay = tCraneButton.bayRow; else
                            buttonClickArgs.row = tCraneButton.bayRow;
                        if (this.craneButtonClick.isEmpty() === false) this.craneButtonClick.doEvent(tCraneButton, buttonClickArgs);
                        break;
                    }
                }
            }

            if (this.boundaryClicked.isEmpty() === false) {
                const boundaryEventArgs = this.getYBayViewEventHelper().makeBoundaryEventArgs(e.selectionList, e.mouseEvent);
                if (boundaryEventArgs) {
                    this.boundaryClicked.doEvent(this, boundaryEventArgs);
                    return;
                }
            }

            if (this.equipmentClicked.isEmpty() === false) {
                const equipmentEventArgs = this.getYBayViewEventHelper().makeEquipmentEventArgs(e.selectionList, e.mouseEvent);
                if (equipmentEventArgs) {
                    this.equipmentClicked.doEvent(this, equipmentEventArgs);
                    return;
                }
            }

            if (this.viewClick) this.viewClick.doEvent(this.getDrawArea(), slotClickArgs);
        } catch (ex) {
            throw ex;
        }
    }

    private drawArea_MouseDown(e: MouseEvent) : void {
        if (this.objectSelectionEventType === ObjectSelectionEventType.MouseDown) {
            const args = new DrawCanvasEventArgs(e);
            const downPointInDrawArea = new Point(e.pageX, e.pageY);
            args.selectionList = this.getDrawArea().findAllAtPoint(downPointInDrawArea.x, downPointInDrawArea.y);
            args.mouseEvent = e;
            this.proceedEvent(args);
        }
    }

    private drawArea_MouseUp(e: MouseEvent) : void {
        if (this.objectSelectionEventType === ObjectSelectionEventType.MouseUp) {
            const args = new DrawCanvasEventArgs(e);
            const downPointInDrawArea = new Point(e.pageX, e.pageY);
            args.selectionList = this.getDrawArea().findAllAtPoint(downPointInDrawArea.x, downPointInDrawArea.y);
            args.mouseEvent = e;
            this.proceedEvent(args);
        }
    }
    
    private drawArea_DrawableObjectClick(sender: any, e: DrawCanvasEventArgs) : void {
        if (this.objectSelectionEventType === ObjectSelectionEventType.MouseClick) {
            this.proceedEvent(e);
        }
    }

    private drawArea_DrawableObjectDoubleClick(sender: any, pEventInfo: DrawCanvasEventArgs) : void {
        const eventArgs = new SlotClickEventArgs();
        eventArgs.mouseEvent = pEventInfo.mouseEvent;
        eventArgs.button = pEventInfo.mouseEvent.button;
        eventArgs.moveX = this.getDrawArea().getScrollX();
        eventArgs.moveY = this.getDrawArea().getScrollY();
        eventArgs.x = pEventInfo.mouseEvent.x + eventArgs.moveX;
        eventArgs.y = pEventInfo.mouseEvent.y + eventArgs.moveY;
        
        try {
            for (let i = 0; i < pEventInfo.selectionList.length; i++) {
                if (pEventInfo.mouseEvent.button === MouseButtons.Left) {
                    if (pEventInfo.selectionList[i] instanceof TCloseButton) {
                        const tCloseButton = pEventInfo.selectionList[i] as TCloseButton;
                        eventArgs.block = tCloseButton.getBlock();
                        eventArgs.blockViewDirection = tCloseButton.getViewType();
                        if (tCloseButton.getViewType() === ViewDirection.Side) {
                            eventArgs.bay = -1;
                            eventArgs.row = tCloseButton.getBayRow();
                        } else {
                            eventArgs.bay = tCloseButton.getBayRow();
                            eventArgs.row = -1;
                        }
                        this.clearBlock(tCloseButton.getBlock(), tCloseButton.getBayRow());
                        if (this.closeButtonClick.isEmpty() === false) this.closeButtonClick.doEvent(this.getDrawArea(), eventArgs);
                    }
                }

                if (pEventInfo.selectionList[i] instanceof TSlot) {
                    this.setSlotEventArgs(pEventInfo.selectionList[i] as TSlot, eventArgs);
                    break;
                } else if (pEventInfo.selectionList[i] instanceof TContainer) {
                    this.setContainerEventArgs(pEventInfo.selectionList[i] as TContainer, eventArgs);
                    break;
                } else if (pEventInfo.selectionList[i] instanceof TBay) {
                    this.setBayEventArgs(pEventInfo.selectionList[i] as TBay, eventArgs);
                    break;
                }
            }

            if (this.viewDoubleClick.isEmpty() === false) this.viewDoubleClick.doEvent(this.getDrawArea(), eventArgs);
        } catch (ex) {
            throw ex;
        }
    }

    private drawArea_DrawableObjectDragSelect(sender: any, pEventInfo: DrawCanvasEventArgs) : void {
        try {
            const selectedHdl = new DragSelectedHandler(this, pEventInfo);
            const currentTBay = selectedHdl.getCurrentTBay();
            const isMultiSelectedBay = selectedHdl.isMultiSelectedBay();
            const slotPositionList = selectedHdl.getSelectedSlotItems();

            if (currentTBay === undefined) {
                return;
            }

            if (this.allowMultiSelection === false) {
                if (isMultiSelectedBay) {
                    return;
                }

                if (selectedHdl.existSelectedSlot() === true && selectedHdl.existSelectedBayRowNo() === true) {
                    return;
                }

                if (selectedHdl.existSelectedSlot() === false && selectedHdl.existSelectedBayRowNo() === true) {
                    if (this.bayRowNoDragSelect.isEmpty() === false) {
                        const eventArgs = this.getYBayViewEventHelper().makeBayRowNoDragSelectedEventArgs(pEventInfo, currentTBay.getViewType(), selectedHdl.getSelectedBayRowNoList());
                        if (eventArgs) this.onBayRowNoDragSelected(eventArgs);
                    }
                    return;
                }

                const dargBoundary = pEventInfo.getDragBoundary();
                const bayBoundary = DrawableUtil.getRectangle(currentTBay.getBounds(), this.getDrawArea().getPageScale());

                if (currentTBay) {
                    if (!bayBoundary.containsRectangle(dargBoundary)) {
                        return;
                    }
                }
            }

            if (slotPositionList.length === 0) {
                return;
            }

            if (this.slotDraggingSelected.isEmpty() === false && slotPositionList.length > 0) {
                const eventArgs = this.getYBayViewEventHelper().makeSlotDraggingSelectedEventArgs(pEventInfo, selectedHdl);
                if (eventArgs) {
                    this.slotDraggingSelected.doEvent(this.getDrawArea(), eventArgs);
                    return;
                }
            }

            if (slotPositionList.length > 0) {
                const eventArgs = new SlotDragEventArgs();
                eventArgs.mouseEvent = pEventInfo.mouseEvent;
                eventArgs.selectedList = slotPositionList;
                if (this.viewMouseBoundary.isEmpty() === false) this.viewMouseBoundary.doEvent(this.getDrawArea(), eventArgs);
            }
        } catch (ex) {
            throw ex;
        }
    }

    private getYBayViewEventHelper() : YBayViewEventHelper {
        if (this._evtMakeHelper === undefined) {
            this._evtMakeHelper = new YBayViewEventHelper();
        }
        return this._evtMakeHelper;
    }

    private addEventHandler(): void {
        window.addEventListener("keyup", this.drawArea_KeyUp.bind(this));
        window.addEventListener("mousemove", this.drawArea_MouseMove.bind(this));
        window.addEventListener("mousedown", this.drawArea_MouseDown.bind(this));
        window.addEventListener("mouseup", this.drawArea_MouseUp.bind(this));
        this.getDrawArea().drawableObjectClick.addEvent(this.drawArea_DrawableObjectClick.bind(this));
        this.getDrawArea().drawableObjectDoubleClick.addEvent(this.drawArea_DrawableObjectDoubleClick.bind(this));
        this.getDrawArea().drawableObjectDragSelect.addEvent(this.drawArea_DrawableObjectDragSelect.bind(this));
    }
    
    private makeBayRowNoClickEventArgs(e: DrawCanvasEventArgs, tBayRowNo: TBayRowNo) : YardBayRowNoEventArgs {
        const item = new YardBayRowNoSelectItem();
        item.block = tBayRowNo.block;
        item.bay = tBayRowNo.bay;
        item.row = tBayRowNo.row;
        item.viewType = tBayRowNo.viewType;
        const bayRowNoEventArgs = new YardBayRowNoEventArgs(e.mouseEvent, e.eventType, [item]);
        return bayRowNoEventArgs;
    }

    private makeBayRowBarClickEventArgs(e: DrawCanvasEventArgs, tBayRowBar: TBayRowBar) : YardBayRowBarEventArgs {
        const item = new YardBayRowNoSelectItem();
        item.block = tBayRowBar.block;
        item.bay = tBayRowBar.bay;
        item.row = tBayRowBar.row;
        item.viewType = tBayRowBar.viewType;
        const bayRowBarEventArgs = new YardBayRowBarEventArgs(e.mouseEvent, e.eventType, item);
        return bayRowBarEventArgs;
    }

    private setSlotEventArgs(tSlot: TSlot, eventArgs: SlotClickEventArgs) : void {
        eventArgs.block = tSlot.block;
        eventArgs.bay = tSlot.bay;
        eventArgs.row = tSlot.row;
        eventArgs.tier = tSlot.tier;
    }

    private setContainerEventArgs(container: any, eventArgs: SlotClickEventArgs) : void {
        let containerItem = undefined;
        if (container instanceof TContainer) {
            containerItem = (container as TContainer).getContainerItem();
        }

        if (containerItem) {
            eventArgs.block = containerItem.block;
            eventArgs.bay = containerItem.bay;
            eventArgs.row = containerItem.row;
            eventArgs.tier = containerItem.tier;
            eventArgs.ytLaneLocTypes = containerItem.ytLaneLocTypes;
        }
    }

    private setBayEventArgs(tbay: TBay, eventArgs: SlotClickEventArgs) : void {
        eventArgs.block = tbay.getBlock();
        if (tbay.getViewType() === ViewDirection.Front) {
            eventArgs.bay = tbay.getBayRow();
        } else {
            eventArgs.row = tbay.getBayRow();
        }
    }

    protected onBayRowNoClick(e: YardBayRowNoEventArgs) : void {
        if (this.bayRowNoClick.isEmpty() === false) this.bayRowNoClick.doEvent(this, e);
    }

    protected onBayRowNoDragSelected(e: YardBayRowNoEventArgs) : void {
        if (e === undefined) return;
        if (this.bayRowNoDragSelect.isEmpty() === false) {
            this.bayRowNoDragSelect.doEvent(this, e);
        }
    }

    protected onBayRowBarClick(e: YardBayRowBarEventArgs) : void {
        if (this.bayRowBarClick.isEmpty() === false) this.bayRowBarClick.doEvent(this, e);
    }

    private getGeomObjectInTCanvas(objectName: string) : IBaseGeometry | undefined {
        try {
            const iList = this.getDrawArea().findAllByKey(objectName);
            if (iList.length > 0) {
                return iList[0] as IBaseGeometry;
            } else
                return undefined;
        } catch (ex) {
            throw ex;
        }
    }

    private removeObjectInCanvas(objectName: string) : void {
        const iList = this.getDrawArea().findAllByKey(objectName);
        if (iList.length > 0) {
            for (let i = 1; i <= iList.length; i++)
                this.getDrawArea().removeDrawableObject(iList[i - 1] as IDrawableGeometry);
        }
    }

    private getTBayIndex(block: string, bayRow: number) : number {
        try {
            return this._bayRowList.findIndex((x: TBayRowGroup) => { return x.block === block && x.bayRow === bayRow; });
        } catch (ex) { 
            return -1; 
        }
    }

    render() {
        return (
            <div id='parent' style={{
                maxHeight:'1024px',
                maxWidth:'1300px',
                overflow:'auto'
                }}>
                <DrawArea ref={this._drawAreaRef} />
            </div>
        )
    }
}

export default YBayView