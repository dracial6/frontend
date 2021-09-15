import DrawEllipse from "../../../drawing/elements/DrawEllipse";
import DrawLine from "../../../drawing/elements/DrawLine";
import DrawPolygon from "../../../drawing/elements/DrawPolygon";
import DrawRectangle from "../../../drawing/elements/DrawRectangle";
import DrawText from "../../../drawing/elements/DrawText";
import DrawTriangle from "../../../drawing/elements/DrawTriangle";
import GeometryEllipse from "../../../drawing/elements/GeometryEllipse";
import GeometryTriangle from "../../../drawing/elements/GeometryTriangle";
import IDragable from "../../../drawing/elements/IDragable";
import { Color, ContentAlignment, FontStyles, Point, Rectangle, Size, TriangleDir } from "../../../drawing/structures";
import StringUtil from "../../../utils/StringUtil";
import ContainerBayItem from "../../common/items/ContainerBayItem";
import CustomTextItem from "../../common/items/CustomTextItem";
import IGeomMarking from "../../shipplan/IGeomMarking";
import { MarkingTypes } from "../../shipplan/structures";
import SideStyles from "../structures/SideStyles";
import TBaseContainer from "../TBaseContainer";
import OverContainerUtil from "../utils/OverContainerUtil";

class TContainer extends TBaseContainer implements IDragable, IGeomMarking {
    TContainer = 0;

    private _width = 0;
    private _height = 0;
    private _zoomRate = 0;
    private _fontRate = 0;
    private _mySlot: ContainerBayItem;
    private _isViewMarking = false;
    private _markingBackColor = Color.Blue();
    private _markingBorderColor = Color.Blue();
    private _markingType = MarkingTypes.CIRCLE;
    private _lineThick = 0;
    private _topOverSlot = 0;
    private _leftOverSlot = 0;
    
    isDragable = true;
    markingSizeRatio = 0;

    constructor(key: string, cntr: ContainerBayItem, cntrWidth: number, slotWidth: number, slotHeight: number, zoomRate: number, fontRate: number) {
        super(key);
        this.searchKey = cntr.searchKey;
        this._mySlot = cntr;
        this._width = cntrWidth;
        this._height = slotHeight;
        this._zoomRate = zoomRate;
        this._fontRate = fontRate;
        super.setSize(new Size(this._width, this._height));

        if (this._mySlot.isOSP) {
            this._leftOverSlot = slotWidth * 0.2;
        }

        if (this._mySlot.isOSH) {
            this._topOverSlot = slotWidth * 0.2;
        }

        this.markingSizeRatio = 4;
    }

    drawDetail(ctx: CanvasRenderingContext2D, pageScale: number, canvasBoundary: Rectangle, isMemoryCache: boolean) {
        this.drawContainer(ctx);
        super.drawDetail(ctx, pageScale, canvasBoundary, isMemoryCache);
    }

    private drawBackground(ctx: CanvasRenderingContext2D): void {
        const cntrRect = new DrawRectangle(this.name + "_CntrRect");
        cntrRect.setLocation(super.getRealLocation(Point.empty()));
        cntrRect.attribute.lineThick = this._zoomRate * this._mySlot.borderWidth;
        cntrRect.attribute.lineAlign = this._mySlot.borderAlignment;
        cntrRect.attribute.lineColor = this._mySlot.borderColor;
        cntrRect.attribute.fillColor = this._mySlot.backColor;
        cntrRect.setSize(super.getSize());
        cntrRect.draw(ctx);

        const location = cntrRect.getLocation();
        const size = cntrRect.getSize();
        const x_c = location.x;
        const y_c = location.y;
        const x_s = x_c;
        const x_f = x_c + size.width;
        const y_s = y_c;
        const y_f = y_c + size.height;
        const x_s_in = x_s + 1;
        const x_f_in = x_f - 1;
        const y_s_in = y_s + 1;
        const y_f_in = y_f - 1;

        if (this._mySlot.backColorLeft.toRGBA() !== Color.Transparent().toRGBA()) {
            const backLeftBG = new DrawRectangle("");
            backLeftBG.setLocation(new Point(x_s_in, y_s_in));
            backLeftBG.setSize(new Size((x_f_in - x_s_in) / 2, y_f_in - y_s_in));
            backLeftBG.attribute.lineColor = this._mySlot.backColorLeft;
            backLeftBG.attribute.fillColor = this._mySlot.backColorLeft;
            backLeftBG.draw(ctx);
        }

        if (this._mySlot.backColorRight.toRGBA() !== Color.Transparent().toRGBA()) {
            const backRightBG = new DrawRectangle("");
            backRightBG.setLocation(new Point(x_s_in + ((x_f_in - x_s_in) / 2), y_s_in));
            backRightBG.setSize(new Size((x_f_in - x_s_in) / 2, y_f_in - y_s_in));
            backRightBG.attribute.lineColor = this._mySlot.backColorRight;
            backRightBG.attribute.fillColor = this._mySlot.backColorRight;
            backRightBG.draw(ctx);
        }

        this.drawDangerousCargo(ctx);
    }

    private drawCellBookMark(ctx: CanvasRenderingContext2D) : void {
        if (this._mySlot.cellBookMark === false) return;
        const location = super.getRealLocation(Point.empty());
        const points: Point[] = [];
        points.push(new Point(location.x + 8, location.y + 1));
        points.push(new Point(location.x + 14, location.y + 1));
        points.push(new Point(location.x + 14, location.y + 6));
        points.push(new Point(location.x + 11, location.y + 9));
        points.push(new Point(location.x + 8, location.y + 6));
        points.push(new Point(location.x + 8, location.y + 1));
        const bookMark = new DrawPolygon("", points);
        bookMark.attribute.fillColor = this._mySlot.cellBookMarkBackColor;
        bookMark.attribute.lineColor = this._mySlot.cellBookMarkLineColor;
        bookMark.draw(ctx);
    }

    private drawRemarshallingSequence(ctx: CanvasRenderingContext2D) : void {
        if (this._mySlot.remarshallingSequence && this._mySlot.remarshallingSequence.text !== "") {
            const remarshallingSequence = new DrawText(this.name + "_RemarshallingSequence");
            remarshallingSequence.attribute.fontName = "tahoma";
            remarshallingSequence.attribute.fontStyle = this._mySlot.remarshallingSequence.getTextStyle();
            remarshallingSequence.attribute.textAlign = ContentAlignment.MiddleRight;
            remarshallingSequence.attribute.fontSize = this._mySlot.remarshallingSequence.fontSize * this._zoomRate + this._fontRate;
            remarshallingSequence.attribute.lineColor = this._mySlot.remarshallingSequence.textColor;
            remarshallingSequence.text = this._mySlot.remarshallingSequence.text;
            const textSize = remarshallingSequence.getTextSize();
            remarshallingSequence.setLocation(super.getRealLocation(new Point(this._width - (5 * this._zoomRate) - textSize.width, this._height - textSize.height - 1)));
            remarshallingSequence.draw(ctx);
        }
    }

    private drawJobCode(ctx: CanvasRenderingContext2D) : void {
        if (this._mySlot.jobCode) {
            let jobCode = undefined;
            if (this._mySlot.jobCode.text !== "") {
                jobCode = new DrawText(this.name + "_jobCode");
                jobCode.attribute.fontName = "Tahoma";
                jobCode.attribute.fontStyle = this._mySlot.jobCode.getTextStyle();
                jobCode.attribute.fontSize = this._mySlot.jobCode.fontSize * this._zoomRate + this._fontRate;
                jobCode.attribute.textAlign = ContentAlignment.MiddleCenter;
                jobCode.text = this._mySlot.jobCode.text;
                jobCode.setSize(new Size(this._height / 3, jobCode.getMBR().height));
                jobCode.setLocation(super.getRealLocation(new Point(this._zoomRate, this._height - jobCode.getSize().height - this._zoomRate)));
                jobCode.attribute.isOutLine = true;
                jobCode.attribute.outLineColor = this._mySlot.jobCode.borderColor;
                jobCode.attribute.fillColor = this._mySlot.jobCode.backColor;
                jobCode.draw(ctx);
            }
        }
    }

