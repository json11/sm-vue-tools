import axios from 'axios';
import {createError} from './utils/utils'
import {baseUrl} from './utils/env';

axios.defaults.timeout = 10000;
axios.defaults.baseURL = baseUrl;


//http request 拦截器
axios.interceptors.request.use(
    config => {
        // $dialog.loading.open('很快加载好了');
        config.data = JSON.stringify(config.data);
        config.headers = {
            'Content-Type':'application/json'
        }
        return config;
    },
    error => {
        return Promise.reject(err);
    }
);


//http response 拦截器
axios.interceptors.response.use(
    response => {
        // $dialog.loading.close();
        if(response.data.errCode ==2){
            console.log('错误特殊处理');
        }
        return response;
    },
    error => {
        // $dialog.loading.close();
        return Promise.reject(error)
    }
)


/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function get(url,params={}){
    return new Promise((resolve,reject) => {
        axios.get(url,{
            params:params
        })
            .then(response => {
                resolve(response.data);
            })
            .catch(err => {
                reject(err)
            })
    })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url,data = {}){
    return new Promise((resolve,reject) => {
        axios.post(url,data)
            .then(response => {
                const data = response.data;
                if(!data) {
                    return reject(createError(400, 'no data'))
                }
                if(data.code!== '200') {
                    return reject(createError(400, data.message))
                }
                resolve(data);
            },err => {
                reject(err)
            })
    })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url,data = {}){
    return new Promise((resolve,reject) => {
        axios.patch(url,data)
            .then(response => {
                resolve(response.data);
            },err => {
                reject(err)
            })
    })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url,data = {}){
    return new Promise((resolve,reject) => {
        axios.put(url,data)
            .then(response => {
                resolve(response.data);
            },err => {
                reject(err)
            })
    })
}

// 获取浏览器中的参数
export function getParams() {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = location.search.substr(1).match(reg);
    if (r) {
        return decodeURI(r[2]);
    }
    return null;
};

/**
 * 获取search中的参数信息，返回参数对象
 * @param {String} search 可选参数，空则表示获取当前地址栏中的参数，否则获取指定search中的参数信息
 * @return {Object} obj
 */
export function param2obj(search) {
    var obj = {};
    search = search.charAt(0) == "?" ? search.substring(1) : search;
    if (search == '') {
        return obj
    };
    var a_search = search.split('&');
    if (a_search) {
        for (var i = 0, len = a_search.length; i < len; i++) {
            var el = a_search[i];
            if (el) {
                var els = el.split('=');
                obj[els[0]] = decodeURIComponent(els[1]);
            }
        }
    }
    return obj;
};


// Cookie
export function Cookie(key, value, options) {
    if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
        options = options || {};

        if (value === null || value === undefined) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires,
                t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }
        value = String(value);

        return (document.cookie = [encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join(''));
    }
    options = value || {};
    var decode = options.raw ?
        function(s) {
            return s;
        } : decodeURIComponent;
    var pairs = document.cookie.split('; ');
    for (var i = 0,
             pair; pair = pairs[i] && pairs[i].split('='); i++) {
        if (decode(pair[0]) === key) return decode(pair[1] || '');
    }
    return null;
};

/**
 * 页面跳转
 * @param urlHref 要跳转的页面
 * @param isReplace 是否替换当前页面,默认为false[不替换]
 * @param isReload  是否重新加载当前页面,默认为true[重新加载]
 */
export function Go(urlHref, isReplace, isReload) {
    isReplace = isReplace || false;
    isReload = isReload && true;
    //跳转页面
    if (history.replaceState && isReplace) {
        history.replaceState("", "", urlHref);
        if (isReload) {
            location.reload(true);
        }
    } else {
        location.href = urlHref;
    }
};

