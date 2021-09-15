class CodeType {
    static readonly ABS_CONST = "ABS";
    static readonly ALL_JOB_TYPE = "AJOB";
    static readonly ALONG_SIDE = "ALSD";
    static readonly AREA_NAME = "AREA_NAME";
    static readonly AREA_WITHOUT_USE = "AREA_NUSE";
    static readonly AREA_BY_USE = "AREA_YUSE";
    static readonly AREA_USE = "ARUS";      //"AREA_USE";
    static readonly AREA_USE2 = "ARU2";     //"AREA_USE2";
    static readonly ASSIGNED_GC = "ASSIGNED_GC"; //Get Assigned GC from tb_gang_asgn.
    static readonly BAY_CNT = "BYCT";
    static readonly BAY_NAME = "BAY_NAME";
    static readonly BAY_IDX = "BAY_INDEX";
    static readonly BAYCOUNT_45 = "BAYCOUNT_45";
    static readonly BERTH_NAME = "BERTH_NAME";
    static readonly BERTH_TYPE = "BHTP";
    static readonly BITT_NAME = "BITT_NAME";
    static readonly BLOCK = "BLOCK";
    static readonly BLOCK_DIRECTION = "BKDR";
    static readonly BLOCK_NAME = "BLOCK_NAME";
    static readonly BLOCK_NAME_TYPE = "BLOCK_NAME_TYPE";
    static readonly BLOCK_SYMMETRY = "BLOCK_SYMMETRY";
    static readonly BLOCK_TYPE = "BKTP";
    static readonly RAIL_BLOCK = "RAIL_BLOCK";
    static readonly BERTH_WINDOW_DIRECTION = "BWDR";
    static readonly BERTH_WINDOW_REQUESTER = "BWRQ";
    static readonly BERTH_PLAN_REQUESTER = "BPRQ";
    static readonly BLOCK_USAGE = "BKUS";
    static readonly BUNDLE_PACK_TYPE = "BNPT";
    static readonly CABIN_POS = "CAPS";
    static readonly CARGO_TYPE = "CGTP";
    static readonly CARGO_TYPE_FOR_AUTOSP = "CGTPS";
    static readonly CELL_TYPE = "CELL_TYPE";
    static readonly CELL_TYPE_CODE = "CELL_TYPE_CODE"; // to use setCodeValue window from spread list directly - by min 2009.05.08
    static readonly CHARACTER_CASTING = "CHARACTER_CAST";
    static readonly CHARACTER_SET = "CHARACTER_SET";
    static readonly CHASSIS_TYPE = "CSTP";
    static readonly CHECKBOX_TEXT_ALIGN = "CHECK_TEXT_ALIGN";
    static readonly CLASS = "CLSS";
    static readonly CLEAN_CODE = "CLEAN_CODE";
    //static readonly CNTR_CONDITION = "CNTR_COND";
    static readonly CNTR_HEIGHT_TYPE = "CNHT";
    static readonly CNTR_HEIGHT = "CNTR_H";
    static readonly CNTR_HEIGHT_WIDTH = "CNHW";
    static readonly CNTR_LENGTH = "CNLH";
    static readonly CNTR_LENGTH_DB = "CNTR_L_DB";
    static readonly CNTR_LENGTH_HEIGHT = "CNLNH";
    static readonly CNTR_STATE = "STA";
    static readonly CNTR_WARN_MSG1 = "WMSG1";   // to use Container Warning Information : Message Type1 , Billy 2011.11.25
    static readonly CNTR_WARN_MSG2 = "WMSG2";   // to use Container Warning Information : Message Type2 , Billy 2011.11.25
    static readonly CNTR_WIDTH = "CNTR_W";
    static readonly CODE_TYPE = "CODE_TYPE";
    static readonly CODE_TYPES = "CODE_TYPES";
    static readonly COLOR_RULE_TYPE = "COLOR_RULE_TYPE";
    static readonly CONTAINER_TYPE = "CTTP";
    static readonly CONTAINER_TYPE_FOR_AUTOSP = "CTTPS";
    static readonly CONTAINER_TYPE_GROUP = "CNTR_TYPE_GROUP";
    static readonly CUSTOM_APP_TYPE = "CAT"; //2011 08 08 BY ROY //2016.01.04 by HSL re-name from "CAPT" to "CAT". 
    //static readonly DAMAGE_CONDITION = "DMG_COND";
    static readonly DATE_TIME_FORMAT = "DATE_TIME_FORMAT";
    static readonly DEFECTIVE_CODE = "DEFECTIVE_CODE";
    static readonly DELIVERY = "DELV";
    static readonly DELIVERY_FILTER = "DELV_FILTER";
    static readonly DELIVERY_FOR_GATE = "DELVG";
    static readonly DELIVERY_FOR_BILLING = "DELVB";
    static readonly DELIVERY_FOR_IMPORT = "DELVI";
    static readonly DELIVERY_FOR_EXPORT = "DELVX";
    static readonly DELIVERY_FOR_MOVINS = "DELVM";
    static readonly DELIVERY_FOR_THROUGH = "DELVT";
    static readonly DUMMY_COLUMN_TYPE = "DMCT"; //added by Edwin Kim 2013.06.17
    static readonly DISPATCH_MODE_IN = "DSIN";
    static readonly DISPATCH_MODE_IN_FOR_GATE = "DSING";
    static readonly DISPATCH_MODE_IN_FOR_RAIL = "DSINR";
    static readonly DISPATCH_MODE_OUT = "DSOT";
    static readonly DISPATCH_MODE_OUT_FOR_GATE = "DSOTG";
    static readonly DISPATCH_MODE_FOR_GATE = "DSTPG";
    static readonly DISPATCH_MODE_INOUT = "DSMD"; //2018.04.13 SH.Kim: added for NDV CODECO screen.
    static readonly DOOR_DIRECTION = "DOOR_DIR";
    static readonly EQU_NAME = "EQU_NAME";
    static readonly EQU_TYPE = "EQU_TYPE";
    static readonly EQU_TYPE_USE_DIRECTION = "EQDTP";
    static readonly FACILITY_USE = "FCUS";
    static readonly FDEST = "FDEST";
    static readonly FE = "FLMT";
    static readonly FLMT = "FE";
    static readonly FILTER_OPERATOR = "FILTER_OPR";
    static readonly FREQUENCY = "FRQC";
    static readonly GATE_BLOCK_NAME = "GATE_BLOCK_NAME";
    static readonly GATE_NAME = "GATE_NAME";
    static readonly GATE_TYPE = "GTTP";
    static readonly GATEINOUT_TYPE = "GTIO";
    static readonly GCNO = "GCNO";
    static readonly YTNO = "YTNO";
    static readonly GNRL_CODE_TYPE = "GNTP"; //"GNRL_CODE_TYPE";
    static readonly HANDLE_INSTR = "HND";
    static readonly HATCH = "HATCH";
    static readonly HATCH_COVER_TYPE = "HCTP";
    static readonly HATCH_COVER_OPENCLOSE = "HCIO";
    static readonly HOLD_CHECK = "HDCH";
    static readonly HOLD_DECK = "HOLD_DECK";
    static readonly HOLD_TYPE = "HDTP";
    static readonly HORIZONTAL_ALIGN = "H_ALIGN";
    static readonly IMDG = "IMDG";
    static readonly INSPECTION_AREA = "INSPECTION_AREA";
    static readonly INSPECTION_CHECK = "IPCH";
    static readonly INSPECTION_TYPE = "ISP";
    static readonly INTERCHANGE_CODE = "ICCD";       //"INTERCHANGE_CODE";
    static readonly IX_CD = "IXCD";
    static readonly SCHEDULE_JOB_STATUS = "SCHST";
    static readonly LANE_CODE = "LANE";
    static readonly LANE_PORT = "LANE_PORT";
    static readonly LANE_PORT_ONLY = "LANE_PORT_ONLY";
    static readonly LOADING_STATE = "LDST";
    static readonly NOTUSERSN = "NUR";
    static readonly OPR_CODE = "OPR";
    static readonly OVERLAND_TYPE = "OVERLAND_TYPE";
    static readonly PAYMENT_TYPE = "PYTP"; //KimHS 2012.04.19 PAYTP -> PYTP
    static readonly PAYMENT_TYPE_TO_UPDATE = "PYTPU"; //Payment Type for user to update payment type
    static readonly PARTNER_TYPE = "PTNR";
    static readonly COUNTRY_CODE = "CTCD";
    static readonly POR_CODE = "POR";
    static readonly PORT_CODE = "PORT";
    static readonly POWER_CODE = "POWER_CODE";
    static readonly PROGRAM_CODE = "PRGM"; //2010-04-28
    static readonly QUAY_CRANE_TYPE = "QCTP";
    static readonly QUAY_PRODUCTIVITY_TYPE = "QPTP";
    static readonly QUAY_PRODUCTIVITY_RATIO_TYPE = "QRTP";
    static readonly QUAY_JOB_TYPE_FOR_PRODUCTIVITY = "QPJT";
    static readonly QUAY_RATIO_FOR_PRODUCTIVITY = "QPMT";
    static readonly QUAY_JOB_TYPE = "Q_JOB_TYPE";
    static readonly RAIL_JOB_TYPE = "R_JOB_TYPE";
    static readonly RESERVE_TYPE = "RSRV_TYPE";
    static readonly RESTOW_AREA = "RSAR";
    static readonly RESTOW_TYPE = "RSTP";
    static readonly ROW_HEADER_TYPE = "ROW_HEADER_TYPE";
    static readonly ROWW_NAME = "ROWW_NAME";
    static readonly RPM_TYPE = "RPMT";
    static readonly SHIPPING_AGENCY = "SHIPPING_AGENCY";
    static readonly SIZE_TYPE = "SIZE_TYPE";
    static readonly SLOT_CARGO = "SLCG";
    static readonly SLOT_HEIGHT = "SLHT";
    static readonly SORT_DIRECTION = "SORT_DIR";
    static readonly SPREAD_COLOR_RULE = "SPREAD_COLOR_RULE";
    static readonly STORAGE_CODE = "STC";
    static readonly STOWAGE_MATERIAL_TYPE = "SMTP";
    static readonly SZTP = "SZTP";
    static readonly SZTP2 = "SZTP2";
    static readonly TC_BLOCK_NAME = "TC_BLOCK_NAME";
    static readonly TERMINAL_HOLDING_CODE = "THC";
    static readonly TRANSPORT_TYPE = "TRAN";
    static readonly TRANSPORT_TYPE_FOR_DOCUMENT = "TRAND"; // 0045083 Sidney
    static readonly TRANSPORT_TYPE_FOR_OPERATIONAL = "TRANO";
    static readonly TRANSPORT_TYPE_FOR_MANUAL_OPERATION = "TRANM";
    static readonly TRUCK_TYPE = "TRUCK_TYPE";
    static readonly TIER_NAME = "TIER_NAME";
    static readonly UNIT_PLACE = "UNIT_PLACE";
    static readonly UNNO = "UNNO";
    static readonly VERTICAL_ALIGN = "V_ALIGN";  //2008-07-28
    static readonly VAN_TYPE = "VPTP"; //KimHS 2012.04.19 VANTP -> VPTP
    static readonly VESSEL_NAME = "VESSEL_NAME";
    static readonly VESSEL_LOCAL_NAME = "VESSEL_LOCAL_NAME"; // added by June 2017.01.19
    static readonly VESSEL_CODE_BLOB = "VESSEL_CODE_BLOB"; // added by Lee.KT 2020.08.11
    static readonly VESSEL_SHIFTING_REASON = "VSR";
    static readonly VESSEL_TYPE1 = "VTP1";
    static readonly VESSEL_TYPE2 = "VTP2";
    static readonly VESSEL_TYPE3 = "VTP3";            
    static readonly VVD_OPR = "VVD_OPR";
    static readonly VVD_OPR_ONLY = "VVD_OPR_ONLY";
    static readonly VVD_OPR2_ONLY = "VVD_OPR2_ONLY";
    static readonly VVD_PORT = "VVD_PORT";
    static readonly VVD_PORT_ONLY = "VVD_PORT_ONLY"; // added by E.C Hwang 2011.06.08
    static readonly VVD_FPOD = "VVD_FPOD";
    static readonly VVD_VESSEL = "VVD_VESSEL";
    static readonly VVD_ASSIGNABLE_VESSEL_ONLY = "VVD_ASSIGNABLE_VESSEL_ONLY";
    static readonly VVD_COLOR = "VVD_COLOR";
    static readonly WEIGHT_GROUP_TYPE = "WGTP";
    static readonly WHEELED_CODE = "WDCD"; //"WHEELED_CODE";
    static readonly YARD_ID = "YARD_ID";
    static readonly YARD_JOB_TYPE = "Y_JOB_TYPE";
    static readonly YARD_TRUCK_TYPE = "YTTP";
    static readonly YARD_TYPE = "YARD_TYPE";
    static readonly YES = "YES";
    static readonly YES_NO = "YENO";
    static readonly YES_NO_ExNull = "YES_NO_ExNul";
    static readonly TRUE_FALSE = "T/F";
    static readonly YT_DIRECTION = "YT_DIR";
    static readonly ZONE_TYPE = "ZONE_TYPE";
    static readonly VESSEL_CONDITION = "VCD";
    static readonly COMMODITY = "COMMODITY";
    static readonly FORWARDER = "FORWARDER";
    static readonly CONSIGNEE = "CONSIGNEE";
    static readonly PACKING_GRP = "PACKING_GRP";
    static readonly MARINE_POLLUT = "MRPL";
    static readonly RECOMMEND_POSITION = "REPO";
    stringANT_CODE_TYPE = "CONSTANT_CODE_TYPE";
    static readonly EQU_ENTER_DIRECTION = "EQDR";
    static readonly EQU_ENTER_POSITION = "EQPOS";
    static readonly MAX_TIER = "MXTIER";
    static readonly PASS_TIER = "PASSTIER";
    static readonly TP_NAME = "TPNM";
    static readonly BUFFER_TYPE = "BPTP";
    static readonly QC_COLOR = "QCCLR";
    static readonly HIGHLIGHTED_COLOR = "HGCLR";

    static readonly BERTH_STATUS = "BPST";
    static readonly STOPPAGE_CODE = "SPCD";
    static readonly STOPPAGE_TYPE = "SPTP";
    static readonly STOPPAGE_DUE_TO = "SPDT";
    static readonly STOPPAGE_USE_EQUIPMENT = "SPUE";
    static readonly SPECIAL_HANDLING_CODES = "SHC"; //Lee Ki Taek 2018.01.26
    static readonly MEDIUM_TYPE = "MDTP";
    static readonly OPR_AGENCY = "OPR_AGENCY"; //KimHS 2011.09.26
    static readonly RESEAL_TYPE = "SLTP"; //KimHS 2011.11.02
    static readonly USER_KIND_INTERNAL = "USKNI"; // by E.C Hwang 2011.12.05
    static readonly USER_LEVEL = "USLV"; // by E.C Hwang 2011.12.05
    static readonly ROW_PATTERN = "ROW_PTN";
    static readonly BAY_PATTERN = "BAY_PTN";
    static readonly BARGE_IN_MODE = "BGIN";
    static readonly RAIL_IN_MODE = "RLIN";
    static readonly RAIL_SCHEDULE_INVEN = "RSCH_INVEN";
    static readonly RAIL_OUT_MODE = "RLOT";
    static readonly BARGE_JOB_STATUS = "BGST";
    static readonly PLAN_TYPE = "YPPT"; // by KGT 2013.08.22
    static readonly QUAY_JOB_TYPE_FOR_GEARBOX = "QJOBG"; //by HSL 2013.08.22 for gearBoxMoves
    static readonly JOIN_POS = "JNPO";  // by KGT 2015.06.08
    static readonly REEFER_CALCULATION_TYPE = "RFCT"; //by HSL 2015.08.18 for "Reefer Contract" screen.
    static readonly RAIL_TRACK = "RAIL_TRACK";
    static readonly RAIL_JOB_STATUS = "RJST";
    static readonly RAIL_DOOR_DIRECTION = "RLDD";
    static readonly USER_TYPE = "USTP";  //2015.07.02 BY HSL            
    static readonly USER_ID = "USER_ID";  //2015.07.02 BY HSL
    static readonly WORKING_VVD = "WORKING_VVD"; // added by jaeok (2019.06.10) Mantis 84782: [Quay Supervisor] Able to filter with specific Vessel
    static readonly PLANNING_VVD = "PLANNING_VVD"; // added by jaeok (2019.09.18) Mantis 89558: [Quay Supervisor] Plan Mode
    static readonly PLANNING_VVD2 = "PLANNING_VVD2"; // added by jaeok (2021.04.14) Mantis 0113725: QUAY SUPERVISOR 에서 PLAN된 모선도 볼 수 있도록 수정 요청
    static readonly PLANNING_AND_WORKING_VVD = "PLANNING_AND_WORKING_VVD"; // added by jaeok (2019.10.30) Mantis 89559: [Report] Crane Working Procedure (SP>>Summary)
    static readonly WORKING_VVD_WITHOUT_NOT_DEFINE = "WORKING_VVD_WITHOUT_NOT_DEFINE"; // added by JH.Tak (2020.10.20) 0110247: [Quay Supervisor] the screen should exclude the vessel without vessel define
    static readonly PLANNING_VVD_WITHOUT_NOT_DEFINE = "PLANNING_VVD_WITHOUT_NOT_DEFINE"; // added by JH.Tak (2020.10.20) 0110247: [Quay Supervisor] the screen should exclude the vessel without vessel define

    static readonly INVOICE_TYPE = "INV";
    static readonly REVENUE_UNIT = "RUNT";
    static readonly SSR_UNIT = "SUNT";
    static readonly CURRENCY_UNIT = "CUNT";
    static readonly TARIFF_UNIT = "UNT";    // 2019.10.02. Jaden Moon, This code is General Type. I added this code to GeneralCodeType also. Remove thisant after checking doesn't use it anymore.
    static readonly VAT_CODE = "VAT";       // 2019.10.02. Jaden Moon, This code is General Type. I added this code to GeneralCodeType also. Remove thisant after checking doesn't use it anymore.
    static readonly TAX_CODE = "TAX";       // 2019.10.02. Jaden Moon, This code is General Type. I added this code to GeneralCodeType also. Remove thisant after checking doesn't use it anymore.
    static readonly BILL_MODE_SSR = "SSR";
    static readonly HCD = "HCD";
    static readonly HOLIDAY_TYPE = "HDY";
    static readonly GATHERING_STATUS = "GTHST";
    static readonly INVOICE_STATUS = "IVST";
    static readonly VESSEL_DT_CODE = "VSLDC";
    static readonly STORAGE_DATECODE = "STCD";
    static readonly STORAGE_STARTDATECODE = "STSCD";
    static readonly STORAGE_ENDDATECODE = "STECD";
    static readonly PAYER_TYPE = "PATP";
    static readonly PAYER_TYPE_BATCH = "PATPB";
    static readonly VANPOOL_UNIT = "VUNT";
    static readonly BILL_TYPE = "BILL_TYPE";
    static readonly BILL_MODE = "BILL_MODE";
    static readonly BILL_CODE = "BILL_CODE";
    static readonly BILL_GROUP = "BILL_GROUP";
    //static readonly BILL_NAME = "BILL_NAME";
    static readonly TARIFF_CODE = "TARIFF_CODE";
    static readonly TARIFF_CODE_EXCEPTSOMECODE = "TARIFF_CODE_EXCEPTSOMECODE";
    static readonly TARIFF_CODE_EXCEPT_OVERSTORAGE_OVERPOOL = "TARIFF_CODE_EXCEPT_OVERSTORAGE_OVERPOOL";
    static readonly TARIFF_CODE_MAPPING_OPERATION_CODE = "TARIFF_CODE_MAPPING_OPERATION_CODE";
    static readonly PATTERN_CODE = "PATTERN_CODE";
    static readonly CONTRACT_TEMPLATE = "CONTRACT_TEMPLATE";
    static readonly INVOICE_TEMPLATE = "INVOICE_TEMPLATE";
    static readonly INVOICE_TEMPLATE_FOR_CASH = "INVOICE_TEMPLATE_FOR_CASH";
    static readonly PERIOD_UNIT = "PERIOD_UNIT";
    static readonly SHIFT_TIME_NO = "SHIFT_TIME_NO";
    static readonly SHIFT_TIME = "SHIFT_TIME";
    static readonly FREQUENT_TYPE = "FQTP";
    static readonly DISCOUNT_SURCHARGE_RATE_ITEMTYPE = "DSIT";
    static readonly CURRENCY_CODE = "CUR";
    static readonly VOLUME_DISCOUNT_ACCUMULATE_PTNR_TYPE ="VAPT";
    static readonly ATC_JOB_STATUS = "JOBST"; // added by jaeok (2020.11.09) HJNC-CUSP-Controller CTR-010 B1
    static readonly CORRECTION_TYPE = "CRTP";

    //Interface
    static readonly BILL_MOVEMENT_TYPE = "BMTP";
    static readonly LOG_STATUS = "LGST";
    static readonly FILE_TYPE = "FLTP";
    static readonly NAVISION_CODE = "NVC";
    static readonly CUSTOMER_TRF_CODE = "CTTC";

    static readonly RESOURCE_MAPPING_CODE = "RSMC";
    static readonly EXCEPTION_TYPE = "ERN";
    static readonly SPECIALTY_TYPE = "SPY";
    static readonly STEVEDORE = "STEVEDORE";
    static readonly RESOURCE_HIRE_TYPE = "RSHT";

    static readonly REEFER_AREA = "REEFER_AREA";
    static readonly RFCHK_STATUS = "RCS";
    static readonly CF = "CEFA";
    static readonly REEFER_PLUG_IO_MODE = "RFIOM";
    static readonly REEFER_PLUG_IN_MODE = "RFIM";
    static readonly REEFER_PLUG_OUT_MODE = "RFOM";
    static readonly PTI_TYPE = "PTITP";
    static readonly REEFER_CHECK_SHIFT = "RFCS";
    static readonly REEFER_CHECK_ACTIVITY = "RFCA"; 
    static readonly REEFER_JOB_STATUS = "RFJS";

    static readonly CFS_IN_OUT_MODE = "IOMD";
    static readonly CFS_REHANDLE_CODE = "CFSRE";

    //20100726 by jindols
    static readonly CONTAINER_DAMAGE_TYPE = "CDT";
    static readonly CONTAINER_CLEANNING_TYPE = "CCT";
    static readonly CONTAINER_DAMAGE_MEASUREMENT = "CDM";
    static readonly CONTAINER_DAMAGE_PART = "CDP";
    static readonly CONTAINER_DEFECTIVE = "DFCD";
    static readonly CONTAINER_CLEAN = "CNCD";
    static readonly CONTAINER_POWER = "POWR";
    static readonly CONTAINER_DAMAGECONDITION = "DMGC";
    static readonly CONTAINER_CONDITION = "CND"; //COND
    static readonly CONTAINER_DAMAGE_DIT = "DIT";   // 2019.10.02. Jaden Moon, This code is general code. I added this code to GeneralCodeType also. Please remove thisant after checking that doesn't use anymore.
    static readonly CONTAINER_DEFECTIVE_TYPE = "CDF";

    // added by jaeok (2019.05.27) Mantis 90143: [CUSP:N89-GT-001] Add ‘Container Door Lock Damage Type’ & Seal Damage Type
    static readonly CONTAINER_DOOR_LOCK_DAMAGE = "CDD";
    static readonly CONTAINER_SEAL_DAMAGE = "SDT";

    static readonly EQUIPMENT_AUTO_COVERAGE = "AUTO_COV"; //Added by Marcus - 20100803
    static readonly EQU_TP = "EQTP"; //Added by Marcus - 20100816

    // added by jaehoon(2016.09.21) : http://mantis.tsb.co.kr/view.php?id=50418
    static readonly COMPULSORY_SHIFTJOB_MODE = "AS_COMPULSORY";

    //For Berth Planning
    static readonly QC_REPAIR_REASON = "GRR";

    // Added by Manh - 20100804 
    static readonly EQUIPMENT_AVAILABILITY = "EQAV";

    // Start Added by Manh - 20100816 *****
    static readonly HOLD_CODE = "THC";
    static readonly OVERLAND_CHK = "OVERLAND_CHK";
    static readonly CONTAINER_SIZE = "CNTR_SIZE";
    static readonly AREA_PLAN_METHOD = "AREA_PLAN_METHOD";
    static readonly POSITION_RULE = "POSITION_RULE";

    static readonly POSITION_RULE_MAIN = "POSITION_RULE_MAIN";
    static readonly POSITION_RULE_RENEWED = "POSITION_RULE_RENEWED";
    static readonly POSITION_RULE_MIXTURE = "POSITION_RULE_MIXTURE";
    static readonly POSITION_RULE_STACK_VOLUME = "POSITION_RULE_STACK_VOLUME";

    // End Added by Manh ***** 

    // Added by Manh on 20100826
    static readonly AREA_BLOCK = "AREA_BLOCK";

    // Added by Manh on 20100903
    static readonly COLOR_CATEGORY = "COLOR_CATEGORY";

    // Added by Manh on 20100915
    static readonly VESSEL_VVD = "VESSEL_VVD";

    // Added by KiTaek Lee on 20180326
    static readonly VESSEL_USERVOY = "VESSEL_USERVOY";

    //Added by SooHyun on 20101201
    static readonly VESSEL_CALLSEQ = "VESSEL_CALLSEQ";

    // Added by Marcus on 20100922
    static readonly IC_ROUTE_RELAY_YN = "IC_ROUTE_RELAY_YN";

    // Added by Manh on 20100930
    static readonly PERIOD = "PERIOD";

    // Added by Marcus on 20100929
    static readonly INVENTORY_POD = "INVENTORY_POD";
    static readonly INVENTORY_FPOD = "INVENTORY_FPOD";
    static readonly ZONE = "ZONE";
    static readonly REJECT_REASON = "REJECT_REASON";

    // Added by Manh on 20101004
    static readonly BLOCK_FILTER_TYPE = "BLOCK_FILTER_TYPE";

    // Added by Manh on 20101011
    static readonly SHIFT_GROUP = "SHIFT_GROUP";

    static readonly DBMS_TYPE = "DBMS_TYPE";

    static readonly RAILSCHEDULE_MODE = "RMOD";

    static readonly BACKUPDB_LINK = "BACKUPDB_LINK";
    static readonly BASEDATE_MONTHS = "BASEDATE_MONTHS";

    static readonly REHANDLE_CODE = "RTCL";

    // Added by Jaden on 20111004, for packing_grp on OM.
    static readonly VALID_PACKING_GRP = "VALID_PACKING_GRP";

    // Added by E.C Hwang on 20111128, for Segregation Code on DG.
    static readonly SEGREGATION_CODE = "SEGREGATION_CODE";

    //Added by Chun (2011.11.28)
    static readonly INVENTORY_OPERATOR = "INVENTORY_OPERATOR";
    static readonly TIER = "TIER";
    static readonly IS_EXISTENCE_OUT_ORDER = "IS_EXISTENCE_OUT_ORDER";

    // Added by E.C Hwang on 20111208
    static readonly USER_GROUP_LIST = "USER_GROUP_LIST";

    // Added by E.C Hwang on 20111208
    static readonly TMNL_LIST = "TMCD";

    // Added by E.C Hwang on 20111219
    static readonly PROGRAM_CODE_AUTHORITY = "PRGMA";

    //2011 12 21 BY ROY 
    static readonly PROGRAM_CODE_ACCESS = "PROGRAM_CODE_ACCESS";

    // Added by Jaden Moon on 20120118 for Bundle Operation
    static readonly BUNDLE_CONTAINER_STATUS = "BUNDLE_CONTAINER_STATUS";

    // Added by E.C Hwang on 20120206
    static readonly CONTROL_TYPE = "COTP";
    static readonly CONTROL_TYPE_WEBIP = "COTPW";

    // Added by Jaden Moon on 20120403
    static readonly SHUTTLE_EDI_STATUS = "SEST";

    // Added by Jaden Moon on 20120419
    static readonly COPARN_INOUT_MODE = "CIOM";
    static readonly RAIL_INOUT_MODE = "RIOM"; // Sidney 20140327 for rail In/Out Mode.

    // Added by Theo So 2012.07.04 for Ship Planning
    static readonly SHIPPLAN_SCENARIO_ID_ALL = "SID1";      //Port, Port as final, Starboard, Starboard as final
    static readonly SHIPPLAN_SCENARIO_ID_P_S = "SID2";      //Port, Starboard
    static readonly SHIPPLAN_SCENARIO_ID_P_FS = "SID3";     //Port, Starboard as final
    static readonly SHIPPLAN_SCENARIO_ID_FP_S = "SID4";     //Port as final, Starboard

    static readonly EQU_COVER_FROM = "EQU_COVER_FROM";
    static readonly EQU_COVER_TO = "EQU_COVER_TO";

    // Added by KKH 2013.08.07
    static readonly DISCHARGE_VVD = "DISCHARGE_VVD";
    static readonly DIRECTION = "DIRECTION";
    static readonly YARD_POS = "YARD_POS";
    static readonly QUAY_POS = "QUAY_POS";
    static readonly GATE_POS = "GATE_POS";
    static readonly RAIL_POS = "RAIL_POS";

    static readonly GROUP_CODE = "BTB";

    // Added by Gyeong-tae Kim 2013.08.23
    static readonly PLANNING_PATTERN_VVD = "PLANNING_PATTERN_VVD";
    // Added by Ki-Taek Lee 2018.03.26
    static readonly PLANNING_PATTERN_USERVOY = "PLANNING_PATTERN_USERVOY";

    // Added by Gyeong-tae Kim 2013.10.02
    static readonly GROUPING_PATTERN_CODE = "GROUPING_PATTERN_CODE";

    static readonly LCLFCL = "LCL_FCL";
    static readonly INVENTORY_VVD = "INV_VVD";
    static readonly INVENTORY_USERVOY = "INV_USERVOY";  // Added by Ki-Taek Lee 2018.03.26
    static readonly INVENTORY_PREVVD = "INV_PREVVD";
    static readonly INVENTORY_PREUSERVOY = "INV_PREUSERVOY";    // Added by Ki-Taek Lee 2018.03.26
    static readonly WORK_GROUP = "WORK_GRP";
    static readonly WORK_ORDER = "WORK_ODR";

    static readonly TIER_CODE = "TIER_CODE";

    // Added by KiHyun Kim 2014.01.22
    static readonly BOUNDARY_PLAN_OPR = "BOUNDARY_PLAN_OPR";
    static readonly BOUNDARY_PLAN_POD = "BOUNDARY_PLAN_POD";
    static readonly BOUNDARY_PLAN_VVD = "BOUNDARY_PLAN_VVD";

    static readonly METHOD_CODE = "RLMH";       //TODO BY Sh.Song - this code is scheduled to be applied to the CM
    static readonly BAY_ROW_PRIORITY = "BRPT";  //TODO BY Sh.Song - this code is scheduled to be applied to the CM
    static readonly PV_DIRECTION = "PVDR";        //TODO BY Sh.Song - this code is scheduled to be applied to the CM
    static readonly HOUSEKEEPING_GROUP = "HKGP";    //TODO BY Sh.Song - this code is scheduled to be applied to the CM

    static readonly DAY_CODE = "DAYCD";

    static readonly INVENTORY_DISCHARGE_VVD = "INVENTORY_DISCHARGE_VVD";
    static readonly INVENTORY_DISCHARGE_USERVOY = "INVENTORY_DISCHARGE_USERVOY";    // Added by Ki-Taek Lee 2018.03.26
    static readonly BOUNDARY_DISCHARGE_VVD = "BOUNDARY_DISCHARGE_VVD";
    static readonly BOUNDARY_DISCHARGE_USERVOY = "BOUNDARY_DISCHARGE_USERVOY";      // Added by Ki-Taek Lee 2018.03.26

    static readonly REQUEST_BY = "RTBY";

    /// <summary>
    /// Gate Type for Container Warning  (Mantis: 0050084)
    /// </summary>            
    static readonly GATE_TYPE_FOR_WARN = "GTTPW";

    static readonly REGISTRATION_NO = "REGNO";
    static readonly REGISTRATION_NO_OF_PAYER = "REGNOPA";
    static readonly REGISTRATION_NO_OF_SHIPPER_CONSIGNEE = "REGNOCNS"; // added by YoungOk Kim (2020.10.22) - ACCHC Gap ID: OM32
    static readonly PAYER = "PYER";

    static readonly NOT_ALLOW_CARGO_TYPE = "NACG";
    static readonly NOT_ALLOW_CONTAINER_TYPE = "NATP";

    // Added by Gyeong-tae Kim 2015.10.16
    static readonly WAGON_ID = "WAGON_ID";

    static readonly TRAIN_VOY = "TRAIN_VOY";
    static readonly DISCHARGING_TRAIN_VOY = "DISCHARGING_TRAIN_VOY";
    static readonly LOADING_TRAIN_VOY = "LOADING_TRAIN_VOY";

    static readonly ITT_AREA = "ITT_AREA";

    static readonly BILLING_REPORT_MODE = "BRMD";

    static readonly QC_STOPPAGE = "QCSP";

    // Added by YoungOk Kim 2016.06.14
    static readonly SEAL_SOURCE = "SLSC";

    static readonly MOVEMENT_TYPE = "MOVEMENT_TYPE";
    static readonly MOVEMENT_TYPE_LOADING = "MOVEMENT_TYPE_LOADING";

    static readonly CLASS_FOR_MOVEMENT_TYPE = "MOTP";

    static readonly GATE_NO = "GATE_NO";

    // Added by WT.Kang 2016.07.12
    static readonly CHESS_CONDITION = "CHCN";
    static readonly CHESS_JOBTYPE = "CHJT";

    // Added by MK.Yoon 2019.09.01
    static readonly RTGSS_REFERENCE_TIME = "RTGRT";

    // Added by YoungOk Kim 2016.07.18
    static readonly USERVOY_VVD = "USERVOY_VVD";

    static readonly INVOICE_ISSUE_TYPE = "IVIT";

    // Added by YoungOk Kim 2016.09.12
    static readonly QJOB_TYPE = "QJOB";

    // Added by Glenda Cheon 2016.10.04
    static readonly DOCK_RECEIPT_SEND_STATUS = "DRST";

    // Added by Glenda Cheon 2016.10.07
    static readonly MOVEMENT_TYPE_FOR_CODECO = "MVTP";

    static readonly VVD_JOB_BAY = "VVD_JOB_BAY";

    static readonly VVD_JOB_BAY_ALLCODE = "VVD_JOB_BAY_ALLCODE";

    static readonly IMDG_LABEL = "IMDG_LABEL";

    // Added by June 2017.02.08. Related Mantis - 56718
    static readonly CODE_USAGE = "CDUS";

    static readonly CFS_AREA = "CFS_AREA";

    //2017.04.27 June - Added for getting Interface's parameter values.
    static readonly SCHEDULE_PARAM_VALUES = "SCH_PARAM_VALUES";

    // Added by E.C Hwang 2017.07.07 Related Mantis - 0056124
    // Storage Code for Operator
    static readonly STORAGE_CODE_OPR = "STC_OPR";

    // Added by SH.Kim on 2017.06.26 for Terminal Departure Report
    static readonly TDR_DELAY_CAUSED_BY = "TRDB";

    static readonly BILLING_CLASS = "CLSBL";

    static readonly SIZE_PRIORITY = "SZPT";

    static readonly SHIPPER_CONSIGNEE = "CNS";
    static readonly EQU_NO = "EQU_NO";
    static readonly CNTR_RULE_CODE = "CNTR_RULE_CODE";

    static readonly SHIPPLAN_SCENARIO_ID = "SPID";

    static readonly SSR_USED_IN_PREADVICE = "SSR_USED_IN_PA";
    static readonly SSR_USED_IN_PICKUP = "SSR_USED_IN_PU";
    static readonly SSR_USED_IN_CFS = "SSR_USED_IN_CFS";

    static readonly JOB_ORDER_TYPE = "ODRTP";

    // Added by SH.Kim 2018.04.24 for CFS Operation Result
    static readonly CFS_EQU_NO = "CFS_EQU_NO";
    static readonly STAFF_CODE = "STAFF_CODE";

    static readonly INTERFACE_STATUS = "IFST";
    static readonly TMNL_PARAMETER = "TMNL_PARAMETER";

    static readonly SUBMENU = "SUBMENU";
    static readonly INTERFACE_RESULT_STATUS = "IFRS";

    static readonly TIME_SLOT_NO = "TIME_SLOT_NO";  // 2018.08.23 BY E.C Hwang
    static readonly TIME_SLOT = "TIME_SLOT"; // added by YoungOk Kim (2020.04.20)
    static readonly CUSTOMER_GROUP = "CTGP"; //ERP Customer Group

    static readonly VIRTUAL_BLOCK = "SPVB";

    static readonly AREA_CODE_FOR_CFS = "ARCD";

    static readonly ALL_PTNRS = "ALL_PTNRS";

    static readonly SZTP_COLOR = "SZCL";

    static readonly LONG_DATE = "LongDate";

    static readonly RORO_TYPE = "RRTP";

    static readonly TRUCK = "TRCK"; //Truck List
    static readonly TRUCK_POOL = "TRPL";//Truck Pool            
    static readonly TRUCK_POOL_ASSIGNED_TRUCKS = "TPAT"; //Truck Pool Assigned Trucks

    static readonly MODE_CHANGE_TYPE = "MCHT";

    // Added by C.H Choi 2019.06.12
    static readonly ACTIONCODE_ACCORDING_TO_REASONCODE = "ACRC";

    // Added by C.H Choi 2019.06.28
    static readonly GANG_SEQ = "GASQ";

    // Added by S.B Shim 2019.07.05
    static readonly GANG_PLAN_STATUS = "GPST";
    static readonly GANG_ID = "GAID";
    static readonly RORO_STATUS = "ROST";

    //Added by EJ.Jang 2019.07.09
    static readonly UNIT_TYPE = "UNTP";

    static readonly VVD_ASSIGNABLE_AND_STORAGE = "VVD_ASSIGNABLE_AND_STORAGE";

    static readonly PILE_GROUPING_PATTERN_FACTOR = "PGPF";
    static readonly PILE_GROUPING_PATTERN_FACTOR_VALUE = "PGPFV";
    static readonly PILE_GROUPING_PATTERN_FACTOR_SPECIAL_VALUE = "PGPFS";

    static readonly PILE_MIXTRUE_RULE = "PMX";
    static readonly PILE_MIXTRUE_RULE_ITEM = "PMXI";
    static readonly PILE_MIXTRUE_RULE_OPERATOR = "PMXO";
    static readonly PILE_MIXTRUE_RULE_OPERATOR_SPECIAL_VALUE = "PMXOS";
    static readonly PILE_MIXTRUE_RULE_OPERATOR_MODE = "PMXOM";
    static readonly PILE_MIXTRUE_RULE_OPERATOR_WEIGHT_GROUP = "PMXOW";
    static readonly PILE_MIXTRUE_RULE_OPERATOR_WORKING_TIME = "PMXOT";
    static readonly PILE_MIXTRUE_RULE_WAY_OF_SCAN = "PMXS";
    static readonly PILE_MIXTRUE_RULE_SET = "PMXRS";

    static readonly PILE_MIXTRUE_RULE_SET_ALL = "PMRSA";
    static readonly PILE_MIXTRUE_RULE_SET_IXCD = "PMXRS_IXCD";
    static readonly PILE_MIXTRUE_RULE_SET_YENO = "PMXRS_YENO";

    static readonly BAYROW_MIXTRUE_RULE = "HMX";
    static readonly BAYROW_MIXTRUE_RULE_ITEM = "HMXI";
    static readonly BAYROW_MIXTRUE_RULE_OPERATOR = "HMXO";
    static readonly BAYROW_MIXTRUE_RULE_OPERATOR_SPECIAL_VALUE = "HMXOS";
    static readonly BAYROW_MIXTRUE_RULE_OPERATOR_MODE = "HMXOM";

    static readonly PRODUCTIVITY_SETTING_SCATTERING_VVD = "PSSV";

    static readonly EVALUATION_RULE = "ER";
    static readonly EVALUATION_RULE_DETAIL_CRITERIA = "ERC";
    static readonly EVALUATION_RULE_DETAIL_CRITERIA_FACTOR = "ERCF";

    static readonly NEW_POSITION_RULE = "NEW_POSITION_RULE";

    static readonly ITT_BLOCK = "ITT_BLOCK";
    static readonly CREDIT_NOTE_TYPE = "CRNT";
    static readonly SO_SPECIAL_JOB = "SOSJ";
    static readonly PICKUP_PURPOSE = "PUPUR";
    static readonly IXCD_IX_ONLY = "IXCD_IX_ONLY";

    static readonly SHIPPER_CONSIGNEE_LONG_NAME = "CNS_LNM";
    static readonly LINE_OPERATOR_LONG_NAME = "SHP_LNM";
    static readonly PAYER_LONG_NAME = "PYER_LNM";

    static readonly MESSAGE_TYPE = "MSTP";
    static readonly JOBMODE_TO_COMPARE = "JOBMODE_TO_COMPARE";

    static readonly VAT_RATE_TYPE = "VTTP";

    static readonly DOOR_DIR = "DRDR";
    static readonly TRANSACTION_TYPE = "TRTP";
    static readonly RULE_PGM_CODE = "PRGMR";
    static readonly RULE_TIMING = "RLTIM";
    static readonly PAYMENT_MODE = "PYMD";
    static readonly SSR_SPECIAL_JOB = "SSRSJ";
    static readonly REE_FREEDAYS_REV_UNIT = "REE_FREEDAYS_REV_UNIT";
    static readonly TRAILER_BARCODE = "TRAILER_BARCODE";

    // added by jaeok (2020.08.24) Mantis 108628: [YQ] 작업 목록 및 베이뷰의 POD 색상을 OM의 Port 색상으로 적용 요청
    static readonly VVD_POD_COLOR = "VVD_POD_COLOR";
    
    static readonly ITT_WORK_GROUP = "ITT_WORK_GROUP";

    static readonly PLUG_DIRECTION = "PGDR";
    //added by YoungHwan Choi (2020.09.02) -HJNC AutoRehandling Configuration
    static readonly AUTOREHANDLING_TIME_UNIT = "AUTOREHANDLING_TIME_UNIT";
    static readonly DO_DOCUMENT_TYPE = "DODT";
    static readonly DAYCD_EXCEPT_SUN = "DAYCD_EXCEPT_SUN";

    static readonly INVOICE_TEMPLATE_FOR_INV_TYPE = "ITIT";//Invoice Type for Invoice Template

    static readonly NATIONAL_ID_OF_SHIPPER_CONSIGNEE_PIC = "NID_CNS_PIC"; // added by YoungOk Kim (2020.10.22) - ACCHC Gap ID: OM32
    static readonly NEGLECT_INTERFACE_STATUS = "IFSTN";

    static readonly BARRIER_MODE = "BAMD"; // added by SugnBo Shim (2020.11.20 HJNC ODC-018-YD/GT-002)

    static readonly PROFORMA_SCHEDULE_TEMPLATE_ID = "PROFORMA_SCHEDULE_TEMPLATE_ID"; // added by KiTaek Lee (2020.11.30 HJNC PLR-206-BP-001)

    static readonly RULE_ITEM_KEY = "RITMK";

    static readonly LCL_FCL = "LFCT";
    static readonly LASHING_UNLASHING = "LSUL";

    static readonly PARTNER_LEVEL = "PTLV";
    static readonly PAYMENT_METHOD = "PYMH";

    static readonly CONTAINER_CLASS = "CNCLS";
    static readonly CONTAINER_CLASS_FOR_IMPORT = "CNCLI";
    static readonly CONTAINER_CLASS_FOR_THRU = "CNCLT";

    static readonly MANUAL_SEND_CODECO_MOVEMENT_TYPE =  "MSCMT";
    static readonly VGM_SERVICE_LEVEL_AGREEMENT = "VSLA";

    static readonly CHASSIS_POS = "CSPO";//added by MJ.Kim(2021.07.09 KPCT AT Work Order List)
    static readonly CRANE_ACTION = "CACD";//added by MJ.Kim(2021.07.09 KPCT AT Work Order List)

    static readonly BLOCK_CODE = "BLKCD";
}

export default CodeType;