    private drawContainerBayThinTriangleType(ctx: CanvasRenderingContext2D) : void {
        if (this._mySlot.thinTriangle) {
            const thinTriangle = new DrawTriangle(this.name + "_ThinTri", 0, 0, 0, 0);
            thinTriangle.attribute.fillColor = this._mySlot.thinTriangle.backColor;
            thinTriangle.attribute.lineColor = this._mySlot.thinTriangle.borderColor;
            thinTriangle.setDirection(this._mySlot.thinTriangle.displayMode);
            if (thinTriangle.getDirection() === TriangleDir.Up || thinTriangle.getDirection() === TriangleDir.Down || thinTriangle.getDirection() === TriangleDir.None) {
                thinTriangle.setSize(new Size(this._width * this._mySlot.thinTriangle.width, this._height * 0.85));
                thinTriangle.setLocation(super.getRealLocation(new Point((this._width - thinTriangle.getSize().width / 2), (this._height - this._height * 0.85) / 2)));
            } else if (thinTriangle.getDirection() === TriangleDir.Left || thinTriangle.getDirection() === TriangleDir.Right) {
                thinTriangle.setSize(new Size(this._width * 0.85, this._height * this._mySlot.thinTriangle.width));
                thinTriangle.setLocation(super.getRealLocation(new Point((this._width - this._width * 0.85) / 2, (this._height - thinTriangle.getSize().height) / 2)));
            }

            thinTriangle.draw(ctx);
        }
    }

