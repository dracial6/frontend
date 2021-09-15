import React, {useEffect, useRef} from 'react';
import axios from 'axios';
import VesselDefine from './items/VesselDefine';
import { Color } from '../../drawing/structures';
import DrawArea from '../../drawing/DrawArea';
import { HatchDefine } from './structures';
import TBayProperty from './TBayProperty';
import ShipUtil from './utils/ShipUtil';
import TBay from './TBay';

const vslDefine = new VesselDefine();
let define: HatchDefine;
let property: TBayProperty;
let canvasRef: any;

const fetchVslDefine = (vslCd: string) => {
    axios.get(`http://localhost:8080/${vslCd}/get_vsldefine`).then(res => {
        vslDefine.setVesselDefine(res.data);
        console.log(vslDefine);
    })
}

const DrawBay = ({vslCd}: any) => {
    define = new HatchDefine();
    property = new TBayProperty();
    canvasRef = useRef();
        
    useEffect(() => {
        if (vslDefine.isEmpty()) {
            fetchVslDefine(vslCd);
        } else {
            addBay(1);
        }
    })

    return (
        <div>
            <DrawArea ref={canvasRef}/>
        </div>
    )
}

function addBay(bayIndex: number) {
    if (!canvasRef.current) return;
    
    canvasRef.current.clear();
    
    if (ShipUtil.invalidateVesselDefineData(vslDefine)) return;

    const key = getTBayKey(bayIndex);
    let bay = getBay(bayIndex.toString());
    
    const property = getProperty();
    property.berthingSideLineColor = Color.Black();
    property.berthingSideFillColor = Color.Gray();
    property.visibleBerthingSide = false;

    if (!bay) {
        bay = new TBay(key, 1, bayIndex, define.zoomRatioInfos[1], property, true);
        bay.isMemoryCache = true;
        canvasRef.current.addDrawableObject(bay);
    }
}

function getTBayKey(bayIndex: number): string {
    return "TBay_" + bayIndex;
}

function getBay(bayKey: string): TBay | undefined {
    const baseGeometry = canvasRef.current.findFirst(bayKey);

    if (baseGeometry) {
        return baseGeometry as TBay;
    }

    return undefined;
}

function getProperty(): TBayProperty {
    if (property) {
        property.vesselDefine = vslDefine;
    }

    return property;
}

const BayPlan = ({match}: any) => {
    return(
        <div>
            <DrawBay vslCd={match.params.vslCd}/>
        </div>
    )
}

export default BayPlan;