import React, {RefObject} from 'react';
import BaseDrawArea from '../../drawing/BaseDrawArea';
import DrawArea from '../../drawing/DrawArea';
import DrawUserComponent from '../../drawing/drawcontainer/DrawUserComponent';
import QCSideCabinItem from '../../drawing/drawcontainer/quaycrane/items/QCSideCabinItem';
import QCSideContainerItem from '../../drawing/drawcontainer/quaycrane/items/QCSideContainerItem';
import QCSideItem from '../../drawing/drawcontainer/quaycrane/items/QCSideItem';
import QCSideMachineryHouseItem from '../../drawing/drawcontainer/quaycrane/items/QCSideMachineryHouseItem';
import QCSideSpreaderItem from '../../drawing/drawcontainer/quaycrane/items/QCSideSpreaderItem';
import QCSideTrolleyItem from '../../drawing/drawcontainer/quaycrane/items/QCSideTrolleyItem';
import TrolleyJobTypes from '../../drawing/drawcontainer/quaycrane/structures/TrolleyJobTypes';
import TCrane from '../../drawing/drawcontainer/quaycrane/TCrane';
import DrawText from '../../drawing/elements/DrawText';
import GeometryPolygon from '../../drawing/elements/GeometryPolygon';
import DrawCanvasEventArgs from '../../drawing/events/DrawCanvasEventArgs';
import TextBoxItem from '../../drawing/items/TextBoxItem';
import { Color, Point } from '../../drawing/structures';
import ArrangeDirection from '../../drawing/structures/ArrangeDirection';
import EmptyContainer from './EmptyContainer';

class QuayCrane extends DrawUserComponent {
    private _drawAreaRef: RefObject<DrawArea>;
    
    zoomRatio = 1;
    craneVerticalMargin = 0;
    arrangeTopMargin = 10;

    constructor(props: any){
        super(props);
        this._drawAreaRef = React.createRef();
    }

    handler(drawArea: BaseDrawArea, args: DrawCanvasEventArgs): void {
        console.log(args.selectionList);
    }

    componentDidMount() {
        const drawArea = this._drawAreaRef.current;
        if (drawArea) {
            super.setDrawArea(drawArea);
            drawArea.setWidth(1000);
            drawArea.setHeight(1000);
            drawArea.isDrawableObjectResize = true;
            drawArea.isDrawableObjectMove = true;
            drawArea.isDrawableObjectMouseOver = true;
            drawArea.arrangeDirection = ArrangeDirection.LeftToRight;
            drawArea.arrangeFixCount = 2;
            drawArea.drawableObjectClick.addEvent(this.handler.bind(this));
            
            const qcItem = new QCSideItem("QC01");
            qcItem.backColor = Color.Green();
            qcItem.borderColor = Color.Black();
            qcItem.nameStyle = new TextBoxItem();
            qcItem.nameStyle.borderColor = Color.Black();
            qcItem.nameStyle.backColor = Color.Transparent();
            qcItem.nameStyle.fontSize = 20;
            qcItem.poleHeight = 75;
            qcItem.outReach = 200;
            qcItem.outReachMargin = 35;
            qcItem.backReach = 150;
            qcItem.backReachMargin = 25;
            qcItem.craneHeight = 150;
            qcItem.liftTopHeight = 125;
            qcItem.liftBottomDepth = 50;
            qcItem.railSpan = 100;
            qcItem.clearanceHeight = 50;
            qcItem.craneThick = 3;
            qcItem.titlePos = new Point(50, 50);

            const machineryHouse = new QCSideMachineryHouseItem();
            machineryHouse.width = 25;
            machineryHouse.height = 15;
            machineryHouse.backColor = Color.LightGray();
            machineryHouse.borderColor = Color.Black();

            qcItem.machineryHouse = machineryHouse;

            const trolleyItem = new QCSideTrolleyItem();
            trolleyItem.jobType = TrolleyJobTypes.Main;

            const cabinItem = new QCSideCabinItem();
            cabinItem.width = 22;
            cabinItem.height = 10;
            cabinItem.backColor = Color.Green();
            cabinItem.borderColor = Color.Black();

            trolleyItem.cabin = cabinItem;

            trolleyItem.spreader = [];

            const cntrItem = new QCSideContainerItem();
            cntrItem.backColor = Color.Blue();
            cntrItem.borderColor = Color.Black();
            cntrItem.width = 10;
            cntrItem.height = 10;

            // Waterside Spreader
            const spreaderW = new QCSideSpreaderItem();
            spreaderW.width = 10;
            spreaderW.height = 5;
            spreaderW.backColor = Color.Green();
            spreaderW.borderColor = Color.Black();
            spreaderW.hoistPosition = 30;
            spreaderW.container = cntrItem;

            trolleyItem.spreader.push(spreaderW);

            // Landside Spreader
            const spreaderL = new QCSideSpreaderItem();
            spreaderL.width = 10;
            spreaderL.height = 5;
            spreaderL.backColor = Color.Green();
            spreaderL.borderColor = Color.Black();
            spreaderL.hoistPosition = 80;
            spreaderL.lockStatus = false;

            trolleyItem.spreader.push(spreaderL);
            qcItem.trolley.push(trolleyItem);

            const crane = new TCrane(qcItem);
            crane.attribute.outLineColor = Color.Red();
            crane.setCraneVerticalMargin(this.craneVerticalMargin * this.zoomRatio - this.arrangeTopMargin);
            crane.setLocation(new Point(100, 100));
            crane.rotate(15);
            crane.updateMBR();
            crane.enableResizable = true;
            crane.enableMouseOver = true;
            drawArea.addDrawableObject(crane);

            qcItem.name = "QC02";
            const crane2 = new TCrane(qcItem);
            crane2.attribute.outLineColor = Color.Red();
            crane2.setCraneVerticalMargin(this.craneVerticalMargin * this.zoomRatio - this.arrangeTopMargin);
            crane2.setLocation(new Point(100, 100));
            crane2.updateMBR();
            drawArea.addDrawableObject(crane2);

            const text = new DrawText("text");
            text.attribute.fontSize = 40;
            text.attribute.isOutLine = true;
            text.attribute.outLineColor = Color.Red();
            text.attribute.textOutLineColor = Color.Red();
            text.attribute.textOutLineThick = 1;
            text.text = "QC01";

            const container = new EmptyContainer("container");
            container.addGeomObject(text);
            container.updateMBR();
            //canvas.addDrawableObject(container);

            const geomPolygon = new GeometryPolygon("polygon", [new Point(0, 50), new Point(50, 0), new Point(100, 50), new Point(80, 100), new Point(20, 100)])
            geomPolygon.attribute.fontSize = 40;
            geomPolygon.attribute.textOutLineColor = Color.Red();
            geomPolygon.attribute.textOutLineThick = 1;
            geomPolygon.attribute.isOutLine = true;
            geomPolygon.attribute.outLineColor = Color.Black();
            geomPolygon.enableResizable = true;
            geomPolygon.rotate(15);
            //canvas.addDrawableObject(geomPolygon);
        }
    }

    render() {
        return (
            <div>
                <DrawArea ref={this._drawAreaRef} />
            </div>
        );
    }
}

const QCSide = ({match}: any) => {
    return (
        <div>
            <QuayCrane/>
        </div>
    )
}

export default QCSide;