    private drawContainer(ctx: CanvasRenderingContext2D) : void {
        const row1Y = 4 * this._zoomRate;
        const row2Y = 18 * this._zoomRate;
        const row3Y = 33 * this._zoomRate;
        const row4Y = 48 * this._zoomRate;
        const row5Y = 63 * this._zoomRate;
        const row6Y = 75 * this._zoomRate;

        try {
            this.setSize(new Size(this._width, this._height));
            this.drawBackground(ctx);

            if (this._mySlot.visibleHoldCheck) {
                const holdCheck = new DrawRectangle(this.name + "_HoldCheck");
                holdCheck.setLocation(super.getRealLocation(new Point(3 * this._zoomRate, 3 * this._zoomRate)));
                holdCheck.attribute.lineColor = Color.Red();
                holdCheck.attribute.fillColor = Color.Red();
                holdCheck.setSize(new Size(12 * this._zoomRate, 10 * this._zoomRate));
                holdCheck.visible = this._mySlot.visibleHoldCheck;
                holdCheck.draw(ctx);
            }

            if (this._mySlot.innerBorderColor.toRGBA() !== Color.Transparent().toRGBA()) {
                const width = this._width - 6 * this._zoomRate;
                const height = this._height - 6 * this._zoomRate;
                const startPos = 6 * this._zoomRate / 2;
                const innerBorder = new DrawRectangle(this.name + "_InnerBorder");
                innerBorder.setLocation(super.getRealLocation(new Point(startPos, startPos)));
                innerBorder.attribute.lineThick = 2 * this._zoomRate;
                innerBorder.attribute.lineColor = this._mySlot.innerBorderColor;
                innerBorder.setSize(new Size(width, height));
                innerBorder.draw(ctx);                
            }

            if (this._mySlot.visibleTriangle) {
                const triangle = new DrawTriangle(this.name + "_Tri", 0, 0, 0, 0);
                triangle.setLocation(super.getRealLocation(new Point((this._width - this._width * 0.85) / 2, (this._height - this._height * 0.85) / 2)));
                triangle.setSize(new Size(this._width * 0.85, this._height * 0.85));
                triangle.attribute.fillColor = this._mySlot.triangleColor;
                triangle.attribute.lineColor = this._mySlot.triangleColor;
                triangle.setDirection(TriangleDir.Up);
                triangle.visible = this._mySlot.visibleTriangle;
                triangle.draw(ctx);
            }

            if (this._mySlot.visibleInvertedTriangle) {
                const invertedTriangle = new DrawTriangle(this.name + "_ITri", 0, 0, 0, 0);
                invertedTriangle.setLocation(super.getRealLocation(new Point((this._width - this._width * 0.85) / 2, (this._height - this._height * 0.85) / 2)));
                invertedTriangle.setSize(new Size(this._width * 0.85, this._height * 0.85));
                invertedTriangle.attribute.fillColor = this._mySlot.triangleColor;
                invertedTriangle.attribute.lineColor = this._mySlot.triangleColor;
                invertedTriangle.setDirection(TriangleDir.Down);
                invertedTriangle.visible = this._mySlot.visibleInvertedTriangle;
                invertedTriangle.draw(ctx);
            }

            if (this._mySlot.visibleDiamondSymbol) {
                const x_s = (this._width * 0.15) / 2;
                const x_f = (this._width * 1.85) / 2;
                const y_s = (this._height * 0.15) / 2;
                const y_f = (this._height * 1.85) / 2;
                const diamondWidth = (this._width * 0.85);
                const diamondHeight = (this._height * 0.85);
                const point: Point[] = [];
                point[0].x = x_s;
                point[0].y = y_s + diamondHeight / 2;
                point[0] = super.getRealLocation(Point.truncate(point[0]));
                point[1].x = x_s + diamondWidth / 2;
                point[1].y = y_f;
                point[1] = super.getRealLocation(Point.truncate(point[1]));
                point[2].x = x_f;
                point[2].y = y_s + diamondHeight / 2;
                point[2] = super.getRealLocation(Point.truncate(point[2]));
                point[3].x = x_s + diamondWidth / 2;
                point[3].y = y_s;
                point[3] = super.getRealLocation(Point.truncate(point[3]));

                if (this._mySlot.diamondSymbolStyle) {
                    if (this._mySlot.diamondSymbolStyle.backColor.toRGBA() !== Color.Transparent().toRGBA()) {
                        const polygon = new DrawPolygon("", point);
                        polygon.attribute.fillColor = this._mySlot.diamondSymbolStyle.backColor;
                        polygon.draw(ctx);
                    }

                    const polygon = new DrawPolygon("", point);
                    polygon.attribute.lineColor = this._mySlot.diamondSymbolStyle.borderColor;
                    polygon.attribute.lineThick = this._mySlot.diamondSymbolStyle.width;
                    polygon.attribute.dashStyle = this._mySlot.diamondSymbolStyle.borderDashStyle;
                    polygon.draw(ctx);
                }
            }

            this.drawContainerBayThinTriangleType(ctx);
            this.drawJobCode(ctx);

            if (this._mySlot.remarshallingInOrder && this._mySlot.remarshallingInOrder.value > 0) {
                const invertedTriangle = new DrawTriangle(this.name + "_ISmallTri", 0, 0, 0, 0);
                const location = this.getCurrentLocation();
                const size = this.getCurrentSize();
                const triRect = new Rectangle(location.x, location.y, size.width, size.height);
                triRect.inflate(new Size(this._width * -0.075, this._height * -0.075));
                const triSize = new Size((this._width * 0.4), (this._height * 0.4));
                invertedTriangle.setLocation(StringUtil.getAlignPoint(ContentAlignment.TopRight, triSize, triRect));
                invertedTriangle.setSize(triSize);
                if (this._mySlot.remarshallingInOrder.triangleColor.toRGBA() === Color.Transparent().toRGBA()) {
                    invertedTriangle.attribute.fillColor = this._mySlot.triangleColor;
                    invertedTriangle.attribute.lineColor = this._mySlot.triangleColor;
                } else {
                    invertedTriangle.attribute.fillColor = this._mySlot.remarshallingInOrder.triangleColor;
                    invertedTriangle.attribute.lineColor = this._mySlot.remarshallingInOrder.triangleColor;
                }

                invertedTriangle.setDirection(TriangleDir.Down);
                invertedTriangle.draw(ctx);

                if (this._mySlot.remarshallingInOrder.value > 1) {
                    const inOrder = new DrawText(this.name + "_IO");
                    inOrder.attribute.fontName = "tahoma";
                    inOrder.attribute.fontStyle = this._mySlot.remarshallingInOrder.getTextStyle();
                    inOrder.attribute.fontSize = (this._mySlot.remarshallingInOrder.fontSize * this._zoomRate + this._fontRate);
                    inOrder.attribute.lineColor = this._mySlot.remarshallingInOrder.textColor;
                    inOrder.text = this._mySlot.remarshallingInOrder.text;
                    inOrder.setLocation(invertedTriangle.getLocation());
                    inOrder.setSize(invertedTriangle.getSize());
                    inOrder.attribute.textAlign = ContentAlignment.MiddleCenter;
                    inOrder.draw(ctx);
                }
            }

            if (this._mySlot.visibleDamageCheck) {
                const damageCheck = new DrawRectangle(this.name + "_DamageCheck");
                damageCheck.setSize(new Size(12 * this._zoomRate , 10 * this._zoomRate));
                damageCheck.setLocation(super.getRealLocation(new Point(this._width - damageCheck.getSize().width - (6 * this._zoomRate), 6 * this._zoomRate)));
                damageCheck.attribute.lineColor = this._mySlot.damageCheckBorderColor;
                damageCheck.attribute.fillColor = this._mySlot.damageCheckBackColor;
                damageCheck.visible = this._mySlot.visibleDamageCheck;
                damageCheck.draw(ctx);
            }

            if (this._mySlot.remarshallingOutOrder && this._mySlot.remarshallingOutOrder.value > 0) {
                const smallTriangle = new DrawTriangle(this.name + "_SmallTri", 0, 0, 0, 0);
                let location = this.getCurrentLocation();
                let size = this.getCurrentSize();
                const triRect = new Rectangle(location.x, location.y, size.width, size.height);
                triRect.inflate(new Size(this._width * -0.075, this._height * -0.075));
                const triSize = new Size((this._width * 0.4), (this._height * 0.4));
                smallTriangle.setLocation(StringUtil.getAlignPoint(ContentAlignment.BottomRight, triSize, triRect));
                smallTriangle.setSize(triSize);
                smallTriangle.attribute.fillColor = this._mySlot.triangleColor;
                smallTriangle.attribute.lineColor = this._mySlot.triangleColor;
                smallTriangle.setDirection(TriangleDir.Up);
                smallTriangle.draw(ctx);

                if (this._mySlot.remarshallingOutOrder.value > 1) {
                    const outOrder = new DrawText(this.name + "_OO");
                    outOrder.attribute.fontName = "Tahoma";
                    outOrder.attribute.fontStyle = this._mySlot.remarshallingOutOrder.getTextStyle();
                    outOrder.attribute.fontSize = (this._mySlot.remarshallingOutOrder.fontSize * this._zoomRate + this._fontRate);
                    outOrder.attribute.lineColor = this._mySlot.remarshallingOutOrder.textColor;
                    outOrder.text = this._mySlot.remarshallingOutOrder.text;
                    outOrder.setLocation(smallTriangle.getLocation());
                    outOrder.setSize(smallTriangle.getSize());
                    outOrder.attribute.textAlign = ContentAlignment.MiddleCenter;
                    outOrder.draw(ctx);
                }     
            }

            const lowerCaptionBackColor = new DrawRectangle(this.name + "_LowerCaptionBackColor");
            lowerCaptionBackColor.setLocation(super.getRealLocation(new Point(1, (this._height * 0.75))));
            lowerCaptionBackColor.attribute.lineColor = this._mySlot.lowerCaptionBackColor;
            lowerCaptionBackColor.attribute.fillColor = this._mySlot.lowerCaptionBackColor;
            lowerCaptionBackColor.setSize(new Size(this._width - 2, this._height * 0.25));
            lowerCaptionBackColor.draw(ctx);

            if (this._mySlot.visibleCircle) {
                const circle = new DrawEllipse(this.name + "_Circle", 0, 0, 0, 0);
                circle.setLocation(super.getRealLocation(new Point((this._width - this._height * 0.7) / 2, (this._height - this._height * 0.7) / 2)));
                circle.setSize(new Size(this._height * 7 / 10, this._height * 7 / 10));
                circle.attribute.lineThick = (3 * this._zoomRate);
                circle.visible = this._mySlot.visibleCircle;
                circle.attribute.lineColor = this._mySlot.circleColor;
                circle.draw(ctx);
            }

            if (this._mySlot.visibleObliqueLine) {
                const obliqueLine = new DrawLine(this.name + "_obliqueLine"
                    , this._width + super.getCurrentLocation().x
                    , super.getCurrentLocation().y
                    , super.getCurrentLocation().x
                    , this._height + super.getCurrentLocation().y
                );

                obliqueLine.attribute.lineThick = (3 * this._zoomRate);
                obliqueLine.attribute.lineColor = this._mySlot.obliqueLineColor;
                obliqueLine.visible = this._mySlot.visibleObliqueLine;
                obliqueLine.draw(ctx);
            }

            if (this._mySlot.visibleOccupied) {
                const sX = this._width * 1 / 10;
                const sY = this._height * 1 / 10;
                const eX = this._width - sX;
                const eY = this._height - sY;

                const line1 = new DrawLine(this.name + "_L1"
                    , sX + super.getCurrentLocation().x
                    , sY + super.getCurrentLocation().y
                    , eX + super.getCurrentLocation().x
                    , eY + super.getCurrentLocation().y
                );

                line1.attribute.lineThick = (3 * this._zoomRate);
                line1.attribute.lineColor = this._mySlot.occupiedColor;
                line1.visible = this._mySlot.visibleOccupied;
                line1.draw(ctx);

                const sX1 = sX;
                const sY1 = eY;
                const eX1 = eX;
                const eY1 = sX;
                const line2 = new DrawLine(this.name + "_L2"
                    , sX1 + super.getCurrentLocation().x
                    , sY1 + super.getCurrentLocation().y
                    , eX1 + super.getCurrentLocation().x
                    , eY1 + super.getCurrentLocation().y
                );

                line2.attribute.lineThick = (3 * this._zoomRate);
                line2.attribute.lineColor = this._mySlot.occupiedColor;
                line2.visible = this._mySlot.visibleOccupied;
                line2.draw(ctx);
            }

            if (this._mySlot.visibleUnsync) {
                const sX = this._width * 1 / 10;
                const sY = this._height * 1 / 10;
                const eX = this._width - sX;
                const eY = this._height - sY;
                const line1 = new DrawLine(this.name + "_UNSL1"
                    , sX + super.getCurrentLocation().x
                    , sY + super.getCurrentLocation().y
                    , eX + super.getCurrentLocation().x
                    , eY + super.getCurrentLocation().y
                );

                line1.attribute.lineThick = 3 * this._zoomRate;
                line1.attribute.lineColor = this._mySlot.unsyncColor;
                line1.visible = this._mySlot.visibleOccupied;
                line1.draw(ctx);
            }

            let containerNo = undefined;
            if (this._mySlot.visibleContainerNo) {
                if (this._mySlot.containerNo && this._mySlot.containerNo.text.length > 0) {
                    containerNo = new DrawText(this.name + "_Cntr");
                    containerNo.attribute.fontName = "Arial";
                    containerNo.attribute.fontStyle = this._mySlot.containerNo.getTextStyle();

                    if (this._mySlot.containerNo.autoFontSize) {
                        containerNo.attribute.fontSize = (7.5 * this._zoomRate + this._fontRate);
                    } else {
                        containerNo.attribute.fontSize = this._mySlot.containerNo.fontSize;
                    }

                    containerNo.attribute.lineColor = this._mySlot.containerNo.textColor;
                    containerNo.setLocation(super.getRealLocation(new Point((4 * this._zoomRate - 2), row1Y)));
                    containerNo.attribute.textAlign = ContentAlignment.MiddleLeft;
                    containerNo.text = this._mySlot.containerNo.text;
                    containerNo.draw(ctx);

                    if (this._mySlot.visibleCntrUnderLine) {
                        const cntrTextBounds = containerNo.getMBR();
                        const cntrNoUnderLine = new DrawLine(this.name + "_cntrNoUnderLine"
                            , cntrTextBounds.x + 1, cntrTextBounds.y + cntrTextBounds.height
                            , cntrTextBounds.x + cntrTextBounds.width - 2, cntrTextBounds.y + cntrTextBounds.height);
                        cntrNoUnderLine.attribute.lineThick = (2 * this._zoomRate);
                        cntrNoUnderLine.attribute.lineColor = this._mySlot.cntrNoUnderLineColor;
                        cntrNoUnderLine.visible = true;
                        cntrNoUnderLine.draw(ctx);
                    }
                }
            }

            this.drawCellBookMark(ctx);

            if (this._mySlot.planSequence && this._mySlot.planSequence.text.length > 0) {
                const planSeq = new DrawText(this.name + "_PlanSeq");
                planSeq.attribute.fontName = "Tahoma";
                planSeq.attribute.fontStyle = this._mySlot.planSequence.getTextStyle();
                planSeq.attribute.textAlign = ContentAlignment.MiddleCenter;
                planSeq.attribute.lineColor = this._mySlot.planSequence.textColor;
                planSeq.attribute.fontSize = (30 * this._zoomRate + this._fontRate);
                planSeq.setLocation(super.getRealLocation(Point.empty()));
                planSeq.setSize(this.getSize());
                planSeq.text = this._mySlot.planSequence.text;
                planSeq.draw(ctx);
            }

            let opr = undefined;
            if (this._mySlot.operatorCode && this._mySlot.operatorCode.text) {
                opr = new DrawText(this.name + "_opr");
                opr.attribute.fontName = "Tahoma";
                opr.attribute.fontStyle = this._mySlot.operatorCode.getTextStyle();

                if (this._mySlot.operatorCode.autoFontSize) {
                    opr.attribute.fontSize = 6 * this._zoomRate + this._fontRate;
                } else {
                    opr.attribute.fontSize = this._mySlot.operatorCode.fontSize;
                }

                opr.attribute.textAlign = ContentAlignment.MiddleRight;
                opr.text = this._mySlot.operatorCode.text;
                opr.attribute.lineColor = this._mySlot.operatorCode.textColor;
                opr.setLocation(super.getRealLocation(new Point(this._width - (5 * this._zoomRate) - opr.getTextSize().width, row2Y)));

                if (this._mySlot.operatorBackColor) {
                    const oprBackColor = new DrawRectangle(this.name + "_oprBackColor");
                    oprBackColor.setLocation(new Point(opr.getLocation().x, opr.getLocation().y));
                    oprBackColor.attribute.lineColor = this._mySlot.operatorBackColor;
                    oprBackColor.attribute.fillColor = this._mySlot.operatorBackColor;
                    oprBackColor.setSize(new Size(opr.getMBR().width, opr.getMBR().height));
                    oprBackColor.draw(ctx);
                }
            }

            if (this._mySlot.classCode && this._mySlot.classCode.text) {
                const classCode = new DrawText(this.name + "_Class");
                classCode.attribute.fontName = "Tahoma";

                if (this._mySlot.classCode.autoFontSize) {
                    classCode.attribute.fontSize = (6.5 * this._zoomRate + this._fontRate);
                } else {
                    classCode.attribute.fontSize = this._mySlot.classCode.fontSize;
                }

                classCode.attribute.fontStyle = this._mySlot.classCode.getTextStyle();
                classCode.setLocation(super.getRealLocation(new Point((5 * this._zoomRate), row2Y)));
                classCode.attribute.lineColor = this._mySlot.classCode.textColor;
                classCode.text = this._mySlot.classCode.text;

                if (this._mySlot.classCodeBackColor.toRGBA() !== Color.Transparent().toRGBA()) {
                    const classCodeBackColor = new DrawRectangle(this.name + "_ClassBackColor");
                    classCodeBackColor.setLocation(new Point(classCode.getLocation().x, classCode.getLocation().y));
                    classCodeBackColor.attribute.lineColor = this._mySlot.classCodeBackColor;
                    classCodeBackColor.attribute.fillColor = this._mySlot.classCodeBackColor;
                    classCodeBackColor.setSize(new Size(classCode.getMBR().width, classCode.getMBR().height));
                    classCodeBackColor.draw(ctx);
                }

                classCode.draw(ctx);
            }

            if (this._mySlot.cargoType && this._mySlot.cargoType.text) {
                const cargoType = new DrawText(this.name + "_Cargo");
                cargoType.attribute.fontName = "Tahoma";
                cargoType.attribute.fontStyle = this._mySlot.cargoType.getTextStyle();
                
                if (this._mySlot.cargoType.autoFontSize) {
                    cargoType.attribute.fontSize = (6.5 * this._zoomRate + this._fontRate);
                } else {
                    cargoType.attribute.fontSize = this._mySlot.cargoType.fontSize;
                }

                cargoType.setLocation(super.getRealLocation(new Point((25 * this._zoomRate), row2Y)));
                cargoType.attribute.lineColor = this._mySlot.cargoType.textColor;
                cargoType.text = this._mySlot.cargoType.text;

                if (this._mySlot.cargoTypeBackColor) {
                    const cargoTypeBackColor = new DrawRectangle(this.name + "_CargoTypeBackColor");
                    cargoTypeBackColor.setLocation(new Point(cargoType.getLocation().x, cargoType.getLocation().y));
                    cargoTypeBackColor.attribute.lineColor = this._mySlot.cargoTypeBackColor;
                    cargoTypeBackColor.attribute.fillColor = this._mySlot.cargoTypeBackColor;
                    cargoTypeBackColor.setSize(new Size(cargoType.getMBR().width, cargoType.getMBR().height));
                    cargoTypeBackColor.draw(ctx);
                }

                cargoType.draw(ctx);
            }

            if (this._mySlot.sizeType && this._mySlot.sizeType.text.length > 0) {
                const szTp = new DrawText(this.name + "_SzTp");
                szTp.attribute.fontName = "Tahoma";
                szTp.attribute.fontStyle = this._mySlot.sizeType.getTextStyle();

                if (this._mySlot.sizeType.autoFontSize) {
                    szTp.attribute.fontSize = (6.5 * this._zoomRate + this._fontRate);
                } else {
                    szTp.attribute.fontSize = this._mySlot.sizeType.fontSize;
                }

                szTp.setLocation(super.getRealLocation(new Point((45 * this._zoomRate - 1), row2Y)));
                szTp.attribute.lineColor = this._mySlot.sizeType.textColor;
                szTp.text = this._mySlot.sizeType.text;
                szTp.draw(ctx);
            }

            if (opr) {
                opr.draw(ctx);
            }

            if (this._mySlot.visibleReeferPlugInOut) {
                const reeferPlugInOut = new DrawEllipse(this.name + "_ReeferInOut", 0, 0, 0, 0);
                reeferPlugInOut.attribute.lineColor = this._mySlot.reeferPlugInOutLineColor;
                reeferPlugInOut.attribute.fillColor = this._mySlot.reeferPlugInOutBackColor;
                reeferPlugInOut.attribute.lineThick = this._mySlot.reeferPlugInOutLineThick;
                const reeferPlugInOutSize = new Size(row4Y - row3Y, row4Y - row3Y);
                reeferPlugInOut.setLocation(super.getRealLocation(new Point((4 * this._zoomRate - 2), (this._height / 2) - (reeferPlugInOutSize.height / 2))));
                reeferPlugInOut.setSize(reeferPlugInOutSize);
                reeferPlugInOut.draw(ctx);
            }

            if (this._mySlot.iMDG && this._mySlot.iMDG.text) {
                const imdg = new DrawText(this.name + "_IMDG");
                imdg.attribute.fontName = "Tahoma";
                imdg.attribute.fontStyle = this._mySlot.iMDG.getTextStyle();
                imdg.attribute.fontSize = (6 * this._zoomRate + this._fontRate);
                imdg.setLocation(super.getRealLocation(new Point((5 * this._zoomRate), row3Y)));
                imdg.attribute.lineColor = this._mySlot.iMDG.textColor;
                imdg.text = this._mySlot.iMDG.text;
                imdg.draw(ctx);
            } else if (this._mySlot.temperature && this._mySlot.temperature.text.length > 0) {
                const imdg = new DrawText(this.name + "_IMDG");
                imdg.attribute.fontName = "Tahoma";
                imdg.attribute.fontStyle = this._mySlot.iMDG.getTextStyle();
                imdg.attribute.fontSize = (6 * this._zoomRate + this._fontRate);
                imdg.setLocation(super.getRealLocation(new Point((5 * this._zoomRate), row3Y)));
                imdg.attribute.lineColor = this._mySlot.iMDG.textColor;
                imdg.text = this._mySlot.temperature.text;
                imdg.draw(ctx);
            }

            if (this._mySlot.plugCheck && this._mySlot.plugCheck.text.length > 0) {
                const plugCheck = new DrawText(this.name + "_Plug");
                plugCheck.attribute.fontName = "Tahoma";
                plugCheck.attribute.fontStyle = this._mySlot.plugCheck.getTextStyle();
                plugCheck.attribute.fontSize = (6 * this._zoomRate + this._fontRate);
                plugCheck.setLocation(super.getRealLocation(new Point((30 * this._zoomRate), row3Y)));
                plugCheck.attribute.lineColor = this._mySlot.plugCheck.textColor;
                plugCheck.text = this._mySlot.plugCheck.text;
                plugCheck.draw(ctx);
            }

            if (this._mySlot.equipmentName && this._mySlot.equipmentName.text.length > 0) {
                const equNo = new DrawText(this.name + "_Equ");
                equNo.attribute.fontName = "Tahoma";
                equNo.attribute.fontSize = (6 * this._zoomRate + this._fontRate);
                equNo.attribute.fontStyle = this._mySlot.equipmentName.getTextStyle();
                equNo.attribute.lineColor = this._mySlot.equipmentName.textColor;
                equNo.setLocation(super.getRealLocation(new Point((40 * this._zoomRate), row3Y)));
                equNo.text = this._mySlot.equipmentName.text;
                equNo.draw(ctx);
            }

            if (this._mySlot.weightGroup && this._mySlot.weightGroup.text.length > 0) {
                const weightGrp = new DrawText(this.name + "_WeightGrp");
                weightGrp.attribute.fontName = "Tahoma";
                weightGrp.attribute.textAlign = ContentAlignment.TopRight;
                weightGrp.attribute.fontStyle = this._mySlot.weightGroup.getTextStyle();

                if (this._mySlot.weightGroup.autoFontSize) {
                    weightGrp.attribute.fontSize = (6 * this._zoomRate + this._fontRate);
                } else {
                    weightGrp.attribute.fontSize = this._mySlot.weightGroup.fontSize;
                }

                weightGrp.attribute.lineColor = this._mySlot.weightGroup.textColor;
                weightGrp.text = this._mySlot.weightGroup.text;
                weightGrp.setLocation(super.getRealLocation(new Point(this._width - (5 * this._zoomRate) - weightGrp.getTextSize().width, row3Y)));
                weightGrp.draw(ctx);
            }

            if (this._mySlot.inboundVVD && this._mySlot.inboundVVD.text.length > 0) {
                const inVVD = new DrawText(this.name + "_InVVD");
                inVVD.attribute.fontName = "Tahoma";
                inVVD.attribute.fontStyle = this._mySlot.inboundVVD.getTextStyle();
                inVVD.attribute.fontSize = (6 * this._zoomRate + this._fontRate);
                inVVD.setLocation(super.getRealLocation(new Point((5 * this._zoomRate), row4Y)));
                inVVD.attribute.lineColor = this._mySlot.inboundVVD.textColor;
                inVVD.text = this._mySlot.inboundVVD.text;
                inVVD.draw(ctx);
            }

            if (this._mySlot.pol && this._mySlot.pol.text.length > 0) {
                const POL = new DrawText(this.name + "_POL");
                POL.attribute.fontName = "Tahoma";
                POL.attribute.fontStyle = this._mySlot.pol.getTextStyle();
                POL.attribute.fontSize = (5.5 * this._zoomRate + this._fontRate);
                POL.attribute.lineColor = this._mySlot.pol.textColor;
                POL.text = this._mySlot.pol.text;
                POL.setLocation(super.getRealLocation(new Point(this._width - (5 * this._zoomRate) - POL.getTextSize().width, row4Y)));
                POL.draw(ctx);
            }

            let POD = undefined;
            if (this._mySlot.pod && this._mySlot.pod.text.length > 0) {
                POD = new DrawText(this.name + "_POD");
                POD.attribute.fontName = "Tahoma";
                POD.attribute.fontStyle = this._mySlot.pod.getTextStyle();
                POD.attribute.fontSize = (7 * this._zoomRate + this._fontRate);
                POD.attribute.lineColor = this._mySlot.pod.textColor;
                POD.attribute.textAlign = ContentAlignment.MiddleRight;
                POD.text = this._mySlot.pod.text;
                POD.setLocation(super.getRealLocation(new Point(this._width - (5 * this._zoomRate) - POD.getTextSize().width, row5Y)));
                
                if (this._mySlot.podBackColor) {
                    const podBackColor = new DrawRectangle(this.name + "_PODBackColor");
                    podBackColor.setLocation(new Point(POD.getLocation().x, POD.getLocation().y));
                    podBackColor.attribute.lineColor = this._mySlot.podBackColor;
                    podBackColor.attribute.fillColor = this._mySlot.podBackColor;
                    podBackColor.setSize(new Size(POD.getMBR().width, POD.getMBR().height));
                    podBackColor.draw(ctx);
                }
            }

            if (this._mySlot.outboundVVD && this._mySlot.outboundVVD.text.length > 0) {
                const outVVD = new DrawText(this.name + "_OutVVD");
                outVVD.attribute.fontName = "Tahoma";
                outVVD.attribute.fontStyle = this._mySlot.outboundVVD.getTextStyle();
                outVVD.attribute.fontSize = (7 * this._zoomRate + this._fontRate);
                outVVD.setLocation(super.getRealLocation(new Point((5 * this._zoomRate), row5Y)));
                outVVD.attribute.lineColor = this._mySlot.outboundVVD.textColor;
                outVVD.text = this._mySlot.outboundVVD.text;
                outVVD.draw(ctx);
            }

            if (this._mySlot.stackingDays && this._mySlot.stackingDays.text.length > 0) {
                const stackingDays = new DrawText(this.name + "_StackingDays");
                stackingDays.attribute.fontName = "Tahoma";
                stackingDays.attribute.fontStyle = this._mySlot.stackingDays.getTextStyle();
                stackingDays.attribute.fontSize = (7 * this._zoomRate + this._fontRate);
                stackingDays.attribute.lineColor = this._mySlot.stackingDays.textColor;
                stackingDays.attribute.textAlign = ContentAlignment.MiddleRight;
                stackingDays.text = this._mySlot.stackingDays.text;
                stackingDays.setLocation(super.getRealLocation(new Point(this._width - (5 * this._zoomRate) - stackingDays.getTextSize().width, row6Y)));
                stackingDays.draw(ctx);
            }

            if (POD) {
                POD.draw(ctx);
            }

            if (this._mySlot.size && this._mySlot.size.text.length > 0) {
                const cntrSize = new DrawText(this.name + "_CntrSize");
                cntrSize.attribute.fontName = "Tahoma";
                cntrSize.attribute.fontStyle = this._mySlot.size.getTextStyle();
                cntrSize.attribute.fontSize = (22 * this._zoomRate + this._fontRate);
                cntrSize.attribute.lineColor = this._mySlot.size.textColor;
                cntrSize.setLocation(super.getRealLocation(new Point((1 * this._zoomRate), (1 * this._zoomRate))));
                cntrSize.text = this._mySlot.size.text;
                cntrSize.draw(ctx);
            }

            let wType = undefined;
            if (this._mySlot.wType > 0) {
                wType = new DrawText(this.name + "_WType");
                wType.attribute.fontName = "Tahoma";
                wType.attribute.fontStyle = this._mySlot.size.getTextStyle();
                wType.attribute.fontSize = (22 * this._zoomRate + this._fontRate);
                wType.attribute.lineColor = this._mySlot.size.textColor;
                wType.setLocation(super.getRealLocation(new Point((1 * this._zoomRate + 5), (1 * this._zoomRate))));
                wType.text = (this._mySlot.wType === 1) ? "W" : "X";
                wType.draw(ctx);
            }

            if (this._mySlot.shipBayNo) {
                const shipBayNo = new DrawText(this.name + "_ShipBayNo");
                shipBayNo.attribute.fontName = "Tahoma";
                shipBayNo.attribute.fontStyle = this._mySlot.shipBayNo.getTextStyle();
                shipBayNo.attribute.fontSize = (21 * this._zoomRate + this._fontRate);
                shipBayNo.attribute.lineColor = this._mySlot.shipBayNo.textColor;
                shipBayNo.attribute.textAlign = ContentAlignment.TopRight;

                if (this._mySlot.shipBayNo.text.length > 0) {
                    shipBayNo.text = "-";
                } else {
                    shipBayNo.text = this._mySlot.shipBayNo.text;
                }

                shipBayNo.setLocation(super.getRealLocation(new Point(this._width - shipBayNo.getTextSize().width, (1 * this._zoomRate))));
                
                if (this._mySlot.shipBayBackColor.toRGBA() !== Color.Transparent().toRGBA()) {
                    const shipBayBackColor = new DrawRectangle(this.name + "_ShipBayBackColor");
                    shipBayBackColor.setLocation(super.getRealLocation(new Point(this._width - shipBayNo.getMBR().width, (2 * this._zoomRate))));
                    shipBayBackColor.attribute.lineColor = this._mySlot.shipBayBackColor;
                    shipBayBackColor.attribute.fillColor = this._mySlot.shipBayBackColor;
                    shipBayBackColor.setSize(new Size(shipBayNo.getMBR().width - (2 * this._zoomRate), shipBayNo.getMBR().height - (6 * this._zoomRate)));
                    shipBayBackColor.draw(ctx);
                }

                if (this._mySlot.shipBayNo.text.length > 0) {
                    shipBayNo.text = "";
                    shipBayNo.draw(ctx);
                }

                if (this._mySlot.weight && this._mySlot.weight.text.length > 0) {
                    const weight = new DrawText(this.name + "_Weight");
                    weight.attribute.fontName = "Tahoma";
                    weight.attribute.fontStyle = this._mySlot.weight.getTextStyle();
                    weight.attribute.textAlign = ContentAlignment.MiddleCenter;
                    weight.attribute.fontSize = (22 * this._zoomRate + this._fontRate);
                    weight.setLocation(super.getRealLocation(Point.empty()));
                    weight.setSize(this.getSize());
                    weight.attribute.lineColor = this._mySlot.weight.textColor;
                    weight.text = this._mySlot.weight.text;
                    weight.draw(ctx);
                }

                if (this._mySlot.lowerCaption && this._mySlot.lowerCaption.text.length > 0) {
                    const lowerCaption = new DrawText(this.name + "_LowerCaption");
                    lowerCaption.attribute.fontName = "Tahoma";
                    lowerCaption.attribute.fontStyle = this._mySlot.lowerCaption.getTextStyle();
                    lowerCaption.attribute.textAlign = ContentAlignment.TopLeft;
                    lowerCaption.attribute.fontSize = (15 * this._zoomRate + this._fontRate);
                    lowerCaption.attribute.lineColor = this._mySlot.lowerCaption.textColor;
                    lowerCaption.text = this._mySlot.lowerCaption.text;
                    const tempY = (lowerCaptionBackColor.getLocation().y + lowerCaptionBackColor.getMBR().height / 2) - lowerCaption.getMBR().height / 2 + 1;
                    lowerCaption.setLocation(new Point(this.getCurrentLocation().x, tempY));
                    lowerCaption.draw(ctx);
                } else if (this._mySlot.bLNo && this._mySlot.bLNo.text.length > 0) {
                    const blNo = new DrawText(this.name + "_BLNo");
                    blNo.attribute.fontName = "Tahoma";
                    blNo.attribute.fontStyle = this._mySlot.bLNo.getTextStyle();
                    blNo.attribute.fontSize = (7 * this._zoomRate + this._fontRate);
                    blNo.setLocation(super.getRealLocation(new Point((5 * this._zoomRate), row6Y)));
                    blNo.attribute.lineColor = this._mySlot.bLNo.textColor;
                    blNo.text = this._mySlot.bLNo.text;
                    blNo.draw(ctx);
                } else if (this._mySlot.bookingNo && this._mySlot.bookingNo.text.length > 0) {
                    const bookingNo = new DrawText(this.name + "_BookingNo");
                    bookingNo.attribute.fontName = "Tahoma";
                    bookingNo.attribute.fontStyle = this._mySlot.bookingNo.getTextStyle();
                    bookingNo.attribute.fontSize = (7 * this._zoomRate + this._fontRate);
                    bookingNo.setLocation(super.getRealLocation(new Point((5 * this._zoomRate), row6Y)));
                    bookingNo.attribute.lineColor = this._mySlot.bookingNo.textColor;
                    bookingNo.text = this._mySlot.bookingNo.text;
                    bookingNo.draw(ctx);
                }
            }

            if (this._mySlot.handlingInstruction && this._mySlot.handlingInstruction.text.length > 0) {
                const lowerCaption = new DrawText(this.name + "_HandlingInstruction");
                lowerCaption.attribute.fontName = this._mySlot.handlingInstruction.fontName;
                lowerCaption.attribute.fontStyle = this._mySlot.handlingInstruction.getTextStyle();
                lowerCaption.attribute.textAlign = this._mySlot.handlingInstruction.textAlign;
                lowerCaption.attribute.fontSize = (6 * this._zoomRate + this._fontRate);
                lowerCaption.attribute.lineColor = this._mySlot.handlingInstruction.textColor;
                lowerCaption.text = this._mySlot.handlingInstruction.text;
                const textSize = lowerCaption.getTextSize();
                lowerCaption.setLocation(super.getRealLocation(new Point(this._width - (5 * this._zoomRate) - textSize.width, this._height - textSize.height - 1)));
                if ((this._mySlot.handlingInstructionBackColor && this._mySlot.handlingInstructionBackColor.toRGBA() !== Color.Transparent().toRGBA()) || (this._mySlot.handlingInstructionBorderColor?.toRGBA() !== Color.Transparent().toRGBA())) {
                    const handlingInstructionBackColor = new DrawRectangle(this.name + "_HandlingInstructionBackColor");
                    handlingInstructionBackColor.setLocation(new Point(lowerCaption.getLocation().x, lowerCaption.getLocation().y));
                    handlingInstructionBackColor.attribute.lineColor = this._mySlot.handlingInstructionBorderColor;
                    handlingInstructionBackColor.attribute.fillColor = this._mySlot.handlingInstructionBackColor;
                    handlingInstructionBackColor.attribute.lineThick = this._mySlot.handlingInstructionBorderWidth;
                    handlingInstructionBackColor.setSize(new Size(lowerCaption.getMBR().width, lowerCaption.getMBR().height));
                    handlingInstructionBackColor.draw(ctx);
                }

                lowerCaption.draw(ctx);
            }

            this.drawRemarshallingSequence(ctx);

            if (this._mySlot.visibleCntrState) {
                if (this._mySlot.isBookedCntr) {
                    const tPoints: Point[] = [];
                    tPoints.push(super.getRealLocation(new Point(this._width, (this._height - this._height * 0.4))));
                    tPoints.push(super.getRealLocation(new Point((this._width - this._width * 0.2), this._height)));
                    tPoints.push(super.getRealLocation(new Point(this._width, this._height)));
                    const polygon = new DrawPolygon(this.name + "_Poly", tPoints);
                    polygon.attribute.lineColor = this._mySlot.podBackColor;
                    polygon.attribute.fillColor = this._mySlot.planSequence.textColor;
                    polygon.visible = true;
                    polygon.setLocation(super.getRealLocation(new Point(this._width - (this._width * 0.2), this._height - (this._height * 0.4))));
                    polygon.draw(ctx);
                }
            }

            const leftOverSlot = this._leftOverSlot;
            const topOverSlot = this._topOverSlot;
            if (this._mySlot.isOSS) {
                const OSS_Line1 = new DrawLine(this.name + "_OSS_Line1"
                    , this._width + super.getCurrentLocation().x
                    , super.getCurrentLocation().y
                    , this._width + super.getCurrentLocation().x + leftOverSlot
                    , this._height / 2 + super.getCurrentLocation().y);
                OSS_Line1.attribute.lineThick = this._zoomRate;
                OSS_Line1.attribute.lineColor = this._mySlot.overSlotColor;
                OSS_Line1.draw(ctx);

                const OSS_Line2 = new DrawLine(this.name + "_OSS_Line2"
                    , this._width + leftOverSlot + super.getCurrentLocation().x
                    , this._height / 2 + super.getCurrentLocation().y
                    , this._width + super.getCurrentLocation().x
                    , this._height + super.getCurrentLocation().y);
                OSS_Line2.attribute.lineThick = this._zoomRate;
                OSS_Line2.attribute.lineColor = this._mySlot.overSlotColor;
                OSS_Line2.draw(ctx);
            }

            if (this._mySlot.isOSP) {
                const OSP_Line1 = new DrawLine(this.name + "_OSP_Line1"
                    , super.getCurrentLocation().x
                    , super.getCurrentLocation().y
                    , super.getCurrentLocation().x - leftOverSlot
                    , this._height / 2 + super.getCurrentLocation().y);

                OSP_Line1.attribute.lineThick = (1 * this._zoomRate);
                OSP_Line1.attribute.lineColor = this._mySlot.overSlotColor;
                OSP_Line1.draw(ctx);

                const OSP_Line2 = new DrawLine(this.name + "_OSP_Line2"
                    , 0 + super.getCurrentLocation().x - leftOverSlot
                    , this._height / 2 + super.getCurrentLocation().y
                    , super.getCurrentLocation().x
                    , this._height + super.getCurrentLocation().y);
                OSP_Line2.attribute.lineThick = this._zoomRate;
                OSP_Line2.attribute.lineColor = this._mySlot.overSlotColor;
                OSP_Line2.draw(ctx);
            }

            if (this._mySlot.isOSH) {
                const OSH_Line1 = new DrawLine(this.name + "_OSH_Line1"
                   , super.getCurrentLocation().x
                   , super.getCurrentLocation().y
                   , this._width / 2 + super.getCurrentLocation().x
                   , super.getCurrentLocation().y - topOverSlot);
                OSH_Line1.attribute.lineThick = this._zoomRate;
                OSH_Line1.attribute.lineColor = this._mySlot.overSlotColor;
                OSH_Line1.draw(ctx);

                const OSH_Line2 = new DrawLine(this.name + "_OSH_Line2"
                    , this._width / 2 + super.getCurrentLocation().x
                    , super.getCurrentLocation().y - topOverSlot
                    , this._width + super.getCurrentLocation().x
                    , super.getCurrentLocation().y);
                OSH_Line2.attribute.lineThick = this._zoomRate;
                OSH_Line2.attribute.lineColor = this._mySlot.overSlotColor;
                OSH_Line2.draw(ctx);
            }

            if (this._mySlot.isOVS) {
                const OVS = new DrawText(this.name + "_OVS");
                OVS.attribute.fontName = "Tahoma";
                OVS.attribute.fontStyle = FontStyles.bold;
                OVS.attribute.textAlign = ContentAlignment.MiddleCenter;
                OVS.attribute.fontSize = (15 * this._zoomRate);
                OVS.attribute.lineColor = this._mySlot.overSizeColor;
                OVS.text = ">";
                const tempX = this._width - (OVS.getMBR().width * 0.5) + leftOverSlot;
                OVS.setLocation(super.getRealLocation(new Point(tempX, this._height / 2 + topOverSlot)));
                OVS.draw(ctx);
            }

            if (this._mySlot.isOVP) {
                const OVP = new DrawText(this.name + "_OVP");
                OVP.attribute.fontName = "Tahoma";
                OVP.attribute.fontStyle = FontStyles.bold;
                OVP.attribute.textAlign = ContentAlignment.MiddleCenter;
                OVP.attribute.fontSize = (15 * this._zoomRate);
                OVP.attribute.lineColor = this._mySlot.overSizeColor;
                OVP.text = "<";
                const tempX = (OVP.getMBR().width * 0.5) + leftOverSlot;
                OVP.setLocation(super.getRealLocation(new Point(tempX, this._height / 2 + topOverSlot)));
                OVP.draw(ctx);
            }

            if (this._mySlot.isOVH) {
                const OVH = new DrawText(this.name + "_OVH");
                OVH.attribute.fontName = "Tahoma";
                OVH.attribute.fontStyle = FontStyles.bold;
                OVH.attribute.textAlign = ContentAlignment.MiddleCenter;
                OVH.attribute.fontSize = (15 * this._zoomRate);
                OVH.attribute.lineColor = this._mySlot.overSizeColor;
                OVH.text = "<";
                const tempY = topOverSlot + (OVH.getMBR().width * 0.5);
                OVH.setLocation(super.getRealLocation(new Point(leftOverSlot + this._width / 2, tempY)));
                OVH.degree = 90;
                OVH.draw(ctx);
            }

            if (this._mySlot.containerRemark && this._mySlot.containerRemark.text.length > 0) {
                const cntrRMK = new DrawText(this.name + "_ContainerRemark");
                cntrRMK.attribute.fontName = "Tahoma";
                cntrRMK.attribute.fontStyle = this._mySlot.containerRemark.getTextStyle();
                cntrRMK.attribute.fontSize = (7 * this._zoomRate + this._fontRate);
                cntrRMK.attribute.lineColor = this._mySlot.containerRemark.textColor;
                const tempY = ((lowerCaptionBackColor.getLocation().y + lowerCaptionBackColor.getMBR().height / 2) - cntrRMK.getMBR().height / 2) + (cntrRMK.attribute.fontSize / 2);
                cntrRMK.setLocation(new Point(this.getCurrentLocation().x, tempY));
                cntrRMK.text = this._mySlot.containerRemark.text;
                cntrRMK.draw(ctx);
            }

            if (this._isViewMarking) {
                let geomSlotMark = undefined;
                switch (this._markingType) {
                    case MarkingTypes.CIRCLE:
                        geomSlotMark = new GeometryEllipse("ContainerMark", 0, 0, 0, 0);
                        break;
                    case MarkingTypes.TRIANGLE:
                        geomSlotMark = new GeometryTriangle("ContainerMark", 0, 0, 0, 0);
                        break;
                    case MarkingTypes.INVERT_TRIANGLE:
                        geomSlotMark = new GeometryTriangle("ContainerMark", 0, 0, 0, 0);
                        break;
                }

                if (this._width === this._height) {
                    geomSlotMark.setSize(new Size(this._width * this.markingSizeRatio / 10, this._height * this.markingSizeRatio / 10));
                } else {
                    geomSlotMark.setSize(new Size(this._height * this.markingSizeRatio / 10, this._height * this.markingSizeRatio / 10));
                }
                
                geomSlotMark.attribute.lineThick = (3 * this._zoomRate + this._lineThick);
                geomSlotMark.setLocation(super.getRealLocation(Point.empty()));
                const radius = geomSlotMark.getMBR().width / 2;
                geomSlotMark.attribute.fillColor = this._markingBackColor;
                geomSlotMark.attribute.lineColor = this._markingBorderColor;
                geomSlotMark.setLocation(new Point((this.getCurrentLocation().x + this._width / 2 - radius), (this.getCurrentLocation().y + this._height / 2 - radius)));
                
                if (this._markingType === MarkingTypes.INVERT_TRIANGLE) {
                    geomSlotMark.rotate(180);
                }

                geomSlotMark.draw(ctx);
            }

            let PECnt = undefined;
            if (this._mySlot.pECnt > 1) {
                PECnt = new DrawText(this.name + "_PECnt");
                PECnt.attribute.fontName = "Tahoma";
                PECnt.attribute.fontStyle = FontStyles.normal;
                PECnt.attribute.fontSize = (7 * this._zoomRate + this._fontRate);
                PECnt.attribute.lineColor = Color.Red();
                PECnt.attribute.textAlign = ContentAlignment.MiddleRight;
                PECnt.text = this._mySlot.pECnt + "";
                PECnt.setLocation(super.getRealLocation(new Point(this._width - (PECnt.getTextSize().width) - 4, this._height - (4 + PECnt.getTextSize().height))));
                PECnt.draw(ctx);
            }

            if (this._mySlot.caption && this._mySlot.caption.text.length > 0) {
                const captionTxt = new DrawText(this.name + "_Caption");
                captionTxt.attribute.fontName = "Tahoma";
                captionTxt.attribute.fontStyle = this._mySlot.caption.getTextStyle();

                if (this._mySlot.caption.autoFontSize) {
                    captionTxt.attribute.fontSize = (50 * this._zoomRate + this._fontRate);
                } else {
                    captionTxt.attribute.fontSize = this._mySlot.caption.fontSize;
                }

                captionTxt.attribute.lineColor = this._mySlot.caption.textColor;
                captionTxt.attribute.textAlign = ContentAlignment.MiddleCenter;
                captionTxt.text = this._mySlot.caption.text + "";
                captionTxt.setLocation(super.getRealLocation(Point.empty()));
                captionTxt.setSize(this.getSize());
                captionTxt.draw(ctx);
            }

            this.drawCustomTextItem(ctx);

            let totQty = undefined;            
            if (this._mySlot.totalQty && this._mySlot.totalQty.text.length > 0) {
                totQty = new DrawText(this.name + "_totQty");
                totQty.attribute.fontName = "Tahoma";
                totQty.attribute.fontStyle = this._mySlot.totalQty.getTextStyle();
                totQty.attribute.fontSize = (this._mySlot.totalQty.fontSize * this._zoomRate + this._fontRate);
                totQty.attribute.textAlign = ContentAlignment.MiddleLeft;
                totQty.text = "99";
                const textSize = totQty.getTextSize();
                totQty.text = this._mySlot.totalQty.text;
                totQty.attribute.lineColor = this._mySlot.totalQty.textColor;
                totQty.setLocation(super.getRealLocation(new Point(this._width - (5 * this._zoomRate) - textSize.width, this._height - textSize.height - 1)));
                totQty.draw(ctx);
            }

            if (this._mySlot.jobSequence && this._mySlot.jobSequence.text.length > 0) {
                const jobSeq = new DrawText(this.name + "_jseq");
                jobSeq.attribute.fontName = "Tahoma";
                jobSeq.attribute.fontStyle = this._mySlot.jobSequence.getTextStyle();
                jobSeq.attribute.fontSize = (this._mySlot.jobSequence.fontSize * this._zoomRate + this._fontRate);
                jobSeq.attribute.textAlign = ContentAlignment.MiddleRight;
                jobSeq.text = this._mySlot.jobSequence.text;
                jobSeq.attribute.lineColor = this._mySlot.jobSequence.textColor;
                const textSize = jobSeq.getTextSize();
                jobSeq.text = this._mySlot.jobSequence.text;
                
                if (totQty) {
                    jobSeq.setLocation(super.getRealLocation(new Point(this._width - (20 * this._zoomRate) - textSize.width, this._height - textSize.height - 1)));
                } else {
                    jobSeq.setLocation(super.getRealLocation(new Point(this._width - (5 * this._zoomRate) - textSize.width, this._height - textSize.height - 1)));
                }

                jobSeq.draw(ctx);
            }

            this.drawInnerSideTriangle(ctx);
            this.drawInnerSideText(ctx);
        } catch (ex) {
            throw ex;
        }
    }

