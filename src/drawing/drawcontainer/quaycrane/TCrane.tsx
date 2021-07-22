import BaseDraw from "../../elements/BaseDraw";
import DrawableObject from "../../elements/DrawableObject";
import DrawLine from "../../elements/DrawLine";
import DrawPolygon from "../../elements/DrawPolygon";
import DrawRectangle from "../../elements/DrawRectangle";
import DrawText from "../../elements/DrawText";
import { Color, Point, Size } from "../../structures";
import QCSideContainerItem from "./items/QCSideContainerItem";
import QCSideItem from "./items/QCSideItem";
import TrolleyJobTypes from "./structures/TrolleyJobTypes";
import TMachineryHouse from "./TMachineryHouse";
import Trolley from "./Trolley";

class TCrane extends DrawableObject {
    private readonly MACHINERY_HOUSE = "MachineryHouse";
    private readonly BOTTOM_LINE = "BottomLine";
    private readonly CLEARANCE_ROOP = "ClearanceRoop";
    private readonly CRANE_DIAGONAL = "CraneDiagonal";
    private readonly TROLLEY = "Trolley";
    private readonly JIB_TIE1 = "JibTie1";
    private readonly JIB_TIE2 = "JibTie2";
    private readonly JIB_TIE3 = "JibTie3";
    private readonly JIB = "Jib";
    private readonly CRANE_HEIGHT = "CraneHeight";
    private readonly CRANE_POLEHEIGHT = "CranePoleHeight";
    private readonly CRANE_TITLE = "CraneTitle";
    private readonly RAIL_HEIGHT = "RailHeight";

    private _item: QCSideItem;
    private _trolleyGeomList: Trolley[] = [];
    private _craneThick = 5;
    private _jibWidth = -1;
    private _waterSideLength = -1;
    private _landSideLength = -1;
    private _machineryHouse = -1;
    private _isSecondExist = false;
    private _mainTrolleyStartX = -1;
    private _secondTrolleyStartX = -1;
    private _trolleyStartX = -1;

    constructor (item: QCSideItem) {
        super(item.name);
        this.isCheckViewBoundary = false;
        this._item = item;
        this._craneThick = this._item.craneThick;
        this.drawCrane();        
    }

    setCraneVerticalMargin(value: number): void {
        this.setSize(new Size(this.getSize().width, this.getSize().height + value));
    }

    private drawCrane(): void {
        this.initCrane();
        this.clearGeomObject();

        this.drawMachineryHouse();
        this.drawTrolley();
        this.drawRail();
        this.drawJib();
        this.drawHeights();
        this.drawTitle();
        this.setSize(new Size(this.getSize().width, this.getSize().height + this._item.liftBottomDepth));
        this._mainTrolleyStartX = this._trolleyGeomList[0].getLocation().x;

        if (this._isSecondExist) {
            this._secondTrolleyStartX = this._trolleyGeomList[1].getLocation().x;
        }
    }

    private initCrane(): void {
        this._waterSideLength = this._item.outReachMargin + this._item.outReach;
        this._landSideLength = this._item.backReachMargin + this._item.backReach;
        this._jibWidth = this._waterSideLength + this._landSideLength;
        this._machineryHouse = this._waterSideLength + this._item.railSpan;
        this.setSize(new Size(this._jibWidth, this._item.poleHeight + this._item.craneHeight + this._item.liftBottomDepth));
    }

    private buildCrane(craneObject: BaseDraw[]): void {
        for (let i = 0; i < craneObject.length; i++) {
            craneObject[i].attribute.fillColor = this._item.backColor;
            craneObject[i].attribute.outLineColor = this._item.borderColor;
            craneObject[i].attribute.isOutLine = true;

            this.addGeomObject(craneObject[i]);
        }
    }

    private buildCraneWithColor(fillColor: Color, outLineColor: Color, craneObject: BaseDraw[]): void {
        for (let i = 0; i < craneObject.length; i++) {
            craneObject[i].attribute.fillColor = fillColor;
            craneObject[i].attribute.outLineColor = outLineColor;
            craneObject[i].attribute.isOutLine = true;

            this.addGeomObject(craneObject[i]);
        }
    }

