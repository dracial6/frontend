import DrawableUtil from "../../utils/DrawableUtil";
import DrawRectangle from "../elements/DrawRectangle";
import DrawText from "../elements/DrawText";
import { Color, FontStyles, Padding, Point, Rectangle, Size } from "../structures";
import ContentAlignment from "../structures/ContentAlignment";
import GeneralPRFSEQCountItem from "./items/GeneralPRFSEQCountItem";
import GeneralQCScheduleItem from "./items/GeneralQCScheduleItem";
import { BayType, HatchDefine } from "./structures";
import TBaseGeneral from "./TBaseGeneral";
import TBayProperty from "./TBayProperty";
import TContainerSizeButton from "./TContainerSizeButton";
import THatchSequenceButton from "./THatchSequenceButton";

class TBaySchedule extends TBaseGeneral {
    private _borderColor = Color.LightGray();
    private _dTitle: DrawText = new DrawText('');
    private _hTitle: DrawText = new DrawText('');
    private _qcDeckScheduleMap = new Map<string, GeneralQCScheduleItem>();
    private _qcHoldScheduleMap = new Map<string, GeneralQCScheduleItem>();
    private _pRFSEQCountItem = new GeneralPRFSEQCountItem();
    private _size20?: TContainerSizeButton;
    private _size40?: TContainerSizeButton;
    private _isVisibleSizeButton = false;
    private _holdQCScheduleHatchClear?: DrawRectangle;
    private _deckQCScheduleHatchClear?: DrawRectangle;

    bay = 0;

    constructor(key: string, bay: number, bayType: BayType, tBayProperty: TBayProperty) {
        super(key, tBayProperty);

        this.bay = bay;
        this.attribute.isOutLine = true;
        this.attribute.outLineColor = Color.Gray();

        if (BayType.Hatch === bayType) {
            this._isVisibleSizeButton = true;
        }

        this.padding = new Padding(3, 3, 3, 3);
        this.intialize();
    }

    intialize(): void {
        this._holdQCScheduleHatchClear = new DrawRectangle(this.name + "_H_S_Clear");
        this._holdQCScheduleHatchClear.attribute.lineColor = Color.White();
        this._holdQCScheduleHatchClear.attribute.fillColor = Color.White();
        this.addGeomObject(this._holdQCScheduleHatchClear);

        this._deckQCScheduleHatchClear = new DrawRectangle(this.name + "_D_S_Clear");
        this._deckQCScheduleHatchClear.attribute.lineColor = Color.White();
        this._deckQCScheduleHatchClear.attribute.fillColor = Color.White();
        this.addGeomObject(this._deckQCScheduleHatchClear);

        this._dTitle = new DrawText(this.name + "_D");
        this._dTitle.setLocation(new Point(this.padding.left, this.padding.top));
        this._dTitle.setSize(new Size(10, HatchDefine.QCSEQ_CELLH));
        this._dTitle.attribute.fontName = HatchDefine.CASP_SMALL_FONT;
        this._dTitle.attribute.fontSize = 6.75;
        this._dTitle.attribute.fontStyle = FontStyles.bold;
        this._dTitle.attribute.outLineColor = HatchDefine.BORDER_COLOR;
        this._dTitle.attribute.textAlign = ContentAlignment.BottomRight;
        this._dTitle.text = "D";
        this.addGeomObject(this._dTitle);

        this._hTitle = new DrawText(this.name + "_H");
        this._hTitle.setLocation(new Point(this.padding.left, this.padding.top + this._dTitle.getRealTextSize().height + HatchDefine.ROW_GAP));
        this._hTitle.setSize(new Size(10, HatchDefine.QCSEQ_CELLH));
        this._hTitle.attribute.fontName = HatchDefine.CASP_SMALL_FONT;
        this._hTitle.attribute.fontSize = 6.75;
        this._hTitle.attribute.fontStyle = FontStyles.bold;
        this._hTitle.attribute.outLineColor = HatchDefine.BORDER_COLOR;
        this._hTitle.attribute.textAlign = ContentAlignment.BottomRight;
        this._hTitle.text = "H";
        this.addGeomObject(this._hTitle);

        if (this._isVisibleSizeButton) {
            this._size20 = new TContainerSizeButton(this.bay, this.name + "_CS_BTN_20", 20, this.PROPERTY);
            this._size20.setIsPressed(true);
            this._size20.setSize(new Size(HatchDefine.QCSEQ_CELLW, HatchDefine.QCSEQ_CELLH));
            this.addGeomObject(this._size20);

            this._size40 = new TContainerSizeButton(this.bay, this.name + "_CS_BTN_40", 40, this.PROPERTY);
            this._size40.setIsPressed(false);
            this._size40.setSize(new Size(HatchDefine.QCSEQ_CELLW, HatchDefine.QCSEQ_CELLH));
            this.addGeomObject(this._size40);
        }
    }