    private drawCustomTextItem(ctx: CanvasRenderingContext2D) : void {
        if (this._mySlot.customTextItem) {
            const count = this._mySlot.customTextItem.length;
            let drawText = undefined;
            let textItem = undefined;
            const cellBounds = this.getBounds();
            let bounds = undefined;

            for (let idx = 0; idx < count; idx++) {
                textItem = this._mySlot.customTextItem[idx];

                if (!textItem) {
                    continue;
                }

                if (textItem.text.length === 0) {
                    continue;
                }

                bounds = this.getTextDisplayBounds(cellBounds, textItem);
                drawText = new DrawText("");
                drawText.setLocation(bounds.getLocation());
                drawText.setSize(bounds.getSize());
                drawText.text = textItem.text;
                drawText.attribute.textAlign = textItem.textAlign;
                drawText.attribute.fontStyle = textItem.getTextStyle();
                drawText.attribute.fontName = textItem.fontName;
                drawText.attribute.outLineColor = textItem.textColor;
                drawText.attribute.lineColor = textItem.textColor;
                drawText.attribute.fontSize = textItem.fontSize;
                drawText.attribute.fillColor = textItem.backgroundColor;
                drawText.draw(ctx);
            }
        }
    }

    private getTextDisplayBounds(cellBounds: Rectangle, textItem: CustomTextItem) : Rectangle {
        let displayBounds = cellBounds;

        if (!textItem) {
            return displayBounds;
        }

        if (textItem.getGridColumnCount() > 1 || textItem.getGridRowCount() > 1) {
            const width = cellBounds.width / textItem.getGridColumnCount();
            const height = cellBounds.height / textItem.getGridRowCount();
            const x = cellBounds.x + (width * (textItem.getGridColumnIndex() - 1));
            const y = cellBounds.y + (height * (textItem.getGridRowIndex() - 1));
            displayBounds = new Rectangle(x, y, width, height);
        }
        return displayBounds;
    }