    private drawMachineryHouse(): void {
        const machineryHouse = new TMachineryHouse(this.MACHINERY_HOUSE, this._item.machineryHouse, this._machineryHouse, this.getLocation().y + this._item.poleHeight - this._item.machineryHouse.height);
        machineryHouse.attribute.fillColor = this._item.machineryHouse.backColor;
        machineryHouse.attribute.outLineColor = this._item.machineryHouse.borderColor;
        machineryHouse.attribute.isOutLine = true;

        this.addGeomObject(machineryHouse);
    }

    private drawTrolley(): void {
        this._trolleyGeomList.length = 0;

        if (this._item.trolley.length >= 2) {
            for (let i = 0; i < this._item.trolley.length; i++) {
                if (this._item.trolley[i].jobType === TrolleyJobTypes.Main) {
                    this.addTrolley(TrolleyJobTypes.Main.toString() + this.TROLLEY, this.getLocation().x + this._item.outReachMargin, TrolleyJobTypes.Main);
                }
            }
        } else if (this._item.trolley.length === 1) {
            this.addTrolley(TrolleyJobTypes.Main.toString() + this.TROLLEY, this.getLocation().x + this._item.outReachMargin, TrolleyJobTypes.Main);
            this._isSecondExist = false;
        }
    }

    private addTrolley(trolleyName: string, startX: number, trolleyIndex: number): void {
        const trolley = new Trolley(trolleyName, this._item, this._item.trolley[trolleyIndex], startX,
                      this.getLocation().y + this._item.poleHeight + this._craneThick);

        this._trolleyGeomList.push(trolley);
        this.addGeomObject(trolley);
    }

    private drawTitle(): void {
        const titleTxt = new DrawText(this.CRANE_TITLE);
        titleTxt.setLocation(new Point(this.getLocation().x + this._item.titlePos.x, this.getLocation().y + this._item.titlePos.y));
        titleTxt.text = this._item.name;
        titleTxt.attribute.fontSize = this._item.nameStyle.fontSize;
        titleTxt.attribute.dashStyle = this._item.nameStyle.borderDashStyle;

        this.buildCraneWithColor(this._item.nameStyle.backColor, this._item.nameStyle.borderColor, [titleTxt]);

        this.moveFirst(titleTxt);
    }

    private drawRail(): void {
        const polyThick = this._craneThick - 1;

        //중간 대각선 표현을 위한 좌표 설정.
        const pointList: Point[] = [];
        pointList.push(new Point(this.getLocation().x + this._waterSideLength, this.getLocation().y + this._item.poleHeight + polyThick));
        pointList.push(new Point(this.getLocation().x + this._waterSideLength + polyThick, this.getLocation().y + this._item.poleHeight));
        pointList.push(new Point(this._machineryHouse + polyThick, this.getLocation().y + this._item.poleHeight + this._item.craneHeight - this._item.clearanceHeight));
        pointList.push(new Point(this._machineryHouse, this.getLocation().y + this._item.poleHeight + this._item.craneHeight - this._item.clearanceHeight + polyThick));
        pointList.push(new Point(this.getLocation().x + this._waterSideLength, this.getLocation().y + this._item.poleHeight + polyThick));

        const craneDiagonalPoly = new DrawPolygon(this.CRANE_DIAGONAL, pointList);
        const clearanceRoopRec = new DrawRectangle(this.CLEARANCE_ROOP);
        clearanceRoopRec.setLocation(new Point(this.getLocation().x + this._waterSideLength, this.getLocation().y + this._item.craneHeight + this._item.poleHeight - this._item.clearanceHeight));
        clearanceRoopRec.setSize(new Size(this._item.railSpan, this._craneThick));
        const bottomLine = new DrawLine(this.BOTTOM_LINE, this.getLocation().x, this.getLocation().y + this._item.craneHeight + this._item.poleHeight, this.getLocation().x + this._waterSideLength + this._landSideLength, this.getLocation().y + this._item.craneHeight + this._item.poleHeight);

        this.buildCrane([craneDiagonalPoly, clearanceRoopRec]);
        this.buildCraneWithColor(Color.Transparent(), Color.Transparent(), [bottomLine]);
    }

