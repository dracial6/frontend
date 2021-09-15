import BaseDataItem from "../../../common/items/BaseDataItem";

class TerminalCapacityItem extends BaseDataItem {
    tmnlCD = "";
    workImportFull = 0;
    workExportFull = 0;
    workFull = 0;
    totalImportFull = 0;
    totalExportFull = 0;
    totalFull = 0;

    //ECY
    workVPEmpty = 0;
    workECYEmpty = 0;
    workEmpty = 0;
    totalVPEmpty = 0;
    totalECYEmpty = 0;
    totalEmpty = 0;

    //CY Occupancy By Container
    totalStockFull = 0;
    stockImportFull = 0;
    stockExportFull = 0;
    stockReeferFull = 0;
    stockStuffFull = 0;
    stockUnstuffFull = 0;
    stockInspectFull = 0;

    //ECY Occupancy By Container
    totalStockEmpty = 0;
    stockCleanEmpty = 0;
    stockWaitCleanEmpty = 0;
    stockRepairEmpty = 0;
    stockWaitRepairEmpty = 0;
    stockPTIEmpty = 0;
    stockAvailableEmpty = 0;
    
    //Plug
    workPlugFull = 0;
    workPlugEmpty = 0;

    remark = "";
}

export default TerminalCapacityItem;