    setTitleColor(dhMode: number, foreColor: Color, backColor: Color): void {
        const key = this.name + (dhMode === 1 ? "_D" : "_H");
        const baseGeometry = this.find(key);

        if (baseGeometry) {
            baseGeometry.attribute.lineColor = foreColor;
            baseGeometry.attribute.fillColor = backColor;
            baseGeometry.isChanged = true;
        }
    }

    setSize(size: Size): void {
        super.setSize(size);

        let startX = 0;
        if (this.PROPERTY.ischkPRFSEQ) {
            startX = this.getCurrentSize().width - (HatchDefine.PRFSEQ_WIDTH + HatchDefine.QCSEQ_CELLW + HatchDefine.COLUMN_GAP);
        } else {
            startX = this.getCurrentSize().width - (HatchDefine.QCSEQ_CELLW + HatchDefine.COLUMN_GAP);
        }

        if (this._isVisibleSizeButton) {
            if (this._size20) this._size20.setLocation(new Point(startX, this.padding.top));
            if (this._size40) this._size40.setLocation(new Point(startX, this.padding.top + this._dTitle.getTextSize().height + HatchDefine.ROW_GAP));
        }                    

        this.visibleQCScheduleHatch(startX);
    }

    selectContainerSizeButton(containerSize: number): void {
        if (this._isVisibleSizeButton && this._size20 && this._size40) { 
            this._size20.setIsPressed(false);
            this._size40.setIsPressed(false);
            if (containerSize === 20) {
                this._size20.setIsPressed(true);
            } else if (containerSize === 40) {
                this._size40.setIsPressed(true);
            }

            this._size20.isChanged = true;
            this._size40.isChanged = true;
        }
    }

    static getQCScheduleHatchKey(qcScheduleItem: GeneralQCScheduleItem): string {
        return "THachButton_" + qcScheduleItem.qcSEQ + "_" +  qcScheduleItem.dhMode + "_" + qcScheduleItem.backColor.toRGBA();
    }

    addQCScheduleHatch(qcScheduleItem: GeneralQCScheduleItem): void {
        const key = TBaySchedule.getQCScheduleHatchKey(qcScheduleItem);
        const baseGeometry = this.find(key);
        let hatchButton;
        
        if (baseGeometry) {
            hatchButton = baseGeometry as THatchSequenceButton;
            hatchButton.qcScheduleItem = qcScheduleItem;
            
            if (qcScheduleItem.dhMode === 1) {
                if (this._qcDeckScheduleMap.has(key)) {
                    this._qcDeckScheduleMap.delete(key);
                }         
            } else {
                if (this._qcHoldScheduleMap.has(key)){
                    this._qcHoldScheduleMap.delete(key);
                }
            }
        } else {
            hatchButton = new THatchSequenceButton(key, qcScheduleItem, this.PROPERTY);
            this.addGeomObject(hatchButton);
        }

        if (qcScheduleItem.dhMode === 1) {
            if (this._qcDeckScheduleMap.entries.length === 0) {
                hatchButton.setIsPressed(true);
            }

            if (!this._qcDeckScheduleMap.has(key)) {
                this._qcDeckScheduleMap.set(key, qcScheduleItem);
            }  
        } else {
            if (this._qcHoldScheduleMap.entries.length === 0) {
                hatchButton.setIsPressed(true);
            }

            if (!this._qcHoldScheduleMap.has(key)) {
                this._qcHoldScheduleMap.set(key, qcScheduleItem);
            }
        }
    }

    removeQCScheduleHatch(qcScheduleItem: GeneralQCScheduleItem): void {
        const key = TBaySchedule.getQCScheduleHatchKey(qcScheduleItem);
        const baseGeometry = this.find(key);
        let scheduleCount;
        
        if (baseGeometry) {
            if (qcScheduleItem.dhMode === 1) {
                scheduleCount = this._qcDeckScheduleMap.entries.length;
                if (this._qcDeckScheduleMap.has(key)) {
                    this._qcDeckScheduleMap.delete(key);
                }
            } else {
                scheduleCount = this._qcHoldScheduleMap.entries.length;
                if (this._qcHoldScheduleMap.has(key)) {
                    this._qcHoldScheduleMap.delete(key);
                }
            }

            this.removeGeomObjectKey(key);
            this.clearQCScheduleHatchArea(qcScheduleItem.dhMode);
        }
    }

