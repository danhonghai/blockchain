define([
    '../../app'
], function(controllers) {
    controllers
        .controller('HeaderController', ['$scope', 'Services', '$rootScope', '$state', '$filter', function($scope, Services, $rootScope, $state, $filter) {
            $scope.account = "";
            $scope.data={
                showpopup : false
            }
            $scope.showPopup = function() {
                $scope.data.showpopup = true;
            }
            if (sessionStorage.token) {
                var account = sessionStorage.account;
                //var account = "18758035164@163.com";
                if (account.indexOf("@") != -1) {
                    var accounts = account.split("@");
                    $scope.account = $filter('limitTo')(accounts[0], accounts[0].length - 4) + "****@" + accounts[1];
                } else {
                    $scope.account = $filter('limitTo')(account, 3) + "****" + $filter('limitTo')(account, -4);
                }
            }
            //退出登录
            $scope.loginout = function() {
                Services.getData("logout", {}, function(data) {
                    sessionStorage.token = "";
                    sessionStorage.account = "";
                    sessionStorage.userId = "";
                    $state.go("logged.login", null, { reload: true });
                })
            }

            //判断当前语言环境
            if (sessionStorage.language && sessionStorage.language == 2) { //English
                $rootScope.language = 2;
                $rootScope.lang = english;
                document.title="Hayek exchange platform HayekEx - a global digital assets trading platform with attitude";
                document.getElementsByTagName('meta')[1].content="Bitcoin trading platform, digital assets trading platform, cryptocurrency trading platform, Bitcoin exchange, Litecoin exchange, Ethereum exchange, Bitcoin price, Bitcoin market, invest in Bitcoin, buy Bitcoin";
                document.getElementsByTagName('meta')[2].content="Hayek Exchange is a global digital assets trading platform with attitude,providing global cryptocurrency enthusiasts with safe, convenient and professional Bitcoin (BTC), Ethereum (ETH), Litecoin (LTC) and other exchange services. We also provide up to date bitcoin prices, Bitcoin market information, and strive to create a global professional bitcoin trading platform.";

            } else {
                $rootScope.language = 1;
                $rootScope.lang = chinese;
                document.title="哈耶克交易平台HayekEx-有态度的全球数字资产交易所";
                document.getElementsByTagName('meta')[1].content="比特币交易平台，数字资产交易平台，数字货币交易平台，比特币交易，莱特币交易，以太坊，比特币价格，比特币行情，比特币投资，买比特币，BTC，LTC，ETH，USDT,HayekEx";
                document.getElementsByTagName('meta')[2].content="哈耶克交易网是一家有态度的全球数字资产交易所，为全球数字货币爱好者提供安全、便捷、专业的比特比(BTC)、以太坊(ETH)、莱特币(LTC)等交易服务，并提供实时比特币价格、比特币行情，致力打造全球专业的比特币交易平台。";
            }

            //切换语言
            $scope.changeLanguage = function(value) {
                $rootScope.language = value;
                sessionStorage.language = value;
                if (value == 1) {
                    $rootScope.lang = chinese;
                    document.title="哈耶克交易平台HayekEx-有态度的全球数字资产交易所";
                    document.getElementsByTagName('meta')[1].content="比特币交易平台，数字资产交易平台，数字货币交易平台，比特币交易，莱特币交易，以太坊，比特币价格，比特币行情，比特币投资，买比特币，BTC，LTC，ETH，USDT,HayekEx";
                    document.getElementsByTagName('meta')[2].content="哈耶克交易网是一家有态度的全球数字资产交易所，为全球数字货币爱好者提供安全、便捷、专业的比特比(BTC)、以太坊(ETH)、莱特币(LTC)等交易服务，并提供实时比特币价格、比特币行情，致力打造全球专业的比特币交易平台。";
                } else if (value == 2) {
                    $rootScope.lang = english;
                    document.title="Hayek exchange platform HayekEx - a global digital assets trading platform with attitude";
                    document.getElementsByTagName('meta')[1].content="Bitcoin trading platform, digital assets trading platform, cryptocurrency trading platform, Bitcoin exchange, Litecoin exchange, Ethereum exchange, Bitcoin price, Bitcoin market, invest in Bitcoin, buy Bitcoin";
                    document.getElementsByTagName('meta')[2].content="Hayek Exchange is a global digital assets trading platform with attitude,providing global cryptocurrency enthusiasts with safe, convenient and professional Bitcoin (BTC), Ethereum (ETH), Litecoin (LTC) and other exchange services. We also provide up to date bitcoin prices, Bitcoin market information, and strive to create a global professional bitcoin trading platform.";
                }
                location.reload();
            }


        }]);
});