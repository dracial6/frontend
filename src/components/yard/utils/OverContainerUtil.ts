import DrawRectangle from "../../../drawing/elements/DrawRectangle";
import DrawText from "../../../drawing/elements/DrawText";
import DrawTriangle from "../../../drawing/elements/DrawTriangle";
import { ContentAlignment, FontStyles, Point, Rectangle, Size, TriangleDir } from "../../../drawing/structures";
import SideRectangleStyleItem from "../../common/items/SideRectangleStyleItem";
import SideTextStyleItem from "../../common/items/SideTextStyleItem";
import SideTriangleStyleItem from "../../common/items/SideTriangleStyleItem";
import SideStyles from "../structures/SideStyles";

class OverContainerUtil {
    static drawTriangle(ctx: CanvasRenderingContext2D, bounds: Rectangle, sideStyle: SideStyles, dir: TriangleDir, style: SideTriangleStyleItem, zoomRate: number) : void {
        const distance = this.calculateTriangleHeight(bounds, dir, style.sizeRate);
        const dBounds = this.calculateDisplayBounds(bounds, sideStyle, distance);
        const drawTriangle = new DrawTriangle("", 0, 0, 0, 0);
        drawTriangle.setLocation(dBounds.getLocation());
        drawTriangle.setSize(dBounds.getSize());
        drawTriangle.setDirection(dir);
        drawTriangle.attribute.dashStyle = style.dashStyle;
        drawTriangle.attribute.lineColor = style.borderColor;
        drawTriangle.attribute.fillColor = style.backColor;
        drawTriangle.attribute.lineThick = style.width * zoomRate;
        drawTriangle.draw(ctx);

        if (style.textItem && style.textItem.text.length > 0) {
            const drawText = new DrawText("");
            drawText.text = style.textItem.text;
            drawText.attribute.lineColor = style.textItem.textColor;
            drawText.attribute.textAlign = ContentAlignment.MiddleCenter;
            drawText.attribute.fontSize = style.textItem.fontSize;
            drawText.attribute.fontStyle = (style.textItem.italic) ? FontStyles.italic : (style.textItem.bold) ? FontStyles.bold : FontStyles.normal;
            const realSize = drawText.getRealTextSize();
            drawText.setLocation(new Point(drawTriangle.getLocation().x + Math.ceil((drawTriangle.getCurrentSize().width - realSize.width) / 2), drawTriangle.getLocation().y + (drawTriangle.getCurrentSize().height - realSize.height) / 2));
            drawText.draw(ctx);
        }
    }
    
    static drawText(ctx: CanvasRenderingContext2D, bounds: Rectangle, sideStyle: ContentAlignment, textItem: SideTextStyleItem, fontName: string, fontSize: number) : void {
        bounds.inflate(new Size(textItem.padding * -1, textItem.padding * -1));
        const drawText = new DrawText("");
        drawText.setLocation(bounds.getLocation());
        drawText.setSize(bounds.getSize());
        drawText.attribute.textAlign = sideStyle;
        drawText.attribute.fontStyle = textItem.getTextStyle();
        drawText.attribute.fontName = fontName;
        drawText.attribute.fontSize = fontSize * textItem.sizeRate;
        drawText.text = textItem.text;
        drawText.attribute.lineColor = textItem.textColor;
        drawText.draw(ctx);
    }

