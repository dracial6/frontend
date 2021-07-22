import IBlinkable from "../elements/IBlinkable";
import IDragable from "../elements/IDragable";
import { Color } from "../structures";
import IGeomContainer from "./IGeomContainer";
import IGeomMarking from "./IGeomMarking";
import ContainerGeneralItem from "./items/ContainerGeneralItem";
import { GeneralBayType, HatchDefine, MarkingTypes, ZoomRatioInfo } from "./structures";
import { CEHeightTypes } from "./structures";
import CETandemFlags from "./structures/CETandemFlags";
import TBaseGeneral from "./TBaseGeneral";
import TBayProperty from "./TBayProperty";

class TContainer extends TBaseGeneral implements IBlinkable, IDragable, IGeomMarking, IGeomContainer {
    private _drawItem = new ContainerGeneralItem();
    private _generalBayType: GeneralBayType;
    private _zoomRate: number;
    private _defaultBorderColor = Color.Black();
    private _boundMode = 0;
    private _rowIndex = 0;
    private _tierIndex = 0;
    private _iCellW = 0;
    private _iCellH = 0;
    private _x_c = 0;
    private _y_c = 0;
    private _x_s = 0;
    private _x_f = 0;
    private _y_s = 0;
    private _y_f = 0;
    private _x_s_in = 0;
    private _x_f_in = 0;
    private _y_s_in = 0;
    private _y_f_in = 0;
    private _pageScale = 1;
    private _isViewMarking = false;
    private _markingBorderColor = Color.Transparent();
    private _markingBackColor = Color.Transparent();
    private _containerMarkingType = MarkingTypes.CIRCLE;
    private _lineThick = 0;

    isDragable = true;
    viewContainerSize = 20;
    isGray = false;
    searchKey: string = '';
    markingSizeRatio: number = 4;
    isTandemClose: boolean = true;
    heightRate = 1;
    
    readonly IsOverlap: boolean;
    readonly DEFAULT_LINE_WIDTH: number = 0.5;

    constructor(key: string, drawItem: ContainerGeneralItem, zoomRatioInfo: ZoomRatioInfo
        , isOverlap: boolean, viewContainerSize: number, tBayProperty: TBayProperty, generalBayType: GeneralBayType) {
        super(key, tBayProperty);
        
        this.setDrawItem(drawItem);
        this.zoomRatioInfo = zoomRatioInfo;
        this._zoomRate = zoomRatioInfo.zoomRatio;

        this.IsOverlap = isOverlap;
        this.viewContainerSize = viewContainerSize;
        this._generalBayType = generalBayType;

        if (drawItem) {
            this._defaultBorderColor = this.getSlotBoardColor(drawItem.bay, drawItem.row, drawItem.tier);
            this.searchKey = drawItem.searchKey;
        }

        this.markingSizeRatio = 4;
    }

    getDrawItem(): ContainerGeneralItem {
        return this._drawItem;
    }

    setDrawItem(item: ContainerGeneralItem): void {
        this._drawItem = item;
        this._rowIndex = this._drawItem.row;
        this._tierIndex = this._drawItem.tier;
        this._boundMode = this._drawItem.boundMode;
        this.searchKey = this._drawItem.searchKey;
    }

    getDragData(): object {
        return this._drawItem;
    }

    drawShipCellOverSlotSymbol(ctx: CanvasRenderingContext2D) {
        if (this._drawItem.osh + this._drawItem.oss + this._drawItem.osp <= 0) return;

        let iHght_x, iHght_y;
        let iPort_x, iPort_y;
        let iSTDB_x, iSTBD_y;

        if (this._drawItem.osh > 0) {
            iHght_x = this._x_s + this._iCellW / 2;
            iHght_y = this._y_s + this._iCellH / 4;

            
        }
    }

    getMarked(): boolean {
        return false;
    }
    setMarking(visible: boolean): void {
        
    }
    setMarkingByType(visible: boolean, markingType: MarkingTypes): void {
        
    }
    setMarkingColor(visible: boolean, backColor: Color, borderColor: Color): void {
        
    }
    setMarkingBorderByType(visible: boolean, backColor: Color, borderColor: Color, markingType: MarkingTypes): void {
        
    }
    setMarkingBorderThickByType(visible: boolean, backColor: Color, borderColor: Color, markingType: MarkingTypes, lineThick: number): void {
        
    }
    getBlock(): string {
        return '';
    }
    getBay(): number {
        return 1;
    }
    getRow(): number {
        return 1;
    }
    getTier(): number {
        return 1;        
    }
    getHeightType(): CEHeightTypes {
        return CEHeightTypes.H43;
    }
    getTandemDir(): CETandemFlags {
        return CETandemFlags.NONE;
    }
}

export default TContainer;