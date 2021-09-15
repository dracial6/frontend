import React, { RefObject } from "react";
import SlotClickEventArgs from "../../components/common/events/SlotClickEventArgs";
import BayItem from "../../components/common/items/BayItem";
import BlockItem from "../../components/common/items/BlockItem";
import BlockItemList from "../../components/common/items/BlockItemList";
import CarrierDirItem from "../../components/common/items/CarrierDirItem";
import RowItem from "../../components/common/items/RowItem";
import YSlotItem from "../../components/common/items/YSlotItem";
import YSlotUsageItem from "../../components/common/items/YSlotUsageItem";
import ViewDirection from "../../components/common/structures/ViewDirection";
import YBayView from "../../components/yard/bayview/YBayView";
import { Color } from "../../drawing/structures";

class YBView extends React.Component {
    private _yBayViewRef: RefObject<YBayView>;
    private _ybayView?: YBayView;

    constructor(props: any){
        super(props);
        this._yBayViewRef = React.createRef();
    }

    handler(sender: any, e: SlotClickEventArgs) : void {
        if (this._ybayView) {
            const cntrItem = this._ybayView.containerAttribute(e.block, e.bay, e.row, e.tier);
            cntrItem.setOccupiedSlotCount(1);
            cntrItem.containerNo.text = "FILU0000067";
            cntrItem.classCode.text = "EX";
            cntrItem.cargoType.text = "DR";
            cntrItem.sizeType.text = "22G0";
            cntrItem.operatorCode.text = "MSC";
            this._ybayView.draw(e.block, e.bay, e.row, e.tier);
        }
    }

    componentDidMount() {
        this._ybayView = this._yBayViewRef.current as YBayView;

        if (this._ybayView) {
            this._ybayView.setZoomRatio(100);
            this._ybayView.viewClick.addEvent(this.handler.bind(this));
            this._ybayView.getDrawArea().isDrawableObjectDragSelect = true;
            const blockItem = new BlockItem();
            blockItem.autoCheck = "Y";
            blockItem.backColor = Color.White();
            blockItem.bayDir = "R";
            blockItem.bayPatten = "XYZ";
            blockItem.facility = "T";
            blockItem.foreColor = Color.Black();
            blockItem.index = 1;
            blockItem.capacity = 2940;
            blockItem.l = 455.55;
            blockItem.laneID = "1";
            blockItem.laneIdx = 1;
            blockItem.maxBay = 49;
            blockItem.maxRow = 10;
            blockItem.maxTier = 6;
            blockItem.setName("1A");
            blockItem.rowDir = "R";
            blockItem.slotLength = 6.45;
            blockItem.slotWidth = 2.83;
            blockItem.tgs = 490;
            blockItem.w = 28.3;
            blockItem.x = 26.25;
            blockItem.y = 91.67;
            blockItem.ytEnter = "S";
            blockItem.ytPos = "E";
            
            const bayMap = new Map<number, BayItem>();
            const bayItem = new BayItem();
            bayItem.block = "1A";
            bayItem.cPOs = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            bayItem.setIndex(1);
            bayItem.setMaxRow(10);
            bayItem.maxTier = 6;
            bayItem.name2 = "05";
            bayItem.name4 = "06";
            bayItem.nosVoid = 2;
            bayMap.set(3, bayItem);
            blockItem.setBayList(bayMap);

            const rowMap = new Map<number, RowItem>();

            for (let i = 1; i <= 10; i++) {
                const rowItem = new RowItem();
                rowItem.block = "1A";
                rowItem.setIndex(1);
                rowItem.setMaxRow(10);
                rowItem.maxTier = "6";
                rowItem.setMaxRow(49);
                rowItem.name = i.toString();
                rowMap.set(i, rowItem);
            }

            blockItem.setRowList(rowMap);

            const carrierDirMap = new Map<string, CarrierDirItem>();
            const carrierDirItem = new CarrierDirItem();
            carrierDirItem.block = "1A";
            carrierDirItem.enter = "S";
            carrierDirItem.pos = "S";
            carrierDirItem.setType("RT");
            carrierDirMap.set(carrierDirItem.key, carrierDirItem);

            const carrierDirItem2 = new CarrierDirItem();
            carrierDirItem2.block = "1A";
            carrierDirItem2.enter = "S";
            carrierDirItem2.pos = "E";
            carrierDirItem2.setType("YT");
            carrierDirMap.set(carrierDirItem.key, carrierDirItem2);

            blockItem.setCarrierTypeSourceList(carrierDirMap);

            const yslotMap = new Map<string, YSlotItem>();       
            let bay = 0;
            let row = 0;
            for (let i = 0; i < 490; i++) {
                bay = Math.floor(i / 10) + 1;
                row = i % 10 + 1;
                const slotItem = new YSlotItem();
                slotItem.cpo = 1;
                slotItem.setBay(bay);
                slotItem.setRow(row);
                slotItem.akChk = "N";
                slotItem.rfChk = "N";
                slotItem.dgChk = "N";
                yslotMap.set(slotItem.key, slotItem);
            }
            blockItem.setYSlotList(yslotMap);

            const yslotUsageMap = new Map<string, YSlotUsageItem>();       
            bay = 0;
            row = 0;
            let tier = 0;
            for (let i = 0; i < 360; i++) {
                bay = Math.floor(i / 60) + 1;
                if (bay > 4) bay = bay + 5;
                row = (i / 6) % 10 + 1;
                tier = i % 6 + 1;

                const slotUsageItem = new YSlotUsageItem();
                slotUsageItem.setBay(bay);
                slotUsageItem.setRow(row);
                slotUsageItem.setTier(tier);
                slotUsageItem.akChk = "N";
                slotUsageItem.rfChk = "N";
                slotUsageItem.dgChk = "N";
                yslotUsageMap.set(slotUsageItem.key, slotUsageItem);
            }
            blockItem.setYSlotUsageList(yslotUsageMap);
            const blockItemList = new BlockItemList([blockItem])
            this._ybayView.yardDefine = blockItemList;

            this._ybayView.addBayRow(ViewDirection.Front, "1A", 3);
        }
    }

    render() {
        return (
            <div>    
                <YBayView ref={this._yBayViewRef} />
            </div>
        );
    }
}

const YardBayView = ({match}: any) => {
    return (
        <div>
            <YBView/>
        </div>
    )
}

export default YardBayView;