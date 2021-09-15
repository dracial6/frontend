import BaseDrawArea from "./BaseDrawArea";
import IDrawableGeometry from "./elements/IDrawableGeometry";
import { Point } from "./structures";
import ArrangeDirection from "./structures/ArrangeDirection";

class DrawArrangeHandler {
    private _control: BaseDrawArea;
    private _arrangeDirectionCache = ArrangeDirection.None;
    private _arrangeTopMarginCache = 1;
    private _arrangeLeftMarginCache = 1;
    private _arrangeFixCountCache = 0;
    private _widthCache = 0;
    private _heightCache = 0;

    arrangeTopMargin: number;
    arrangeLeftMargin: number;
    arrangeOffsetX = 0;
    arrangeOffsetY = 0;

    constructor(control: BaseDrawArea, topMargin: number, leftMargin: number) {
        this._control = control;
        this.arrangeTopMargin = topMargin;
        this.arrangeLeftMargin = leftMargin;
    }

    reset(): void {
        this._arrangeTopMarginCache = 1;
        this._arrangeLeftMarginCache = 1;
        this._arrangeDirectionCache = ArrangeDirection.None;
        this._arrangeFixCountCache = 0;
        this._widthCache = 0;
        this._heightCache = 0;
    }

    arrange(list: IDrawableGeometry[], type: ArrangeDirection, arrangeFixCount: number, enforceArrange: boolean): void {
        if (list.length === 0) return;

        if (enforceArrange || this.isValueChange(type, arrangeFixCount)) {
            this._arrangeTopMarginCache = this.arrangeTopMargin;
            this._arrangeLeftMarginCache = this.arrangeLeftMargin;
            this._arrangeDirectionCache = type;
            this._arrangeFixCountCache = arrangeFixCount;
            this._widthCache = this._control.getWidth();
            this._heightCache = this._control.getHeight();
        } else {
            return;
        }

        switch(type) {
            case ArrangeDirection.LeftToRight:
                this.arrangeLeftToRight(list, arrangeFixCount);
                break;
            case ArrangeDirection.TopDown:
                this.arrangeTopToBottom(list, arrangeFixCount);
                break;
            case ArrangeDirection.RightToLeft:
                this.arrangeRightToLeft(list, arrangeFixCount);
                break;
            case ArrangeDirection.BottomUp:
                this.arrangeBottomToUp(list, arrangeFixCount);
                break;
            case ArrangeDirection.LeftToRightBottomUp:
                this.arrangeLeftToRightBottomToUp(list, arrangeFixCount);
                break;
        }

        if (this.arrangeOffsetX !== 0 || this.arrangeOffsetY !== 0) {
            this.applyOffset(list, this.arrangeOffsetX, this.arrangeOffsetY);
        }
    }

    private isValueChange(type: ArrangeDirection, arrangeFixCount: number): boolean {
        if (this._arrangeTopMarginCache !== this.arrangeTopMargin) return true;
        if (this._arrangeLeftMarginCache !== this.arrangeLeftMargin) return true;
        if (this._arrangeDirectionCache !== type) return true;
        if (this._arrangeFixCountCache !== arrangeFixCount) return true;
        if (this._widthCache !== this._control.getWidth()) return true;
        if (this._heightCache !== this._control.getHeight()) return true;

        return false;
    }

    private arrangeLeftToRight(list: IDrawableGeometry[], fixCol: number): void {
        let tBayHeight = 0;
        let leftPos = this.arrangeLeftMargin;
        let topPos = this.arrangeTopMargin;
        let highestBayIndex = 0;
        let count = 0;
        let hasToGoNextRow = false;
        const n = list.length;

        list[n - 1].setLocation(new Point(leftPos, topPos));
        highestBayIndex = n - 1;
        count++;
        leftPos += list[n - 1].getMBR().width + this.arrangeLeftMargin;
        tBayHeight += list[n - 1].getMBR().height + this.arrangeTopMargin;

        for (let i = n - 2; i >= 0; i--) {
            const item = list[i];
            hasToGoNextRow = false;

            if (fixCol === 0) {
                if ((leftPos + item.getMBR().width + this.arrangeLeftMargin) * this._control.getPageScale() > this._control.getWidth()) {
                    hasToGoNextRow = true;
                }
            } else {
                if (count === fixCol) {
                    hasToGoNextRow = true;
                    count = 0;
                }
            }

            if (hasToGoNextRow) {
                const highestItem = list[highestBayIndex];
                leftPos = this.arrangeLeftMargin;
                topPos = highestItem.getLocation().y + highestItem.getMBR().height + this.arrangeTopMargin;
                tBayHeight = item.getMBR().height + this.arrangeTopMargin;
                highestBayIndex = i;
            } else {
                if (tBayHeight < item.getMBR().height + this.arrangeTopMargin) {
                    tBayHeight = item.getMBR().height + this.arrangeTopMargin;
                    highestBayIndex = i;
                }
            }

            list[i].setLocation(new Point(leftPos, topPos));
            count++;
            leftPos += item.getMBR().width + this.arrangeLeftMargin;
        }
    }

