App = {
    web3Provider:null,
    contracts:{},
    account:"0x0",
    loading: false,
    tokenPrice: 1000000000000000,
    tokensSold: 0,
    tokensAvailable: 7500000,
    init:function(){
        console.log("App Initialized....");
        return App.loadWeb3();
    },
    loadWeb3: function(){
        // Specify default instance if no web3 instance provided
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        web3 = new Web3(App.web3Provider);
        return App.loadContract();
    },
    loadContract:function(){
        $.getJSON("MappsTokenSale.json", function(mappsTokenSale){
            App.contracts.MappsTokenSale = TruffleContract(mappsTokenSale);
            App.contracts.MappsTokenSale.setProvider(App.web3Provider);
            App.contracts.MappsTokenSale.deployed().then(function(mappsTokenSale){
                console.log("Mapp Token Sale Address:", mappsTokenSale.address);
            });
        }).done(function(){
            $.getJSON("MappsToken.json", function(mappsToken){
                App.contracts.MappsToken = TruffleContract(mappsToken);
                App.contracts.MappsToken.setProvider(App.web3Provider);
                App.contracts.MappsToken.deployed().then(function(mappsToken){
                    console.log("Mapp Token  Address:", mappsToken.address);
                });
            });
            App.listenForEvents();
            return App.render();
        });
    },
    // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.MappsTokenSale.deployed().then(function(instance) {
      instance.Sell({}, {
        fromBlock: 0,
        toBlock: 'latest',
      }).watch(function(error, event) {
        console.log("event triggered", event);
        App.render();
      })
    })
  },
    render: function(){
        if (App.loading) {
        return;
        }
        App.loading = true;
    
        var loader  = $('#loader');
        var content = $('#content');
    
        loader.show();
        content.hide();
        web3.eth.getAccounts(function(err,account){
            if(err === null){
                App.account = account[4];
                console.log("account : ", App.account);
                $('#accountAddress').html("your account: " + account[0]);
            }
        });
       // Load token sale contract
    App.contracts.MappsTokenSale.deployed().then(function(instance) {
        mappsTokenSaleInstance = instance;
        return mappsTokenSaleInstance.tokenPrice();
      }).then(function(tokenPrice) {
        App.tokenPrice = tokenPrice;
        $('.token-price').html(web3.fromWei(App.tokenPrice, "ether").toNumber());
        return mappsTokenSaleInstance.tokensSold();
      }).then(function(tokensSold) {
        App.tokensSold = tokensSold.toNumber();
        $('.tokens-sold').html(App.tokensSold);
        $('.tokens-available').html(App.tokensAvailable);
  
        var progressPercent = (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
        $('#progress').css('width', progressPercent + '%');
  
        // Load token contract
        App.contracts.MappsToken.deployed().then(function(instance) {
            mappsTokenInstance = instance;
          return mappsTokenInstance.balanceOf(App.account);
        }).then(function(balance) {
            console.log(balance.toNumber());
          $('.mapps-balance').html(balance.toNumber());
          App.loading = false;
          loader.hide();
          content.show();
        })
      });
    },
    buyTokens: function() {
        $('#content').hide();
        $('#loader').show();
        var numberOfTokens = $('#numberOfTokens').val();
        App.contracts.MappsTokenSale.deployed().then(function(instance) {
          return instance.buyTokens(numberOfTokens, {
            from: App.account,
            value: numberOfTokens * App.tokenPrice,
            gas: 500000 // Gas limit
          });
        }).then(function(result) {
          console.log("Tokens bought...")
          $('form').trigger('reset') // reset number of tokens in form
          // Wait for Sell event
        });
      }
};

$(()=>{
    $(window).load(()=>{
        App.init();
    })
})