    static drawOuterSideRectangle(ctx: CanvasRenderingContext2D, bounds: Rectangle, style: SideRectangleStyleItem) : void {
        const overSlotLeft = style.leftOverSize;
        const overSlotTop = style.topOverSize;
        const overSlotRight = style.rightOverSize;
        let overSlotWidth, overSlotHeight;
        let x = 0;
        let y = 0;
        const x_s = bounds.x;
        const y_s = bounds.y;
        const cellW = bounds.width;
        const cellH = bounds.height;

        try {
            if (overSlotLeft + overSlotTop + overSlotRight <= 0) {
                return;
            }
            const rateOne = style.sizeRate;
            const rateTwo = style.sizeRate * 0.5;
            const rectangle = new DrawRectangle("");
            rectangle.attribute.lineColor = style.borderColor;
            rectangle.attribute.lineThick = style.width;
            rectangle.attribute.dashStyle = style.dashStyle;
            ctx.globalCompositeOperation = "destination-over";
            
            if (overSlotLeft > 0 && overSlotTop === 0 && overSlotRight === 0) {
                x = (x_s - (cellW * overSlotLeft) + (cellW * rateOne));
                y = (y_s + (cellH * rateTwo));
                overSlotWidth = ((cellW * overSlotLeft) - (cellW * rateOne));
                overSlotHeight = (cellH * rateOne);
                rectangle.setLocation(new Point(x, y));
                rectangle.setSize(new Size(overSlotWidth, overSlotHeight));
                rectangle.draw(ctx);
            } else if (overSlotLeft > 0 && overSlotTop > 0 && overSlotRight === 0) {
                x = (x_s - (cellW * overSlotLeft) + (cellW * rateOne));
                y = (y_s - (cellH * overSlotTop) + (cellH * rateOne));
                overSlotWidth = ((cellW * overSlotLeft) + (cellW * rateTwo));
                overSlotHeight = ((cellH * overSlotTop) + (cellH * rateTwo));
                rectangle.setLocation(new Point(x, y));
                rectangle.setSize(new Size(overSlotWidth, overSlotHeight));
                rectangle.draw(ctx);
            } else if (overSlotLeft > 0 && overSlotTop > 0 && overSlotRight > 0) {
                x = (x_s - (cellW * overSlotLeft) + (cellW * rateOne));
                y = (y_s - (cellH * overSlotTop) + (cellH * rateOne));
                overSlotWidth = ((cellW * overSlotLeft) + (cellW * overSlotRight));
                overSlotHeight = ((cellH * overSlotTop) + (cellH * rateTwo));
                rectangle.setLocation(new Point(x, y));
                rectangle.setSize(new Size(overSlotWidth, overSlotHeight));
                rectangle.draw(ctx);
            } else if (overSlotLeft === 0 && overSlotTop > 0 && overSlotRight > 0) {
                x = (x_s + (cellW * rateTwo));
                y = (y_s - ((cellH * overSlotTop) - (cellH * rateOne)));
                overSlotWidth = ((cellW * overSlotRight) + (cellW * rateTwo));
                overSlotHeight = ((cellH * overSlotTop) + (cellH * rateTwo));
                rectangle.setLocation(new Point(x, y));
                rectangle.setSize(new Size(overSlotWidth, overSlotHeight));
                rectangle.draw(ctx);
            } else if (overSlotLeft === 0 && overSlotTop === 0 && overSlotRight > 0) {
                x = (x_s + (cellW * (overSlotRight)));
                y = (y_s + (cellH * rateTwo));
                overSlotWidth = ((cellW * overSlotRight) - (cellW * rateOne));
                overSlotHeight = (cellH * rateOne);
                rectangle.setLocation(new Point(x, y));
                rectangle.setSize(new Size(overSlotWidth, overSlotHeight));
                rectangle.draw(ctx);
            } else if (overSlotLeft === 0 && overSlotTop > 0 && overSlotRight === 0) {
                overSlotWidth = (cellW * rateOne);
                overSlotHeight = ((cellH * overSlotTop) - (cellH * rateOne));
                x = (x_s + (cellW * rateTwo));
                y = (y_s - overSlotHeight);
                rectangle.setLocation(new Point(x, y));
                rectangle.setSize(new Size(overSlotWidth, overSlotHeight));
                rectangle.draw(ctx);
            } else if (overSlotLeft > 0 && overSlotTop === 0 && overSlotRight > 0) {
                x = (x_s - (cellW * overSlotLeft) + (cellW * rateOne));
                y = (y_s + (cellH * rateTwo));
                overSlotWidth = ((cellW * overSlotLeft) - (cellW * rateOne));
                overSlotHeight = (cellH * rateOne);
                rectangle.setLocation(new Point(x, y));
                rectangle.setSize(new Size(overSlotWidth, overSlotHeight));
                rectangle.draw(ctx);
                x = (x_s + (cellW * (overSlotRight)));
                y = (y_s + (cellH * rateTwo));
                overSlotWidth = ((cellW * overSlotRight) - (cellW * rateOne));
                overSlotHeight = (cellH * rateOne);
                rectangle.setLocation(new Point(x, y));
                rectangle.setSize(new Size(overSlotWidth, overSlotHeight));
                rectangle.draw(ctx);
            }
        }
        finally {
            ctx.globalCompositeOperation = "source-over";
        }
    }

    private static calculateDisplayBounds(displayBounds: Rectangle, sideStyle: SideStyles, range: number) : Rectangle {
        const slotBoundsF = new Rectangle(displayBounds.x, displayBounds.y, displayBounds.width, displayBounds.height);
        const boundsF = this.getDisplayBounds(slotBoundsF, sideStyle, range);
        return boundsF;
    }

    private static getDisplayBounds(displayBounds: Rectangle, sideStyle: SideStyles, range: number) : Rectangle {
        const bounds = Rectangle.empty();
        switch (sideStyle) {
            case SideStyles.OuterTop:
                bounds.x = displayBounds.x;
                bounds.y = displayBounds.y - range;
                bounds.width = displayBounds.width;
                bounds.height = range;
                break;
            case SideStyles.InnerTop:
                bounds.x = displayBounds.x;
                bounds.y = displayBounds.y;
                bounds.width = displayBounds.width;
                bounds.height = range;
                break;
            case SideStyles.OuterLeft:
                bounds.x = displayBounds.x - range;
                bounds.y = displayBounds.y;
                bounds.width = range;
                bounds.height = displayBounds.height;
                break;
            case SideStyles.InnerLeft:
                bounds.x = displayBounds.x;
                bounds.y = displayBounds.y;
                bounds.width = range;
                bounds.height = displayBounds.height;
                break;
            case SideStyles.OuterBottom:
                bounds.x = displayBounds.x;
                bounds.y = displayBounds.y + displayBounds.height;
                bounds.width = displayBounds.width;
                bounds.height = range;
                break;
            case SideStyles.InnerBottom:
                bounds.x = displayBounds.x;
                bounds.y = displayBounds.y + displayBounds.height - range;
                bounds.width = displayBounds.width;
                bounds.height = range;
                break;
            case SideStyles.OuterRight:
                bounds.x = displayBounds.x + displayBounds.width;
                bounds.y = displayBounds.y;
                bounds.width = range;
                bounds.height = displayBounds.height;
                break;
            case SideStyles.InnerRight:
                bounds.x = displayBounds.x + displayBounds.width - range;
                bounds.y = displayBounds.y;
                bounds.width = range;
                bounds.height = displayBounds.height;
                break;
        }
        
        return bounds;
    }

    private static calculateTriangleHeight(bounds: Rectangle, dir: TriangleDir, sizeRate: number) : number {
        let distance = 1;

        if (dir === TriangleDir.Left || dir === TriangleDir.Right) {
            distance = (bounds.width * sizeRate);
        } else {
            distance = (bounds.height * sizeRate);
        }

        if (distance < 1) {
            distance = 1;
        }

        return distance;
    }
}

export default OverContainerUtil;