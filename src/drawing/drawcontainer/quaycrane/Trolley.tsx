import DrawableObject from "../../elements/DrawableObject";
import DrawEllipse from "../../elements/DrawEllipse";
import DrawLine from "../../elements/DrawLine";
import DrawRectangle from "../../elements/DrawRectangle";
import { Color, Point, Size } from "../../structures";
import QCSideContainerItem from "./items/QCSideContainerItem";
import QCSideItem from "./items/QCSideItem";
import QCSideTrolleyItem from "./items/QCSideTrolleyItem";
import SpreaderSet from "./items/SpreaderSet";
import TrolleyJobTypes from "./structures/TrolleyJobTypes";
import TCabin from "./TCabin";
import TSpreader from "./TSpreader";

class Trolley extends DrawableObject {
    private readonly CABIN = "Cabin";
    private readonly SPREADER = "Spreader";
    private readonly TROLLEY_LINE = "TrolleyLine";
    private readonly ELLIPSE = "Ellipse";
    private readonly CONTAINER = "Container";
    private readonly SPREADER_WATERSIDE = "Waterside";
    private readonly SPREADER_LANDSIDE = "Landside";
    readonly SPREADER_GAP = 2;

    private _craneItem: QCSideItem;
    private _trolleyItem: QCSideTrolleyItem;
    private _cabin?: TCabin;
    private _spreaderSetList: SpreaderSet[] = [];
    private _spreaderSetCount = -1;
    private _landSideX = -1;
    
    constructor(name: string, item: QCSideItem, trolleyItem: QCSideTrolleyItem, startX: number, startY: number) {
        super(name);
        this._craneItem = item;
        this._trolleyItem = trolleyItem;
        this.initSpreaderSet();

        this.setLocation(new Point(startX, startY));
    }

    private initSpreaderSet(): void {
        this._spreaderSetCount = this._trolleyItem.spreader.length;

        for (let i = 0; i < this._spreaderSetCount; i++) {
            this._spreaderSetList.push(new SpreaderSet());
            this._spreaderSetList[i].spreaderItem = this._trolleyItem.spreader[i];
        }
    }

    drawTrolley(): void {
        this.clearGeomObject();
        this.drawCabin();
        this.drawSpreader();
        this.drawLine();
        this.drawEllipse();
    }

    private drawCabin(): void {
        this._cabin = new TCabin(this.name + this.CABIN, this._trolleyItem.cabin, 0, 0);
        this.addGeomObject(this._cabin);
    }

    private drawSpreader(): void {
        if (this._spreaderSetCount >= 2) {
            for (let i = 0; i < this._spreaderSetCount; i++) {
                this.addSpreader(i, (this.SPREADER_GAP + this._spreaderSetList[i].spreaderItem.width) * i);
            }
        } else if (this._spreaderSetCount === 1 && this._cabin) {
            this.addSpreader(0, (this._cabin.getSize().width - this._spreaderSetList[0].spreaderItem.width) / 2);
        }
    }

    private drawLine(): void {
        let spreaderLine = undefined;

        for (let i = 0; i < this._spreaderSetCount; i++) {
            const spreader = this._spreaderSetList[i].spreader;
            const spreaderItem = this._spreaderSetList[i].spreaderItem;

            if (!spreader) continue;

            spreaderLine = new DrawLine(this.getGeomKey(i, this.TROLLEY_LINE), spreader.getLocation().x + spreaderItem.width / 2,
                                    ((this._cabin) ? this._cabin.getLocation().y + this._cabin.getSize().height: 0 ), spreader.getLocation().x + spreaderItem.width / 2,
                                    spreader.getLocation().y - spreaderItem.width / 4);

            this._spreaderSetList[i].spreaderLine = spreaderLine;
            this.addGeomObject(spreaderLine);
        }
    }

