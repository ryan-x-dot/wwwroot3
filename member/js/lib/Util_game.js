function Util_game(_win, _dom) {
                var _self = this;
                var win = _win;
                var dom = _dom;
                var parentClass;
                var ratioChg;
                var config_set;
                _self.init = function() {
                    ratioChg = new ratioChgRule(win,dom)
                }
                ;
                _self.setParentclass = function(_parentclass) {
                    parentClass = _parentclass;
                    config_set = parentClass.getThis("config_set")
                }
                ;
                _self.getThis = function(varible) {
                    return eval(varible)
                }
                ;
                _self.checkLogoForTV = function(isTV, gtype) {
                    if (!isTV)
                        TV_style = gtype != null ? "icon_match_" + gtype : "icon_mt";
                    else
                        TV_style = "icon_tv";
                    return TV_style
                }
                ;
                _self.showTxt = function(txt) {
                    if (txt + "" == "undefined" || txt + "" == "null" || txt + "" == "NaN")
                        return "";
                    return txt
                }
                ;
                _self.lockIor = function(ior) {
                    var ret = "lock";
                    if ("" + ior == "undefined")
                        return ret;
                    if (ior * 1 == 0)
                        return ret;
                    else if (ior.substr(0, 1) == "-") {
                        ret = "odd_bl";
                        return ret
                    } else
                        return ""
                }
                ;
                _self.in_array = function(txt, ary) {
                    for (var i = 0; i < ary.length; i++)
                        if (ary[i] == txt)
                            return true;
                    return false
                }
                ;
                _self.getNowMS = function(xmlnode, gameData, MsOrPoint, gtype, util, plays) {
                    var _ms = "";
                    var msStr = "MS_SE";
                    if (gtype == "ES")
                        msStr = "NOWSET";
                    var ms_se = "";
                    if (gtype != "FT") {
                        xmlnode = null;
                        if (MsOrPoint == "HALF" || MsOrPoint == "MS")
                            for (var key in gameData[plays])
                                if (gtype == "ES") {
                                    var es_ms = gameData[plays][key]["MS"].split("_")[0];
                                    var es_nowgame = gameData[plays][key]["MS"].split("_")[2];
                                    ms_se = es_ms + "_" + es_nowgame
                                } else
                                    ms_se = gameData[plays][key]["MS"]
                    } else
                        ms_se = util.getKeyValue(xmlnode, gameData[plays], msStr);
                    _ms = ms_se;
                    return _ms
                }
                ;
                _self.getWtypeName = function(LS_game, gid, showtype, gtype, wtype, rtype, msStr, team_h, team_c, imp, ptype, param) {
                    var ret = _self.get_wtype_name(LS_game, gid, showtype, gtype, wtype, rtype, msStr, team_h, team_c, imp, ptype, param);
                    return ret["menutype"]
                }
                ;
                _self.get_wtype_name = function(LS_game, gid, showtype, gtype, wtype, rtype, msStr, team_h, team_c, imp, ptype, param) {
                    var ret = {};
                    gtype = gtype.toUpperCase();
                    wtype = wtype.toUpperCase();
                    rtype = rtype.toUpperCase();
                    var subtypestr = "";
                    var menutype = "";
                    var showtypeStr = "";
                    var showRtype = "";
                    var tmp_wtype = "";
                    var showPlayType = "";
                    var tHash = new Object;
                    tHash["ODD"] = "EOO";
                    tHash["EVEN"] = "EOE";
                    tHash["RODD"] = "REOO";
                    tHash["REVEN"] = "REOE";
                    tHash["HREVEN"] = "HREOE";
                    tHash["HRODD"] = "HREOO";
                    var _ary = new Array("ouh","ouc","houh","houc","rouh","rouc","hruh","hruc");
                    var pd_ary = new Array("pd","rpd","pdh","pdc");
                    var REgtype = new Array("BM","TT","TN","VB");
                    var specialBS = new Array("HM","OT","HRM","ROT");
                    var ms = "";
                    try {
                        team_h = team_h.split("-")[0];
                        team_c = team_c.split("-")[0];
                        if (gtype == "FT") {
                            subtypestr = LS_game.get("showRtype");
                            if (_self.checkWtypeIsHalf_menutype(wtype))
                                subtypestr = LS_game.get("showRtype_h")
                        } else {
                            if (msStr)
                                ms = msStr.split("_")[1];
                            var ms_str = LS_game.get(gtype + "_game_" + ms + "_set");
                            if (ms_str != "") {
                                if (ms_str == gtype + "_game_" + ms + "_set")
                                    ms_str = "";
                                subtypestr = ms_str
                            }
                            var htype = "_HR_HRE_HPD_HM_HRM_HRPD_HOU_HROU_HWM_HRWM_HOUH_HOUC_HRUH_HRUC_HT_HEO_HRT_HREO_HPR_HPOU_HPEO_HPOUH_HPOUC_";
                            if (htype.indexOf("_" + wtype + "_") >= 0)
                                if (gtype.toUpperCase() == "BS")
                                    subtypestr = LS_game.get("showRtype_h_s");
                                else
                                    subtypestr = LS_game.get("showRtype_h")
                        }
                        if (wtype == "T") {
                            var _ary = new Array("EOO","EOE","HEOO","HEOE","EOH","EOC","HEOH","HEOC","ODD","RODD","EVEN","REVEN");
                            if (_self.in_array(rtype, _ary))
                                wtype = "eo";
                            showRtype = wtype;
                            rtype = tHash[rtype]
                        } else if (wtype == "HT") {
                            var _ary = new Array("HEVEN","HODD");
                            if (_self.in_array(rtype, _ary))
                                wtype = "heo";
                            showRtype = wtype;
                            rtype = tHash[rtype]
                        } else if (wtype == "RT") {
                            var _ary = new Array("REVEN","RODD");
                            if (_self.in_array(rtype, _ary))
                                wtype = "reo";
                            showRtype = wtype;
                            rtype = tHash[rtype]
                        } else if (wtype == "HRT") {
                            var _ary = new Array("HREVEN","HRODD");
                            if (_self.in_array(rtype, _ary))
                                wtype = "hreo";
                            showRtype = wtype;
                            rtype = tHash[rtype]
                        } else if (wtype == "SP" || _self.checkWtypeisSP(wtype))
                            showRtype = rtype.substr(0, rtype.length - 1);
                        else
                            showRtype = wtype;
                        var tmp_wtype = showRtype.toLowerCase();
                        if ((tmp_wtype.substr(0, 2) == "hp" || tmp_wtype.substr(0, 1) == "p") && tmp_wtype != "pd" && tmp_wtype != "hpd" && tmp_wtype != "pgf" && tmp_wtype != "pgl" && tmp_wtype != "pgfn" && tmp_wtype != "pgln" && tmp_wtype != "pg" && tmp_wtype != "pgfh" && tmp_wtype != "pgfc" && tmp_wtype != "pglh" && tmp_wtype != "pglc" && tmp_wtype != "pa" && tmp_wtype != "pah" && tmp_wtype != "pac" && gtype == "FT")
                            showRtype = tmp_wtype.replace("p", "");
                        showPlayType = LS_game.get(_self.chgShowName_M("showRtype_" + showRtype.toLowerCase(), gtype));
                        if (_self.in_array(tmp_wtype, _ary) && gtype == "FT") {
                            var t = tmp_wtype.substr(tmp_wtype.length - 1, 1);
                            if (t.toUpperCase() == "H")
                                showPlayType = showPlayType.replace("*TEAM_H*", team_h);
                            else
                                showPlayType = showPlayType.replace("*TEAM_C*", team_c)
                        }
                        if (wtype != "FS") {
                            if (_self.in_array(gtype, REgtype)) {
                                var tmp_i = typeof msStr == "undefined" || msStr == "" ? "0" : "1";
                                _type = _self.util_wtypeConverToR(wtype, true);
                                showPlayType = LS_game.get("showRtype_" + _type + "_" + tmp_i + "_" + gtype);
                                if (_type.indexOf("rf") != -1 || _type.indexOf("rga") != -1 || _type.indexOf("rgou") != -1)
                                    showPlayType = LS_game.get("showRtype_" + _type + "_" + gtype);
                                if (gtype == "TN" && _type == "r" && tmp_i == "1" && subtypestr == "")
                                    showPlayType = LS_game.get("showRtype_" + _type + "_main_TN");
                                if (gtype == "BM" && (_self.checkWtypeIsWXP_BM(showRtype.toUpperCase()) || _self.checkWtypeIsPTW_BM(showRtype.toUpperCase())))
                                    showPlayType = LS_game.get("showRtype_" + showRtype.toLowerCase() + "_" + gtype)
                            }
                            if (gtype == "SK") {
                                _type = _self.util_wtypeConverToR(wtype, true);
                                showPlayType = LS_game.get("showRtype_" + _type + "_" + gtype)
                            }
                            if (gtype == "BS" && (_self.checkWtypeIsOU(wtype) || _self.checkWtypeIsEO(wtype) || _self.in_array(wtype, specialBS))) {
                                _type = _self.util_wtypeConverToR(wtype, true);
                                showPlayType = LS_game.get("showRtype_" + _type + "_" + gtype.toLowerCase())
                            }
                            if (gtype == "BK" && _self.checkWtypeIsR(wtype)) {
                                if (showRtype.indexOf("P") != -1)
                                    showRtype = showRtype.replace("P", "");
                                showPlayType = LS_game.get("showRtype_" + showRtype.toLowerCase() + "_s")
                            }
                            if (gtype == "BK" && !_self.checkWtypeIsR(wtype))
                                showPlayType = LS_game.get("showRtype_" + showRtype.toLowerCase() + "_BK");
                            if (gtype == "ES") {
                                showPlayType = LS_game.get("showRtype_" + showRtype.toLowerCase() + "_ES");
                                if (param && param.nowGame && param.period) {
                                    var period_menu_str = "";
                                    if (param.period * 1 > 1)
                                        if (!param.nowGame.match(/Match|G0/))
                                            period_menu_str = LS_game.get("ES_" + param.nowGame.toLowerCase()) + " " + LS_game.get("game_" + param.gameType + "_ES") + LS_game.get("period_" + param.period + "_ES") + " - ";
                                        else
                                            period_menu_str = LS_game.get("match_" + param.period + "_ES") + " - ";
                                    else if (!param.nowGame.match(/Match|G0/))
                                        period_menu_str = LS_game.get("ES_" + param.nowGame.toLowerCase()) + " " + LS_game.get("game_" + param.gameType + "_ES") + " - ";
                                    showPlayType = period_menu_str + showPlayType
                                }
                            }
                            if (_self.in_array(tmp_wtype, pd_ary) && gtype == "BK") {
                                showPlayType = LS_game.get("showRtype_" + tmp_wtype + "_BK");
                                var _rtype = rtype.toLowerCase();
                                var t = _rtype.substr(_rtype.length - 2, 1);
                                if (t.toUpperCase() == "H")
                                    showPlayType = showPlayType.replace("*TEAM*", team_h);
                                else
                                    showPlayType = showPlayType.replace("*TEAM*", team_c)
                            }
                        }
                    } catch (e) {
                        console.log(e)
                    }
                    showPlayType = showPlayType.replace(/\*TEAM_H\*/g, team_h);
                    showPlayType = showPlayType.replace(/\*TEAM_C\*/g, team_c);
                    showtypeStr = showtype.toLowerCase() == "live" ? LS_game.get("showtype_" + showtype) : "";
                    var tilte_gtype = "";
                    if (gtype == "BK")
                        tilte_gtype = LS_game.get("title_" + gtype.toUpperCase()).split("/")[0];
                    else
                        tilte_gtype = LS_game.get("title_" + gtype.toUpperCase());
                    var showtypeStr = _self.isRBWtype(wtype) ? _self.showTxt(LS_game.get("showtype_live")) : _self.showTxt(showtypeStr);
                    if (subtypestr == "")
                        menutype = tilte_gtype + " " + showtypeStr + " " + _self.showTxt(showPlayType) + " " + _self.showTxt(subtypestr);
                    else
                        menutype = tilte_gtype + " " + showtypeStr + " " + _self.showTxt(showPlayType) + " - " + _self.showTxt(subtypestr);
                    var imp, ptype, tmp_menutype = "";
                    var isRB = _self.isRBWtype(wtype) ? true : false;
                    if (gtype == "FT") {
                        tmp_menutype = menutype;
                        if (tmp_menutype.indexOf(ptype) != -1)
                            tmp_menutype = tmp_menutype.replace(ptype, "");
                        ptype = ptype.replace("-", "");
                        if (imp == "Y")
                            if (showtype == "live" || showtype == "parlay" && isRB) {
                                var tmp = tmp_menutype.split(" ");
                                tmp_menutype = tmp_menutype.replace(tmp[1], tmp[1] + " " + ptype + " -")
                            } else {
                                var tmp = tmp_menutype.split(" ");
                                tmp_menutype = tmp_menutype.replace(tmp[0], tmp[0] + " " + ptype + " -")
                            }
                    } else if (gtype == "BS") {
                        tmp_menutype = menutype;
                        if (ptype != null) {
                            if (tmp_menutype.indexOf(ptype) != -1)
                                tmp_menutype = tmp_menutype.replace(ptype, "");
                            ptype = ptype.replace("-", "");
                            ptype = ptype.replace(/[\])}[{(]/g, "");
                            if (imp == "Y")
                                tmp_menutype = tmp_menutype + " - " + ptype
                        }
                    } else
                        tmp_menutype = menutype;
                    ret["title_gtype"] = tilte_gtype;
                    ret["str_showtype"] = _self.showTxt(showtypeStr);
                    ret["wtype"] = _self.showTxt(showPlayType);
                    ret["ptype"] = _self.showTxt(ptype);
                    ret["subtype"] = subtypestr;
                    ret["menutype"] = tmp_menutype;
                    return ret
                }
                ;
                _self.checkWtypeIsHalf_menutype = function(wtype) {
                    var ary = new Array("HR","HRE","HPD","HM","HRM","HRPD","HOU","HROU","HEO","HREO","HT","HRT","HOUH","HOUC","HRUH","HRUC","HPR","HPOU","HPEO","HPOUH","HPOUC","HPRE","HPROU","HPREO","HPROUH","HPROUC","HPRUH","HPRUC");
                    return _self.in_array(wtype.toUpperCase(), ary)
                }
                ;
                _self.checkWtypeIsHalf_util = function(wtype) {
                    var ary = new Array("HR","HRE","HPD","HM","HRM","HRPD","HOU","HROU","HEO","HREO","HT","HRT","HOUH","HOUC","HRUH","HRUC","HPR","HPOU","HPEO","HPOUH","HPOUC","HPRE","HPROU","HPREO","HPROUH","HPROUC","HPRUH","HPRUC","HTS","HEOH","HEOC","HREOH","HREOC","HWM","HRWM");
                    return _self.in_array(wtype.toUpperCase(), ary)
                }
                ;
                _self.checkWtypeIsR = function(wtype) {
                    var ary = new Array("PRE","HPRE","PARE","PBRE","PCRE","PDRE","PERE","PFRE","R","HR","RE","HRE","PR","HPR","ARE","BRE","CRE","DRE","ERE","FRE","AR","BR","CR","DR","ER","FR","PAR","PBR","PCR","PDR","PER","PFR","BAR","CAR","DAR","EAR","FAR","W3");
                    return _self.in_array(wtype.toUpperCase(), ary)
                }
                ;
                _self.checkWtypeIsOU = function(wtype) {
                    var wtypeDouble2017 = new Array("TARU","TBRU","TDRU","TERU");
                    var ary = new Array("ROU","HROU","AROU","BROU","CROU","DROU","EROU","FROU","ROUH","ROUC","HRUH","HRUC","OU","HOU","AOU","BOU","COU","DOU","EOU","FOU","PAOU","PBOU","PCOU","PDOU","PEOU","PFOU","OUH","OUC","HOUH","HOUC","POU","HPOU","HPOUH","HPOUC","POUH","POUC");
                    var finalAry = ary.concat(wtypeDouble2017);
                    return _self.in_array(wtype.toUpperCase(), finalAry)
                }
                ;
                _self.checkWtypeIsPD = function(wtype) {
                    var ary = new Array("PD","HPD","RPD","HRPD");
                    return _self.in_array(wtype.toUpperCase(), ary)
                }
                ;
                _self.checkWtypeIs15Min_RB = function(wtype) {
                    var ary = new Array("ARE","AROU","ARM","BRE","BROU","BRM","CRE","CROU","CRM","DRE","DROU","DRM","ERE","EROU","ERM","FRE","FROU","FRM");
                    return _self.in_array(wtype.toUpperCase(), ary)
                }
                ;
                _self.checkWtypeIsEO = function(wtype) {
                    var ary = new Array("EO","HEO","EOH","EOC","HEOH","HEOC","REO","HREO","REOH","REOC","HREOH","HREOC","PEO","HPEO");
                    return _self.in_array(wtype.toUpperCase(), ary)
                }
                ;
                _self.checkWtypeIsTS = function(wtype) {
                    var ary = new Array("TS","HTS","RTS","RTS2");
                    return _self.in_array(wtype.toUpperCase(), ary)
                }
                ;
                _self.checkWtypeIsOT = function(wtype) {
                    var ary = new Array("OT","ROT");
                    return _self.in_array(wtype.toUpperCase(), ary)
                }
                ;
                _self.OUtransDT_wtype = function(wtype) {
                    var ary = new Array("TS","HTS","OG","OT","RTS","RTS2","ROT");
                    return _self.in_array(wtype.toUpperCase(), ary)
                }
                ;
                _self.checkWtypeIsComplex = function(wtype) {
                    var ary = new Array("MOU","MTS","MPG","DU","DS","DG","OUT","OUP","OUE","MOUA","MOUB","MOUC","MOUD","DUA","DUB","DUC","DUD","OUTA","OUTB","OUTC","OUTD","OUPA","OUPB","OUPC","OUPD","OUEA","OUEB","OUEC","OUED","RMOU","RMTS","RMPG","RDU","RDS","RDG","ROUT","ROUP","ROUE","RMUA","RMUB","RMUC","RMUD","RDUA","RDUB","RDUC","RDUD","RUTA","RUTB","RUTC","RUTD","RUPA","RUPB","RUPC","RUPD","RUEA","RUEB","RUEC","RUED");
                    return _self.in_array(wtype.toUpperCase(), ary)
                }
                ;
                _self.checkWtypeIsSingle2016 = function(wtype) {
                    var ary = new Array("MOUA","MOUB","MOUC","MOUD","DUA","DUB","DUC","DUD","OUTA","OUTB","OUTC","OUTD","OUPA","OUPB","OUPC","OUPD","OUEA","OUEB","OUEC","OUED","MOU","MTS","MPG","DU","DS","DG","OUT","OUP","OUE","MW","MQ","RMUA","RMUB","RMUC","RMUD","RDUA","RDUB","RDUC","RDUD","RUTA","RUTB","RUTC","RUTD","RUPA","RUPB","RUPC","RUPD","RUEA","RUEB","RUEC","RUED","RMOU","RMTS","RMPG","RDU","RDS","RDG","ROUT","ROUP","ROUE");
                    return _self.in_array(wtype.toUpperCase(), ary)
                }
                ;
                _self.checkWtypeIsDouble2016 = function(wtype) {
                    var ary = new Array("EOH","EOC","HEOH","HEOC","RNBA","RNBB","RNBC","RNBD","RNBE","RNBF","RNBG","RNBH","RNBI","RNBJ","RNBK","RNBL","RNBM","RNBN","RNBO","RNC1","RNC2","RNC3","RNC4","RNC5","RNC6","RNC7","RNC8","RNC9","RNCA","RNCB","RNCC","RNCD","RNCE","RNCF","RNCG","RNCH","RNCI","RNCJ","RNCK","RNCL","RNCM","RNCN","RNCO","RNCP","RNCQ","RNCR","RNCS","RNCT","RNCU","RSHA","RSHB","RSHC","RSHD","RSHE","RSHF","RSHG","RSHH","RSHI","RSHJ","RSHK","RSHL","RSHM","RSHN","RSHO","RSCA","RSCB","RSCC","RSCD","RSCE","RSCF","RSCG","RSCH","RSCI","RSCJ","RSCK","RSCL","RSCM","RSCN","RSCO");
                    return _self.in_array(wtype.toUpperCase(), ary)
                }
                ;
                _self.checkWtypeIsSingle2017 = function(wtype) {
                    var ary = new Array("RPS","RTW","RPF","RPXA","RPXB","RPXC","RPXD","RPXE","RPXF","RPXG","RPXH","RPXI","RPXJ","RPXK","RPXL","RPXM","RPXN","RPXO");
                    return _self.in_array(wtype.toUpperCase(), ary)
                }
                ;
                _self.checkWtypeIsRSH = function(wtype) {
                    var ary = new Array("RSHA","RSHB","RSHC","RSHD","RSHE","RSHF","RSHG","RSHH","RSHI","RSHJ","RSHK","RSHL","RSHM","RSHN","RSHO","PRSHA","PRSHB","PRSHC","PRSHD","PRSHE","PRSHF","PRSHG","PRSHH","PRSHI","PRSHJ","PRSHK","PRSHL","PRSHM","PRSHN","PRSHO");
                    return _self.in_array(wtype.toUpperCase(), ary)
                }
                ;
                _self.checkWtypeIsWM = function(wtype) {
                    var ary = new Array("WM","RWM","HWM","HRWM");
                    return _self.in_array(wtype.toUpperCase(), ary)
                }
                ;
                _self.checkWtypeIsF = function(wtype) {
                    var ary = new Array("F01","F02");
                    return _self.in_array(wtype.toUpperCase(), ary)
                }
                ;
                _self.checkWtypeIsRF = function(wtype) {
                    var ary = new Array("RF01","RF02","RF03","RF04","RF05","RF06","RF07","RF08","RF09","RF10","RF11","RF12","RF13","RF14","RF15","RF16","RF17","RF18","RF19","RF20","RF21","RF22","RF23","RF24","RF25","RF26","RF27","RF28","RF29","RF30","RF31","RF32","RF33","RF34","RF35");
                    return _self.in_array(wtype.toUpperCase(), ary)
                }
                ;
                _self.checkWtypeIsRF_TN = function(wtype) {
                    var ary = new Array("RFA01","RFA02","RFA03","RFA04","RFA05","RFA06","RFA07","RFA08","RFA09","RFA10","RFA11","RFA12","RFA13","RFB01","RFB02","RFB03","RFB04","RFB05","RFB06","RFB07","RFB08","RFB09","RFB10","RFB11","RFB12","RFB13","RFC01","RFC02","RFC03","RFC04","RFC05","RFC06","RFC07","RFC08","RFC09","RFC10","RFC11","RFC12","RFC13","RFC14","RFC15","RFC16","RFC17","RFC18","RFC19","RFC20","RFC21","RFC22","RFC23","RFC24","RFC25","RFC26","RFC27","RFC28","RFC29","RFC30","RFC31","RFC32","RFC33","RFC34","RFC35","RFC36","RFC37","RFC38","RFC39","RFC40","RFC41","RFC42","RFC43","RFC44","RFC45","RFC46","RFC47","RFC48","RFC49","RFC50","RFD01","RFD02","RFD03","RFD04","RFD05","RFD06","RFD07","RFD08","RFD09","RFD10","RFD11","RFD12","RFD13","RFE01","RFE02","RFE03","RFE04","RFE05","RFE06","RFE07","RFE08","RFE09","RFE10","RFE11","RFE12","RFE13","RFE14","RFE15","RFE16","RFE17","RFE18","RFE19","RFE20","RFE21","RFE22","RFE23","RFE24","RFE25","RFE26","RFE27","RFE28","RFE29","RFE30","RFE31","RFE32","RFE33","RFE34","RFE35","RFE36","RFE37","RFE38","RFE39","RFE40","RFE41","RFE42","RFE43","RFE44","RFE45","RFE46","RFE47","RFE48","RFE49","RFE50");
                    return _self.in_array(wtype.toUpperCase(), ary)
                }
                ;
                _self.checkWtypeIsRGA_TN = function(wtype) {
                    var ary = new Array("RGAA01","RGAA02","RGAA03","RGAA04","RGAA05","RGAA06","RGAA07","RGAA08","RGAA09","RGAA10","RGAA11","RGAA12","RGAA13","RGAB01","RGAB02","RGAB03","RGAB04","RGAB05","RGAB06","RGAB07","RGAB08","RGAB09","RGAB10","RGAB11","RGAB12","RGAB13","RGAC01","RGAC02","RGAC03","RGAC04","RGAC05","RGAC06","RGAC07","RGAC08","RGAC09","RGAC10","RGAC11","RGAC12","RGAC13","RGAC14","RGAC15","RGAC16","RGAC17","RGAC18","RGAC19","RGAC20","RGAC21","RGAC22","RGAC23","RGAC24","RGAC25","RGAC26","RGAC27","RGAC28","RGAC29","RGAC30","RGAC31","RGAC32","RGAC33","RGAC34","RGAC35","RGAC36","RGAC37","RGAC38","RGAC39","RGAC40","RGAC41","RGAC42","RGAC43","RGAC44","RGAC45","RGAC46","RGAC47","RGAC48","RGAC49","RGAC50","RGAD01","RGAD02","RGAD03","RGAD04","RGAD05","RGAD06","RGAD07","RGAD08","RGAD09","RGAD10","RGAD11","RGAD12","RGAD13","RGAE01","RGAE02","RGAE03","RGAE04","RGAE05","RGAE06","RGAE07","RGAE08","RGAE09","RGAE10","RGAE11","RGAE12","RGAE13","RGAE14","RGAE15","RGAE16","RGAE17","RGAE18","RGAE19","RGAE20","RGAE21","RGAE22","RGAE23","RGAE24","RGAE25","RGAE26","RGAE27","RGAE28","RGAE29","RGAE30","RGAE31","RGAE32","RGAE33","RGAE34","RGAE35","RGAE36","RGAE37","RGAE38","RGAE39","RGAE40","RGAE41","RGAE42","RGAE43","RGAE44","RGAE45","RGAE46","RGAE47","RGAE48","RGAE49","RGAE50");
                    return _self.in_array(wtype.toUpperCase(), ary)
                }
                ;
                _self.checkWtypeIsRGOU_TN = function(wtype) {
                    var ary = new Array("RGOUA01","RGOUA02","RGOUA03","RGOUA04","RGOUA05","RGOUA06","RGOUA07","RGOUA08","RGOUA09","RGOUA10","RGOUA11","RGOUA12","RGOUA13","RGOUB01","RGOUB02","RGOUB03","RGOUB04","RGOUB05","RGOUB06","RGOUB07","RGOUB08","RGOUB09","RGOUB10","RGOUB11","RGOUB12","RGOUB13","RGOUC01","RGOUC02","RGOUC03","RGOUC04","RGOUC05","RGOUC06","RGOUC07","RGOUC08","RGOUC09","RGOUC10","RGOUC11","RGOUC12","RGOUC13","RGOUC14","RGOUC15","RGOUC16","RGOUC17","RGOUC18","RGOUC19","RGOUC20","RGOUC21","RGOUC22","RGOUC23","RGOUC24","RGOUC25","RGOUC26","RGOUC27","RGOUC28","RGOUC29","RGOUC30","RGOUC31","RGOUC32","RGOUC33","RGOUC34","RGOUC35","RGOUC36","RGOUC37","RGOUC38","RGOUC39","RGOUC40","RGOUC41","RGOUC42","RGOUC43","RGOUC44","RGOUC45","RGOUC46","RGOUC47","RGOUC48","RGOUC49","RGOUC50","RGOUD01","RGOUD02","RGOUD03","RGOUD04","RGOUD05","RGOUD06","RGOUD07","RGOUD08","RGOUD09","RGOUD10","RGOUD11","RGOUD12","RGOUD13","RGOUE01","RGOUE02","RGOUE03","RGOUE04","RGOUE05","RGOUE06","RGOUE07","RGOUE08","RGOUE09","RGOUE10","RGOUE11","RGOUE12","RGOUE13","RGOUE14","RGOUE15","RGOUE16","RGOUE17","RGOUE18","RGOUE19","RGOUE20","RGOUE21","RGOUE22","RGOUE23","RGOUE24","RGOUE25","RGOUE26","RGOUE27","RGOUE28","RGOUE29","RGOUE30","RGOUE31","RGOUE32","RGOUE33","RGOUE34","RGOUE35","RGOUE36","RGOUE37","RGOUE38","RGOUE39","RGOUE40","RGOUE41","RGOUE42","RGOUE43","RGOUE44","RGOUE45","RGOUE46","RGOUE47","RGOUE48","RGOUE49","RGOUE50");
                    return _self.in_array(wtype.toUpperCase(), ary)
                }
                ;
                _self.checkWtypeIsPTW_BM = function(wtype) {
                    var ary = new Array("PTWA01","PTWA02","PTWA03","RPTWA01","RPTWA02","RPTWA03","RPTWA04","RPTWA05","RPTWA06","RPTWA07","RPTWA08","RPTWA09","RPTWA10","RPTWA11","RPTWA12","RPTWA13","RPTWA14","RPTWA15","RPTWA16","RPTWA17","RPTWA18","RPTWA19","RPTWA20","RPTWA21","RPTWA22","RPTWA23","RPTWA24","RPTWA25","RPTWA26","RPTWA27","RPTWA28","RPTWA29","RPTWA30","RPTWA31","RPTWA32","RPTWA33","RPTWA34","RPTWA35","RPTWA36","RPTWA37","RPTWA38","RPTWA39","RPTWA40","RPTWA41","RPTWA42","RPTWA43","RPTWA44","RPTWA45","RPTWA46","RPTWA47","RPTWA48","RPTWA49","RPTWA50","RPTWA51","RPTWA52","RPTWA53","RPTWA54","RPTWA55","RPTWA56","RPTWA57","RPTWA58","RPTWA59","RPTWB01","RPTWB02","RPTWB03","RPTWB04","RPTWB05","RPTWB06","RPTWB07","RPTWB08","RPTWB09","RPTWB10","RPTWB11","RPTWB12","RPTWB13","RPTWB14","RPTWB15","RPTWB16","RPTWB17","RPTWB18","RPTWB19","RPTWB20","RPTWB21","RPTWB22","RPTWB23","RPTWB24","RPTWB25","RPTWB26","RPTWB27","RPTWB28","RPTWB29","RPTWB30","RPTWB31","RPTWB32","RPTWB33","RPTWB34","RPTWB35","RPTWB36","RPTWB37","RPTWB38","RPTWB39","RPTWB40","RPTWB41","RPTWB42","RPTWB43","RPTWB44","RPTWB45","RPTWB46","RPTWB47","RPTWB48","RPTWB49","RPTWB50","RPTWB51","RPTWB52","RPTWB53","RPTWB54","RPTWB55","RPTWB56","RPTWB57","RPTWB58","RPTWB59","RPTWC01","RPTWC02","RPTWC03","RPTWC04","RPTWC05","RPTWC06","RPTWC07","RPTWC08","RPTWC09","RPTWC10","RPTWC11","RPTWC12","RPTWC13","RPTWC14","RPTWC15","RPTWC16","RPTWC17","RPTWC18","RPTWC19","RPTWC20","RPTWC21","RPTWC22","RPTWC23","RPTWC24","RPTWC25","RPTWC26","RPTWC27","RPTWC28","RPTWC29","RPTWC30","RPTWC31","RPTWC32","RPTWC33","RPTWC34","RPTWC35","RPTWC36","RPTWC37","RPTWC38","RPTWC39","RPTWC40","RPTWC41","RPTWC42","RPTWC43","RPTWC44","RPTWC45","RPTWC46","RPTWC47","RPTWC48","RPTWC49","RPTWC50","RPTWC51","RPTWC52","RPTWC53","RPTWC54","RPTWC55","RPTWC56","RPTWC57","RPTWC58","RPTWC59","RPTWD01","RPTWD02","RPTWD03","RPTWD04","RPTWD05","RPTWD06","RPTWD07","RPTWD08","RPTWD09","RPTWD10","RPTWD11","RPTWD12","RPTWD13","RPTWD14","RPTWD15","RPTWD16","RPTWD17","RPTWD18","RPTWD19","RPTWD20","RPTWD21","RPTWD22","RPTWD23","RPTWD24","RPTWD25","RPTWD26","RPTWD27","RPTWD28","RPTWD29","RPTWE01","RPTWE02","RPTWE03","RPTWE04","RPTWE05","RPTWE06","RPTWE07","RPTWE08","RPTWE09","RPTWE10","RPTWE11","RPTWE12","RPTWE13","RPTWE14","RPTWE15","RPTWE16","RPTWE17","RPTWE18","RPTWE19","RPTWE20","RPTWE21","RPTWE22","RPTWE23","RPTWE24","RPTWE25","RPTWE26","RPTWE27","RPTWE28","RPTWE29");
                    return _self.in_array(wtype.toUpperCase(), ary)
                }
                ;
                _self.checkWtypeIsWXP_BM = function(wtype) {
                    var ary = new Array("WXPA05","WXPA10","WXPA15","RWXPA05","RWXPA10","RWXPA15","RWXPB05","RWXPB10","RWXPB15","RWXPC05","RWXPC10","RWXPC15","RWXPD05","RWXPD10","RWXPD15","RWXPE05","RWXPE10","RWXPE15");
                    return _self.in_array(wtype.toUpperCase(), ary)
                }
                ;
                _self.checkWtypeIsRG = function(wtype) {
                    var ary = new Array("ARG","BRG","CRG","DRG","ERG","FRG","GRG","HRG","IRG","JRG");
                    return _self.in_array(wtype.toUpperCase(), ary)
                }
                ;
                _self.needToShowScore = function(wtype) {
                    var ary = new Array("RE","HRE","ROU","HROU","ARE","AROU","ARM","BRE","BROU","BRM","CRE","CROU","CRM","DRE","DROU","DRM","ERE","EROU","ERM","FRE","FROU","FRM","ROUH","ROUC","HRUH","HRUC","RNC1","RNC2","RNC3","RNC4","RNC5","RNC6","RNC7","RNC8","RNC9","RNCA","RNCB","RNCC","RNCD","RNCE","RNCF","RNCG","RNCH","RNCI","RNCJ","RNCK","RNCL","RNCM","RNCN","RNCO","RNCP","RNCQ","RNCR","RNCS","RNCT","RNCU","RNBA","RNBB","RNBC","RNBD","RNBE","RNBF","RNBG","RNBH","RNBI","RNBJ","RNBK","RNBL","RNBM","RNBN","RNBO","RSHA","RSHB","RSHC","RSHD","RSHE","RSHF","RSHG","RSHH","RSHI","RSHJ","RSHK","RSHL","RSHM","RSHN","RSHO","RSCA","RSCB","RSCC","RSCD","RSCE","RSCF","RSCG","RSCH","RSCI","RSCJ","RSCK","RSCL","RSCM","RSCN","RSCO","TARU","TBRU","TDRU","TERU");
                    return _self.in_array(wtype.toUpperCase(), ary)
                }
                ;
                _self.transRETIME = function(vals, hasPD, LS, typeShow) {
                    var ret = "";
                    var tmpHash = vals.split("^");
                    var tmpHtime = "";
                    var showretime = "";
                    if (tmpHash[0] == "Start" || tmpHash[0] == "LIVE") {
                        tmpHtime = "";
                        showretime = "0"
                    } else if (tmpHash[0] == "MTIME") {
                        tmpHtime = "";
                        showretime = LS.get("HT")
                    } else if (tmpHash[0] == "HT") {
                        tmpHtime = "";
                        showretime = LS.get("retimeHT")
                    } else {
                        var tmpHtime = tmpHash[0];
                        showretime = tmpHash[1].replace("'", "");
                        var showstr = tmpHash[0].split("H");
                        if (showstr[0] == "1")
                            tmpHtime = LS.get("retime1H");
                        if (showstr[0] == "2")
                            tmpHtime = LS.get("retime2H")
                    }
                    if (hasPD)
                        ret = "<p>" + tmpHtime + "</p>" + showretime;
                    else {
                        if (tmpHtime)
                            tmpHtime += "<b></b>";
                        if (typeShow == "ET")
                            tmpHtime = LS.get("ET") + "<b></b>" + tmpHtime;
                        ret = tmpHtime + showretime
                    }
                    return ret
                }
                ;
                _self.chgShowName_M = function(_name, _gtype) {
                    var gtype = _gtype.toUpperCase();
                    var ary = new Array("showRtype_m","showRtype_hm","showRtype_rm","showRtype_hrm");
                    if (_self.in_array(_name, ary))
                        if (gtype == "FT" || gtype == "OP")
                            return _name + "_FT";
                    return _name
                }
                ;
                _self.getTeamWM = function(rtype) {
                    var _rtype = rtype.toUpperCase();
                    var hash = new Object;
                    hash["WMH1"] = "h";
                    hash["WMH2"] = "h";
                    hash["WMH3"] = "h";
                    hash["WMH4"] = "h";
                    hash["WMHOV"] = "h";
                    hash["WMAH1"] = "h";
                    hash["WMAH2"] = "h";
                    hash["WMAH3"] = "h";
                    hash["WMAH4"] = "h";
                    hash["WMAH5"] = "h";
                    hash["WMAHOV"] = "h";
                    hash["WMBH1"] = "h";
                    hash["WMBHOV"] = "h";
                    hash["WMCHOV"] = "h";
                    hash["WMAC1"] = "c";
                    hash["WMAC2"] = "c";
                    hash["WMAC3"] = "c";
                    hash["WMAC4"] = "c";
                    hash["WMAC5"] = "c";
                    hash["WMACOV"] = "c";
                    hash["WMBC1"] = "c";
                    hash["WMBCOV"] = "c";
                    hash["WMCCOV"] = "c";
                    hash["WMC1"] = "c";
                    hash["WMC2"] = "c";
                    hash["WMC3"] = "c";
                    hash["WMC4"] = "c";
                    hash["WMCOV"] = "c";
                    hash["HWMH1"] = "h";
                    hash["HWMH2"] = "h";
                    hash["HWMH3"] = "h";
                    hash["HWMH4"] = "h";
                    hash["HWMC1"] = "c";
                    hash["HWMC2"] = "c";
                    hash["HWMC3"] = "c";
                    hash["HWMC4"] = "c";
                    hash["RWMH1"] = "h";
                    hash["RWMH2"] = "h";
                    hash["RWMH3"] = "h";
                    hash["RWMH4"] = "h";
                    hash["RWMHOV"] = "h";
                    hash["RWMAH1"] = "h";
                    hash["RWMAH2"] = "h";
                    hash["RWMAH3"] = "h";
                    hash["RWMAH4"] = "h";
                    hash["RWMAH5"] = "h";
                    hash["RWMAHOV"] = "h";
                    hash["RWMBH1"] = "h";
                    hash["RWMBHOV"] = "h";
                    hash["RWMCHOV"] = "h";
                    hash["RWMAC1"] = "c";
                    hash["RWMAC2"] = "c";
                    hash["RWMAC3"] = "c";
                    hash["RWMAC4"] = "c";
                    hash["RWMAC5"] = "c";
                    hash["RWMACOV"] = "c";
                    hash["RWMBC1"] = "c";
                    hash["RWMBCOV"] = "c";
                    hash["RWMCCOV"] = "c";
                    hash["RWMC1"] = "c";
                    hash["RWMC2"] = "c";
                    hash["RWMC3"] = "c";
                    hash["RWMC4"] = "c";
                    hash["RWMCOV"] = "c";
                    hash["HRWMH1"] = "h";
                    hash["HRWMH2"] = "h";
                    hash["HRWMH3"] = "h";
                    hash["HRWMH4"] = "h";
                    hash["HRWMC1"] = "c";
                    hash["HRWMC2"] = "c";
                    hash["HRWMC3"] = "c";
                    hash["HRWMC4"] = "c";
                    return hash[_rtype]
                }
                ;
                _self.util_wtypeConverToR = function(wtype, isLower) {
                    wtype = wtype.toUpperCase();
                    var hash = new Object;
                    hash["RM"] = "M";
                    hash["RE"] = "R";
                    hash["ROU"] = "OU";
                    hash["REO"] = "EO";
                    hash["RPD3"] = "PD3";
                    hash["RPD5"] = "PD5";
                    hash["RPD7"] = "PD7";
                    hash["ROUH"] = "OUH";
                    hash["ROUC"] = "OUC";
                    hash["PR"] = "R";
                    hash["POU"] = "OU";
                    hash["PEO"] = "EO";
                    var ret = hash[wtype] != null ? hash[wtype] : wtype;
                    return isLower ? ret.toLowerCase() : ret.toUpperCase()
                }
                ;
                _self.switchConRtype = function(rtype, isOutside, gtype) {
                    rtype = rtype.toLowerCase();
                    var _gtype = gtype ? gtype : top.choice_gtype;
                    var hash = new Object;
                    if (isOutside == "Y" || _gtype != "ft") {
                        hash["ouc"] = "ratio_ouo";
                        hash["ouh"] = "ratio_ouu";
                        hash["houc"] = "ratio_houo";
                        hash["houh"] = "ratio_houu";
                        hash["rh"] = "ratio_r";
                        hash["rc"] = "ratio_r";
                        hash["prh"] = "ratio_r";
                        hash["prc"] = "ratio_r";
                        hash["pouc"] = "ratio_ouo";
                        hash["pouh"] = "ratio_ouu";
                        hash["hrh"] = "ratio_hr";
                        hash["hrc"] = "ratio_hr";
                        hash["hprh"] = "ratio_hr";
                        hash["hprc"] = "ratio_hr";
                        hash["hpouc"] = "ratio_houo";
                        hash["hpouh"] = "ratio_houu"
                    } else {
                        hash["ouc"] = "ratio_o";
                        hash["ouh"] = "ratio_u";
                        hash["houc"] = "ratio_ho";
                        hash["houh"] = "ratio_hu";
                        hash["rh"] = "ratio";
                        hash["rc"] = "ratio";
                        hash["prh"] = "ratio";
                        hash["prc"] = "ratio";
                        hash["pouc"] = "ratio_o";
                        hash["pouh"] = "ratio_u";
                        hash["hrh"] = "hratio";
                        hash["hrc"] = "hratio";
                        hash["hprh"] = "hratio";
                        hash["hprc"] = "hratio";
                        hash["hpouc"] = "ratio_ho";
                        hash["hpouh"] = "ratio_hu"
                    }
                    hash["rouc"] = "ratio_rouo";
                    hash["rouh"] = "ratio_rouu";
                    hash["hrouc"] = "ratio_hrouo";
                    hash["hrouh"] = "ratio_hrouu";
                    hash["reh"] = "ratio_re";
                    hash["rec"] = "ratio_re";
                    hash["hreh"] = "ratio_hre";
                    hash["hrec"] = "ratio_hre";
                    hash["arh"] = "ratio_ar";
                    hash["arc"] = "ratio_ar";
                    hash["brh"] = "ratio_br";
                    hash["brc"] = "ratio_br";
                    hash["crh"] = "ratio_cr";
                    hash["crc"] = "ratio_cr";
                    hash["drh"] = "ratio_dr";
                    hash["drc"] = "ratio_dr";
                    hash["erh"] = "ratio_er";
                    hash["erc"] = "ratio_er";
                    hash["frh"] = "ratio_fr";
                    hash["frc"] = "ratio_fr";
                    hash["aouo"] = "ratio_aouo";
                    hash["aouu"] = "ratio_aouu";
                    hash["bouo"] = "ratio_bouo";
                    hash["bouu"] = "ratio_bouu";
                    hash["couo"] = "ratio_couo";
                    hash["couu"] = "ratio_couu";
                    hash["douo"] = "ratio_douo";
                    hash["douu"] = "ratio_douu";
                    hash["eouo"] = "ratio_eouo";
                    hash["eouu"] = "ratio_eouu";
                    hash["fouo"] = "ratio_fouo";
                    hash["fouu"] = "ratio_fouu";
                    hash["parh"] = "ratio_ar";
                    hash["parc"] = "ratio_ar";
                    hash["pbrh"] = "ratio_br";
                    hash["pbrc"] = "ratio_br";
                    hash["pcrh"] = "ratio_cr";
                    hash["pcrc"] = "ratio_cr";
                    hash["pdrh"] = "ratio_dr";
                    hash["pdrc"] = "ratio_dr";
                    hash["perh"] = "ratio_er";
                    hash["perc"] = "ratio_er";
                    hash["pfrh"] = "ratio_fr";
                    hash["pfrc"] = "ratio_fr";
                    hash["paouo"] = "ratio_aouo";
                    hash["paouu"] = "ratio_aouu";
                    hash["pbouo"] = "ratio_bouo";
                    hash["pbouu"] = "ratio_bouu";
                    hash["pcouo"] = "ratio_couo";
                    hash["pcouu"] = "ratio_couu";
                    hash["pdouo"] = "ratio_douo";
                    hash["pdouu"] = "ratio_douu";
                    hash["peouo"] = "ratio_eouo";
                    hash["peouu"] = "ratio_eouu";
                    hash["pfouo"] = "ratio_fouo";
                    hash["pfouu"] = "ratio_fouu";
                    hash["rouho"] = "ratio_rouho";
                    hash["rouhu"] = "ratio_rouhu";
                    hash["rouco"] = "ratio_rouco";
                    hash["roucu"] = "ratio_roucu";
                    hash["hruho"] = "ratio_hruho";
                    hash["hruhu"] = "ratio_hruhu";
                    hash["hruco"] = "ratio_hruco";
                    hash["hrucu"] = "ratio_hrucu";
                    hash["ouho"] = "ratio_ouho";
                    hash["ouhu"] = "ratio_ouhu";
                    hash["ouco"] = "ratio_ouco";
                    hash["oucu"] = "ratio_oucu";
                    hash["houho"] = "ratio_houho";
                    hash["houhu"] = "ratio_houhu";
                    hash["houco"] = "ratio_houco";
                    hash["houcu"] = "ratio_houcu";
                    hash["w3h"] = "ratio_w3h";
                    hash["w3c"] = "ratio_w3c";
                    hash["w3n"] = "ratio_w3n";
                    hash["areh"] = "ratio_are";
                    hash["arec"] = "ratio_are";
                    hash["breh"] = "ratio_bre";
                    hash["brec"] = "ratio_bre";
                    hash["creh"] = "ratio_cre";
                    hash["crec"] = "ratio_cre";
                    hash["dreh"] = "ratio_dre";
                    hash["drec"] = "ratio_dre";
                    hash["ereh"] = "ratio_ere";
                    hash["erec"] = "ratio_ere";
                    hash["freh"] = "ratio_fre";
                    hash["frec"] = "ratio_fre";
                    hash["arouo"] = "ratio_arouo";
                    hash["arouu"] = "ratio_arouu";
                    hash["brouo"] = "ratio_brouo";
                    hash["brouu"] = "ratio_brouu";
                    hash["crouo"] = "ratio_crouo";
                    hash["crouu"] = "ratio_crouu";
                    hash["drouo"] = "ratio_drouo";
                    hash["drouu"] = "ratio_drouu";
                    hash["erouo"] = "ratio_erouo";
                    hash["erouu"] = "ratio_erouu";
                    hash["frouo"] = "ratio_frouo";
                    hash["frouu"] = "ratio_frouu";
                    hash["pouho"] = "ratio_ouho";
                    hash["pouhu"] = "ratio_ouhu";
                    hash["pouco"] = "ratio_ouco";
                    hash["poucu"] = "ratio_oucu";
                    hash["hpouho"] = "ratio_houho";
                    hash["hpouhu"] = "ratio_houhu";
                    hash["hpouco"] = "ratio_houco";
                    hash["hpoucu"] = "ratio_houcu";
                    hash["taruo"] = "ratio_taruo";
                    hash["taruu"] = "ratio_taruu";
                    hash["tbruo"] = "ratio_tbruo";
                    hash["tbruu"] = "ratio_tbruu";
                    hash["tdruo"] = "ratio_tdruo";
                    hash["tdruu"] = "ratio_tdruu";
                    hash["teruo"] = "ratio_teruo";
                    hash["teruu"] = "ratio_teruu";
                    hash["prouc"] = "ratio_rouo";
                    hash["prouh"] = "ratio_rouu";
                    hash["hprouc"] = "ratio_hrouo";
                    hash["hprouh"] = "ratio_hrouu";
                    hash["preh"] = "ratio_re";
                    hash["prec"] = "ratio_re";
                    hash["hpreh"] = "ratio_hre";
                    hash["hprec"] = "ratio_hre";
                    hash["pareh"] = "ratio_are";
                    hash["parec"] = "ratio_are";
                    hash["pbreh"] = "ratio_bre";
                    hash["pbrec"] = "ratio_bre";
                    hash["pcreh"] = "ratio_cre";
                    hash["pcrec"] = "ratio_cre";
                    hash["pdreh"] = "ratio_dre";
                    hash["pdrec"] = "ratio_dre";
                    hash["pereh"] = "ratio_ere";
                    hash["perec"] = "ratio_ere";
                    hash["pfreh"] = "ratio_fre";
                    hash["pfrec"] = "ratio_fre";
                    hash["parouo"] = "ratio_arouo";
                    hash["parouu"] = "ratio_arouu";
                    hash["pbrouo"] = "ratio_brouo";
                    hash["pbrouu"] = "ratio_brouu";
                    hash["pcrouo"] = "ratio_crouo";
                    hash["pcrouu"] = "ratio_crouu";
                    hash["pdrouo"] = "ratio_drouo";
                    hash["pdrouu"] = "ratio_drouu";
                    hash["perouo"] = "ratio_erouo";
                    hash["perouu"] = "ratio_erouu";
                    hash["pfrouo"] = "ratio_frouo";
                    hash["pfrouu"] = "ratio_frouu";
                    hash["prouho"] = "ratio_rouho";
                    hash["prouhu"] = "ratio_rouhu";
                    hash["prouco"] = "ratio_rouco";
                    hash["proucu"] = "ratio_roucu";
                    hash["hpruho"] = "ratio_hruho";
                    hash["hpruhu"] = "ratio_hruhu";
                    hash["hpruco"] = "ratio_hruco";
                    hash["hprucu"] = "ratio_hrucu";
                    hash["ptaruo"] = "ratio_taruo";
                    hash["ptaruu"] = "ratio_taruu";
                    hash["ptbruo"] = "ratio_tbruo";
                    hash["ptbruu"] = "ratio_tbruu";
                    hash["ptdruo"] = "ratio_tdruo";
                    hash["ptdruu"] = "ratio_tdruu";
                    hash["pteruo"] = "ratio_teruo";
                    hash["pteruu"] = "ratio_teruu";
                    return hash[rtype] != null ? hash[rtype] : rtype
                }
                ;
                _self.checkWtypeisSP = function(wtype) {
                    var ary = new Array("PG","OS","ST","CN","CD","RC","YC","GA");
                    return _self.in_array(wtype, ary)
                }
                ;
                _self.switchBetRtype = function(hash) {
                    var rtype = hash["show_rtype"];
                    hash["rtype"] = hash["show_rtype"];
                    var ary = new Array("TS","RTS","OG","OT","HTS","ROT","RTS2","RWM","WM","RDC","DC","RWE","WE","RWB","WB","RTS","TS","CS","RCS","WN","RWN","PA","RCD","T1G","RT1G","T3G","RT3G","FG","BH","F2G","F3G","SB","RSB","TK");
                    if (rtype.match(/^EOO$/g) || rtype.match(/^REOO$/g) || rtype.match(/^PEOO$/g)) {
                        tmp_w = _self.checkBetRtype(rtype.substr(0, 1));
                        hash["rtype"] = tmp_w + "ODD";
                        hash["chose_team"] = hash["rtype"];
                        hash["wtype"] = tmp_w + "T"
                    } else if (rtype.match(/^EOE$/g) || rtype.match(/^REOE$/g) || rtype.match(/^PEOE$/g)) {
                        tmp_w = _self.checkBetRtype(rtype.substr(0, 1));
                        hash["rtype"] = tmp_w + "EVEN";
                        hash["chose_team"] = hash["rtype"];
                        hash["wtype"] = tmp_w + "T"
                    } else if (rtype.match(/^HEOO$/g)) {
                        hash["rtype"] = "HODD";
                        hash["chose_team"] = hash["rtype"];
                        hash["wtype"] = "HT"
                    } else if (rtype.match(/^HEOE$/g)) {
                        hash["rtype"] = "HEVEN";
                        hash["chose_team"] = hash["rtype"];
                        hash["wtype"] = "HT"
                    } else if (rtype.match(/^HREOO$/g)) {
                        hash["rtype"] = "HRODD";
                        hash["chose_team"] = hash["rtype"];
                        hash["wtype"] = "HRT"
                    } else if (rtype.match(/^HREOE$/g)) {
                        hash["rtype"] = "HREVEN";
                        hash["chose_team"] = hash["rtype"];
                        hash["wtype"] = "HRT"
                    } else if (rtype.match(/^[H]?EO[HC][OE]$/g)) {
                        hash["rtype"] = rtype;
                        hash["chose_team"] = hash["rtype"];
                        hash["wtype"] = rtype.substr(0, rtype.length - 1)
                    } else if (rtype.match(/^H[1-2]?[0-9]C[1-2]?[0-9]$/g) || rtype.match(/^RH[1-2]?[0-9]C[1-2]?[0-9]$/g) || rtype.match(/^PH[1-2]?[0-9]C[1-2]?[0-9]$/g)) {
                        tmp_w = _self.checkBetRtype(rtype.substr(0, 1));
                        hash["con"] = rtype.replace("H", "").replace("C", ":");
                        hash["ratio"] = hash["con"];
                        hash["chose_team"] = hash["rtype"];
                        hash["wtype"] = tmp_w + "PD"
                    } else if (rtype.match(/^OVH$/g) || rtype.match(/^ROVH$/g) || rtype.match(/^POVH$/g)) {
                        tmp_w = _self.checkBetRtype(rtype.substr(0, 1));
                        hash["con"] = "OV5";
                        hash["ratio"] = hash["con"];
                        hash["chose_team"] = hash["rtype"];
                        hash["wtype"] = tmp_w + "PD"
                    } else if (rtype.match(/^HH[0-1]?[0-9]C[1-2]?[0-9]$/g) || rtype.match(/^HRH[0-1]?[0-9]C[1-2]?[0-9]$/g) || rtype.match(/^HPH[0-1]?[0-9]C[1-2]?[0-9]$/g)) {
                        tmp_w = _self.checkBetRtype(rtype.substr(1, 1));
                        hash["con"] = rtype.replace(/H/g, "").replace("C", ":");
                        hash["ratio"] = hash["con"];
                        hash["rtype"] = hash["rtype"].substr(1, hash["rtype"].length - 1);
                        hash["chose_team"] = hash["rtype"];
                        hash["wtype"] = "H" + tmp_w + "PD"
                    } else if (rtype.match(/^HOVH$/g) || rtype.match(/^HROVH$/g) || rtype.match(/^HPOVH$/g)) {
                        tmp_w = _self.checkBetRtype(rtype.substr(1, 1));
                        hash["con"] = "OV5";
                        hash["ratio"] = hash["con"];
                        hash["rtype"] = tmp_w + "OVH";
                        hash["chose_team"] = hash["rtype"];
                        hash["wtype"] = "H" + tmp_w + "PD"
                    } else if (rtype.match(/^T[0-4][1-6]$/g) || rtype.match(/^RT[0-4][1-6]$/g)) {
                        tmp_w = _self.checkBetRtype(rtype.substr(0, 1));
                        tmp_r = rtype.substr(rtype.length - 2, 2);
                        var tmp = tmp_r.split("");
                        hash["rtype"] = tmp_w + tmp.join("~");
                        hash["chose_team"] = hash["rtype"];
                        hash["wtype"] = tmp_w + "T"
                    } else if (rtype.match(/^HT[0-2]$/g) || rtype.match(/^HRT[0-2]$/g)) {
                        hash["rtype"] = rtype;
                        hash["chose_team"] = hash["rtype"];
                        hash["wtype"] = rtype.substring(0, rtype.length - 1)
                    } else if (rtype.match(/^OVER$/g) || rtype.match(/^ROVER$/g)) {
                        tmp_w = _self.checkBetRtype(rtype.substr(0, 1));
                        hash["wtype"] = tmp_w + "T";
                        hash["rtype"] = hash["rtype"];
                        hash["chose_team"] = hash["rtype"]
                    } else if (rtype.match(/^HTOV$/g) || rtype.match(/^HRTOV$/g)) {
                        hash["rtype"] = hash["rtype"];
                        hash["chose_team"] = hash["rtype"];
                        hash["wtype"] = rtype.substring(0, rtype.length - 2)
                    } else if (rtype.match(/^F(H|N|C)(H|N|C)$/g) || rtype.match(/^RF(H|N|C)(H|N|C)$/g) || rtype.match(/^PF(H|N|C)(H|N|C)$/g)) {
                        tmp_w = _self.checkBetRtype(rtype.substr(0, 1));
                        hash["con"] = rtype;
                        hash["ratio"] = hash["con"];
                        hash["wtype"] = tmp_w + "F";
                        hash["chose_team"] = hash["rtype"]
                    } else if (rtype.match(/^(P|O|S|C|R|Y|G)(G|S|T|N|D|C|A)(F|L)(H|N|C)$/g)) {
                        hash["ratio"] = hash["con"];
                        hash["wtype"] = "SP";
                        hash["chose_team"] = hash["rtype"]
                    } else if (_self.in_array(hash["keepwtype"], ary)) {
                        hash["wtype"] = hash["keepwtype"];
                        hash["chose_team"] = rtype
                    } else if (rtype.match(/^RPD3[0-2][0-2]$/g) || rtype.match(/^PD3[0-2][0-2]$/g)) {
                        hash["con"] = rtype.substr(rtype.length - 2, 1) + ":" + rtype.substr(rtype.length - 1, 1);
                        hash["ratio"] = hash["con"];
                        hash["chose_team"] = hash["rtype"];
                        hash["wtype"] = rtype.substr(0, rtype.length - 2)
                    } else if (rtype.match(/^RPD5[0-3][0-3]$/g) || rtype.match(/^PD5[0-3][0-3]$/g)) {
                        tmp_w = _self.checkBetRtype(rtype.substr(0, 1));
                        hash["con"] = rtype.substr(rtype.length - 2, 1) + ":" + rtype.substr(rtype.length - 1, 1);
                        hash["ratio"] = hash["con"];
                        hash["chose_team"] = hash["rtype"];
                        hash["wtype"] = rtype.substr(0, rtype.length - 2)
                    } else if (rtype.match(/^RPD7[0-4][0-4]$/g) || rtype.match(/^PD7[0-4][0-4]$/g)) {
                        tmp_w = _self.checkBetRtype(rtype.substr(0, 1));
                        hash["con"] = rtype.substr(rtype.length - 2, 1) + ":" + rtype.substr(rtype.length - 1, 1);
                        hash["ratio"] = hash["con"];
                        hash["chose_team"] = hash["rtype"];
                        hash["wtype"] = rtype.substr(0, rtype.length - 2)
                    } else if (rtype.match(/^RPD(H|C)[0-4]$/g) || rtype.match(/^PD(H|C)[0-4]$/g)) {
                        hash["chose_team"] = hash["rtype"];
                        hash["wtype"] = hash["keepwtype"]
                    } else if (rtype.match(/^R?F[0-3][0-9][HC]$/g)) {
                        hash["con"] = rtype;
                        hash["ratio"] = hash["con"];
                        hash["chose_team"] = hash["rtype"]
                    }
                    return hash
                }
                ;
                _self.checkBetRtype = function(type) {
                    var _ary = new Array("R","P");
                    return _self.in_array(type, _ary) ? type : ""
                }
                ;
                _self.chgTwtype = function(wtype, rtype) {
                    var tmp_wtype = wtype.toUpperCase();
                    var tmp_rtype = rtype.toUpperCase();
                    if (tmp_wtype == "T") {
                        var _ary = Array("PEOO", "PEOE", "HPEOO", "HPEOE", "PEOH", "PEOC", "HPEOH", "HPEOC", "PODD", "PEVEN", "PO", "PE");
                        var _ary2 = Array("EOO", "EOE", "HEOO", "HEOE", "EOH", "EOC", "HEOH", "HEOC", "ODD", "RODD", "EVEN", "REVEN");
                        if (_self.in_array(tmp_rtype, _ary))
                            tmp_wtype = "PEO";
                        else if (_self.in_array(tmp_rtype, _ary2))
                            tmp_wtype = "EO"
                    } else if (tmp_wtype == "HT") {
                        _ary = Array("HPEVEN", "HPODD", "HPEOO", "HPEOE", "HPO", "HPE");
                        _ary2 = Array("HEVEN", "HODD", "HEOO", "HEOE");
                        if (_self.in_array(tmp_rtype, _ary))
                            tmp_wtype = "HPEO";
                        else if (_self.in_array(tmp_rtype, _ary2))
                            tmp_wtype = "HEO"
                    } else if (tmp_wtype == "RT") {
                        _ary = Array("REVEN", "RODD", "REOO", "REOE");
                        if (_self.in_array(tmp_rtype, _ary))
                            tmp_wtype = "REO"
                    } else if (tmp_wtype == "HRT") {
                        _ary = Array("HREVEN", "HRODD", "HREOO", "HREOE");
                        if (_self.in_array(tmp_rtype, _ary))
                            tmp_wtype = "HREO"
                    }
                    return tmp_wtype
                }
                ;
                _self.isChgIor = function(errorCode) {
                    var ary = new Array("1X006","1X016");
                    return _self.in_array(errorCode, ary)
                }
                ;
                _self.isChgConcede = function(errorCode) {
                    var ary = new Array("1X005","1X015");
                    return _self.in_array(errorCode, ary)
                }
                ;
                _self.isSpecCode = function(errorCode) {
                    var ary = new Array("1X013","betError000");
                    return _self.in_array(errorCode, ary)
                }
                ;
                _self.getConcedeStr = function(wtype, strong, ratio) {
                    var obj = new Object;
                    if (_self.checkWtypeIsR(wtype) && wtype != "W3")
                        if (strong == "H") {
                            obj["bet_finish_con"] = _self.showTxt(_self.getConcede(ratio, null));
                            obj["bet_finish_con_c"] = ""
                        } else {
                            obj["bet_finish_con"] = "";
                            obj["bet_finish_con_c"] = _self.showTxt(_self.getConcede(ratio, null))
                        }
                    else {
                        obj["bet_finish_con"] = "";
                        obj["bet_finish_con_c"] = ""
                    }
                    return obj
                }
                ;
                _self.getIoratio = function(ior, sw, chgWtype) {
                    var ret = "";
                    var str = "";
                    if ("" + ior == "undefined")
                        return ret;
                    if ("" + sw == "N")
                        return ret;
                    if (ior * 1 == 0)
                        return ret;
                    if (("" + ior).indexOf("Infinity") != -1)
                        return ret;
                    if (isNaN("" + ior))
                        return ret;
                    str = ratioChg.chgRatio(ior, chgWtype);
                    return str
                }
                ;
                _self.getOrderIoratio = function(ior, sw, chgWtype) {
                    var ret = "-";
                    var str = "";
                    if ("" + ior == "undefined")
                        return ret;
                    if ("" + sw == "N")
                        return ret;
                    if (ior * 1 == 0)
                        return ret;
                    if (("" + ior).indexOf("Infinity") != -1)
                        return ret;
                    str = ratioChg.chgRatio(ior, chgWtype);
                    return str
                }
                ;
                _self.checkIorClass = function(ior) {
                    return ior * 1 > 0 || ior == "-" ? "word_red" : "word_blue"
                }
                ;
                _self.checkIoratio = function(ior) {
                    var ret = false;
                    if ("" + ior == "undefined")
                        return ret;
                    if (ior * 1 == 0)
                        return ret;
                    return true
                }
                ;
                _self.getConcede = function(ratio, sw) {
                    var ret = "-";
                    var str = "";
                    if ("" + ratio == "undefined")
                        return ret;
                    if ("" + sw == "N")
                        return ret;
                    str = ratio;
                    return str
                }
                ;
                _self.calcWindGold = function(gold, ior, wtype, gtype) {
                    if ((_self.checkWtypeIsR(wtype) || _self.checkWtypeIsOU(wtype) || _self.checkWtypeIsDouble2016(wtype)) && !_self.checkWtypeIsEO(wtype) && top["userData"].odd_f_type != "E" && !(_self.checkWtypeIsOT(wtype) && gtype == "BS"))
                        if (ior < 0 || wtype == "W3")
                            return _self.calcWinGoldDT(gold, ior);
                        else
                            return _self.util_formatNumber(gold * ior * 1);
                    else if (wtype == "P3" || wtype == "RP3")
                        return _self.calcWinGoldP(gold, ior);
                    else
                        return _self.calcWinGoldDT(gold, ior)
                }
                ;
                _self.calcWinGoldP = function(gold, ior) {
                    var total = gold * ior - gold;
                    return _self.util_formatNumber(total)
                }
                ;
                _self.calcWinGoldDT = function(gold, ior) {
                    if (ior * 1 > 1)
                        return _self.util_formatNumber(gold * (ior * 1 - 1));
                    if (ior * 1 < 0)
                        return _self.util_formatNumber(gold * 1);
                    else
                        return _self.util_formatNumber(gold * ior * 1)
                }
                ;
                _self.util_formatNumber = function(num) {
                    return _self.formatNumber(num, 2, true)
                }
                ;
                _self.formatNumber = function(num, b, add) {
                    var point = b;
                    var t = 1;
                    for (; b > 0; t *= 10,
                    b--)
                        ;
                    if (num * 1 >= 0)
                        if (add)
                            return _self.addZero(Math.round(num * t + 1 / t) / t, point);
                        else
                            return Math.round(num * t + 1 / t) / t;
                    else if (add)
                        return _self.addZero(Math.round(num * t - 1 / t) / t, point);
                    else
                        return Math.round(num * t + 1 / t) / t
                }
                ;
                _self.addZero = function(code, b) {
                    code += "";
                    var str = "";
                    var index = code.indexOf(".");
                    if (index == -1) {
                        code += ".";
                        index = code.length - 1
                    }
                    var r = b * 1 - (code.length - index - 1);
                    for (i = 0; i < r; i++)
                        str += "0";
                    str = code + str;
                    return str
                }
                ;
                _self.checkFormat = function(num) {
                    return ""
                }
                ;
                _self.getTimestamp = function() {
                    return (new Date).getTime()
                }
                ;
                _self.changeRtypetoWtypeSP = function(rtype) {
                    var ary = new Array("PG","OS","ST","CN","CD","RC","YC","GA");
                    for (var i = 0; i < ary.length; i++)
                        if (rtype.indexOf(ary[i]) != -1)
                            return ary[i]
                }
                ;
                _self.switchTeamName = function(wtype, rtype) {
                    var rtypeHash = new Object;
                    rtypeHash["T_EVEN"] = "eoe";
                    rtypeHash["T_ODD"] = "eoo";
                    rtypeHash["HT_HEVEN"] = "heoe";
                    rtypeHash["HT_HODD"] = "heoo";
                    rtypeHash["RT_REVEN"] = "reoe";
                    rtypeHash["RT_RODD"] = "reoo";
                    rtypeHash["HRT_HREVEN"] = "hreoe";
                    rtypeHash["HRT_HRODD"] = "hreoo";
                    rtypeHash["T_0~1"] = "t01";
                    rtypeHash["T_2~3"] = "t23";
                    rtypeHash["T_4~6"] = "t46";
                    rtypeHash["RT_R0~1"] = "rt01";
                    rtypeHash["RT_R2~3"] = "rt23";
                    rtypeHash["RT_R4~6"] = "rt46";
                    return rtypeHash[wtype.toUpperCase() + "_" + rtype.toUpperCase()]
                }
                ;
                _self.getTicketType = function(wtype) {
                    var DT_ary = new Array("FS","PD","RPD","HPD","HRPD","PD3","PD5","PD7","RPD3","RPD5","RPD7","SP","T","RT","HT","HRT","RDT","F","RF");
                    var P_ary = new Array("P3","PR");
                    if (_self.in_array(wtype, DT_ary))
                        return "DT";
                    else if (_self.in_array(wtype, P_ary))
                        return wtype;
                    else if (wtype == "RP3")
                        return "P3";
                    else
                        return "OU"
                }
                ;
                _self.switchTypeToParlay = function(_wtype, _rtype) {
                    var hash = new Object;
                    var tmpRtype = "";
                    hash["R"] = "PR";
                    hash["OU"] = "POU";
                    hash["HR"] = "HPR";
                    hash["HOU"] = "HPOU";
                    hash["EO"] = "PEO";
                    hash["HEO"] = "HPEO";
                    hash["OUH"] = "POUH";
                    hash["OUC"] = "POUC";
                    hash["HOUH"] = "HPOUH";
                    hash["HOUC"] = "HPOUC";
                    hash["AR"] = "PAR";
                    hash["BR"] = "PBR";
                    hash["CR"] = "PCR";
                    hash["DR"] = "PDR";
                    hash["ER"] = "PER";
                    hash["FR"] = "PFR";
                    hash["AOU"] = "PAOU";
                    hash["BOU"] = "PBOU";
                    hash["COU"] = "PCOU";
                    hash["DOU"] = "PDOU";
                    hash["EOU"] = "PEOU";
                    hash["FOU"] = "PFOU";
                    hash["PDH"] = "PDH";
                    hash["PDC"] = "PDC";
                    hash["RE"] = "PRE";
                    hash["ROU"] = "PROU";
                    hash["HRE"] = "HPRE";
                    hash["HROU"] = "HPROU";
                    hash["REO"] = "PREO";
                    hash["HREO"] = "HPREO";
                    hash["ROUH"] = "PROUH";
                    hash["ROUC"] = "PROUC";
                    hash["HROUH"] = "HPROUH";
                    hash["HROUC"] = "HPROUC";
                    hash["HRUH"] = "HPRUH";
                    hash["HRUC"] = "HPRUC";
                    hash["ARE"] = "PARE";
                    hash["BRE"] = "PBRE";
                    hash["CRE"] = "PCRE";
                    hash["DRE"] = "PDRE";
                    hash["ERE"] = "PERE";
                    hash["FRE"] = "PFRE";
                    hash["AROU"] = "PAROU";
                    hash["BROU"] = "PBROU";
                    hash["CROU"] = "PCROU";
                    hash["DROU"] = "PDROU";
                    hash["EROU"] = "PEROU";
                    hash["FROU"] = "PFROU";
                    hash["TARU"] = "PTARU";
                    hash["TBRU"] = "PTBRU";
                    hash["TDRU"] = "PTDRU";
                    hash["TERU"] = "PTERU";
                    hash["RT01"] = "R0~1";
                    hash["RT23"] = "R2~3";
                    hash["RT46"] = "R4~6";
                    hash["T01"] = "0~1";
                    hash["T23"] = "2~3";
                    hash["T46"] = "4~6";
                    tmpRtype = _rtype;
                    if (hash[_wtype] != null)
                        tmpRtype = tmpRtype.replace(_wtype, hash[_wtype]);
                    if (hash[_rtype] != null)
                        tmpRtype = hash[_rtype];
                    return tmpRtype
                }
                ;
                _self.switchBetRtypeP = function(_str) {
                    var rtype = _str.toUpperCase;
                    rtype = rtype.replace(/PEOE/g, "PE");
                    rtype = rtype.replace(/PEOO/g, "PO");
                    rtype = rtype.replace(/T01/g, "0~1");
                    rtype = rtype.replace(/T23/g, "2~3");
                    rtype = rtype.replace(/T46/g, "4~6");
                    return rtype
                }
                ;
                _self.isRBWtype = function(wtype) {
                    var wtype = _self.filterP(wtype, true);
                    var wtypeRB = new Array("RE","ROU","HRE","HROU","RM","HRM","ARE","BRE","CRE","DRE","ERE","FRE","AROU","BROU","CROU","DROU","EROU","FROU","ARM","BRM","CRM","DRM","ERM","FRM","ROUH","ROUC","HRUH","HRUC","RPD","RPD3","RPD5","RPD7","HRPD","RDT","RT","HRT","REO","HREO","RF","RHG","RMG","ARG","BRG","CRG","DRG","ERG","FRG","GRG","HRG","IRG","JRG","RWM","RDC","RCS","RWN","RTS","RWB","RWE","RSB","RT1G","RT3G","RMUA","RMUB","RMUC","RMUD","RMPG","RMTS","RDUA","RDUB","RDUC","RDUD","RDG","RDS","RUEA","RUEB","RUEC","RUED","RUPA","RUPB","RUPC","RUPD","RUTA","RUTB","RUTC","RUTD","ROT","RTS","RTS2","RNC1","RNC2","RNC3","RNC4","RNC5","RNC6","RNC7","RNC8","RNC9","RNCA","RNCB","RNCC","RNCD","RNCE","RNCF","RNCG","RNCH","RNCI","RNCJ","RNCK","RNCL","RNCM","RNCN","RNCO","RNCP","RNCQ","RNCR","RNCS","RNCT","RNCU","RNBA","RNBB","RNBC","RNBD","RNBE","RNBF","RNBG","RNBH","RNBI","RNBJ","RNBK","RNBL","RNBM","RNBN","RNBO","RSHA","RSHB","RSHC","RSHD","RSHE","RSHF","RSHG","RSHH","RSHI","RSHJ","RSHK","RSHL","RSHM","RSHN","RSHO","RSCA","RSCB","RSCC","RSCD","RSCE","RSCF","RSCG","RSCH","RSCI","RSCJ","RSCK","RSCL","RSCM","RSCN","RSCO","HRWM","RF01","RF02","RF03","RF04","RF05","RF06","RF07","RF08","RF09","RF10","RF11","RF12","RF13","RF14","RF15","RF16","RF17","RF18","RF19","RF20","RF21","RF22","RF23","RF24","RF25","RF26","RF27","RF28","RF29","RF30","RF31","RF32","RF33","RF34","RF35","RFA01","RFA02","RFA03","RFA04","RFA05","RFA06","RFA07","RFA08","RFA09","RFA10","RFB01","RFB02","RFB03","RFB04","RFB05","RFB06","RFB07","RFB08","RFB09","RFB10","RFC01","RFC02","RFC03","RFC04","RFC05","RFC06","RFC07","RFC08","RFC09","RFC10","RFD01","RFD02","RFD03","RFD04","RFD05","RFD06","RFD07","RFD08","RFD09","RFD10","RFE01","RFE02","RFE03","RFE04","RFE05","RFE06","RFE07","RFE08","RFE09","RFE10","TARU","TBRU","TDRU","TERU","RPS","RTW","RPF","RPXA","RPXB","RPXC","RPXD","RPXE","RPXF","RPXG","RPXH","RPXI","RPXJ","RPXK","RPXL","RPXM","RPXN","RPXO","RPTWA01","RPTWA02","RPTWA03","RPTWA04","RPTWA05","RPTWA06","RPTWA07","RPTWA08","RPTWA09","RPTWA10","RPTWA11","RPTWA12","RPTWA13","RPTWA14","RPTWA15","RPTWA16","RPTWA17","RPTWA18","RPTWA19","RPTWA20","RPTWA21","RPTWA22","RPTWA23","RPTWA24","RPTWA25","RPTWA26","RPTWA27","RPTWA28","RPTWA29","RPTWA30","RPTWA31","RPTWA32","RPTWA33","RPTWA34","RPTWA35","RPTWA36","RPTWA37","RPTWA38","RPTWA39","RPTWA40","RPTWA41","RPTWA42","RPTWA43","RPTWA44","RPTWA45","RPTWA46","RPTWA47","RPTWA48","RPTWA49","RPTWA50","RPTWA51","RPTWA52","RPTWA53","RPTWA54","RPTWA55","RPTWA56","RPTWA57","RPTWA58","RPTWA59","RPTWB01","RPTWB02","RPTWB03","RPTWB04","RPTWB05","RPTWB06","RPTWB07","RPTWB08","RPTWB09","RPTWB10","RPTWB11","RPTWB12","RPTWB13","RPTWB14","RPTWB15","RPTWB16","RPTWB17","RPTWB18","RPTWB19","RPTWB20","RPTWB21","RPTWB22","RPTWB23","RPTWB24","RPTWB25","RPTWB26","RPTWB27","RPTWB28","RPTWB29","RPTWB30","RPTWB31","RPTWB32","RPTWB33","RPTWB34","RPTWB35","RPTWB36","RPTWB37","RPTWB38","RPTWB39","RPTWB40","RPTWB41","RPTWB42","RPTWB43","RPTWB44","RPTWB45","RPTWB46","RPTWB47","RPTWB48","RPTWB49","RPTWB50","RPTWB51","RPTWB52","RPTWB53","RPTWB54","RPTWB55","RPTWB56","RPTWB57","RPTWB58","RPTWB59","RPTWC01","RPTWC02","RPTWC03","RPTWC04","RPTWC05","RPTWC06","RPTWC07","RPTWC08","RPTWC09","RPTWC10","RPTWC11","RPTWC12","RPTWC13","RPTWC14","RPTWC15","RPTWC16","RPTWC17","RPTWC18","RPTWC19","RPTWC20","RPTWC21","RPTWC22","RPTWC23","RPTWC24","RPTWC25","RPTWC26","RPTWC27","RPTWC28","RPTWC29","RPTWC30","RPTWC31","RPTWC32","RPTWC33","RPTWC34","RPTWC35","RPTWC36","RPTWC37","RPTWC38","RPTWC39","RPTWC40","RPTWC41","RPTWC42","RPTWC43","RPTWC44","RPTWC45","RPTWC46","RPTWC47","RPTWC48","RPTWC49","RPTWC50","RPTWC51","RPTWC52","RPTWC53","RPTWC54","RPTWC55","RPTWC56","RPTWC57","RPTWC58","RPTWC59","RPTWD01","RPTWD02","RPTWD03","RPTWD04","RPTWD05","RPTWD06","RPTWD07","RPTWD08","RPTWD09","RPTWD10","RPTWD11","RPTWD12","RPTWD13","RPTWD14","RPTWD15","RPTWD16","RPTWD17","RPTWD18","RPTWD19","RPTWD20","RPTWD21","RPTWD22","RPTWD23","RPTWD24","RPTWD25","RPTWD26","RPTWD27","RPTWD28","RPTWD29","RPTWE01","RPTWE02","RPTWE03","RPTWE04","RPTWE05","RPTWE06","RPTWE07","RPTWE08","RPTWE09","RPTWE10","RPTWE11","RPTWE12","RPTWE13","RPTWE14","RPTWE15","RPTWE16","RPTWE17","RPTWE18","RPTWE19","RPTWE20","RPTWE21","RPTWE22","RPTWE23","RPTWE24","RPTWE25","RPTWE26","RPTWE27","RPTWE28","RPTWE29","RWXPA05","RWXPA10","RWXPA15","RWXPB05","RWXPB10","RWXPB15","RWXPC05","RWXPC10","RWXPC15","RWXPD05","RWXPD10","RWXPD15","RWXPE05","RWXPE10","RWXPE15","RGAA01","RGAA02","RGAA03","RGAA04","RGAA05","RGAA06","RGAA07","RGAA08","RGAA09","RGAA10","RGAA11","RGAA12","RGAA13","RGAB01","RGAB02","RGAB03","RGAB04","RGAB05","RGAB06","RGAB07","RGAB08","RGAB09","RGAB10","RGAB11","RGAB12","RGAB13","RGAC01","RGAC02","RGAC03","RGAC04","RGAC05","RGAC06","RGAC07","RGAC08","RGAC09","RGAC10","RGAC11","RGAC12","RGAC13","RGAC14","RGAC15","RGAC16","RGAC17","RGAC18","RGAC19","RGAC20","RGAC21","RGAC22","RGAC23","RGAC24","RGAC25","RGAC26","RGAC27","RGAC28","RGAC29","RGAC30","RGAC31","RGAC32","RGAC33","RGAC34","RGAC35","RGAC36","RGAC37","RGAC38","RGAC39","RGAC40","RGAC41","RGAC42","RGAC43","RGAC44","RGAC45","RGAC46","RGAC47","RGAC48","RGAC49","RGAC50","RGAD01","RGAD02","RGAD03","RGAD04","RGAD05","RGAD06","RGAD07","RGAD08","RGAD09","RGAD10","RGAD11","RGAD12","RGAD13","RGAE01","RGAE02","RGAE03","RGAE04","RGAE05","RGAE06","RGAE07","RGAE08","RGAE09","RGAE10","RGAE11","RGAE12","RGAE13","RGAE14","RGAE15","RGAE16","RGAE17","RGAE18","RGAE19","RGAE20","RGAE21","RGAE22","RGAE23","RGAE24","RGAE25","RGAE26","RGAE27","RGAE28","RGAE29","RGAE30","RGAE31","RGAE32","RGAE33","RGAE34","RGAE35","RGAE36","RGAE37","RGAE38","RGAE39","RGAE40","RGAE41","RGAE42","RGAE43","RGAE44","RGAE45","RGAE46","RGAE47","RGAE48","RGAE49","RGAE50","RGOUA01","RGOUA02","RGOUA03","RGOUA04","RGOUA05","RGOUA06","RGOUA07","RGOUA08","RGOUA09","RGOUA10","RGOUA11","RGOUA12","RGOUA13","RGOUB01","RGOUB02","RGOUB03","RGOUB04","RGOUB05","RGOUB06","RGOUB07","RGOUB08","RGOUB09","RGOUB10","RGOUB11","RGOUB12","RGOUB13","RGOUC01","RGOUC02","RGOUC03","RGOUC04","RGOUC05","RGOUC06","RGOUC07","RGOUC08","RGOUC09","RGOUC10","RGOUC11","RGOUC12","RGOUC13","RGOUC14","RGOUC15","RGOUC16","RGOUC17","RGOUC18","RGOUC19","RGOUC20","RGOUC21","RGOUC22","RGOUC23","RGOUC24","RGOUC25","RGOUC26","RGOUC27","RGOUC28","RGOUC29","RGOUC30","RGOUC31","RGOUC32","RGOUC33","RGOUC34","RGOUC35","RGOUC36","RGOUC37","RGOUC38","RGOUC39","RGOUC40","RGOUC41","RGOUC42","RGOUC43","RGOUC44","RGOUC45","RGOUC46","RGOUC47","RGOUC48","RGOUC49","RGOUC50","RGOUD01","RGOUD02","RGOUD03","RGOUD04","RGOUD05","RGOUD06","RGOUD07","RGOUD08","RGOUD09","RGOUD10","RGOUD11","RGOUD12","RGOUD13","RGOUE01","RGOUE02","RGOUE03","RGOUE04","RGOUE05","RGOUE06","RGOUE07","RGOUE08","RGOUE09","RGOUE10","RGOUE11","RGOUE12","RGOUE13","RGOUE14","RGOUE15","RGOUE16","RGOUE17","RGOUE18","RGOUE19","RGOUE20","RGOUE21","RGOUE22","RGOUE23","RGOUE24","RGOUE25","RGOUE26","RGOUE27","RGOUE28","RGOUE29","RGOUE30","RGOUE31","RGOUE32","RGOUE33","RGOUE34","RGOUE35","RGOUE36","RGOUE37","RGOUE38","RGOUE39","RGOUE40","RGOUE41","RGOUE42","RGOUE43","RGOUE44","RGOUE45","RGOUE46","RGOUE47","RGOUE48","RGOUE49","RGOUE50");
                    for (i = 65; i < 70; i++) {
                        var tochar = String.fromCharCode(i);
                        for (j = 11; j <= 50; j++) {
                            var round = String;
                            round = j;
                            wtypeRB.push("RF" + tochar + j)
                        }
                    }
                    if (_self.in_array(wtype.toUpperCase(), wtypeRB))
                        return true;
                    return false
                }
                ;
                _self.filterP = function(str, isLower) {
                    var tmpstr = str.toUpperCase();
                    if ((tmpstr.substr(0, 2) == "HP" || tmpstr.substr(0, 1) == "P") && !tmpstr.match(/^H?PD(3|5|7)?$/g) && !tmpstr.match(/^R?PD3[0-2][0-2]$/g) && !tmpstr.match(/^R?PD5[0-3][0-3]$/g) && !tmpstr.match(/^R?PD7[0-4][0-4]$/g) && !tmpstr.match(/^PD(H|C)?[0-4]?$/g) && !tmpstr.match(/^PG(F|L)?(H|N|C)?$/g) && !tmpstr.match(/^PA(H|C)?$/g) && !tmpstr.match(/^PTWA0[1-3](H|C)?$/g))
                        tmpstr = tmpstr.replace("P", "");
                    return isLower ? tmpstr.toLowerCase() : tmpstr.toUpperCase()
                }
                ;
                _self.chgOddfIoratio = function(iorH, iorC, config_ior, odd) {
                    if (odd == "HK")
                        odd = "H";
                    var tmp_odd = odd != null ? odd : top["userData"].odd_f_type;
                    if (iorH * 1 == 0 && iorC * 1 == 0) {
                        var tmp = new Array;
                        tmp[0] = 0;
                        tmp[1] = 0;
                        return tmp
                    }
                    return get_other_ioratio(tmp_odd, iorH, iorC, _self.chg_showior(top["userData"].ltype), config_ior)
                }
                ;
                _self.getChangeAry = function(isUpper) {
                    var ary = new Array("R","OU","HR","HOU","RE","ROU","HRE","HROU","EO","HEO","REO","HREO","AR","BR","CR","DR","ER","FR","AOU","BOU","COU","DOU","EOU","FOU","ARE","BRE","CRE","DRE","ERE","FRE","AROU","BROU","CROU","DROU","EROU","FROU","ROUH","ROUC","HRUH","HRUC","OUH","OUC","HOUH","HOUC","EOH","EOC","HEOH","HEOC","RNBA","RNBB","RNBC","RNBD","RNBE","RNBF","RNBG","RNBH","RNBI","RNBJ","RNBK","RNBL","RNBM","RNBN","RNBO","RNC1","RNC2","RNC3","RNC4","RNC5","RNC6","RNC7","RNC8","RNC9","RNCA","RNCB","RNCC","RNCD","RNCE","RNCF","RNCG","RNCH","RNCI","RNCJ","RNCK","RNCL","RNCM","RNCN","RNCO","RNCP","RNCQ","RNCR","RNCS","RNCT","RNCU","RSHA","RSHB","RSHC","RSHD","RSHE","RSHF","RSHG","RSHH","RSHI","RSHJ","RSHK","RSHL","RSHM","RSHN","RSHO","RSCA","RSCB","RSCC","RSCD","RSCE","RSCF","RSCG","RSCH","RSCI","RSCJ","RSCK","RSCL","RSCM","RSCN","RSCO","TARU","TBRU","TDRU","TERU");
                    if (isUpper)
                        return ary;
                    else {
                        var tmp = ary.join(",").toLowerCase();
                        return tmp.split(",")
                    }
                }
                ;
                _self.chg_showior = function(ltype) {
                    switch (ltype) {
                    case "1":
                        show_ior = 100;
                        break;
                    case "2":
                        show_ior = 100;
                        break;
                    case "3":
                        show_ior = 100;
                        break;
                    case "4":
                        show_ior = 100;
                        break;
                    default:
                        show_ior = 100;
                        break
                    }
                    return show_ior
                }
                ;
                _self.chkParlayDate = function(_pickDate) {
                    var isOk = true;
                    try {
                        var dateAry = _pickDate.split("^");
                        dateAry.sort();
                        var fOD = dateAry[0];
                        var fD = new Date(fOD);
                        if (isNaN(fD)) {
                            var s = fOD.split("-");
                            fD = new Date(s[0] + "/" + s[1] + "/" + s[2])
                        }
                        var lD = new Date(fD);
                        if (isNaN(lD)) {
                            var s = fOD.split("-");
                            fD = new Date(s[0] + "/" + s[1] + "/" + s[2])
                        }
                        lD.setDate(fD.getDate() + 7);
                        var overDate = lD.getFullYear() + "-";
                        overDate += lD.getMonth() + 1 < 10 ? "0" + (lD.getMonth() + 1) + "-" : lD.getMonth() + 1 + "-";
                        overDate += lD.getDate() < 10 ? "0" + lD.getDate() : lD.getDate();
                        for (var i = 0; i < dateAry.length; i++) {
                            var tmp = dateAry[i];
                            if (tmp >= overDate) {
                                isOk = false;
                                break
                            }
                        }
                    } catch (E) {
                        console.log("chkParlayDate error");
                        isOk = false
                    }
                    return isOk
                }
                ;
                _self.chkGameDate = function(_SYSTIME, _date) {
                    try {
                        if (isNaN(_SYSTIME)) {
                            var s = _SYSTIME.split("-");
                            var sD = new Date(s[0],s[1] * 1 - 1,s[2])
                        }
                        if (isNaN(_date) && _date) {
                            var s = _date.split("-");
                            var tD = new Date(s[0],s[1] * 1 - 1,s[2])
                        }
                        if (tD < sD)
                            return "yesterday";
                        return "today"
                    } catch (E) {
                        console.log(E);
                        return "error"
                    }
                }
                ;
                _self.switchRtypetoFinish = function(wtype, rtype) {
                    if (wtype.indexOf("EO") != -1) {
                        rtype = rtype == "PE" || rtype == "HPE" ? rtype.replace(/PE/g, "PEOE") : rtype;
                        rtype = rtype == "PO" || rtype == "HPO" ? rtype.replace(/PO/g, "PEOO") : rtype;
                        rtype = rtype == "PRE" || rtype == "HPRE" ? rtype.replace(/PRE/g, "PREOE") : rtype;
                        rtype = rtype == "PRO" || rtype == "HPRO" ? rtype.replace(/PRO/g, "PREOO") : rtype
                    }
                    rtype = rtype.replace(/0~1/g, "T01");
                    rtype = rtype.replace(/2~3/g, "T23");
                    rtype = rtype.replace(/4~6/g, "T46");
                    return rtype
                }
                ;
                _self.getTeamP = function(rtype) {
                    var _rtype = rtype.toUpperCase();
                    var hash = new Object;
                    hash["POUHO"] = "h";
                    hash["POUHU"] = "h";
                    hash["POUCO"] = "c";
                    hash["POUCU"] = "c";
                    hash["HPOUHO"] = "h";
                    hash["HPOUHU"] = "h";
                    hash["HPOUCO"] = "c";
                    hash["HPOUCU"] = "c";
                    return hash[_rtype]
                }
                ;
                _self.showConcede = function(wtype, concede) {
                    var showConcedeWtype = new Array("OU","HOU","ROU","HROU","POU","HPOU","POUH","POUC","HPOUH","HPOUC","AOU","BOU","COU","DOU","EOU","FOU","AROU","BROU","CROU","DROU","EROU","FROU","PAOU","PBOU","PCOU","PDOU","PEOU","PFOU","W3","PROU","HPROU","PROUH","PROUC","HPROUH","HPROUC","PAROU","PBROU","PCROU","PDROU","PEROU","PFROU","HPRUH","HPRUC","PTARU","PTBRU","PTDRU","PTERU");
                    if (_self.in_array(wtype.toUpperCase(), showConcedeWtype))
                        return concede;
                    return ""
                }
                ;
                _self.changeWtypeSwitchP = function(wtype, isUpper) {
                    wtype = wtype.toLowerCase();
                    var hash = new Object;
                    hash["pr"] = "r";
                    hash["pou"] = "ou";
                    hash["hpr"] = "hr";
                    hash["hpou"] = "hou";
                    hash["peo"] = "eo";
                    hash["hpeo"] = "heo";
                    hash["pouh"] = "ouh";
                    hash["pouc"] = "ouc";
                    hash["hpouh"] = "houh";
                    hash["hpouc"] = "houc";
                    hash["par"] = "ar";
                    hash["pbr"] = "br";
                    hash["pcr"] = "cr";
                    hash["pdr"] = "dr";
                    hash["per"] = "er";
                    hash["pfr"] = "fr";
                    hash["paou"] = "aou";
                    hash["pbou"] = "bou";
                    hash["pcou"] = "cou";
                    hash["pdou"] = "dou";
                    hash["peou"] = "eou";
                    hash["pfou"] = "fou";
                    hash["pdh"] = "pd";
                    hash["pdc"] = "pd";
                    hash["pre"] = "re";
                    hash["prou"] = "rou";
                    hash["hpre"] = "hre";
                    hash["hprou"] = "hrou";
                    hash["preo"] = "reo";
                    hash["hpreo"] = "hreo";
                    hash["prouh"] = "rouh";
                    hash["prouc"] = "rouc";
                    hash["hprouh"] = "hrouh";
                    hash["hprouc"] = "hrouc";
                    hash["hpruh"] = "hruh";
                    hash["hpruc"] = "hruc";
                    hash["pare"] = "are";
                    hash["pbre"] = "bre";
                    hash["pcre"] = "cre";
                    hash["pdre"] = "dre";
                    hash["pere"] = "ere";
                    hash["pfre"] = "fre";
                    hash["parou"] = "arou";
                    hash["pbrou"] = "brou";
                    hash["pcrou"] = "crou";
                    hash["pdrou"] = "drou";
                    hash["perou"] = "erou";
                    hash["pfrou"] = "frou";
                    hash["ptaru"] = "taru";
                    hash["ptbru"] = "tbru";
                    hash["ptdru"] = "tdru";
                    hash["pteru"] = "teru";
                    var _wtype = hash[wtype] != null ? hash[wtype] : wtype;
                    return isUpper == true ? _wtype.toUpperCase() : _wtype
                }
                ;
                _self.changeWtypeForPD = function(gtype, wtype, isLower) {
                    gtype = gtype.toUpperCase();
                    wtype = wtype.toUpperCase();
                    var hash = new Object;
                    hash["BK_RPDH"] = "RPD";
                    hash["BK_RPDC"] = "RPD";
                    hash["BK_PDH"] = "PD";
                    hash["BK_PDC"] = "PD";
                    hash["BS_MX"] = "M";
                    hash["BS_RMX"] = "RM";
                    var ret = hash[gtype + "_" + wtype] != null ? hash[gtype + "_" + wtype] : wtype;
                    return isLower ? ret.toLowerCase() : ret.toUpperCase()
                }
                ;
                _self.getAllRtype = function(wtype) {
                    var hash = new Object;
                    var RNB_ary = new Array("RNBA","RNBB","RNBC","RNBD","RNBE","RNBF","RNBG","RNBH","RNBI","RNBJ","RNBK","RNBL","RNBM","RNBN","RNBO");
                    var RNC_ary = new Array("RNC1","RNC2","RNC3","RNC4","RNC5","RNC6","RNC7","RNC8","RNC9","RNCA","RNCB","RNCC","RNCD","RNCE","RNCF","RNCG","RNCH","RNCI","RNCJ","RNCK","RNCL","RNCM","RNCN","RNCO","RNCP","RNCQ","RNCR","RNCS","RNCT","RNCU");
                    var RSH_ary = new Array("RSHA","RSHB","RSHC","RSHD","RSHE","RSHF","RSHG","RSHH","RSHI","RSHJ","RSHK","RSHL","RSHM","RSHN","RSHO","RSCA","RSCB","RSCC","RSCD","RSCE","RSCF","RSCG","RSCH","RSCI","RSCJ","RSCK","RSCL","RSCM","RSCN","RSCO");
                    hash[wtype] = new Array(wtype);
                    hash["MW"] = new Array("MWH","MWC","MWHOT","MWCOT","MWHPK","MWCPK");
                    hash["MQ"] = new Array("MQH","MQC","MQHOT","MQCOT","MQHPK","MQCPK");
                    hash["MOUA"] = new Array("MOUAHO","MOUAHU","MOUACO","MOUACU","MOUANO","MOUANU");
                    hash["MOUB"] = new Array("MOUBHO","MOUBHU","MOUBCO","MOUBCU","MOUBNO","MOUBNU");
                    hash["MOUC"] = new Array("MOUCHO","MOUCHU","MOUCCO","MOUCCU","MOUCNO","MOUCNU");
                    hash["MOUD"] = new Array("MOUDHO","MOUDHU","MOUDCO","MOUDCU","MOUDNO","MOUDNU");
                    hash["MPG"] = new Array("MPGHH","MPGHC","MPGCH","MPGCC","MPGNH","MPGNC");
                    hash["MTS"] = new Array("MTSHY","MTSHN","MTSCY","MTSCN","MTSNY","MTSNN");
                    hash["DUA"] = new Array("DUAHO","DUAHU","DUACO","DUACU","DUASO","DUASU");
                    hash["DUB"] = new Array("DUBHO","DUBHU","DUBCO","DUBCU","DUBSO","DUBSU");
                    hash["DUC"] = new Array("DUCHO","DUCHU","DUCCO","DUCCU","DUCSO","DUCSU");
                    hash["DUD"] = new Array("DUDHO","DUDHU","DUDCO","DUDCU","DUDSO","DUDSU");
                    hash["DG"] = new Array("DGHH","DGHC","DGCH","DGCC","DGSH","DGSC");
                    hash["DS"] = new Array("DSHY","DSHN","DSCY","DSCN","DSSY","DSSN");
                    hash["OUEA"] = new Array("OUEAOO","OUEAOE","OUEAUO","OUEAUE");
                    hash["OUEB"] = new Array("OUEBOO","OUEBOE","OUEBUO","OUEBUE");
                    hash["OUEC"] = new Array("OUECOO","OUECOE","OUECUO","OUECUE");
                    hash["OUED"] = new Array("OUEDOO","OUEDOE","OUEDUO","OUEDUE");
                    hash["OUPA"] = new Array("OUPAOH","OUPAOC","OUPAUH","OUPAUC");
                    hash["OUPB"] = new Array("OUPBOH","OUPBOC","OUPBUH","OUPBUC");
                    hash["OUPC"] = new Array("OUPCOH","OUPCOC","OUPCUH","OUPCUC");
                    hash["OUPD"] = new Array("OUPDOH","OUPDOC","OUPDUH","OUPDUC");
                    hash["OUTA"] = new Array("OUTAOY","OUTAON","OUTAUY","OUTAUN");
                    hash["OUTB"] = new Array("OUTBOY","OUTBON","OUTBUY","OUTBUN");
                    hash["OUTC"] = new Array("OUTCOY","OUTCON","OUTCUY","OUTCUN");
                    hash["OUTD"] = new Array("OUTDOY","OUTDON","OUTDUY","OUTDUN");
                    hash["RMUA"] = new Array("RMUAHO","RMUAHU","RMUACO","RMUACU","RMUANO","RMUANU");
                    hash["RMUB"] = new Array("RMUBHO","RMUBHU","RMUBCO","RMUBCU","RMUBNO","RMUBNU");
                    hash["RMUC"] = new Array("RMUCHO","RMUCHU","RMUCCO","RMUCCU","RMUCNO","RMUCNU");
                    hash["RMUD"] = new Array("RMUDHO","RMUDHU","RMUDCO","RMUDCU","RMUDNO","RMUDNU");
                    hash["RMPG"] = new Array("RMPGHH","RMPGHC","RMPGCH","RMPGCC","RMPGNH","RMPGNC");
                    hash["RMTS"] = new Array("RMTSHY","RMTSHN","RMTSCY","RMTSCN","RMTSNY","RMTSNN");
                    hash["RDUA"] = new Array("RDUAHO","RDUAHU","RDUACO","RDUACU","RDUASO","RDUASU");
                    hash["RDUB"] = new Array("RDUBHO","RDUBHU","RDUBCO","RDUBCU","RDUBSO","RDUBSU");
                    hash["RDUC"] = new Array("RDUCHO","RDUCHU","RDUCCO","RDUCCU","RDUCSO","RDUCSU");
                    hash["RDUD"] = new Array("RDUDHO","RDUDHU","RDUDCO","RDUDCU","RDUDSO","RDUDSU");
                    hash["RDG"] = new Array("RDGHH","RDGHC","RDGCH","RDGCC","RDGSH","RDGSC");
                    hash["RDS"] = new Array("RDSHY","RDSHN","RDSCY","RDSCN","RDSSY","RDSSN");
                    hash["RUEA"] = new Array("RUEAOO","RUEAOE","RUEAUO","RUEAUE");
                    hash["RUEB"] = new Array("RUEBOO","RUEBOE","RUEBUO","RUEBUE");
                    hash["RUEC"] = new Array("RUECOO","RUECOE","RUECUO","RUECUE");
                    hash["RUED"] = new Array("RUEDOO","RUEDOE","RUEDUO","RUEDUE");
                    hash["RUPA"] = new Array("RUPAOH","RUPAOC","RUPAUH","RUPAUC");
                    hash["RUPB"] = new Array("RUPBOH","RUPBOC","RUPBUH","RUPBUC");
                    hash["RUPC"] = new Array("RUPCOH","RUPCOC","RUPCUH","RUPCUC");
                    hash["RUPD"] = new Array("RUPDOH","RUPDOC","RUPDUH","RUPDUC");
                    hash["RUTA"] = new Array("RUTAOY","RUTAON","RUTAUY","RUTAUN");
                    hash["RUTB"] = new Array("RUTBOY","RUTBON","RUTBUY","RUTBUN");
                    hash["RUTC"] = new Array("RUTCOY","RUTCON","RUTCUY","RUTCUN");
                    hash["RUTD"] = new Array("RUTDOY","RUTDON","RUTDUY","RUTDUN");
                    if (_self.in_array(wtype, RNB_ary) || _self.in_array(wtype, RNC_ary)) {
                        var rtypeH = wtype + "H";
                        var rtypeC = wtype + "C";
                        hash[wtype] = new Array(rtypeH,rtypeC)
                    } else if (_self.in_array(wtype, RSH_ary)) {
                        var rtypeHH = wtype + "Y";
                        var rtypeHC = wtype + "N";
                        var rtypeCH = wtype.substr(0, 2) + "C" + wtype.substr(3, 1) + "Y";
                        var rtypeCC = wtype.substr(0, 2) + "C" + wtype.substr(3, 1) + "N";
                        hash[wtype] = new Array(rtypeHH,rtypeHC,rtypeCH,rtypeCC)
                    }
                    return hash[wtype]
                }
                ;
                _self.transRtype2P = function(_rtype, low) {
                    var rtype = _rtype.toUpperCase();
                    var ret = rtype;
                    var isP = false;
                    var isHP = false;
                    if (rtype.match(/^RE?(H|C)$/g))
                        isP = true;
                    else if (rtype.match(/^H?RE?(H|C)$/g))
                        isHP = true;
                    else if (rtype.match(/^R?OU(H|C)$/g))
                        isP = true;
                    else if (rtype.match(/^HR?OU(H|C)$/g))
                        isHP = true;
                    else if (rtype.match(/^R?EO(O|E)$/g))
                        isP = true;
                    else if (rtype.match(/^HR?EO(O|E)$/g))
                        isHP = true;
                    else if (rtype.match(/^[A-F]RE?(H|C)$/g))
                        isP = true;
                    else if (rtype.match(/^[A-F]R?OU(O|U)$/g))
                        isP = true;
                    else if (rtype.match(/^R?OU(H|C)(O|U)$/g))
                        isP = true;
                    else if (rtype.match(/^H?OU(H|C)(O|U)$/g))
                        isHP = true;
                    else if (rtype.match(/^HRU(H|C)(O|U)$/g))
                        isHP = true;
                    else if (rtype.match(/^T[A-E]RU(O|U)$/g))
                        isP = true;
                    if (isP)
                        ret = "P" + rtype;
                    else if (isHP)
                        ret = rtype.replace("H", "HP");
                    if (low)
                        ret = ret.toLowerCase();
                    return ret
                }
                ;
                _self.transWtype2P = function(_wtype, low) {
                    var wtype = _wtype.toUpperCase();
                    var ret = wtype;
                    var isP = false;
                    var isHP = false;
                    if (wtype.match(/^RE?$/g))
                        isP = true;
                    else if (wtype.match(/^H?RE?$/g))
                        isHP = true;
                    else if (wtype.match(/^R?OU$/g))
                        isP = true;
                    else if (wtype.match(/^HR?OU$/g))
                        isHP = true;
                    else if (wtype.match(/^R?EO$/g))
                        isP = true;
                    else if (wtype.match(/^HR?EO$/g))
                        isHP = true;
                    else if (wtype.match(/^[A-F]RE?$/g))
                        isP = true;
                    else if (wtype.match(/^[A-F]R?OU$/g))
                        isP = true;
                    else if (wtype.match(/^R?OU(H|C)$/g))
                        isP = true;
                    else if (wtype.match(/^H?OU(H|C)$/g))
                        isHP = true;
                    else if (wtype.match(/^HRU(H|C)$/g))
                        isHP = true;
                    else if (wtype.match(/^T[A-E]RU$/g))
                        isP = true;
                    if (isP)
                        ret = "P" + wtype;
                    else if (isHP)
                        ret = wtype.replace("H", "HP");
                    if (low)
                        ret = ret.toLowerCase();
                    return ret
                }
                ;
                _self.util_AdvToA = function(score) {
                    var ret = score + "";
                    if (ret == "Adv")
                        ret = "A";
                    return ret
                }
                ;
                _self.isToday = function(str) {
                    var d = new Date(str.replace(/-/g, "/"));
                    var todaysDate = new Date;
                    utc = todaysDate.getTime() + todaysDate.getTimezoneOffset() * 60 * 1E3;
                    var offset = -4;
                    var newtodaysDate = new Date(utc + 36E5 * offset);
                    if (d.setHours(0, 0, 0, 0) == newtodaysDate.setHours(0, 0, 0, 0))
                        return true;
                    else
                        return false
                }
                ;
                _self.transWtypeRB2R = function(wtype, is_rb) {
                    if (is_rb != "N")
                        return wtype;
                    var hash = new Object;
                    hash[wtype] = wtype;
                    hash["RE"] = "R";
                    hash["HRE"] = "HR";
                    hash["ROU"] = "OU";
                    hash["HROU"] = "HOU";
                    hash["RM"] = "M";
                    hash["HRM"] = "HM";
                    hash["REO"] = "EO";
                    hash["HREO"] = "HEO";
                    hash["RTS"] = "TS";
                    hash["RPD"] = "PD";
                    return hash[wtype]
                }
                ;
                _self.transRtypeRB2R = function(rtype, is_rb) {
                    if (is_rb != "N")
                        return rtype;
                    var hash = new Object;
                    hash[rtype] = rtype;
                    hash["REH"] = "RH";
                    hash["REC"] = "RC";
                    hash["HREH"] = "HRH";
                    hash["HREC"] = "HRC";
                    hash["ROUH"] = "OUH";
                    hash["ROUC"] = "OUC";
                    hash["HROUH"] = "HOUH";
                    hash["HROUC"] = "HOUC";
                    hash["RMH"] = "MH";
                    hash["RMC"] = "MC";
                    hash["RMN"] = "MN";
                    hash["HRMH"] = "HMH";
                    hash["HRMC"] = "HMC";
                    hash["HRMN"] = "HMN";
                    hash["REOO"] = "EOO";
                    hash["REOE"] = "EOE";
                    hash["HREOO"] = "HEOO";
                    hash["HREOE"] = "HEOE";
                    hash["RTSY"] = "TSY";
                    hash["RTSN"] = "TSN";
                    if (rtype && (rtype.match(/^RH[1-2]?[0-9]C[1-2]?[0-9]$/g) || rtype == "ROVH"))
                        hash[rtype] = rtype.replace(/R/, "");
                    return hash[rtype]
                }
                ;
                _self.transRtypeR2RB = function(rtype, is_rb) {
                    if (is_rb != "N")
                        return rtype;
                    var hash = new Object;
                    hash[rtype] = rtype;
                    hash["RH"] = "REH";
                    hash["RC"] = "REC";
                    hash["HRH"] = "HREH";
                    hash["HRC"] = "HREC";
                    hash["OUH"] = "ROUH";
                    hash["OUC"] = "ROUC";
                    hash["HOUH"] = "HROUH";
                    hash["HOUC"] = "HROUC";
                    hash["MH"] = "RMH";
                    hash["MC"] = "RMC";
                    hash["MN"] = "RMN";
                    hash["HMH"] = "HRMH";
                    hash["HMC"] = "HRMC";
                    hash["HMN"] = "HRMN";
                    hash["EOO"] = "REOO";
                    hash["EOE"] = "REOE";
                    hash["HEOO"] = "HREOO";
                    hash["HEOE"] = "HREOE";
                    hash["TSY"] = "RTSY";
                    hash["TSN"] = "RTSN";
                    for ($i = 0; $i <= 20; $i++)
                        for ($j = 0; $j <= 20; $j++)
                            hash["H" + $i + "C" + $j] = "RH" + $i + "C" + $j;
                    hash["OVH"] = "ROVH";
                    return hash[rtype]
                }
                ;
                _self.checkRtypeIor = function(rtype) {
                    var _type = rtype.toUpperCase();
                    var hash = new Object;
                    hash["OUH"] = "OUC";
                    hash["OUC"] = "OUH";
                    hash["HOUH"] = "HOUC";
                    hash["HOUC"] = "HOUH";
                    hash["ROUH"] = "ROUC";
                    hash["ROUC"] = "ROUH";
                    hash["HROUH"] = "HROUC";
                    hash["HROUC"] = "HROUH";
                    hash["POUH"] = "POUC";
                    hash["POUC"] = "POUH";
                    hash["HPOUH"] = "HPOUC";
                    hash["HPOUC"] = "HPOUH";
                    hash["OUHO"] = "OUHU";
                    hash["OUHU"] = "OUHO";
                    hash["OUCO"] = "OUCU";
                    hash["OUCU"] = "OUCO";
                    hash["HOUHO"] = "HOUHU";
                    hash["HOUHU"] = "HOUHO";
                    hash["HOUCO"] = "HOUCU";
                    hash["HOUCU"] = "HOUCO";
                    hash["ROUHO"] = "ROUHU";
                    hash["ROUHU"] = "ROUHO";
                    hash["ROUCO"] = "ROUCU";
                    hash["ROUCU"] = "ROUCO";
                    hash["HRUHO"] = "HRUHU";
                    hash["HRUHU"] = "HRUHO";
                    hash["HRUCO"] = "HRUCU";
                    hash["HRUCU"] = "HRUCO";
                    hash["PROUHO"] = "PROUHU";
                    hash["PROUHU"] = "PROUHO";
                    hash["PROUCO"] = "PROUCU";
                    hash["PROUCU"] = "PROUCO";
                    hash["HPROUHO"] = "HPROUHU";
                    hash["HPROUHU"] = "HPROUHO";
                    hash["HPROUCO"] = "HPROUCU";
                    hash["HPROUCU"] = "HPROUCO";
                    hash["RH"] = "RC";
                    hash["RC"] = "RH";
                    hash["HRH"] = "HRC";
                    hash["HRC"] = "HRH";
                    hash["REH"] = "REC";
                    hash["REC"] = "REH";
                    hash["HREH"] = "HREC";
                    hash["HREC"] = "HREH";
                    hash["PRH"] = "PRC";
                    hash["PRC"] = "PRH";
                    hash["HPRH"] = "HPRC";
                    hash["HPRC"] = "HPRH";
                    hash["PREH"] = "PREC";
                    hash["PREC"] = "PREH";
                    hash["HPREH"] = "HPREC";
                    hash["HPREC"] = "HPREH";
                    hash["ARH"] = "ARC";
                    hash["ARC"] = "ARH";
                    hash["BRH"] = "BRC";
                    hash["BRC"] = "BRH";
                    hash["CRH"] = "CRC";
                    hash["CRC"] = "CRH";
                    hash["DRH"] = "DRC";
                    hash["DRC"] = "DRH";
                    hash["ERH"] = "ERC";
                    hash["ERC"] = "ERH";
                    hash["FRH"] = "FRC";
                    hash["FRC"] = "FRH";
                    hash["AREH"] = "AREC";
                    hash["AREC"] = "AREH";
                    hash["BREH"] = "BREC";
                    hash["BREC"] = "BREH";
                    hash["CREH"] = "CREC";
                    hash["CREC"] = "CREH";
                    hash["DREH"] = "DREC";
                    hash["DREC"] = "DREH";
                    hash["EREH"] = "EREC";
                    hash["EREC"] = "EREH";
                    hash["FREH"] = "FREC";
                    hash["FREC"] = "FREH";
                    hash["PARH"] = "PARC";
                    hash["PARC"] = "PARH";
                    hash["PBRH"] = "PBRC";
                    hash["PBRC"] = "PBRH";
                    hash["PCRH"] = "PCRC";
                    hash["PCRC"] = "PCRH";
                    hash["PDRH"] = "PDRC";
                    hash["PDRC"] = "PDRH";
                    hash["PERH"] = "PERC";
                    hash["PERC"] = "PERH";
                    hash["PFRH"] = "PFRC";
                    hash["PFRC"] = "PFRH";
                    hash["PAREH"] = "PAREC";
                    hash["PAREC"] = "PAREH";
                    hash["PBREH"] = "PBREC";
                    hash["PBREC"] = "PBREH";
                    hash["PCREH"] = "PCREC";
                    hash["PCREC"] = "PCREH";
                    hash["PDREH"] = "PDREC";
                    hash["PDREC"] = "PDREH";
                    hash["PEREH"] = "PEREC";
                    hash["PEREC"] = "PEREH";
                    hash["PFREH"] = "PFREC";
                    hash["PFREC"] = "PFREH";
                    hash["POUHO"] = "POUHU";
                    hash["POUHU"] = "POUHO";
                    hash["POUCO"] = "POUCU";
                    hash["POUCU"] = "POUCO";
                    hash["HPOUHO"] = "HPOUHU";
                    hash["HPOUHU"] = "HPOUHO";
                    hash["HPOUCO"] = "HPOUCU";
                    hash["HPOUCU"] = "HPOUCO";
                    hash["AOUO"] = "AOUU";
                    hash["AOUU"] = "AOUO";
                    hash["BOUO"] = "BOUU";
                    hash["BOUU"] = "BOUO";
                    hash["COUO"] = "COUU";
                    hash["COUU"] = "COUO";
                    hash["DOUO"] = "DOUU";
                    hash["DOUU"] = "DOUO";
                    hash["EOUO"] = "EOUU";
                    hash["EOUU"] = "EOUO";
                    hash["FOUO"] = "FOUU";
                    hash["FOUU"] = "FOUO";
                    hash["AROUO"] = "AROUU";
                    hash["AROUU"] = "AROUO";
                    hash["BROUO"] = "BROUU";
                    hash["BROUU"] = "BROUO";
                    hash["CROUO"] = "CROUU";
                    hash["CROUU"] = "CROUO";
                    hash["DROUO"] = "DROUU";
                    hash["DROUU"] = "DROUO";
                    hash["EROUO"] = "EROUU";
                    hash["EROUU"] = "EROUO";
                    hash["FROUO"] = "FROUU";
                    hash["FROUU"] = "FROUO";
                    hash["REOO"] = "REOE";
                    hash["REOE"] = "REOO";
                    hash["HREOO"] = "HREOE";
                    hash["HREOE"] = "HREOO";
                    hash["EOO"] = "EOE";
                    hash["EOE"] = "EOO";
                    hash["HEOO"] = "HEOE";
                    hash["HEOE"] = "HEOO";
                    hash["PEOO"] = "PEOE";
                    hash["PEOE"] = "PEOO";
                    hash["HPEOO"] = "HPEOE";
                    hash["HPEOE"] = "HPEOO";
                    hash["EOHO"] = "EOHE";
                    hash["EOHE"] = "EOHO";
                    hash["EOCO"] = "EOCE";
                    hash["EOCE"] = "EOCO";
                    hash["HEOHO"] = "HEOHE";
                    hash["HEOHE"] = "HEOHO";
                    hash["HEOCO"] = "HEOCE";
                    hash["HEOCE"] = "HEOCO";
                    hash["TSY"] = "TSN";
                    hash["TSN"] = "TSY";
                    hash["RTSY"] = "RTSN";
                    hash["RTSN"] = "RTSY";
                    hash["HTSY"] = "HTSN";
                    hash["HTSN"] = "HTSY";
                    hash["RTS2Y"] = "RTS2N";
                    hash["RTS2N"] = "RTS2Y";
                    hash["OGY"] = "OGN";
                    hash["OGN"] = "OGY";
                    hash["OTY"] = "OTN";
                    hash["OTN"] = "OTY";
                    hash["ROTY"] = "ROTN";
                    hash["ROTN"] = "ROTY";
                    return hash[_type]
                }
                ;
                _self.isSystemError = function(_error) {
                    if (_self.isBetTryAgain(_error) || _self.isBusy(_error) || _self.isOptimization(_error) || _self.isConnectFail(_error) || _self.isCashError(_error))
                        return true;
                    return false
                }
                ;
                _self.isOrderLevel = function(_error) {
                    if (_self.isBetFailed(_error) || _self.isBetError(_error) || _self.isRemoveClose(_error) || _self.isOverMaxCredit(_error) || _self.isLoginFailed(_error) || _self.isOverYesterdayMaxCredit(_error) || _self.isBetTryAgain(_error) || _self.isBusy(_error) || _self.isOptimization(_error) || _self.isConnectFail(_error) || _self.isCashError(_error))
                        return true;
                    return false
                }
                ;
                _self.onlyOrderLevel = function(_error) {
                    var ary = new Array("betError9487","betError000","totalBet_close","connectFail","0X001","0X002","0X003","0X004","0X005","0X006","0X007","0X008","1X012","1X014","1X029","1X037");
                    return _self.in_array(_error, ary)
                }
                ;
                _self.sortBetError = function(_errAry) {
                    var err_sorted = new Object;
                    for (var a = 0; a < _errAry.length; a++) {
                        var _error = _errAry[a];
                        if (_error == "totalBet_close")
                            err_sorted["11"] = _error;
                        if (_self.isBetFailed(_error))
                            err_sorted["10"] = "order_failed";
                        if (_self.isBetError(_error))
                            err_sorted["9"] = _error;
                        if (_self.isRemoveClose(_error))
                            err_sorted["8"] = "remove_closed";
                        if (_self.isOverMaxCredit(_error))
                            err_sorted["7"] = _error;
                        if (_self.isLoginFailed(_error))
                            err_sorted["6"] = _error;
                        if (_self.isOverYesterdayMaxCredit(_error))
                            err_sorted["5"] = _error;
                        if (_self.isBetTryAgain(_error))
                            err_sorted["4"] = "bet_try_again";
                        if (_self.isBusy(_error))
                            err_sorted["3"] = _error;
                        if (_self.isOptimization(_error))
                            err_sorted["2"] = _error;
                        if (_self.isConnectFail(_error))
                            err_sorted["1"] = _error;
                        if (_self.isCashError(_error))
                            err_sorted["0"] = _error
                    }
                    return err_sorted
                }
                ;
                _self.isBetFailed = function(_error) {
                    var ary = new Array("0X001","0X002","0X003","0X004","0X005","0X006","0X007","0X008","1X000","1X001","1X002","1X003","1X004","1X005","1X006","1X007","1X008","1X009","1X010","1X011","1X012","1X013","1X014","1X015","1X016","1X017","1X018","1X019","1X020","1X021","1X022","1X023","1X024","1X025","1X026","1X027","1X029","1X030","1X031","1X032","1X034","1X035","1X036","1X037","score_changed","connect_failed","error_mem_max","error_mem_max1");
                    return _self.in_array(_error, ary)
                }
                ;
                _self.isBetError = function(_error) {
                    var ary = new Array("betError000","betError878787","betError9487");
                    return _self.in_array(_error, ary)
                }
                ;
                _self.isRemoveClose = function(_error) {
                    var ary = new Array("1X000","1X001");
                    return _self.in_array(_error, ary)
                }
                ;
                _self.isOverMaxCredit = function(_error) {
                    var ary = new Array("1X012");
                    return _self.in_array(_error, ary)
                }
                ;
                _self.isLoginFailed = function(_error) {
                    var ary = new Array("1X014");
                    return _self.in_array(_error, ary)
                }
                ;
                _self.isOverYesterdayMaxCredit = function(_error) {
                    var ary = new Array("1X029");
                    return _self.in_array(_error, ary)
                }
                ;
                _self.isBetTryAgain = function(errorCode) {
                    var ary = new Array("0X001","0X002");
                    return _self.in_array(errorCode, ary)
                }
                ;
                _self.isBusy = function(_error) {
                    var ary = new Array("0X003","0X004","0X005","0X007","0X008");
                    return _self.in_array(_error, ary)
                }
                ;
                _self.isOptimization = function(_error) {
                    var ary = new Array("0X006");
                    return _self.in_array(_error, ary)
                }
                ;
                _self.isConnectFail = function(_error) {
                    var ary = new Array("connectFail");
                    return _self.in_array(_error, ary)
                }
                ;
                _self.isOverSingleCredit = function(_error) {
                    var ary = new Array("1X036","1X018");
                    return _self.in_array(_error, ary)
                }
                ;
                _self.isLessSingleCredit = function(_error) {
                    var ary = new Array("1X004","1X022");
                    return _self.in_array(_error, ary)
                }
                ;
                _self.isCashError = function(_error) {
                    var ary = new Array("1X037");
                    return _self.in_array(_error, ary)
                }
                ;
                _self.chgPlayColor = function(dom, util, key) {
                    if (key) {
                        util.addClass(dom.getElementById(key), "newchg");
                        setTimeout(_self.removePlayChg, 1500, util, dom, key)
                    }
                }
                ;
                _self.removePlayChg = function(util, dom, key) {
                    if (dom.getElementById(key))
                        util.removeClass(dom.getElementById(key), "newchg")
                }
                ;
                _self.chgIorColor = function(dom, util, chgColorIor, cookie) {
                    var iorChgSw = cookie.get("iorChgSw");
                    if (util.countSize(chgColorIor) != 0 && iorChgSw != "N")
                        for (var key in chgColorIor)
                            if (chgColorIor[key] && dom.getElementById(key) != null) {
                                util.addClass(dom.getElementById(key), "odd_chg");
                                setTimeout(_self.removeOddChg, 1500, util, dom, key, chgColorIor)
                            }
                    return chgColorIor
                }
                ;
                _self.removeOddChg = function(util, dom, key, chgColorIor) {
                    util.removeClass(dom.getElementById(key), "odd_chg");
                    delete chgColorIor[key]
                }
                ;
                _self.delBetslip = function(util, _ECID) {
                    _self.deleteSelect(util, "ec_" + _ECID);
                    _self.initSelect(util)
                }
                ;
                _self.initSelect = function(util) {
                    if (top["bet_select_more"] != null)
                        for (var key in top["bet_select_more"]) {
                            var tmpObj_more = dom.getElementById(top["bet_select_more"][key]);
                            if (tmpObj_more != null)
                                util.addClass(tmpObj_more, "on")
                        }
                    for (var key in top["bet_select"]) {
                        var tmpObj = dom.getElementById(top["bet_select"][key]);
                        var OBTobj = dom.getElementById("OBT_" + top["bet_select"][key]);
                        var groupObj = dom.getElementById("group_" + top["bet_select"][key]);
                        var cupObj = dom.getElementById("cup_" + top["bet_select"][key]);
                        if (OBTobj != null)
                            util.addClass(OBTobj, "on");
                        if (tmpObj != null)
                            util.addClass(tmpObj, "on");
                        if (groupObj != null)
                            util.addClass(groupObj, "on");
                        if (cupObj != null)
                            util.addClass(cupObj, "on");
                        var tmp = top["bet_select"][key].split("_");
                        var needsTransWtype = new Array("RG","RPX","RSH","RSC","RNC","RNB");
                        var chose_team = tmp[3].substr(tmp[3].length - 1, 1);
                        for (var b = 0; b < needsTransWtype.length; b++)
                            if (tmp[3].match(needsTransWtype[b]))
                                if (top.bet_className != "game_more")
                                    tmp[3] = _self.transNextRtype(tmp[3], chose_team);
                        if (tmp[3].match("RF")) {
                            var tmpWtype = tmp[3].substr(0, tmp[3].length - 1);
                            if (top["transWtype"] && top["transWtype"][key] && top["transWtype"][key][tmpWtype])
                                if (tmpWtype == top["transWtype"][key][tmpWtype])
                                    tmp[3] = chose_team == "H" ? "RFH" : "RFC"
                        }
                        if (tmp[3].match(/^RGA[A-E][0-5][0-9](Y|N)$/g)) {
                            var tmpWtype = tmp[3].substr(0, tmp[3].length - 1);
                            if (top["transWtype"] && top["transWtype"][key] && top["transWtype"][key][tmpWtype])
                                if (tmpWtype == top["transWtype"][key][tmpWtype])
                                    tmp[3] = chose_team == "Y" ? "RGAY" : "RGAN"
                        }
                        if (tmp[3].match(/^(RPTW)[A-E][0-5][0-9](H|C)$/g)) {
                            var tmpWtype = tmp[3].substr(0, tmp[3].length - 1);
                            if (top["transWtype"] && top["transWtype"][key] && top["transWtype"][key][tmpWtype])
                                if (tmpWtype == top["transWtype"][key][tmpWtype])
                                    tmp[3] = chose_team == "H" ? "RPTWH" : "RPTWC"
                        }
                        if (tmp[3].match(/^(RWXP)[A-E][0-1](0|5)(H|C)$/g)) {
                            var tmpWtype = tmp[3].substr(0, tmp[3].length - 1);
                            if (top["transWtype"] && top["transWtype"][key] && top["transWtype"][key][tmpWtype])
                                if (tmpWtype == top["transWtype"][key][tmpWtype])
                                    tmp[3] = chose_team == "H" ? "RWXPH" : "RWXPC"
                        }
                        var targetNameR = tmp[0] + "_" + tmp[1] + "_" + tmp[2] + "_" + _self.transRtypeRB2R(tmp[3], "N");
                        var transObj = dom.getElementById(targetNameR);
                        var transOBTObj = dom.getElementById("OBT_" + targetNameR);
                        var transGroupObj = dom.getElementById("group_" + targetNameR);
                        var transCupObj = dom.getElementById("cup_" + targetNameR);
                        if (transObj != null)
                            util.addClass(transObj, "on");
                        if (transOBTObj != null)
                            util.addClass(transOBTObj, "on");
                        if (transGroupObj != null)
                            util.addClass(transGroupObj, "on");
                        if (transCupObj != null)
                            util.addClass(transCupObj, "on");
                        var targetNameRB = tmp[0] + "_" + tmp[1] + "_" + tmp[2] + "_" + _self.transRtypeR2RB(tmp[3], "N");
                        var transObj_RB = dom.getElementById(targetNameRB);
                        var transOBTObj_RB = dom.getElementById("OBT_" + targetNameRB);
                        var transGroupObj_RB = dom.getElementById("group_" + targetNameRB);
                        var transCupObj_RB = dom.getElementById("cup_" + targetNameRB);
                        if (transObj_RB != null)
                            util.addClass(transObj_RB, "on");
                        if (transOBTObj_RB != null)
                            util.addClass(transOBTObj_RB, "on");
                        if (transGroupObj_RB != null)
                            util.addClass(transGroupObj_RB, "on");
                        if (transCupObj_RB != null)
                            util.addClass(transCupObj_RB, "on")
                    }
                }
                ;
                _self.transNextRtype = function(rtype, chose_team) {
                    var newRtype = "";
                    if (rtype.match(/^[A-J]RG[HCN]$/g))
                        newRtype = "RG" + chose_team;
                    else if (rtype.match(/^RPX[A-O][HCN]$/g))
                        newRtype = "RPX" + chose_team;
                    else if (rtype.match(/^RSH[A-O][YN]$/g))
                        newRtype = "RSH" + chose_team;
                    else if (rtype.match(/^RSC[A-O][YN]$/g))
                        newRtype = "RSC" + chose_team;
                    else if (rtype.match(/^RNB[A-O][HC]$/g))
                        newRtype = "RNB" + chose_team;
                    else if (rtype.match(/^RNC[1-9]?[A-O]?[HC]$/g))
                        newRtype = "RNC" + chose_team;
                    else
                        newRtype = rtype;
                    return newRtype
                }
                ;
                _self.setSelect = function(dom, util, param) {
                    var needsToTransRtype = new Array("today","early","soon");
                    var _hash = param.paramHash;
                    var _key = _hash.gtype + "_" + _hash.ecid;
                    var _betKey = top["bet_select"]["ec_" + _hash.ecid];
                    var game_information = new Object;
                    var needsTransWtype = new Array("RG","RPX","RSH","RSC","RNC","RNB");
                    var tmpRtype = "";
                    if (_hash.gtype.toLowerCase() == "ft")
                        if (needsToTransRtype.indexOf(_hash.showtype) != -1 && top["bet_select"]["ec_" + _hash.ecid])
                            if (top.choice_filter == "RB")
                                _betKey = top["bet_select"]["ec_" + _hash.ecid];
                            else if (top.choice_filter == "MIX") {
                                var tmp = top["bet_select"]["ec_" + _hash.ecid].split("_");
                                if (_hash.is_rb != "Y")
                                    _betKey = tmp[0] + "_" + tmp[1] + "_" + tmp[2] + "_" + _self.transRtypeRB2R(tmp[3], "N");
                                else
                                    _betKey = tmp[0] + "_" + tmp[1] + "_" + tmp[2] + "_" + _self.transRtypeR2RB(tmp[3], "N")
                            } else {
                                var tmp = top["bet_select"]["ec_" + _hash.ecid].split("_");
                                _betKey = tmp[0] + "_" + tmp[1] + "_" + tmp[2] + "_" + _self.transRtypeRB2R(tmp[3], "N")
                            }
                        else if (needsToTransRtype.indexOf(_hash.showtype) == -1 && top["bet_select"]["ec_" + _hash.ecid]) {
                            var tmp = top["bet_select"]["ec_" + _hash.ecid].split("_");
                            if (_hash.is_rb != "Y" && (top.choice_showtype == "parlay" || top.choice_showtype == "hot"))
                                _betKey = tmp[0] + "_" + tmp[1] + "_" + tmp[2] + "_" + _self.transRtypeRB2R(tmp[3], "N");
                            else
                                _betKey = tmp[0] + "_" + tmp[1] + "_" + tmp[2] + "_" + _self.transRtypeR2RB(tmp[3], "N")
                        }
                    if (top["bet_select"]["ec_" + _hash.ecid]) {
                        var tmp = top["bet_select"]["ec_" + _hash.ecid].split("_");
                        var chose_team = tmp[3].substr(tmp[3].length - 1, 1);
                        for (var b = 0; b < needsTransWtype.length; b++)
                            if (tmp[3].match(needsTransWtype[b]))
                                if (top.bet_className != "game_more") {
                                    tmpRtype = _self.transNextRtype(tmp[3], chose_team);
                                    _betKey = tmp[0] + "_" + tmp[1] + "_" + tmp[2] + "_" + tmpRtype
                                } else
                                    _betKey = top["bet_select_more"]["ec_" + _hash.ecid];
                        if (tmp[3].match("RF") && top.bet_className != "game_more") {
                            var tmpWtype = tmp[3].substr(0, tmp[3].length - 1);
                            if (top["transWtype"] && top["transWtype"]["ec_" + _hash.ecid] && top["transWtype"]["ec_" + _hash.ecid][tmpWtype])
                                if (tmpWtype == top["transWtype"]["ec_" + _hash.ecid][tmpWtype])
                                    tmp[3] = chose_team == "H" ? "RFH" : "RFC";
                            _betKey = tmp[0] + "_" + tmp[1] + "_" + tmp[2] + "_" + tmp[3]
                        }
                        if (tmp[3].match(/^RGA[A-E][0-5][0-9](Y|N)$/g) && top.bet_className != "game_more") {
                            var tmpWtype = tmp[3].substr(0, tmp[3].length - 1);
                            if (top["transWtype"] && top["transWtype"]["ec_" + _hash.ecid] && top["transWtype"]["ec_" + _hash.ecid][tmpWtype])
                                if (tmpWtype == top["transWtype"]["ec_" + _hash.ecid][tmpWtype])
                                    tmp[3] = chose_team == "Y" ? "RGAY" : "RGAN";
                            _betKey = tmp[0] + "_" + tmp[1] + "_" + tmp[2] + "_" + tmp[3]
                        }
                        if (tmp[3].match(/^(RPTW)[A-E][0-5][0-9](H|C)$/g) && top.bet_className != "game_more") {
                            var tmpWtype = tmp[3].substr(0, tmp[3].length - 1);
                            if (top["transWtype"] && top["transWtype"]["ec_" + _hash.ecid] && top["transWtype"]["ec_" + _hash.ecid][tmpWtype])
                                if (tmpWtype == top["transWtype"]["ec_" + _hash.ecid][tmpWtype])
                                    tmp[3] = chose_team == "H" ? "RPTWH" : "RPTWC";
                            _betKey = tmp[0] + "_" + tmp[1] + "_" + tmp[2] + "_" + tmp[3]
                        }
                        if (tmp[3].match(/^(RWXP)[A-E][0-1](0|5)(H|C)$/g) && top.bet_className != "game_more") {
                            var tmpWtype = tmp[3].substr(0, tmp[3].length - 1);
                            if (top["transWtype"] && top["transWtype"]["ec_" + _hash.ecid] && top["transWtype"]["ec_" + _hash.ecid][tmpWtype])
                                if (tmpWtype == top["transWtype"]["ec_" + _hash.ecid][tmpWtype])
                                    tmp[3] = chose_team == "H" ? "RWXPH" : "RWXPC";
                            _betKey = tmp[0] + "_" + tmp[1] + "_" + tmp[2] + "_" + tmp[3]
                        }
                    }
                    var _tmpRtype = _hash.remain_rtype != null ? _hash.remain_rtype : _hash.rtype;
                    var tmpKey = "bet_" + _hash.gid + "_" + _hash.ecid + "_" + _tmpRtype.toUpperCase();
                    if (_betKey)
                        var isSameEcid = true;
                    var isRepeat = tmpKey == _betKey;
                    if (!isRepeat) {
                        if (util.in_object("ec_" + _hash.ecid, top["bet_select"])) {
                            _self.deleteSelect(util, "ec_" + _hash.ecid);
                            delete top["bet_ECID"]["gid_" + _hash.gid]
                        }
                        var targetName = "bet_" + _hash.gid + "_" + _hash.ecid + "_" + _tmpRtype.toUpperCase();
                        top["bet_select"]["ec_" + _hash.ecid] = targetName;
                        top["bet_ECID"]["gid_" + _hash.gid] = _hash.ecid;
                        top["bet_viewdata"]["ec_" + _hash.ecid] = _key;
                        var mainObj = dom.getElementById(targetName);
                        var OBTobj = dom.getElementById("OBT_" + targetName);
                        var groupObj = dom.getElementById("group_" + targetName);
                        var cupObj = dom.getElementById("cup_" + targetName);
                        if (OBTobj != null) {
                            util.removeClass(OBTobj, "odd_chg");
                            util.addClass(OBTobj, "on")
                        }
                        if (mainObj != null) {
                            util.removeClass(mainObj, "odd_chg");
                            util.addClass(mainObj, "on")
                        }
                        if (groupObj != null) {
                            util.removeClass(groupObj, "odd_chg");
                            util.addClass(groupObj, "on")
                        }
                        if (cupObj != null) {
                            util.removeClass(cupObj, "odd_chg");
                            util.addClass(cupObj, "on")
                        }
                        var selectRtype = "";
                        var targetName = "";
                        var targetName_more = "";
                        if (_hash.is_rb != "Y" && top.choice_showtype == "parlay" && top.choice_gtype == "ft") {
                            if (top.bet_className == "game_more") {
                                selectRtype = _self.transRtypeR2RB(_tmpRtype.toUpperCase(), "N");
                                targetName = "bet_" + _hash.gid + "_" + _hash.ecid + "_" + selectRtype;
                                top["bet_select"]["ec_" + _hash.ecid] = targetName
                            }
                            selectRtype = _self.transRtypeRB2R(_tmpRtype.toUpperCase(), "N");
                            targetName_more = "bet_" + _hash.gid + "_" + _hash.ecid + "_" + selectRtype;
                            top["bet_select_more"]["ec_" + _hash.ecid] = targetName_more
                        }
                        for (var a = 0; a < needsTransWtype.length; a++)
                            if (_tmpRtype.match(needsTransWtype[a])) {
                                selectRtype = _hash.rtype;
                                targetName_more = "bet_" + _hash.gid + "_" + _hash.ecid + "_" + selectRtype;
                                top["bet_select_more"]["ec_" + _hash.ecid] = targetName_more
                            }
                        if (_tmpRtype.match("RF") || _tmpRtype.match("RGA") || _tmpRtype.match("RPTW") || _tmpRtype.match("RWXP")) {
                            selectRtype = _hash.rtype;
                            targetName = "bet_" + _hash.gid + "_" + _hash.ecid + "_" + selectRtype;
                            targetName_more = "bet_" + _hash.gid + "_" + _hash.ecid + "_" + selectRtype;
                            top["bet_select"]["ec_" + _hash.ecid] = targetName;
                            top["bet_select_more"]["ec_" + _hash.ecid] = targetName_more
                        }
                    } else {
                        var tmpObj = dom.getElementById(top["bet_select"]["ec_" + _hash.ecid]);
                        var OBTobj = dom.getElementById("OBT_" + top["bet_select"]["ec_" + _hash.ecid]);
                        var groupObj = dom.getElementById("group_" + top["bet_select"]["ec_" + _hash.ecid]);
                        var cupObj = dom.getElementById("cup_" + top["bet_select"]["ec_" + _hash.ecid]);
                        if (OBTobj != null) {
                            util.removeClass(OBTobj, "odd_chg");
                            util.addClass(OBTobj, "on")
                        }
                        if (tmpObj != null) {
                            util.removeClass(tmpObj, "odd_chg");
                            util.addClass(tmpObj, "on")
                        }
                        if (groupObj != null) {
                            util.removeClass(groupObj, "odd_chg");
                            util.addClass(groupObj, "on")
                        }
                        if (cupObj != null) {
                            util.removeClass(cupObj, "odd_chg");
                            util.addClass(cupObj, "on")
                        }
                        _self.deleteSelect(util, "ec_" + _hash.ecid, _hash.betType);
                        delete top["bet_ECID"]["gid_" + _hash.gid];
                        if (util.countSize(top["bet_select"]) == 0)
                            top["isAddTotal"] = false
                    }
                    game_information["isRepeat"] = isRepeat;
                    game_information["isSameEcid"] = isSameEcid;
                    return game_information
                }
                ;
                _self.deleteSelect = function(util, _key) {
                    if (top["bet_select_more"] != null) {
                        var tmpObj_more = dom.getElementById(top["bet_select_more"][_key]);
                        if (tmpObj_more != null)
                            util.removeClass(tmpObj_more, "on");
                        delete top["bet_select_more"][_key]
                    }
                    var tmp = top["bet_select"][_key].split("_");
                    var needsTransWtype = new Array("RG","RPX","RSH","RSC","RNC","RNB");
                    var chose_team = tmp[3].substr(tmp[3].length - 1, 1);
                    for (var b = 0; b < needsTransWtype.length; b++)
                        if (tmp[3].match(needsTransWtype[b]))
                            if (top.bet_className != "game_more")
                                tmp[3] = _self.transNextRtype(tmp[3], chose_team);
                    if (tmp[3].match("RF")) {
                        var tmpWtype = tmp[3].substr(0, tmp[3].length - 1);
                        if (top["transWtype"] && top["transWtype"][_key] && top["transWtype"][_key][tmpWtype])
                            if (tmpWtype == top["transWtype"][_key][tmpWtype])
                                tmp[3] = chose_team == "H" ? "RFH" : "RFC"
                    }
                    if (tmp[3].match("RGA")) {
                        var tmpWtype = tmp[3].substr(0, tmp[3].length - 1);
                        if (top["transWtype"] && top["transWtype"][_key] && top["transWtype"][_key][tmpWtype])
                            if (tmpWtype == top["transWtype"][_key][tmpWtype])
                                tmp[3] = chose_team == "Y" ? "RGAY" : "RGAN"
                    }
                    if (tmp[3].match(/^(RPTW)[A-E][0-5][0-9](H|C)$/g)) {
                        var tmpWtype = tmp[3].substr(0, tmp[3].length - 1);
                        if (top["transWtype"] && top["transWtype"][_key] && top["transWtype"][_key][tmpWtype])
                            if (tmpWtype == top["transWtype"][_key][tmpWtype])
                                tmp[3] = chose_team == "H" ? "RPTWH" : "RPTWC"
                    }
                    if (tmp[3].match(/^(RWXP)[A-E][0-1](0|5)(H|C)$/g)) {
                        var tmpWtype = tmp[3].substr(0, tmp[3].length - 1);
                        if (top["transWtype"] && top["transWtype"][_key] && top["transWtype"][_key][tmpWtype])
                            if (tmpWtype == top["transWtype"][_key][tmpWtype])
                                tmp[3] = chose_team == "H" ? "RWXPH" : "RWXPC"
                    }
                    var targetNameR = tmp[0] + "_" + tmp[1] + "_" + tmp[2] + "_" + _self.transRtypeRB2R(tmp[3], "N");
                    var transObj = dom.getElementById(targetNameR);
                    var transOBTObj = dom.getElementById("OBT_" + targetNameR);
                    var transCupObj = dom.getElementById("cup_" + targetNameR);
                    var transGroupObj = dom.getElementById("group_" + targetNameR);
                    if (transObj != null) {
                        util.removeClass(transObj, "on");
                        util.removeClass(transObj, "odd_chg")
                    }
                    if (transOBTObj != null) {
                        util.removeClass(transOBTObj, "on");
                        util.removeClass(transOBTObj, "odd_chg")
                    }
                    if (transCupObj != null) {
                        util.removeClass(transCupObj, "on");
                        util.removeClass(transCupObj, "odd_chg")
                    }
                    if (transGroupObj != null) {
                        util.removeClass(transGroupObj, "on");
                        util.removeClass(transGroupObj, "odd_chg")
                    }
                    var targetNameRB = tmp[0] + "_" + tmp[1] + "_" + tmp[2] + "_" + _self.transRtypeR2RB(tmp[3], "N");
                    var transObj_RB = dom.getElementById(targetNameRB);
                    var transOBTObj_RB = dom.getElementById("OBT_" + targetNameRB);
                    var transCupObj_RB = dom.getElementById("cup_" + targetNameRB);
                    var transGroupObj_RB = dom.getElementById("group_" + targetNameRB);
                    if (transObj_RB != null) {
                        util.removeClass(transObj_RB, "on");
                        util.removeClass(transObj_RB, "odd_chg")
                    }
                    if (transOBTObj_RB != null) {
                        util.removeClass(transOBTObj_RB, "on");
                        util.removeClass(transOBTObj_RB, "odd_chg")
                    }
                    if (transCupObj_RB != null) {
                        util.removeClass(transCupObj_RB, "on");
                        util.removeClass(transCupObj_RB, "odd_chg")
                    }
                    if (transGroupObj_RB != null) {
                        util.removeClass(transGroupObj_RB, "on");
                        util.removeClass(transGroupObj_RB, "odd_chg")
                    }
                    delete top["keepGold"][top["bet_select"][_key]];
                    delete top["bet_select"][_key];
                    if (top["LastBet_select"] != null && _key && util.countSize(top.bet_select) == 0)
                        delete top["LastBet_select"][_key];
                    delete top["totalBetHash"][top["bet_viewdata"][_key]];
                    delete top["bet_viewdata"][_key];
                    top["fastBetHash"] = new Object
                }
                ;
                _self.chkXmlError = function(xml) {
                    var ret = xml.indexOf(">error<") != -1;
                    return ret
                }
                ;
                _self.checkTS = function(tarTS, newTS, _php) {
                    return tarTS == newTS
                }
                ;
                _self.jsonECToHash = function(jsonData, util) {
                    var ret = new Object;
                    var newHash = new Object;
                    var newAry = new Array;
                    for (var key in jsonData)
                        try {
                            if (jsonData[key]) {
                                var hasEC = "N";
                                var myGame = jsonData[key]["MTGAME"];
                                var ecid = top.choice_gtype == "es" ? "ec" + jsonData[key]["PARENT_ID"] : "ec" + jsonData[key]["GIDM"];
                                newHash[ecid] = new Object;
                                newHash[ecid]["hasEC"] = hasEC;
                                newHash[ecid]["myGame"] = myGame != null ? myGame : "";
                                var gameObj = jsonData[key];
                                newAry.push(ecid);
                                newHash[ecid] = gameObj
                            }
                        } catch (e) {
                            console.log(e.toString())
                        }
                    ret["obj"] = newHash;
                    ret["ary"] = newAry;
                    return ret
                }
                ;
                _self.convertNodeToHashForGame = function(NodeObj, orgHash) {
                    var ret = new Object;
                    var newHash = new Object;
                    var newAry = new Array;
                    var xmlHash = new Object;
                    for (var i = 0; i < NodeObj.children.length; i++)
                        try {
                            if (NodeObj.children[i].id == "")
                                continue;
                            var hasEC = NodeObj.children[i].getAttribute("hasEC");
                            var myGame = NodeObj.children[i].getAttribute("myGame");
                            var groupName = NodeObj.children[i].getAttribute("groupName");
                            var groupID = NodeObj.children[i].getAttribute("groupID");
                            newHash[NodeObj.children[i].id] = new Object;
                            newHash[NodeObj.children[i].id]["hasEC"] = hasEC;
                            newHash[NodeObj.children[i].id]["myGame"] = myGame != null ? myGame : "";
                            newHash[NodeObj.children[i].id]["groupName"] = groupName != null ? groupName : "";
                            newHash[NodeObj.children[i].id]["groupID"] = groupID != null ? groupID : "";
                            var gameObj = NodeObj.children[i].children[0];
                            newAry.push(NodeObj.children[i].id);
                            xmlHash[NodeObj.children[i].id] = gameObj;
                            for (var j = 0; j < gameObj.children.length; j++) {
                                var gamekey = gameObj.children[j].localName;
                                if (gamekey == "rga") {
                                    var RGA_TN = xmlnode.Node(gameObj, "RGA", false);
                                    var sw_wtype = RGA_TN[0].getAttribute("wtype");
                                    var ior_Y = xmlnode.Node(RGA_TN[0], "IOR_Y").innerHTML;
                                    var ior_N = xmlnode.Node(RGA_TN[0], "IOR_N").innerHTML;
                                    newHash[NodeObj.children[i].id]["wtype_" + gamekey] = sw_wtype;
                                    newHash[NodeObj.children[i].id]["ior_" + gamekey + "y"] = ior_Y;
                                    newHash[NodeObj.children[i].id]["ior_" + gamekey + "n"] = ior_N
                                } else if (gamekey == "rf") {
                                    var RF_TN = xmlnode.Node(gameObj, "RF", false);
                                    var sw_wtype = RF_TN[0].getAttribute("wtype");
                                    var ior_H = xmlnode.Node(RF_TN[0], "IOR_H").innerHTML;
                                    var ior_C = xmlnode.Node(RF_TN[0], "IOR_C").innerHTML;
                                    newHash[NodeObj.children[i].id]["wtype_" + gamekey] = sw_wtype;
                                    newHash[NodeObj.children[i].id]["ior_" + gamekey + "h"] = ior_H;
                                    newHash[NodeObj.children[i].id]["ior_" + gamekey + "c"] = ior_C
                                } else if (gamekey == "rptw") {
                                    var RPTW_BM = xmlnode.Node(gameObj, "RPTW", false);
                                    var sw_wtype = RPTW_BM[0].getAttribute("wtype");
                                    var ior_H = xmlnode.Node(RPTW_BM[0], "IOR_H").innerHTML;
                                    var ior_C = xmlnode.Node(RPTW_BM[0], "IOR_C").innerHTML;
                                    newHash[NodeObj.children[i].id]["wtype_" + gamekey] = sw_wtype;
                                    newHash[NodeObj.children[i].id]["ior_" + gamekey + "h"] = ior_H;
                                    newHash[NodeObj.children[i].id]["ior_" + gamekey + "c"] = ior_C
                                } else if (gamekey == "rwxp") {
                                    var RWXP_BM = xmlnode.Node(gameObj, "RWXP", false);
                                    var sw_wtype = RWXP_BM[0].getAttribute("wtype");
                                    var ior_H = xmlnode.Node(RWXP_BM[0], "IOR_H").innerHTML;
                                    var ior_C = xmlnode.Node(RWXP_BM[0], "IOR_C").innerHTML;
                                    newHash[NodeObj.children[i].id]["wtype_" + gamekey] = sw_wtype;
                                    newHash[NodeObj.children[i].id]["ior_" + gamekey + "h"] = ior_H;
                                    newHash[NodeObj.children[i].id]["ior_" + gamekey + "c"] = ior_C
                                } else {
                                    _key = gamekey;
                                    _value = gameObj.children[j].innerHTML;
                                    newHash[NodeObj.children[i].id][_key] = _value
                                }
                            }
                        } catch (e) {
                            console.log(e.toString())
                        }
                    ret["obj"] = orgHash != null ? _self.mergeHash(orgHash, newHash) : newHash;
                    ret["ary"] = newAry;
                    ret["xmlObj"] = xmlHash;
                    return ret
                }
                ;
                _self.convertNodeToHashForOBTGame = function(NodeObj, orgHash) {
                    var ret = new Object;
                    var newHash = new Object;
                    for (var i = 0; i < NodeObj.children.length; i++)
                        try {
                            if (NodeObj.children[i].id == "")
                                continue;
                            newHash[NodeObj.children[i].id] = new Object;
                            var gameObj = NodeObj.children[i].getElementsByTagName("game");
                            for (var j = 0; j < gameObj.length; j++) {
                                var _gid = gameObj[j].id;
                                newHash[NodeObj.children[i].id][_gid] = new Object;
                                for (var x = 0; x < gameObj[j].children.length; x++) {
                                    _key = gameObj[j].children[x].localName;
                                    _value = gameObj[j].children[x].innerHTML;
                                    newHash[NodeObj.children[i].id][_gid][_key] = _value
                                }
                            }
                        } catch (e) {
                            console.log(e.toString())
                        }
                    ret["obj"] = orgHash != null ? _self.mergeHash(orgHash, newHash) : newHash;
                    return ret
                }
                ;
                _self.convertNodeToHashForGroupGame = function(NodeObj, orgHash) {
                    var ret = new Object;
                    var newHash = new Object;
                    for (var i = 0; i < NodeObj.children.length; i++)
                        try {
                            if (NodeObj.children[i].id == "")
                                continue;
                            newHash[NodeObj.children[i].id] = new Object;
                            var gameObj = NodeObj.children[i].getElementsByTagName("Participant");
                            for (var j = 0; j < gameObj.length; j++) {
                                var partiID = gameObj[j].id;
                                var flag_class = gameObj[j].getAttribute("image_id");
                                newHash[NodeObj.children[i].id][partiID] = new Object;
                                for (var x = 0; x < gameObj[j].children.length; x++)
                                    if (gameObj[j].children[x].localName == "competitor") {
                                        newHash[NodeObj.children[i].id][partiID]["competitor"] = new Object;
                                        var comObj = gameObj[j].children[x];
                                        var comAry = new Array("rank","played","win","loss","draw","goals_for","goals_against","goals_diff","points");
                                        for (var b = 0; b < comAry.length; b++)
                                            newHash[NodeObj.children[i].id][partiID]["competitor"][comAry[b]] = comObj.getAttribute(comAry[b])
                                    } else {
                                        var item_id = gameObj[j].children[x].getAttribute("item_id");
                                        var rtypeID = partiID + "_" + x;
                                        newHash[NodeObj.children[i].id][partiID][rtypeID] = new Object;
                                        for (var v = 0; v < gameObj[j].children[x].children.length; v++) {
                                            _key = gameObj[j].children[x].children[v].localName;
                                            _value = gameObj[j].children[x].children[v].innerHTML;
                                            newHash[NodeObj.children[i].id][partiID][rtypeID][_key] = _value
                                        }
                                    }
                            }
                        } catch (e) {
                            console.log(e.toString())
                        }
                    ret["obj"] = orgHash != null ? _self.mergeHash(orgHash, newHash) : newHash;
                    return ret
                }
                ;
                _self.transMyGameShowtype = function(showtype) {
                    var hash = new Object;
                    hash[showtype] = showtype;
                    hash["rb"] = "live";
                    hash["ft"] = "today";
                    hash["fu"] = "early";
                    hash["em"] = "early";
                    return hash[showtype]
                }
                ;
                _self.checkBetFrom = function(type, from) {
                    var ret = "";
                    switch (type) {
                    case "special":
                        if (from == "R")
                            ret = "SA";
                        if (from == "M")
                            ret = "SB";
                        if (from == "O")
                            ret = "SC";
                        break;
                    case "mygame":
                        if (from == "R")
                            ret = "GD";
                        if (from == "M")
                            ret = "GE";
                        if (from == "O")
                            ret = "GF";
                        break;
                    case "outrights":
                        if (from == "R")
                            ret = "W";
                        break;
                    default:
                        ret = from
                    }
                    return ret
                }
                ;
                _self.sortHash = function(hash, sortMode) {
                    hash.sort(function(a, b) {
                        var tmp_a = a.split("-");
                        var tmp_b = b.split("-");
                        var AH = tmp_a[0].padStart(2, "0");
                        var AC = tmp_a[1].padStart(2, "0");
                        var BH = tmp_b[0].padStart(2, "0");
                        var BC = tmp_b[1].padStart(2, "0");
                        if (sortMode == "reverse")
                            return AC + AH - (BC + BH);
                        else
                            return AH + AC - (BH + BC)
                    })
                }
                ;
                _self.calcWinRate = function(iorH, iorC) {
                    if (iorH == undefined || iorC == undefined)
                        return false;
                    var ior_h = iorH * 1;
                    var ior_c = iorC * 1;
                    var retHash = new Array;
                    var z = 1 / ior_h * 100 + 1 / ior_c * 100;
                    if (ior_h < 1 || ior_c < 1 || z < 100)
                        return false;
                    else {
                        var h_rate = 1 / ior_h * 100 / z;
                        var c_rate = 1 / ior_c * 100 / z;
                        retHash.push(Math.round(h_rate * 100) / 100);
                        retHash.push(Math.round(c_rate * 100) / 100);
                        return retHash
                    }
                }
                ;
                _self.switchWtypeStr = function(wtype) {
                    var retWtypeAry = new Object;
                    retWtypeAry["R"] = "R";
                    retWtypeAry["M"] = "M";
                    retWtypeAry["OU"] = "OU";
                    retWtypeAry["OE"] = "OE";
                    retWtypeAry["RE"] = "R";
                    retWtypeAry["RM"] = "M";
                    retWtypeAry["ROU"] = "OU";
                    retWtypeAry["REO"] = "EO";
                    retWtypeAry["ROUH"] = "OUH";
                    retWtypeAry["ROUC"] = "OUC";
                    retWtypeAry["RWM"] = "WM";
                    retWtypeAry["RPD"] = "PD";
                    retWtypeAry["ROT"] = "OT";
                    retWtypeAry["HRE"] = "HR";
                    retWtypeAry["HROU"] = "HOU";
                    retWtypeAry["HRUH"] = "HOUH";
                    retWtypeAry["HRUC"] = "HOUC";
                    retWtypeAry["HRM"] = "HM";
                    retWtypeAry["HREO"] = "HEO";
                    retWtypeAry["HRWM"] = "HWM";
                    if (top.choice_gtype == "bs") {
                        retWtypeAry["RMX"] = "M";
                        retWtypeAry["MX"] = "M"
                    }
                    if (top.choice_gtype == "tn")
                        retWtypeAry["RF"] = "RF";
                    if (top.choice_gtype == "sk")
                        retWtypeAry["RF"] = "F";
                    if (top.choice_gtype == "bm") {
                        retWtypeAry["RPTW"] = "PTW";
                        retWtypeAry["RWXP"] = "WXP"
                    }
                    if (wtype.match(/^R?PD(3|5|7)?$/g))
                        retWtypeAry[wtype] = "PD";
                    else if (wtype.match(/^R?PD(H|C)?$/g))
                        retWtypeAry[wtype] = "PD";
                    else if (wtype.match(/^(R?PTW)[A-E][0-5][0-9]$/g))
                        retWtypeAry[wtype] = "PTW";
                    else if (wtype.match(/^(R?WXP)[A-E][0-1](0|5)$/g))
                        retWtypeAry[wtype] = "WXP";
                    else if (wtype.match(/^(RGA)[A-E][0-5][0-9]$/g))
                        retWtypeAry[wtype] = "RGA";
                    else if (wtype.match(/^(RGOU)[A-E][0-5][0-9]$/g))
                        retWtypeAry[wtype] = "RGOU";
                    else if (wtype.match(/^(RF)[A-E][0-5][0-9]$/g))
                        retWtypeAry[wtype] = "RF";
                    else if (wtype.match(/^(R?F)[0-5][0-9]$/g))
                        retWtypeAry[wtype] = "F";
                    return retWtypeAry[wtype] ? retWtypeAry[wtype] : wtype
                }
                ;
                _self.limitScore = function(score) {
                    var max = 999;
                    var ret = "";
                    ret = score * 1 > 999 ? "999" : score;
                    return ret
                }
                ;
                _self.transRatioStr = function(period, ratio) {
                    var ret = ratio;
                    var regex = /\.5/;
                    if (period * 1 == 2) {
                        ret = ratio * 1 < 10 ? "0" + ratio : ratio;
                        if (regex.test(ret))
                            ret = ret.replace(regex, ":30");
                        else
                            ret = ret + ":00"
                    }
                    return ret
                }
            }
            ;