    private drawDangerousCargo(ctx: CanvasRenderingContext2D) : void {
        if (!this._mySlot.iMDGSymbol) return;

        const location = this.getCurrentLocation();
        const size = this.getCurrentSize();
        const boundary = new Rectangle(location.x, location.y, size.width, size.height);
        boundary.inflate(new Size(-2, -2));
        boundary.inflate(new Size(0, -(boundary.height * 0.20)));
        const width = (boundary.width / 2);
        const height = (boundary.height / 2);
        const heightGap = -1;
        const points: Point[] = [];
        points.push(new Point(boundary.x + width, boundary.y + heightGap));
        points.push(new Point(boundary.x + boundary.width, boundary.y + height + heightGap));
        points.push(new Point(boundary.x + width, boundary.y + boundary.height + heightGap));
        points.push(new Point(boundary.x, boundary.y + height + heightGap));
        points.push(new Point(boundary.x + width, boundary.y + heightGap));
        const polygon = new DrawPolygon("DangerousCargo", points);
        polygon.attribute.lineColor = this._mySlot.iMDGSymbol.borderColor;
        polygon.attribute.fillColor = this._mySlot.iMDGSymbol.backColor;
        polygon.attribute.lineThick = this._mySlot.iMDGSymbol.width;
        polygon.draw(ctx);
    }

