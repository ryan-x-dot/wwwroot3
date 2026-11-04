function dashboard(_win, _dom){
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var classname = "dashboard";
    var chart_dashboard = null;
    var dateAry = null;
    var pr = null;
    var chartHash = new Object();
    var eventHandler = new Object();
    var getView;
    var cookie;
    var util;
    var LS;
    var dash_type = "";

    _self.init=function(){
        _self.initChartData();
    }

    _self.setParentclass=function(_parentclass){
        parentClass = _parentclass;
        getView = parentClass.getThis("getView");
        cookie = parentClass.getThis("cookie");
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
    }

    _self.getThis=function(varible){
        return eval(varible);
    }

    _self.initChartData=function(){


        chartHash["possess"] = function(mc, labelAry, dataAry){

            pr = mc.getContext('2d');

            return {
                type: 'bar',
                data: {
                    labels: labelAry,
                    dataPoints: [
                        { x: 10, y: 71, label: "alpha"}
                    ],
                    datasets: [{
                        data: dataAry,
                        backgroundColor: [],
                        hoverBackgroundColor: []
                    }]
                },
                options: {
                    cornerRadius: 2,
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: {
                        display: false
                    },
                    tooltips: _self.setToolTip('PR'),
                    scales: {
                        yAxes: [{
                            gridLines: {
                                zeroLineWidth:2,
                                zeroLineColor: "rgba(69, 129, 181, 1)"
                            },
                            ticks: {
                                beginAtZero:true,
                                fontSize: 11,
                                callback: function(value, index, values){
                                    return _self.chg_y_value(value, index, values);
                                }
                            }
                        }],
                        xAxes: [{
                            categoryPercentage: _self.getPercentage(),
                            barPercentage: _self.getPercentage(),
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                beginAtZero:true,
                                fontSize: 11,
                                fontColor: "rgba(69, 129, 181, 1)",
                                maxRotation: 0,
                                callback: function(value, index, values){
                                    return _self.chg_x_value(value, index, values);
                                }
                            },
                            scaleLabel: {
                                display: false,
                                labelString: LS.get("dash_D"),
                                fontColor: "rgba(69, 129, 181, 1)",
                            },
                            stacked: true
                        }]
                    }
                    // maintainAspectRatio: false,
                    // responsive: false
                }
            };
        };



        chartHash["members"] = function(mc, labelAry, dataAry){

            pr = mc.getContext('2d');
            var gradient1 = pr.createLinearGradient(0, 0, 0, 400);
            gradient1.addColorStop(0, '#D6A744');
            gradient1.addColorStop(1, '#CF7610');

            var gradient2 = pr.createLinearGradient(0, 0, 0, 400);
            gradient2.addColorStop(0, 'rgba(246, 200, 102, 11)');
            gradient2.addColorStop(0.5, 'rgba(229, 143, 57, 1)');

            return {
                type: 'bar',
                data: {
                    labels: labelAry,
                    datasets: [{
                        data: dataAry,
                        backgroundColor: gradient2,
                        pointHoverBackgroundColor: gradient2,
                        hoverBackgroundColor: gradient1
                    }]
                },
                options: {
                    cornerRadius: 2,
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: {
                        display: false
                    },
                    tooltips: _self.setToolTip('MW'),

                    scales: {
                        yAxes: [{
                            gridLines: {
                                zeroLineWidth:2,
                                zeroLineColor: "rgba(229, 143, 57, 1)"
                            },
                            ticks: {
                                beginAtZero:true,
                                fontSize: 11,
                                callback: function(value, index, values){
                                    return _self.chg_y_value(value, index, values);
                                }
                            }
                        }],
                        xAxes: [{
                            categoryPercentage: _self.getPercentage(),
                            barPercentage: _self.getPercentage(),
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                beginAtZero:true,
                                fontSize: 11,
                                fontColor: "rgba(229, 143, 57, 1)",
                                maxRotation: 0,
                                callback: function(value, index, values){
                                    return _self.chg_x_value(value, index, values);
                                }
                            },
                            scaleLabel: {
                                display: false,
                                labelString: LS.get("dash_D"),
                                fontColor: "rgba(229, 143, 57, 1)"
                            }
                        }]
                    }
                }
            };
        };


        chartHash["turnover"] = function(mc, labelAry, dataAry){

            pr = mc.getContext('2d');
            var gradient1 = pr.createLinearGradient(0, 0, 0, 400);
            gradient1.addColorStop(0, '#27916E');
            gradient1.addColorStop(1, '#5DB687');

            var gradient2 = pr.createLinearGradient(0, 0, 0, 400);
            gradient2.addColorStop(0, 'rgba(139, 216, 168, 1)');
            gradient2.addColorStop(0.5, 'rgba(83, 164, 127, 1)');

            return {
                type: 'bar',
                data: {
                    labels: labelAry,
                    datasets: [{
                        data: dataAry,
                        backgroundColor: gradient2,
                        pointHoverBackgroundColor: gradient2,
                        hoverBackgroundColor: gradient1
                    }]
                },
                options: {
                    cornerRadius: 2,
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: {
                        display: false
                    },
                    tooltips: _self.setToolTip('TO'),

                    scales: {
                        yAxes: [{
                            gridLines: {
                                zeroLineWidth:2,
                                zeroLineColor: "rgba(83, 164, 127, 1)"
                            },
                            ticks: {
                                beginAtZero:true,
                                fontSize: 11,
                                callback: function(value, index, values){
                                    return _self.chg_y_value(value, index, values);
                                }
                            },
                        }],
                        xAxes: [{
                            categoryPercentage: _self.getPercentage(),
                            barPercentage: _self.getPercentage(),
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                beginAtZero:true,
                                fontSize: 11,
                                fontColor: "rgba(83, 164, 127, 1)",
                                maxRotation: 0,
                                callback: function(value, index, values){
                                    return _self.chg_x_value(value, index, values);
                                }
                            },
                            scaleLabel: {
                                display: false,
                                labelString: LS.get("dash_D"),
                                fontColor: "rgba(83, 164, 127, 1)"
                            }
                        }]
                    }
                }
            };
        };

        chartHash["winloss"] = function(mc, labelAry, dataAry){

            pr = mc.getContext('2d');

            return {
                type: 'bar',
                data: {
                    labels: labelAry,
                    datasets: [{
                        data: dataAry,
                        backgroundColor: [],
                        hoverBackgroundColor: []
                    }, ]
                },
                options: {
                    cornerRadius: 2,
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: {
                        display: false
                    },
                    tooltips: _self.setToolTip('WL'),

                    scales: {
                        yAxes: [{
                            gridLines: {
                                zeroLineWidth:2,
                                zeroLineColor: "#2b82ba"
                            },
                            ticks: {
                                beginAtZero:true,
                                fontSize: 11,
                                callback: function(value, index, values){
                                    return _self.chg_y_value(value, index, values);
                                }
                            },
                        }],
                        xAxes: [{
                            categoryPercentage: _self.getPercentage(),
                            barPercentage: _self.getPercentage(),
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                beginAtZero:true,
                                fontSize: 11,
                                fontColor: "#2b82ba",
                                maxRotation: 0,
                                callback: function(value, index, values){
                                    return _self.chg_x_value(value, index, values);
                                }
                            },
                            scaleLabel: {
                                display: false,
                                labelString: LS.get("dash_D"),
                                fontColor: "#2b82ba"
                            }
                        }]
                    }
                }
            };
        };

    }


    _self.hideToopTip=function(){
        var obj = dom.getElementById('chartjs-tooltip');
        if(obj!=null) obj.style.opacity = 0;
    }

    _self.repaint=function(){
        _self.hideToopTip();
        chart_dashboard.update();
    }

    _self.destroy=function(){
        if(chart_dashboard!=null) chart_dashboard.destroy();
    }


    _self.show=function(type, mc, labelAry, dataAry, _dateAry, orgDate,click_flag){

        dateAry = _dateAry;
        dash_type = type;
        var lineChartData = chartHash[type](mc, labelAry, dataAry);
        chart_dashboard = new Chart(pr, lineChartData);
        if(type=="winloss"){
             _self.updateWinLoss(chart_dashboard);
        }else if(type=="possess"){
            _self.updatePossess(chart_dashboard);
        }


        var hasData = _self.hasDatas(dataAry);
        if(!hasData){
            _self.setY(chart_dashboard);
        }


        if(click_flag)_self.addDataClick(type, mc, orgDate);

    }


    _self.addDataClick=function(type, mc, orgDate){
        //if(getView().viewportwidth < 1024 || type=="members") return;
        if (getView().viewportwidth < 1024 ) return;

        mc.onclick = function(evt){
            util.checkReportTeach(cookie, parentClass);

            var activePoints = chart_dashboard.getElementsAtEvent(evt);
            var firstPoint = activePoints[0];
            if(firstPoint!=null){


                var label = chart_dashboard.data.labels[firstPoint._index];
                // var value = chart_dashboard.data.datasets[firstPoint._datasetIndex].data[firstPoint._index];
                var d = orgDate[label*1 - 1] || "";
                // console.log(label + ": " + d);
                parentClass.dispatchEvent("choseDateEvent", {"date":d});


            }
        };

    }



    _self.getPercentage=function(){
        var ret = 0.9;
        if(getView().viewportwidth < 768){
           ret = 0.9;
        }
        return ret;
    }

    _self.hasDatas=function(ary){
        var ret = false;
        for(var i=0; i<ary.length; i++){
            if(ary[i]*1!=0){
                ret = true;
                break;
            }
        }
        return ret;
    }

    _self.setY=function(chart_dashboard){
        chart_dashboard.options.scales.yAxes[0].ticks.steps = 1;
        chart_dashboard.options.scales.yAxes[0].ticks.max = 10;
        chart_dashboard.update();
    }

    _self.updatePossess=function(chart_dashboard){

        // var gradient1 = pr.createLinearGradient(0, 0, 0, 400);
        // gradient1.addColorStop(0, '#70A8BA');
        // gradient1.addColorStop(1, '#2572A3');

        // var gradient2 = pr.createLinearGradient(0, 0, 0, 400);
        // gradient2.addColorStop(0, 'rgba(143, 192, 212, 1)');
        // gradient2.addColorStop(0.5, 'rgba(69, 129, 181, 1)');



        var gradientWIN = pr.createLinearGradient(0, 0, 0, 400);
        var gradientLOSS = pr.createLinearGradient(0, 0, 0, 400);
        gradientWIN.addColorStop(0, '#70A8BA');
        gradientWIN.addColorStop(1, '#2572A3');
        gradientLOSS.addColorStop(0, 'rgba(130, 49, 38, 1)');
        gradientLOSS.addColorStop(0.5, 'rgba(176, 71, 55, 1)');

        var hoverWIN = pr.createLinearGradient(0, 0, 0, 400);
        var hoverLOSS = pr.createLinearGradient(0, 0, 0, 400);
        hoverWIN.addColorStop(0, 'rgba(143, 192, 212, 1)');
        hoverWIN.addColorStop(0.5, 'rgba(69, 129, 181, 1)');
        hoverLOSS.addColorStop(0, '#C53F32');
        hoverLOSS.addColorStop(1, '#8A281E');

        var barsWinLoss = chart_dashboard.data.datasets[0].data;

        for(var i = 0; i < barsWinLoss.length; i++){
            var color;
            var hoverColor;
            if(barsWinLoss[i] > 0){
                color = gradientWIN;
                hoverColor = hoverWIN;
            }else{
                color = gradientLOSS;
                hoverColor = hoverLOSS;
            }

            chart_dashboard.data.datasets[0].backgroundColor[i] = color;
            chart_dashboard.data.datasets[0].hoverBackgroundColor[i] = hoverColor;
        }

        chart_dashboard.update();


    }

    _self.updateWinLoss=function(chart_dashboard){

        var gradientWIN = pr.createLinearGradient(0, 0, 0, 400);
        var gradientLOSS = pr.createLinearGradient(0, 0, 0, 400);
        gradientWIN.addColorStop(0, 'rgba(143, 192, 212, 1)');
        gradientWIN.addColorStop(0.5, 'rgba(69, 129, 181, 1)');
        gradientLOSS.addColorStop(0, 'rgba(130, 49, 38, 1)');
        gradientLOSS.addColorStop(0.5, 'rgba(176, 71, 55, 1)');

        var hoverWIN = pr.createLinearGradient(0, 0, 0, 400);
        var hoverLOSS = pr.createLinearGradient(0, 0, 0, 400);
        hoverWIN.addColorStop(0, '#70A8BA');
        hoverWIN.addColorStop(1, '#2572A3');
        hoverLOSS.addColorStop(0, '#C53F32');
        hoverLOSS.addColorStop(1, '#8A281E');

        var barsWinLoss = chart_dashboard.data.datasets[0].data;

        for(var i = 0; i < barsWinLoss.length; i++){
            var color;
            var hoverColor;
            if(barsWinLoss[i] > 0){
                color = gradientWIN;
                hoverColor = hoverWIN;
            }else{
                color = gradientLOSS;
                hoverColor = hoverLOSS;
            }

            chart_dashboard.data.datasets[0].backgroundColor[i] = color;
            chart_dashboard.data.datasets[0].hoverBackgroundColor[i] = hoverColor;
        }

        chart_dashboard.update();
    }


    _self.setToolTip=function(_type){
        return {
            // Disable the on-canvas tooltip
            enabled: false,

            custom: function(tooltipModel) {


                // Tooltip Element
                var tooltipEl = dom.getElementById('chartjs-tooltip');

                // Create element on first render
                if (!tooltipEl) {

                    tooltipEl = dom.createElement('div');
                    tooltipEl.id = 'chartjs-tooltip';
                    var tmpModel = dom.getElementById("tooltip_model").cloneNode(true);
                    tmpModel.style.display = "";
                    tmpModel.id = "div_tooltip";
                    tooltipEl.appendChild(tmpModel);
                    // tooltipEl.innerHTML = '<table></table>';
                    document.body.appendChild(tooltipEl);
                }

                // Hide if no tooltip
                if (tooltipModel.opacity === 0) {
                    tooltipEl.style.opacity = 0;
                    return;
                }

                // Set caret Position
                tooltipEl.classList.remove('above', 'below', 'no-transform');
                if (tooltipModel.yAlign) {
                    tooltipEl.classList.add(tooltipModel.yAlign);
                } else {
                    tooltipEl.classList.add('no-transform');
                }

                function getBody(bodyItem) {
                    return bodyItem.lines;
                }


                // Set Text
                if (tooltipModel.body) {
                    var titleLines = tooltipModel.title || [];
                    var bodyLines = tooltipModel.body.map(getBody);
                    var _mc = util.getObjAry(tooltipEl, ",div_tooltip,tooltip_day,tooltip_value,tooltip_type,tooltip_week,");

                    titleLines.forEach(function(title) {
                        var d = dateAry[title*1 - 1] || "";
                        _mc["tooltip_week"].innerHTML = d;
                        _mc["tooltip_day"].innerHTML = LS.get("dash_D")+" "+title+" "+LS.get("dash_Ds");
                        _self.setTipClass(_mc["div_tooltip"], title);
                    });
                    _mc["tooltip_type"].innerHTML = _self.getTypeTitle(_type);

                    bodyLines.forEach(function(body, i) {
                        var points =(_type == "MW")? 0 : 2;
                        // body_arr = (body+"").split(".");
                        // if (body_arr.length != 1){
                        //     points = (body_arr[1].length>2)? 2 : body_arr[1].length;
                        // }
                        _mc["tooltip_value"].innerHTML = util.mprintf(body * 1, 0, points, false, true);
                        _self.chgDotColor(_mc["div_tooltip"], _type, body);
                        _self.checkWinLossClass(_mc["tooltip_value"], body);
                    });
                }

                _tooltipModel = tooltipModel;
                chart_this = this;

                // `this` will be the overall tooltip
                var position = this._chart.canvas.getBoundingClientRect();
                // _self.setPosition();

                // Display, position, and set styles for font
                tooltipEl.style.position = 'absolute';
                tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                tooltipEl.style.opacity = 1;
                tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                tooltipEl.style.pointerEvents = 'none';
            }
        };
    }
    var _tooltipModel;
    var chart_this;
    _self.setPosition=function(){
        var position = chart_this._chart.canvas.getBoundingClientRect();
        var tooltipEl = dom.getElementById("chartjs-tooltip");
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.left = position.left + window.pageXOffset + _tooltipModel.caretX + 'px';
        tooltipEl.style.top = position.top + window.pageYOffset + _tooltipModel.caretY + 'px';
        tooltipEl.style.opacity = 1;
    }

    _self.getTypeTitle=function(_type){
        var hash = new Object();
        hash["PR"] = LS.get("dash_PR");
        hash["MW"] = LS.get("dash_MW");
        hash["TO"] = LS.get("dash_TO");
        hash["WL"] = LS.get("dash_WL");
        return hash[_type]? hash[_type] : "";
    }

    _self.getTypeColor=function(_type, _val){
        var isWin = (_val*1 >=0) ? true : false;
        var hash = new Object();
        hash["PR"] = "";
        hash["MW"] = "yellow_dot";
        hash["TO"] = "green_dot";
        hash["WL"] = isWin ? "" : "red_dot";
        return hash[_type]? hash[_type] : "";
    }

    _self.chgDotColor=function(obj, _type, _val){
        var col = _self.getTypeColor(_type, _val);
        util.classFunc(obj, ["yellow_dot","green_dot","red_dot"], "remove");
        if(col!=""){
            util.classFunc(obj, col, "");
        }
    }

    _self.setTipClass=function(obj, i){
        var n = (dateAry.length / 3) * 2; //over 2/3 turn left
        var r = i > n;

        util.classFunc(obj, "tip_left", "remove");
        if(r){
            util.classFunc(obj, "tip_left", "");
        }
    }

    _self.checkWinLossClass=function(obj, _val){
        var isWin = (_val*1 >=0) ? true : false;
        util.classFunc(obj, "word_red", "remove");
        if(!isWin){
            util.classFunc(obj, "word_red", "");
        }
    }

    _self.chg_y_value=function(value, index, values){
        var val = value.toString();
        var n = val.length;
        var len = 0;
        var base = "";
        var ret = value;
        if(n > 13){
            base = "T";
            len = 12;
        }else if(n > 10){
            base = "B";
            len = 9;
        }else if(n > 7){
            base = "M";
            len = 6;
        }else if(n > 4){
            base = "K";
            len = 3;
        }
        if(base!=""){
            ret = val.substring(0,n-len) + " " +base;
        }
        ret += "    ";
        return ret;
    }

    _self.chg_x_value=function(value, index, values){
        if(getView().viewportwidth < 768){
            return (value%2==0)? "" : value;
        }
        return value;
    }

    _self.addEventListener=function(eventname, eventFunction){
        eventHandler[eventname] = eventFunction;
    }

    _self.dispatchEvent=function(eventname, param){
        if(eventHandler[eventname]) eventHandler[eventname](param);
	}
}