    clearQCScheduleHatch(deckHold: number): void {
        let key: string;
        if (deckHold === 1) {
            this._qcDeckScheduleMap.forEach(element => {
                key = TBaySchedule.getQCScheduleHatchKey(element);
                this.removeGeomObjectKey(key);
            });

            this._qcDeckScheduleMap.clear();
        } else {
            this._qcHoldScheduleMap.forEach(element => {
                key = TBaySchedule.getQCScheduleHatchKey(element);
                this.removeGeomObjectKey(key);
            });

            this._qcHoldScheduleMap.clear();
        }

        this.clearQCScheduleHatchArea(deckHold);
    }

    private clearQCScheduleHatchArea(deckHold: number): void {
        const startX = this.padding.left + this._dTitle.getSize().width + 2;
        const dStartY = this.padding.top;
        const hStartY = this.padding.top + this._dTitle.getTextSize().height + HatchDefine.ROW_GAP;
        
        let maxWidth = 0;
        if (this._size20) {
            maxWidth = this._size20.getLocation().x - 1;
        } else {
            maxWidth = this.getSize().width - 1;
        }

        if (deckHold === 1) {
            this._deckQCScheduleHatchClear?.setLocation(new Point(startX, dStartY));
            this._deckQCScheduleHatchClear?.setSize(new Size(maxWidth - (startX + 2), HatchDefine.QCSEQ_CELLH + 1));
            if (this._deckQCScheduleHatchClear) {
                this._deckQCScheduleHatchClear.isChanged = true;
                DrawableUtil.calculateAncher(this, this._deckQCScheduleHatchClear);
            }
        } else {
            this._holdQCScheduleHatchClear?.setLocation(new Point(startX, hStartY));
            this._holdQCScheduleHatchClear?.setSize(new Size(maxWidth - (startX + 2), HatchDefine.QCSEQ_CELLH + 1));
            if (this._holdQCScheduleHatchClear) {
                this._holdQCScheduleHatchClear.isChanged = true;
                DrawableUtil.calculateAncher(this, this._holdQCScheduleHatchClear);
            }
        }
    }

    arrangeQCScheduleHatch(): void {
        const list = this.getGeomList();
        const count = list.length;
        let seqBtn: THatchSequenceButton;

        let dChkCount = 0;
        let hChkCount = 0;
        const startX = this.padding.left + this._dTitle.getSize().width;
        const dStartY = this.padding.top;
        const hStartY = this.padding.top + this._dTitle.getTextSize().height + HatchDefine.ROW_GAP;
        let gap = 0;

        for (let index = count - 1; index >= 0; index--) {
            if (list[index] instanceof THatchSequenceButton) {
                seqBtn = list[index] as THatchSequenceButton;
                if (seqBtn.qcScheduleItem.dhMode === 1) {
                    gap = (dChkCount + 1) * HatchDefine.COLUMN_GAP;
                    seqBtn.setLocation(new Point(startX + gap + HatchDefine.QCSEQ_CELLW * dChkCount, dStartY));
                    dChkCount++;
                } else {
                    gap = (hChkCount + 1) * HatchDefine.COLUMN_GAP;
                    seqBtn.setLocation(new Point(startX + gap + HatchDefine.QCSEQ_CELLW * hChkCount, hStartY));
                    hChkCount++;
                }
            }
        }

        this.setSize(this.getSize());
    }

    visibleQCScheduleHatch(viewEndX: number): void {
        const list = this.getGeomList();
        const count = list.length;
        let seqBtn: THatchSequenceButton;
        let visible = false;

        for (let index = count - 1; index >= 0; index--)
        {
            visible = false;
            if (list[index] instanceof THatchSequenceButton)
            {
                seqBtn = list[index] as THatchSequenceButton;

                if (seqBtn.getLocation().x + seqBtn.getSize().width < viewEndX) {
                    visible = true;
                }

                seqBtn.visible = visible;
                seqBtn.isChanged = visible;
            }
        }
    }

    selectQCScheduleHatchBtn(qcScheduleItem: GeneralQCScheduleItem): void {
        const key1 = TBaySchedule.getQCScheduleHatchKey(qcScheduleItem);
        let map;

        if (qcScheduleItem.dhMode === 1) {
            map = this._qcDeckScheduleMap;
        } else {
            map = this._qcHoldScheduleMap;
        }

        map.forEach(element => {
            const key2 = TBaySchedule.getQCScheduleHatchKey(element);
            const baseGeometry = this.find(key2);

            if (baseGeometry !== null) {
                (baseGeometry as THatchSequenceButton).setIsPressed(false);

                if (key1 === key2) {
                    (baseGeometry as THatchSequenceButton).setIsPressed(true);
                }
            }
        });
    }