    private drawOuterSideTriangle(ctx: CanvasRenderingContext2D) : void {
        const rectangle = this.getBounds();

        if (this._mySlot.outerLeftSideTriangle) {
            OverContainerUtil.drawTriangle(ctx, rectangle, SideStyles.OuterLeft, TriangleDir.Left, this._mySlot.outerLeftSideTriangle, this._zoomRate);
        }
        if (this._mySlot.outerTopSideTriangle) {
            OverContainerUtil.drawTriangle(ctx, rectangle, SideStyles.OuterTop, TriangleDir.Up, this._mySlot.outerTopSideTriangle, this._zoomRate);
        }
        if (this._mySlot.outerRightSideTriangle) {
            OverContainerUtil.drawTriangle(ctx, rectangle, SideStyles.OuterRight, TriangleDir.Right, this._mySlot.outerRightSideTriangle, this._zoomRate);
        }
    }

    private drawInnerSideTriangle(ctx: CanvasRenderingContext2D) : void {
        if (this._mySlot.innerTopSideTriangle !== undefined) {
            OverContainerUtil.drawTriangle(ctx, this.getBounds(), SideStyles.InnerTop, TriangleDir.Down, this._mySlot.innerTopSideTriangle, this._zoomRate);
        }
    }

    private drawOuterSideRectangle(g: CanvasRenderingContext2D) : void {
        if (this._mySlot.outerSideRectangle !== undefined) {
            OverContainerUtil.drawOuterSideRectangle(g, this.getBounds(), this._mySlot.outerSideRectangle);
        }
    }

