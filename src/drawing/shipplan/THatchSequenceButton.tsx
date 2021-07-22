import DrawLine from "../elements/DrawLine";
import DrawRectangle from "../elements/DrawRectangle";
import DrawText from "../elements/DrawText";
import { Color, FontStyles, Point, Rectangle, Size } from "../structures";
import ContentAlignment from "../structures/ContentAlignment";
import GeneralQCScheduleItem from "./items/GeneralQCScheduleItem";
import { HatchDefine } from "./structures";
import TBaseGeneral from "./TBaseGeneral";
import TBayProperty from "./TBayProperty";

class THatchSequenceButton extends TBaseGeneral {
    private _isPressed = false;
    qcScheduleItem: GeneralQCScheduleItem;

    constructor (key: string, qcScheduleItem: GeneralQCScheduleItem, tBayProperty: TBayProperty) {
        super(key, tBayProperty);
        this.qcScheduleItem = qcScheduleItem;
        this.setSize(new Size(HatchDefine.QCSEQ_CELLW, HatchDefine.QCSEQ_CELLH));
    }

    getIsPressed(): boolean {
        return this._isPressed;
    }

    setIsPressed(isPressed: boolean): void {
        this._isPressed = isPressed;
        this.isChanged = true;
    }

    drawDetail(ctx: CanvasRenderingContext2D, pageScale: number, canvasBoundary: Rectangle, isMemoryCatch: boolean): void {
        this.drawSequenceButton(ctx);
    }

    drawSequenceButton(ctx: CanvasRenderingContext2D) {
        const startX = this.getCurrentLocation().x;
        const startY = this.getCurrentLocation().y;

        const qcSEQ = new DrawText(this.name + "_qcSEQ");
        qcSEQ.setLocation(new Point(startX, startY));
        qcSEQ.setSize(new Size(HatchDefine.QCSEQ_CELLW, HatchDefine.QCSEQ_CELLH));
        qcSEQ.attribute.lineColor = this.qcScheduleItem.foreColor;
        qcSEQ.attribute.fillColor = this.qcScheduleItem.backColor;
        qcSEQ.attribute.fontName = HatchDefine.CASP_LARGE_FONT;
        qcSEQ.attribute.fontSize = 11.25;
        qcSEQ.attribute.fontStyle = FontStyles.normal;
        qcSEQ.attribute.textAlign = ContentAlignment.BottomCenter;
        qcSEQ.text = this.qcScheduleItem.qcSEQ + "";
        qcSEQ.draw(ctx);

        if (this._isPressed) {
            const outLine = new DrawRectangle(this.name + "_R");
            outLine.setLocation(new Point(startX, startY));
            outLine.attribute.lineColor = Color.Black();
            outLine.setSize(new Size(HatchDefine.QCSEQ_CELLW, HatchDefine.QCSEQ_CELLH));
            outLine.draw(ctx);

            const line1 = new DrawLine(this.name + "_L1", startX + 1, startY + 1
                , startX + HatchDefine.QCSEQ_CELLW - 2, startY + 1);
            line1.attribute.lineColor = Color.Black();
            line1.draw(ctx);

            const line2 = new DrawLine(this.name + "_L2", startX + 1, startY + 1
                , startX + 1, startY + HatchDefine.QCSEQ_CELLH - 2);
            line2.attribute.lineColor = Color.Black();
            line2.draw(ctx);

            const line3 = new DrawLine(this.name + "_L3", startX + 1
                , startY + HatchDefine.QCSEQ_CELLH - 1
                , startX + HatchDefine.QCSEQ_CELLW - 1
                , startY + HatchDefine.QCSEQ_CELLH - 1);
            line3.attribute.lineColor = Color.White();
            line3.draw(ctx);

            const line4 = new DrawLine(this.name + "_L4"
                , startX + HatchDefine.QCSEQ_CELLW - 1
                , startY + HatchDefine.QCSEQ_CELLH - 1
                , startX + HatchDefine.QCSEQ_CELLW - 1
                , startY + 1);
            line4.attribute.lineColor = Color.White();
            line4.draw(ctx);
        } else {
            const outLine = new DrawRectangle(this.name + "_R");
            outLine.setLocation(new Point(startX, startY));
            outLine.setSize(new Size(HatchDefine.QCSEQ_CELLW, HatchDefine.QCSEQ_CELLH));
            outLine.attribute.lineColor = Color.DarkGray();
            outLine.draw(ctx);

            const inOutLine = new DrawRectangle(this.name + "_R");
            inOutLine.setLocation(new Point(startX + 1, startY + 1));
            inOutLine.setSize(new Size(HatchDefine.QCSEQ_CELLW - 2, HatchDefine.QCSEQ_CELLH - 2));
            inOutLine.attribute.lineColor = Color.White();
            inOutLine.draw(ctx);
        }
    }

    onMouseClick(sender: any, event: MouseEvent): void {
        this._isPressed = !this._isPressed;
        this.isChanged = true;
    }
}

export default THatchSequenceButton;