    getSelectedQCScheduleHatch(dhMode: number): GeneralQCScheduleItem | undefined {
        let map;
        
        if (dhMode === 1) {
            map = this._qcDeckScheduleMap;
        } else {
            map = this._qcHoldScheduleMap;
        }

        map.forEach(element => {
            const key2 = TBaySchedule.getQCScheduleHatchKey(element);
            const baseGeometry = this.find(key2);

            if (baseGeometry !== null) {
                if ((baseGeometry as THatchSequenceButton).getIsPressed()) {
                    return (baseGeometry as THatchSequenceButton).qcScheduleItem;
                }
            }
        });

        return undefined;
    }

    setQCScheduleHatch(pRFSEQCountItem: GeneralPRFSEQCountItem): void {
        this._pRFSEQCountItem = pRFSEQCountItem;
        this.setSize(this.getSize());
        this.isChanged = true;
    }

    selectContainerSizeBtn(containerSize: number): void {
        this._size20?.setIsPressed(false);
        this._size40?.setIsPressed(false);

        if (containerSize === 20) {
            this._size20?.setIsPressed(true);
        } else if (containerSize === 40) {
            this._size40?.setIsPressed(true);
        }
    }

    getSelectedContainerSize(): number {
        if (this._size20?.getIsPressed()) {
            return this._size20.ContainerSize;
        } else if (this._size40) {
            return this._size40.ContainerSize;
        }

        return 0;
    }

    drawDetail(ctx: CanvasRenderingContext2D, pageScale: number, canvasBoundary: Rectangle, isMemoryCache: boolean) {
        super.drawDetail(ctx, pageScale, canvasBoundary, isMemoryCache);
    }

    private drawBaySchedule(ctx: CanvasRenderingContext2D): void {
        if (this.PROPERTY.ischkPRFSEQ) {
            const rightPadding = 2;
            const outLine = new DrawRectangle(this.name + "_OL_PRF");
            outLine.attribute.lineColor = Color.LightGray();
            outLine.setLocation(this.getRealLocation(new Point(this.getCurrentSize().width - HatchDefine.PRFSEQ_WIDTH, 0)));
            outLine.setSize(new Size(HatchDefine.PRFSEQ_WIDTH, this.getCurrentSize().height));
            outLine.draw(ctx);

            if (this._pRFSEQCountItem) {
                const prfDeckSeq = new DrawText(this.name + "_D_PRF");
                prfDeckSeq.attribute.fontName = HatchDefine.CASP_SMALL_FONT;
                prfDeckSeq.attribute.fontSize = 6.75;
                prfDeckSeq.attribute.fontStyle = FontStyles.bold;
                prfDeckSeq.attribute.lineColor = Color.Black();
                prfDeckSeq.attribute.fillColor = Color.White();

                prfDeckSeq.attribute.textAlign = ContentAlignment.BottomRight;
                prfDeckSeq.text = this._pRFSEQCountItem.deckQtyTotal.toString().padStart(3)
                    + "/" + this._pRFSEQCountItem.deckQtySEQ.toString().padStart(3);

                let txtSize = prfDeckSeq.getTextSize();
                prfDeckSeq.setLocation(this.getRealLocation(new Point(this.getCurrentSize().width - (txtSize.width + 2) - rightPadding, this.padding.top)));
                prfDeckSeq.setSize(new Size(txtSize.width, HatchDefine.QCSEQ_CELLH));
                prfDeckSeq.draw(ctx);

                const prfHoldSeq = new DrawText(this.name + "_H_PRF");
                prfHoldSeq.attribute.fontName = HatchDefine.CASP_SMALL_FONT;
                prfHoldSeq.attribute.fontSize = 6.75;
                prfHoldSeq.attribute.fontStyle = FontStyles.bold;
                prfHoldSeq.attribute.lineColor = Color.Black();
                prfHoldSeq.attribute.fillColor = Color.White();
                prfDeckSeq.attribute.textAlign = ContentAlignment.BottomRight;
                prfHoldSeq.text = this._pRFSEQCountItem.holdQtyTotal.toString().padStart(3)
                    + "/" + this._pRFSEQCountItem.holdQtySEQ.toString().padStart(3);

                txtSize = prfHoldSeq.getTextSize();
                prfHoldSeq.setLocation(this.getRealLocation(new Point(this.getCurrentSize().width - (txtSize.width + 2) - rightPadding, this.padding.top + this._dTitle.getTextSize().height + HatchDefine.ROW_GAP)));
                prfHoldSeq.setSize(new Size(txtSize.width, HatchDefine.QCSEQ_CELLH));
                prfHoldSeq.draw(ctx);
            }
        }
    }
}

export default TBaySchedule;