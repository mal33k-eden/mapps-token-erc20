const ethereumButton = document.querySelector('.enableEthereumButton');
App = {
    ropstenTestNet:'https://ropsten.infura.io/v3/66d10f25b1974a5383319c94e91fa208',
    infuraKey:'66d10f25b1974a5383319c94e91fa208',
    web3Provider:null,
    contracts:{},
    MTCADD:"0x84640Ac4446875915F54C55c2F7c9DB4DE3c8F26",
    MTSCADD:"0x35295e11F9d13bd01805722e386995767531F23B",
    account:"0x0",
    admin:"0x0",
    loading: false,
    tokenPrice: 1000000000000000,
    tokensSold: 0,
    tokensAvailable: 7500000,
    init:function(){
        console.log("App Initialized....");
        //Load metamask function on load
        App.requestMetaMaskWallet();
        App.admin="0xA9B67fc86a5D1F983a3Efe36aa732ce6D441fecB";
        return  App.loadWeb3();
    },
    loadWeb3: function(){
      // Specify default instance if no web3 instance provided
      //App.web3Provider = new Web3.providers.HttpProvider("http://localhost.com:7545");
      App.web3Provider = new Web3.providers.HttpProvider(App.ropstenTestNet);
      //App.web3Provider = new Web3HttpProvider(`https://rinkeby.infura.io/v3/${App.infuraKey}`);
      web3 = new Web3(App.web3Provider);
      //console.log(web3);
        return App.loadContract();
    },
    connectToMetaMaskWallet: async function(){
      await ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(App.loadMetaMaskWallet)
      .catch((err) => {
        
      });
    },
    requestMetaMaskWallet: function(){
      ethereum.request({ method: 'eth_accounts' })
            .then(App.loadMetaMaskWallet)
            .catch((err) => {
              // Some unexpected error.
              // For backwards compatibility reasons, if no accounts are available,
              // eth_accounts will return an empty array.
              console.error(err);
              $(".enableEthereumButton").show();
              ethereumButton.addEventListener('click', () => {
                //Will Start the metamask extension
                App.connectToMetaMaskWallet();
              });
            });
    },
    loadMetaMaskWallet: function(accounts){
      if(Array.isArray(accounts)){
        if (accounts.length === 0) {
          // MetaMask is locked or the user has not connected any accounts
          console.log('Please connect to MetaMask.');
              $(".enableEthereumButton").show();
              ethereumButton.addEventListener('click', () => {
                //Will Start the metamask extension
                App.connectToMetaMaskWallet();
              });
        } else if (accounts[0] !== App.account) {
          App.account = accounts[0];
          // Do any other work!
          $(".enableEthereumButton").hide();
          $('#accountAddress').html("your account: " + App.account);
        }
      }else if (accounts !== App.account) {
        App.account = accounts[0];
        // Do any other work!
        $(".enableEthereumButton").hide();
        $('#accountAddress').html("your account: " + App.account);
      }
        
    },
    loadContract:function(){
      App.contracts.MappsToken = new web3.eth.Contract(abi,App.MTCADD);
      App.contracts.MappsTokenSale = new web3.eth.Contract(saleabi,App.MTSCADD);
      //App.listenForEvents();
      return App.render();
    },
    // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.MappsTokenSale.events.Sell({
        fromBlock: 0,
        toBlock: 'latest',
    },function(error, event){
      console.log("error triggered", error);
      console.log("event triggered", event);
      App.render();
    });
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
       App.contracts.MappsTokenSale.methods.tokenPrice().call().then((tokenPrice)=>{
            App.tokenPrice = tokenPrice;
            $('.token-price').html(web3.utils.fromWei(App.tokenPrice, "ether"));
            $('.mapps-price').html(web3.utils.fromWei(App.tokenPrice, "ether"));
            return App.contracts.MappsTokenSale.methods.tokensSold().call();
        }).then((tokensSold)=>{
            App.tokensSold = tokensSold;
            $('.tokens-sold').html(App.tokensSold);
            $('.tokens-available').html(App.tokensAvailable);
            var progressPercent = (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
            $('#progress').css('width', progressPercent + '%');

            return  App.contracts.MappsToken.methods.balanceOf(App.account).call();
        }).then((balance)=>{
          console.log(balance);
          $('.mapps-balance').html(balance);
        });
        App.loading = false;
          loader.hide();
          content.show();
  },
  buildTransaction:function(){
    var numberOfTokens = $('#numberOfTokens').val();
    var encoded_tx = App.contracts.MappsTokenSale.methods
                .buyTokens(numberOfTokens).encodeABI();
                let transactionObject = {
                  gas: 500000,
                  data: encoded_tx,
                  from: ethereum.selectedAddress,
                  to: App.MTSCADD,
                  value: numberOfTokens * App.tokenPrice,
              };
    return transactionObject;
  },
    buyTokens:async  function() {
        $('#content').hide();
        $('#loader').show();
        web3.eth.accounts.signTransaction(
          App.buildTransaction(),
           'PRIVATE KEY GOES HERE',function(e,r){
                          if (e) {
                            console.log(e);
                            // handle error
                        } else {
                            web3.eth.sendSignedTransaction(r.rawTransaction).on('receipt', function (receipt) {
                                //do something
                                console.log(receipt);
                        });
                      }
           });
        

                      // .then(function(result) {
                      //   console.log(result)
                      //   $('form').trigger('reset') // reset number of tokens in form
                      //   // Wait for Sell event
                      // });
      }
};

$(()=>{
  App.init();
});