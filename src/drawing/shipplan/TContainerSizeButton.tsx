import DrawLine from "../elements/DrawLine";
import DrawRectangle from "../elements/DrawRectangle";
import DrawText from "../elements/DrawText";
import { Color, FontStyles, Point, Rectangle, Size } from "../structures";
import ContentAlignment from "../structures/ContentAlignment";
import { HatchDefine } from "./structures";
import TBaseGeneral from "./TBaseGeneral";
import TBayProperty from "./TBayProperty";

class TContainerSizeButton extends TBaseGeneral {
    private _isPressed = false;
    
    readonly ContainerSize;
    readonly HatchIndex;

    constructor(hatchIndex: number, key: string, containerSize: number, tBayProperty: TBayProperty) {
        super(key, tBayProperty);
        this.ContainerSize = containerSize;
        this.HatchIndex = hatchIndex;
        this.setSize(new Size(HatchDefine.QCSEQ_CELLW, HatchDefine.QCSEQ_CELLH));
    }

    getIsPressed(): boolean {
        return this._isPressed;
    }

    setIsPressed(isPressed: boolean): void {
        this._isPressed = isPressed;
        this.isChanged = true;
    }

    drawDetail(ctx: CanvasRenderingContext2D, pageScale: number, canvasBoundary: Rectangle, isMemoryCatch: boolean) {
        this.drawSizeButton(ctx);
    }

    private drawSizeButton(ctx: CanvasRenderingContext2D) {
        const startX = this.getCurrentLocation().x;
        const startY = this.getCurrentLocation().y;

        const cntSizeTxt = new DrawText(this.name + "_CN_SIZE");
        cntSizeTxt.setLocation(new Point(startX, startY));
        cntSizeTxt.setSize(this.getSize());
        cntSizeTxt.attribute.lineColor = (this._isPressed) ? Color.Red() : HatchDefine.BORDER_COLOR;
        cntSizeTxt.attribute.fontName = "tahoma";
        cntSizeTxt.attribute.fontSize = 11.25;
        cntSizeTxt.attribute.fontStyle = FontStyles.bold;
        cntSizeTxt.attribute.textAlign = ContentAlignment.BottomCenter;
        cntSizeTxt.attribute.fillColor = Color.White();
        cntSizeTxt.text = this.ContainerSize.toString();
        cntSizeTxt.draw(ctx);

        const outLine = new DrawRectangle(this.name + "_R");
        outLine.attribute.lineColor = HatchDefine.BORDER_COLOR;
        outLine.setLocation(new Point(startX, startY));
        outLine.setSize(new Size(HatchDefine.QCSEQ_CELLW, HatchDefine.QCSEQ_CELLH));
        outLine.draw(ctx);

        if (this._isPressed) {
            const line1 = new DrawLine(this.name + "_L1", startX + 1, startY + 1, startX + HatchDefine.QCSEQ_CELLW - 2, startY + 1);
            line1.attribute.lineColor = Color.Black();
            line1.draw(ctx);

            const line2 = new DrawLine(this.name + "_L2", startX + 1, startY + 1, startX + 1, startY + HatchDefine.QCSEQ_CELLH - 2);
            line2.attribute.lineColor = Color.Black();
            line2.draw(ctx);
        } else {
            const line1 = new DrawLine(this.name + "_L1", startX + 1, startY + 1, startX + HatchDefine.QCSEQ_CELLW - 2, startY + 1);
            line1.attribute.lineColor = Color.White();
            line1.draw(ctx);

            const line2 = new DrawLine(this.name + "_L2", startX + 1, startY + 1, startX + 1, startY + HatchDefine.QCSEQ_CELLH - 2);
            line2.attribute.lineColor = Color.White();
            line2.draw(ctx);
        }        
    }

    onMouseClick(sender: any, event: MouseEvent): void {
        this._isPressed = !this._isPressed;
        this.isChanged = true;
    }
}

export default TContainerSizeButton;