    private drawEllipse(): void {
        let diameter = -1;
        let spreaderEllipse = undefined;

        for (let i = 0; i < this._spreaderSetCount; i++) {
            const spreader = this._spreaderSetList[i].spreader;
            if (!spreader) continue;

            const spreaderItem = this._spreaderSetList[i].spreaderItem;
            diameter = spreaderItem.width / 2;

            for (let j = 0; j < 2; j++) {
                spreaderEllipse = new DrawEllipse(this.getGeomKey(i, this.ELLIPSE), 0, 0, 0, 0);

                spreaderEllipse.setLocation(new Point(spreader.getLocation().x + (diameter * j), spreader.getLocation().y - diameter));
                spreaderEllipse.setSize(new Size(diameter, diameter));
                spreaderEllipse.attribute.fillColor = Color.LightGray();
                spreaderEllipse.attribute.outLineColor = Color.Black();
                spreaderEllipse.attribute.isOutLine = true;

                this._spreaderSetList[i].spreaderEllipse[j] = spreaderEllipse;
                this.addGeomObject(spreaderEllipse);
            }
        }
    }

    private addSpreader(spreaderIndex: number, startX: number): void {
        const spreaderItem = this._spreaderSetList[spreaderIndex].spreaderItem;
        const spreader = new TSpreader(this.getGeomKey(spreaderIndex, this.SPREADER), this._spreaderSetList[spreaderIndex].spreaderItem, startX, this._craneItem.craneHeight - spreaderItem.hoistPosition - spreaderItem.height - spreaderItem.width / 2);
        this._spreaderSetList[spreaderIndex].spreader = spreader;
        this.addGeomObject(spreader);

        if (spreaderItem.lockStatus) {
            this.drawContainer(this._trolleyItem.spreader[spreaderIndex].container, spreaderIndex);
        } else {
            this.removeGeomObjectKey(this.CONTAINER + spreaderIndex);
        }
    }

    private drawContainer(cntrItem: QCSideContainerItem, spreaderIndex: number): void {
        const spreader = this._spreaderSetList[spreaderIndex].spreader;
        if (!spreader) return;

        this._trolleyItem.spreader[spreaderIndex].container = cntrItem;
        this.removeGeomObjectKey(this.CONTAINER + spreaderIndex);

        const containerRec = new DrawRectangle(this.CONTAINER + spreaderIndex);
        containerRec.setLocation(new Point(spreader.getLocation().x + (spreader.getSize().width - cntrItem.width) / 2, spreader.getLocation().y + spreader.getSize().height));
        containerRec.setSize(new Size(cntrItem.width, cntrItem.height));
        containerRec.attribute.fillColor = cntrItem.backColor;
        containerRec.attribute.outLineColor = cntrItem.borderColor;
        containerRec.attribute.isOutLine = true;
        this.addGeomObject(containerRec);

        this.moveSpreader(spreaderIndex, spreader.getLocation().y);
    }

    private moveSpreader(spreaderIndex: number, positionY: number): void {
        if (spreaderIndex >= this._spreaderSetCount) return;

        const spreader = this._spreaderSetList[spreaderIndex].spreader;
        if (!spreader) return;
        const spreaderItem = this._spreaderSetList[spreaderIndex].spreaderItem;        
        positionY = this.getValidPosition(spreaderIndex, positionY);
        spreader.setLocation(new Point(spreader.getLocation().x, positionY));
        spreaderItem.hoistPosition = ((this._cabin) ? this._cabin.getLocation().y : 0 ) + this._craneItem.craneHeight - spreaderItem.height - spreaderItem.width / 2 - positionY;
        this.moveLineEllipse(spreaderIndex, positionY);

        if (spreaderItem.lockStatus) {
            this.moveContainer(spreaderIndex, 0, positionY);
        }
    }

    private getValidPosition(spreaderIndex: number, positionY: number): number {
        const spreader = this._spreaderSetList[spreaderIndex].spreader;
        const spreaderItem = this._spreaderSetList[spreaderIndex].spreaderItem;

        if (!spreader) return positionY;

        let lowestPosition = -1;
        let highestPosition = -1;
        const ellipseHeight = spreaderItem.width / 2;

        highestPosition = this._craneItem.craneHeight + spreaderItem.height + ellipseHeight - this._craneItem.liftTopHeight;

        if (this._trolleyItem.jobType === TrolleyJobTypes.Main) {
            if (this.getLocation().x + spreader.getSize().width + (spreader.getSize().width + this.SPREADER_GAP) * spreaderIndex <= this._landSideX) {
                lowestPosition = this._craneItem.craneHeight + this._craneItem.liftBottomDepth - spreaderItem.height - ellipseHeight;
            } else {
                lowestPosition = this._craneItem.craneHeight - spreaderItem.height - ellipseHeight;
            }
        } else {
            lowestPosition = this._craneItem.craneHeight - spreaderItem.height - ellipseHeight;          
        }

        if (spreaderItem.lockStatus) {
            lowestPosition -= this._trolleyItem.spreader[spreaderIndex].container.height;
        }

        if (positionY > lowestPosition) {
            positionY = lowestPosition;
        } else if (positionY < highestPosition) {
            positionY = highestPosition;
        }

        return positionY;
    }