    private drawJib(): void {
        const polyThick = this._craneThick - 1;

        const pointList: Point[] = [];
        pointList.push(new Point(this.getLocation().x + this._item.outReachMargin, this.getLocation().y + this._item.poleHeight));
        pointList.push(new Point(this.getLocation().x + this._item.outReachMargin + polyThick, this.getLocation().y + this._item.poleHeight + polyThick));
        pointList.push(new Point(this.getLocation().x + this._waterSideLength + polyThick, this.getLocation().y + polyThick));
        pointList.push(new Point(this.getLocation().x + this._waterSideLength, this.getLocation().y));
        pointList.push(new Point(this.getLocation().x + this._item.outReachMargin, this.getLocation().y + this._item.poleHeight));
        const jibTieRec1 = new DrawPolygon(this.JIB_TIE1, pointList);

        const pointList2: Point[] = [];
        pointList2.push(new Point(this.getLocation().x + this._waterSideLength + this._craneThick, this.getLocation().y));
        pointList2.push(new Point(this.getLocation().x + this._waterSideLength + 3, this.getLocation().y + this._craneThick));
        pointList2.push(new Point(this._machineryHouse - polyThick, this.getLocation().y + this._item.poleHeight + polyThick));
        pointList2.push(new Point(this._machineryHouse, this.getLocation().y + this._item.poleHeight));
        pointList2.push(new Point(this.getLocation().x + this._waterSideLength + this._craneThick, this.getLocation().y));
        const jibTieRec2 = new DrawPolygon(this.JIB_TIE2, pointList2);

        const jibTieRec3 = new DrawLine(this.JIB_TIE3, this.getLocation().x + this._waterSideLength + this._craneThick, this.getLocation().y, this.getLocation().x + this._waterSideLength + this._landSideLength, this.getLocation().y + this._item.poleHeight);

        const jibRec = new DrawRectangle(this.JIB);
        jibRec.setLocation(new Point(this.getLocation().x, this.getLocation().y + this._item.poleHeight));
        jibRec.setSize(new Size(this._jibWidth, this._craneThick));

        this.buildCrane([jibTieRec1, jibTieRec2, jibTieRec3, jibRec]);
    }

    private drawHeights(): void {
        const railHeight = this._item.railSpan / 5;

        const cranePoleHeightRec = new DrawRectangle(this.CRANE_POLEHEIGHT);
        cranePoleHeightRec.setLocation(new Point(this.getLocation().x + this._waterSideLength, this.getLocation().y));
        cranePoleHeightRec.setSize(new Size(this._craneThick, this._item.craneHeight + this._item.poleHeight - railHeight));
        const craneHeightRec = new DrawRectangle(this.CRANE_HEIGHT);
        craneHeightRec.setLocation(new Point(this._machineryHouse, this.getLocation().y + this._item.poleHeight));
        craneHeightRec.setSize(new Size(this._craneThick, this._item.craneHeight - railHeight));
        const railPoleHeightRec = new DrawRectangle(this.RAIL_HEIGHT);
        railPoleHeightRec.setLocation(new Point(this.getLocation().x + this._waterSideLength, this.getLocation().y + this._item.craneHeight + this._item.poleHeight - railHeight));
        railPoleHeightRec.setSize(new Size(this._craneThick, railHeight));
        const railHeightRec = new DrawRectangle(this.RAIL_HEIGHT);
        railHeightRec.setLocation(new Point(this._machineryHouse, this.getLocation().y + this._item.craneHeight + this._item.poleHeight - railHeight));
        railHeightRec.setSize(new Size(this._craneThick, railHeight));

        this.buildCrane([cranePoleHeightRec, craneHeightRec]);
        this.buildCraneWithColor(Color.Black(), Color.Black(), [railPoleHeightRec, railHeightRec]);
    }

    setSpreadStatus(trolleyType: TrolleyJobTypes, spreaderIndex: number, lockType: boolean, cntrItem: QCSideContainerItem): void {
        if (trolleyType >= this._trolleyGeomList.length) return;

        this._trolleyGeomList[trolleyType].setSpreaderStatus(spreaderIndex, lockType, cntrItem);
        this.calculateAncher();
    }