    private arrangeTopToBottom(list: IDrawableGeometry[], fixRow: number): void {
        let tBayWidth = 0;
        let leftPos = this.arrangeLeftMargin;
        let topPos = this.arrangeTopMargin;
        let widestBayIndex = 0;
        let count = 0;
        let hasToGoNextRow = false;
        const n = list.length;

        list[n - 1].setLocation(new Point(leftPos, topPos));
        widestBayIndex = n - 1;
        count++;
        topPos += list[n - 1].getMBR().height + this.arrangeTopMargin;
        tBayWidth = list[n - 1].getMBR().width + this.arrangeLeftMargin;

        for (let i = n - 2; i >= 0; i--) {
            const item = list[i];
            hasToGoNextRow = false;

            if (fixRow === 0) {
                if (topPos + item.getMBR().height + this.arrangeTopMargin > this._control.getHeight()) {
                    hasToGoNextRow = true;
                }
            } else {
                if (count === fixRow) {
                    hasToGoNextRow = true;
                    count = 0;
                }
            }

            if (hasToGoNextRow) {
                const widestItem = list[widestBayIndex];
                topPos = this.arrangeTopMargin;
                leftPos = widestItem.getLocation().x + widestItem.getMBR().width + this.arrangeLeftMargin;
                tBayWidth = item.getMBR().width + this.arrangeLeftMargin;
                widestBayIndex = i;
            } else {
                if (tBayWidth < item.getMBR().width + this.arrangeLeftMargin) {
                    tBayWidth = item.getMBR().width + this.arrangeLeftMargin;
                    widestBayIndex = i;
                }
            }

            list[i].setLocation(new Point(leftPos, topPos));
            count++;
            topPos += item.getMBR().height + this.arrangeTopMargin;
        }
    }

    private arrangeRightToLeft(list: IDrawableGeometry[], fixCol: number): void {
        let tBayHeight = 0;
        let leftPos = this.arrangeLeftMargin;
        let topPos = this.arrangeTopMargin;
        let highestBayIndex = 0;
        let count = 0;
        let hasToGoNextRow = false;
        let minX = 99999;
        const realWidth = this._control.getWidth();
        const n = list.length;

        leftPos = realWidth - (list[n - 1].getMBR().width + this.arrangeLeftMargin);
        list[n - 1].setLocation(new Point(leftPos, topPos));
        highestBayIndex = n - 1;
        count++;
        tBayHeight = list[n - 1].getMBR().height + this.arrangeTopMargin;

        for (let i = n - 2; i >= 0; i--) {
            const item = list[i];
            hasToGoNextRow = false;

            if (fixCol === 0) {
                if (leftPos - (item.getMBR().width + this.arrangeLeftMargin) < 0)
                    hasToGoNextRow = true;
            } else {
                if (count === fixCol) {
                    hasToGoNextRow = true;
                    count = 0;
                }
            }

            if (hasToGoNextRow) {
                const highestItem = list[highestBayIndex];
                leftPos = realWidth - (item.getMBR().width + this.arrangeLeftMargin);
                topPos = highestItem.getLocation().y + highestItem.getMBR().height + this.arrangeTopMargin;
                tBayHeight = item.getMBR().height + this.arrangeTopMargin;
            } else {
                if (tBayHeight < item.getMBR().height + this.arrangeTopMargin) {
                    tBayHeight = item.getMBR().height + this.arrangeTopMargin;
                    highestBayIndex = i;
                }

                leftPos -= item.getMBR().width + this.arrangeLeftMargin;
            }

            if (minX > leftPos) {
                minX = leftPos;
            }

            list[i].setLocation(new Point(leftPos, topPos));
            count++
        }

        if (minX < 0) {
            const tempMinX = Math.abs(minX);

            list.forEach(element => {
                element.setLocation(new Point(element.getLocation().x + tempMinX, element.getLocation().y));
            });
        }
    }

