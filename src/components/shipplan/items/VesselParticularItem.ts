import VesselItem from "./VesselItem";
import WeightConstantItem from "./WeightConstantItem";

class VesselParticularItem extends VesselItem {
    public hydroStart = 0;
    public hydroInterval = 0;
    public knStart = 0;
    public knInterval = 0;
    public bonjeanStart = 0;
    public bonjeanInterval = 0;
    public sValueStart = 0;
    public sValueInterval = 0;
    public maxDraft = 0;
    public maxDZ = 0;
    public windPressureStart = 0;
    public windPressureInterval = 0;
    public trimStart = 0;
    public trimInterval = 0;
    public stressType = 0;
    public userBayType = 0;
    public trimKMT = 0;
    public trimKN = 0;
    public trimHydro = 0;
    public knCurveType = 0;
    public maxBM = 0;
    public sValue = 0;
    public longitudinalPermitType = 0;
    public torque = 0;
    public minGM = 0;
    public propeller = 0;
    public searchForceManipulateType = 0;
    public windPressure = 0;
    public trimOptimization = 0;
    public remarkAllow1 = '';
    public remarkAllow2 = '';
    public autoDeckHouse = 0;
    public hatchless = '';
    public lightWeight: WeightConstantItem = new WeightConstantItem();
    public dwtConstant: WeightConstantItem = new WeightConstantItem();

    public corrMaxSF = 0;
    public boGanBoyDis = 0;
}

export default VesselParticularItem;