    moveTrolley(trolleyType: TrolleyJobTypes, distanceX: number): void {
        const cabinWidth = this._item.trolley[trolleyType].cabin.width;
        const spreaderCount = this._item.trolley[trolleyType].spreader.length;

        if (trolleyType >= this._item.trolley.length) return;

        if (trolleyType === TrolleyJobTypes.Main) {
            this._trolleyStartX = this._mainTrolleyStartX - distanceX;
            this._mainTrolleyStartX = this._mainTrolleyStartX - distanceX;

            this.checkValidLocation(trolleyType, cabinWidth);
        } else {
            this._trolleyStartX = this._secondTrolleyStartX + this._item.outReach - cabinWidth - distanceX;
            this._secondTrolleyStartX = this._secondTrolleyStartX - distanceX;

            if (!this.checkValidLocation(trolleyType, cabinWidth)) {
                this._secondTrolleyStartX = this._secondTrolleyStartX + distanceX;
            }
        }

        this._trolleyGeomList[trolleyType].setLocation(new Point(this._trolleyStartX, this._trolleyGeomList[trolleyType].getLocation().y));
        this._item.trolley[trolleyType].trolleyPosition = this._waterSideLength - this._trolleyStartX - this._item.trolley[trolleyType].cabin.width / 2;

        for (let i = 0; i < spreaderCount; i++) {
            this.moveHoist(trolleyType, i, 0);
        }
    }

    moveHoist(trolleyType: TrolleyJobTypes, spreaderIndex: number, distanceY: number): void {
        this._trolleyGeomList[trolleyType].moveHoist(spreaderIndex, distanceY, this._waterSideLength);
        this.calculateAncher();
    }

    moveTrolleyToPoint(trolleyType: TrolleyJobTypes, pointX: number): void {
        const startX = this.getStartX(trolleyType, pointX);
        const trolleyStartX = startX - this._item.outReach + this._item.trolley[trolleyType].cabin.width;
        const spreaderCount = this._item.trolley[trolleyType].spreader.length;

        if (trolleyType >= this._item.trolley.length) return;

        this.checkValidLocation(trolleyType, this._item.trolley[trolleyType].cabin.width);

        this._trolleyGeomList[trolleyType].setLocation(new Point(startX, this._trolleyGeomList[trolleyType].getLocation().y));
        this._item.trolley[trolleyType].trolleyPosition = pointX;

        for (let i = 0; i < spreaderCount; i++) {
            this.moveHoist(trolleyType, i, 0);
        }
    }

    moveHoistToPoint(trolleyType: TrolleyJobTypes, spreaderIndex: number, hoistPosition: number): void {
        this._trolleyGeomList[trolleyType].moveHoistToPoint(spreaderIndex, hoistPosition, this._waterSideLength);
        this.calculateAncher();
    }

    private getStartX(trolleyType: TrolleyJobTypes, pointX: number): number {
        let startX = -1; 

        if(trolleyType === TrolleyJobTypes.Main) {
            startX = this._waterSideLength - this._item.trolley[trolleyType].cabin.width / 2 - pointX;
        } else {
            startX = this._waterSideLength + this._craneThick - pointX;
        }

        return startX;
    }

    checkValidLocation(trolleyType: TrolleyJobTypes, cabinWidth: number): boolean {
        let isValidPosition = true;
        let endOfMovePoint = -1;

        if (trolleyType === TrolleyJobTypes.Main) {
            endOfMovePoint = this._trolleyStartX + cabinWidth;

            if (this._trolleyStartX < this._item.outReachMargin) {
                this._trolleyStartX = this._item.outReachMargin;
                isValidPosition = false;
            }

            if (this._isSecondExist) {
                if (endOfMovePoint > this._waterSideLength) {
                    this._trolleyStartX = this._waterSideLength - cabinWidth;
                    isValidPosition = false;
                }
            } else {
                if (endOfMovePoint > this._jibWidth - this._item.backReachMargin) {
                    this._trolleyStartX = this._jibWidth - this._item.backReachMargin - cabinWidth;
                    isValidPosition = false;
                }
            }
        } else {
            endOfMovePoint = this._trolleyStartX + cabinWidth;

            if (this._trolleyStartX < this._waterSideLength + this._craneThick) {
                this._trolleyStartX = this._waterSideLength + this._craneThick;
                isValidPosition = false;
            } else if (endOfMovePoint > this._jibWidth - this._item.backReachMargin) {
                this._trolleyStartX = this._jibWidth - this._item.backReachMargin - cabinWidth;
                isValidPosition = false;
            }
        }

        this._mainTrolleyStartX = this._trolleyStartX;
        return isValidPosition;
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
        console.log("i");
    }
    onMouseClick(sender: any, event: MouseEvent): void {
    }
    onResize(sender: any, event: MouseEvent): void {        
    }
}

export default TCrane;