    private drawInnerSideText(g: CanvasRenderingContext2D) : void {
        const rectangle = this.getBounds();
        
        if (this._mySlot.innerLeftSideText !== undefined) {
            OverContainerUtil.drawText(g, rectangle, ContentAlignment.MiddleLeft, this._mySlot.innerLeftSideText, "Tahoma", (15 * this._zoomRate));
        }
        if (this._mySlot.innerTopSideText !== undefined) {
            OverContainerUtil.drawText(g, rectangle, ContentAlignment.TopCenter, this._mySlot.innerTopSideText, "Tahoma", (15 * this._zoomRate));
        }
        if (this._mySlot.innerRightSideText !== undefined) {
            OverContainerUtil.drawText(g, rectangle, ContentAlignment.MiddleRight, this._mySlot.innerRightSideText, "Tahoma", (15 * this._zoomRate));
        }
    }

    drawOuterSideSymbol(g: CanvasRenderingContext2D) : void {
        this.drawOuterSideTriangle(g);
        this.drawOuterSideRectangle(g);
    }

    getContainerItem(): ContainerBayItem {
        return this._mySlot;
    }

    getDragData(): any {
        return this._mySlot;
    }

    getMarked(): boolean {
        return this._isViewMarking;
    }

    setMarking(visible: boolean): void {
        this._isViewMarking = visible;
    }

    setMarkingByType(visible: boolean, markingType: MarkingTypes): void {
        this._isViewMarking = visible;
        this._markingType = markingType;
    }

    setMarkingColor(visible: boolean, backColor: Color, borderColor: Color): void {
        this._isViewMarking = visible;
        this._markingBorderColor = borderColor;
        this._markingBackColor = backColor;
    }

    setMarkingBorderByType(visible: boolean, backColor: Color, borderColor: Color, markingType: MarkingTypes): void {
        this.setMarkingBorderThickByType(visible, backColor, borderColor, markingType, 0);
    }

    setMarkingBorderThickByType(visible: boolean, backColor: Color, borderColor: Color, markingType: MarkingTypes, lineThick: number): void {
        this._isViewMarking = visible;
        this._markingBorderColor = borderColor;
        this._markingBackColor = backColor;
        this._markingType = markingType;
        this._lineThick = lineThick;
    }
}

export default TContainer;