    setSpreaderStatus(spreaderIndex: number, lockType: boolean, cntrItem: QCSideContainerItem): void {
        if (spreaderIndex >= this._spreaderSetList.length) return;

        this._spreaderSetList[spreaderIndex].spreaderItem.lockStatus = lockType;

        if (lockType) {
            this.drawContainer(cntrItem, spreaderIndex);
        } else {
            this.removeGeomObjectKey(this.CONTAINER + spreaderIndex);
        }
    }

    private moveLineEllipse(spreaderIndex: number, positionY: number): void {
        const spreaderLine = this._spreaderSetList[spreaderIndex].spreaderLine;
        const spreaderEllipse = this._spreaderSetList[spreaderIndex].spreaderEllipse;
        if (!spreaderLine || spreaderEllipse.length === 0) return;

        const spreaderItem = this._spreaderSetList[spreaderIndex].spreaderItem;
        const linePoint = spreaderLine.getLocation();
        spreaderLine.setData(linePoint.x, linePoint.y, linePoint.x, positionY - spreaderItem.width / 4);
        
        for (let i = 0; i < spreaderEllipse.length; i++) {
            spreaderEllipse[i].setLocation(new Point(spreaderEllipse[i].getLocation().x, positionY - spreaderItem.width / 2));
        }
    }

    private moveContainer(spreaderIndex: number, positionX: number, positionY: number): void {
        let container = this.getGeomObject(this.CONTAINER + spreaderIndex);

        if (container instanceof DrawRectangle) {
            container = container as DrawRectangle;
        } else {
            return;
        }

        container.setLocation(new Point(positionX + container.getLocation().x, positionY + this._spreaderSetList[spreaderIndex].spreaderItem.height));
    }

    moveHoist(spreaderIndex: number, distanceY: number, landSideX: number): void {
        if (spreaderIndex >= this._spreaderSetCount) return;
        const spreader = this._spreaderSetList[spreaderIndex].spreader;
        if (!spreader) return;

        this._landSideX = landSideX;
        this.moveSpreader(spreaderIndex, spreader.getLocation().y - distanceY);
    }

    moveHoistToPoint(spreaderIndex: number, hoistPoistion: number, landSideX: number): void {
        if (spreaderIndex >= this._spreaderSetCount) return;

        this._landSideX = landSideX;
        const spreaderItem = this._spreaderSetList[spreaderIndex].spreaderItem;

        this.moveSpreader(spreaderIndex, ((this._cabin) ? this._cabin.getLocation().y : 0 ) + this._craneItem.craneHeight - hoistPoistion - spreaderItem.height - spreaderItem.width / 2);

        return;
    }

    private getGeomKey(spreaderIndex: number, geomName: string): string {
        let key = '';
        
        if (spreaderIndex === 0) {
            key = this.SPREADER_WATERSIDE + geomName;
        } else {
            key = this.SPREADER_LANDSIDE + geomName;
        }

        return key;
    }
    
    onMouseDown(sender: any, event: MouseEvent): void {
        console.log("onMouseDown");
    }
    onMouseMove(sender: any, event: MouseEvent): void {
        console.log("onMouseMove");
    }
    onMouseUp(sender: any, event: MouseEvent): void {
        console.log("onMouseUp");
    }
    onSelected(sender: any, event: MouseEvent): void {
        console.log("onSelected");
    }
    onMouseHover(sender: any, event: MouseEvent): void {
        console.log("onMouseHover");
    }
    onMouseLeave(sender: any, event: MouseEvent): void {
        console.log("onMouseLeave");
    }
    onMouseClick(sender: any, event: MouseEvent): void {
        console.log("onMouseClick");
    }
    onResize(sender: any, event: MouseEvent): void {
        console.log("onResize");
    }
}

export default Trolley;