    private arrangeBottomToUp(list: IDrawableGeometry[], fixRow: number): void {
        let tBayWidth = 0;
        let leftPos = this.arrangeLeftMargin;
        let topPos = this.arrangeTopMargin;
        let widestBayIndex = 0;
        let count = 0;
        let realHeight = 0;
        let hasToGoNextCol = false;
        let minY = 99999;

        const n = list.length;

        list.forEach(element => {
            if (element.getSize().height > realHeight) {
                realHeight = element.getSize().height * this._control.getPageScale();
            }
        });

        const mbr = (list[n - 1].getMBR().height + this.arrangeTopMargin) * this._control.getPageScale();
        topPos = ((this._control.getHeight() > realHeight) ? this._control.getHeight() : realHeight) - mbr;
        list[n - 1].setLocation(new Point(leftPos, topPos));
        widestBayIndex = n - 1;
        count++;
        tBayWidth = list[n - 1].getMBR().width + this.arrangeLeftMargin;

        for (let i = n - 2; i >= 0; i--) {
            const item = list[i];
            hasToGoNextCol = false;

            if (fixRow === 0) {
                if (topPos - mbr < 0)
                    hasToGoNextCol = true;
            } else {
                if (count === fixRow) {
                    hasToGoNextCol = true;
                    count = 0;
                }
            }

            if (hasToGoNextCol) {
                const widestItem = list[widestBayIndex];
                topPos = this._control.getHeight() - item.getMBR().height - this.arrangeTopMargin;
                leftPos = widestItem.getLocation().x + widestItem.getMBR().width + this.arrangeLeftMargin;
                tBayWidth = item.getMBR().width + this.arrangeLeftMargin;
                widestBayIndex = i;
            } else {
                if (tBayWidth < item.getMBR().width + this.arrangeLeftMargin) {
                    tBayWidth = item.getMBR().width + this.arrangeLeftMargin;
                    widestBayIndex = i;
                }
                topPos -= mbr;
            }

            if (minY > topPos) {
                minY = topPos;
            }

            list[i].setLocation(new Point(leftPos, topPos));
            count++;
        }
    }

    private arrangeLeftToRightBottomToUp(list: IDrawableGeometry[], fixCol: number): void {
        let tBayHeight = 0;
        let leftPos = this.arrangeLeftMargin;
        let topPos = 0;
        let hightestBayIndex = 0;
        let count = 0;
        let hasToGoNextRow = false;
        const realWidth = this._control.getWidth();
        
        const n = list.length;

        const bottomMargin = 1;
        const tempN = n - 1;
        const rowCount = n / ((fixCol === 0) ? 1 : fixCol);

        tBayHeight = list[tempN].getMBR().height;
        topPos = tBayHeight * rowCount + this.arrangeTopMargin;

        list[tempN].setLocation(new Point(leftPos, topPos));
        hightestBayIndex = tempN;
        count++;

        for (let i = n - 2; i >= 0; i--) {
            const item = list[i + 1];
            hasToGoNextRow = false;

            if (fixCol === 0) {
                if (leftPos + item.getMBR().width + this.arrangeLeftMargin > this._control.getWidth())
                    hasToGoNextRow = true;
            } else {
                if (count === fixCol) {
                    hasToGoNextRow = true;
                    count = 0;
                }
            }

            if (hasToGoNextRow) {
                const highestBay = list[hightestBayIndex];
                leftPos = this.arrangeLeftMargin;
                topPos = highestBay.getLocation().y - highestBay.getMBR().height;
                tBayHeight = item.getMBR().height;
                hightestBayIndex = i + 1;
            } else {
                if (tBayHeight < item.getMBR().height) {
                    tBayHeight = item.getMBR().height;
                    hightestBayIndex = i + 1;
                }

                leftPos += item.getMBR().width + this.arrangeLeftMargin;
            }

            list[i].setLocation(new Point(this.arrangeLeftMargin, tBayHeight * (rowCount - 1) + this.arrangeTopMargin));
        }
    }
    
    private applyOffset(list: IDrawableGeometry[], offsetX: number, offsetY: number): void {
        if (!list) return;

        list.forEach(element => {
            element.setLocation(new Point(element.getLocation().x + offsetX, element.getLocation().y + offsetY));
        });
    }
}

export default DrawArrangeHandler;