// Dialog
export const  Dialog = {
    obj: {
        node: null,
        title: null,
        content: null,
        cancel: null,
        ok: null
    },
    _init: function() {
        var div = document.createElement('div');
        div.innerHTML = '<div class="weui_dialog_alert" id="weui_dialog" style="display: none;">' +
            '<div class="weui_mask"></div>' +
            '<div class="weui_dialog">' +
            '<div class="weui_dialog_hd"><strong id="weui_dialog_title" class="weui_dialog_title">温馨提示</strong></div>' +
            '<div class="weui_dialog_bd" id="weui_dialog_content"></div>' +
            '<div class="weui_dialog_ft">' +
            '<a id="weui_dialog_cancel" href="javascript:;" class="weui_btn_dialog default" style="display: none;">取消</a>' +
            '<a id="weui_dialog_ok" href="javascript:;" class="weui_btn_dialog primary">确定</a>' +
            '</div>' +
            '</div>' +
            '</div>';
        document.body.appendChild(div);
    },
    show: function(title, msg, okFunc, useCancel, cancelFunc, btnTextObj) {
        var self = this;
        self.obj.node = document.getElementById("weui_dialog");
        if (!self.obj.node) {
            self._init();
            self.obj.node = document.getElementById("weui_dialog");
        }
        self.obj.title = document.getElementById("weui_dialog_title");
        self.obj.content = document.getElementById("weui_dialog_content");
        self.obj.title.innerHTML = title || '温馨提示';
        self.obj.content.innerHTML = msg;

        if (useCancel) {
            self.obj.cancel = document.getElementById("weui_dialog_cancel");
            if (btnTextObj && btnTextObj.cancel) {
                self.obj.cancel.innerHTML = btnTextObj.cancel;
            }
            self.obj.cancel.style.display = "block";
            self.obj.cancel.onclick = function() {
                if (cancelFunc && typeof cancelFunc === 'function') {
                    cancelFunc(self.obj.node);
                } else {
                    self.hide();
                }
            }
        } else {
            self.obj.cancel && (self.obj.cancel.style.display = "none");
        }
        self.obj.ok = document.getElementById("weui_dialog_ok");
        if (btnTextObj && btnTextObj.ok) {
            self.obj.ok.innerHTML = btnTextObj.ok;
        }
        self.obj.ok.onclick = function() {
            if (okFunc && typeof okFunc === 'function') {
                okFunc(self.obj.node);
            } else {
                self.hide();
            }
        }
        self.obj.node.style.display = "block";
        return self;
    },
    hide: function() {
        var self = this;
        if (self.obj.node) {
            self.obj.node.style.display = "none";
            self.obj.title.innerHTML = '';
            self.obj.content.innerHTML = '';
            self.obj.cancel && (self.obj.cancel.onclick = null);
            self.obj.ok && (self.obj.ok.onclick = null);
        }
        return self;
    },
    done: function(f) {
        f && typeof f === 'function' && f(this.obj.node);
    }
}


// Loading
export const Loading = {
    obj: {
        node: null
    },
    _init: function() {
        var div = document.createElement('div');
        div.innerHTML = '<div id="weui_loading_toast" class="weui_loading_toast" style="display:none;">' +
            '<div class="weui_mask_transparent"></div>' +
            '<div class="weui_toast">' +
            '<div class="weui_loading">' +
            '<div class="weui_loading_leaf weui_loading_leaf_0"></div>' +
            '<div class="weui_loading_leaf weui_loading_leaf_1"></div>' +
            '<div class="weui_loading_leaf weui_loading_leaf_2"></div>' +
            '<div class="weui_loading_leaf weui_loading_leaf_3"></div>' +
            '<div class="weui_loading_leaf weui_loading_leaf_4"></div>' +
            '<div class="weui_loading_leaf weui_loading_leaf_5"></div>' +
            '<div class="weui_loading_leaf weui_loading_leaf_6"></div>' +
            '<div class="weui_loading_leaf weui_loading_leaf_7"></div>' +
            '<div class="weui_loading_leaf weui_loading_leaf_8"></div>' +
            '<div class="weui_loading_leaf weui_loading_leaf_9"></div>' +
            '<div class="weui_loading_leaf weui_loading_leaf_10"></div>' +
            '<div class="weui_loading_leaf weui_loading_leaf_11"></div>' +
            '</div>' +
            '<p class="weui_toast_content">加载中...</p>' +
            '</div>' +
            '</div>';
        document.body.appendChild(div);
    },
    show: function(autoHide, seconds) {
        var self = this;
        self.obj.node = document.getElementById("weui_loading_toast");
        if (!self.obj.node) {
            self._init();
            self.obj.node = document.getElementById("weui_loading_toast");
        }
        self.obj.node.style.display = "block";
        if (autoHide) {
            setTimeout(function() {
                self.hide();
            }, seconds * 1000 || 5000);
        }
        return self;
    },
    hide: function() {
        var self = this;
        if (self.obj.node) {
            self.obj.node.style.display = "none";
        }
        return self;
    },
    done: function(f) {
        f && typeof f === 'function' && f(this.obj.node);
    }
}

