/**
 * 应用入口
 */
(function ($, Sammy, w) {
    //全局配置
    w.G = w.G || {
        //属性
        urlApi: '/gfix-api',   //服务接口访问映射
        user: null,     //登录信息

        //方法
        e:toastError,   //提示错误
        i:toastInfo     //提示信息
    };
    var app = createApp('#content');

    init();

    /**
     * 初始化应用
     * 
     */
    function init() {
        app.run('#/');
        initData();
        initEvent();
    }

    //初始化数据
    function initData() {
        way.set('app', {
            user: G.user
        });
    }

    /**
     * 
     * 初始化事件
     */
    function initEvent() {
        $('#login').click(function () {
            var payload = way.get("app.user");
            $.post(G.urlApi + "/api/user/auth", payload, function (rs) {
                if (rs.status === 'success') {
                    G.i("登录成功");
                    G.user = rs.data;
                    showUserNav(true);
                } else {
                   G.e( "登录失败：" + rs.message);
                }
                console.log(rs);
            });

            return false;
        });
        $('#logout').click(function(){
            G.user = null;
            showUserNav(false);
        });

    }

    function showUserNav(show) {
        if (show) {
            $('#user').text(G.user.username);
            $('#userNav').show();
            $('#loginForm').hide();
        } else {
             $('#user').text('-');
            $('#userNav').hide();
            $('#loginForm').show();
        }
    }

    /**
     * 初始化SAMMY应用
     * @param {any} el  DomID
     */
    function createApp(el) {
        var routes = [{
                hash: '#/',
                name: 'home'
            },
            {
                hash: '#/sdk',
                name: 'sdk'
            },
            {
                hash: '#/doc',
                name: 'doc'
            },
            {
                hash: '#/copy',
                name: 'copy'
            },
        ];
        return Sammy(el, function () {
            var self = this;
            var content = $(el);
            for (var i = 0; i < routes.length; i++) {
                var r = routes[i];
                //配置路由
                (function (r) {
                    var h = r.hash,
                        n = r.name,
                        u = 'partials/' + n + '/' + n
                    self.get(h, function () {
                        content.load(u + '.html', function () {
                            $.getScript(u + '.js', function () {
                                window[n] && window[n].init();
                            })
                        });
                        activeMenu(h);
                    })
                }(r));
            }
        });
    }

    /**
     * 
     * 菜单激活
     * @param {any} hash 
     */
    function activeMenu(hash) {

        var nav = $('#nav-bar');
        var target = nav.find('a[href="' + hash + '"]').parent('li');
        target.addClass('active');
        nav.find('li').not(target[0]).removeClass('active');
    }

    function toastError(msg){
        toast(msg,'error');
    }
    function toastInfo(msg){
        toast(msg,'info');
    }

    function toast(msg,type){
         $.toast({
            text: msg,
            bgColor: type == 'error' ?  '#f44' : null, // Background color for toast
            textColor:  type == 'error' ? '#fff' : null, // text color
            position:'bottom-center'
        });
    }

}($, Sammy, window))