// Message弹框
export const Message = {
    obj : {
        node : null,
        childNode:null
    },
    _init : function(){
        var div = document.createElement('div');
        div.innerHTML = '<div id="weui_msg_alert"><div id="weui_msg_title"><div></div>';

        document.body.appendChild(div);
    },
    show : function(msg, seconds){
        var self = this;
        self.obj.node = document.getElementById("weui_msg_alert");
        if (!self.obj.node) {
            self._init();
            self.obj.node = document.getElementById("weui_msg_alert");
        }
        self.obj.childNode = document.getElementById('weui_msg_title');
        self.obj.childNode.innerHTML = msg ;
        self.obj.node.style.display = "block";

        setTimeout(function(){
            self.hide();
        }, seconds * 1000 || 1000);
        return self;
    },
    hide : function(){
        var self = this;
        if(self.obj.node){
            self.obj.node.style.display = "none";
            self.obj.childNode.innerHTML = "";
        }
        return self;
    },
    done : function(f){
        f && typeof f === 'function' && f(this.obj.node);
    }
}

// Message警告
export const Warn = {
    obj : {
        node : null
    },
    _init : function(){
        var div = document.createElement('div');
        div.innerHTML = '<div id="msg_tip_error" class="weui_toptips weui_warn js_tooltips msg_tip_error"></div>';
        document.body.appendChild(div);
    },
    show : function(msg,  seconds){
        var self = this;
        self.obj.node = document.getElementById("msg_tip_error");
        if (!self.obj.node) {
            self._init();
            self.obj.node = document.getElementById("msg_tip_error");
        }
        self.obj.node.innerHTML = msg;
        self.obj.node.style.display = "block";

        setTimeout(function(){
            self.hide();
        }, seconds * 1000 || 1000);
        return self;
    },
    hide : function(){
        var self = this;
        if(self.obj.node){
            self.obj.node.style.display = "none";
            self.obj.node.innerHTML = "";
        }
        return self;
    },
    done : function(f){
        f && typeof f === 'function' && f(this.obj.node);
    }
}

//获取url 参数
export  function GetQueryString(key) {
    var href=window.location.href;
    if(href && href.split("?").length>=2){
        var totalParam = href.split("?")[1];
        var params = totalParam.split("&");
        for(var i=0; i<params.length; i++){
            var param = params[i].split("=");
            if(param[0]==key){
                return param[1];
            }
        }
    }
    return '';
}

//调用原生方法
export function callHandler(handlerName, param,callBack) {
    var u = navigator.userAgent;
    //android终端
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
    //ios终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if(isAndroid) {
        var str = JSON.stringify(param);
        if(handlerName == "getParams"){
            Native.jsCall(handlerName,param,function (result) {
                callBack(result);
            });
        }else {
            Native.jsCall(handlerName,str,function (result) {
                callBack(result);
            });
        }
    }else if(isiOS) {
        Native.jsCall(handlerName,param,function (result) {
            callBack(result);
        });
    }
}










