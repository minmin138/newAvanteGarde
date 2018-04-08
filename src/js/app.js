var dogMap = [
    "https://animalso.com/wp-content/uploads/2017/01/Golden-Retriever_6.jpg",
   "https://dnq5fc8vfw3ev.cloudfront.net/thumbs/aspect-large-normal/45000/45074/Van-Gogh/Irises.jpg"
]


App = {
  web3Provider: null,
  contracts: {},
  currentColor: null,

  init: function() {
    App.generateNewColor()
    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('ColorsERC721.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var TutorialTokenArtifact = data;
      App.contracts.TutorialToken = TruffleContract(TutorialTokenArtifact);

      // Set the provider for our contract.
      App.contracts.TutorialToken.setProvider(App.web3Provider);

      // Use our contract to retieve and mark the adopted pets.
      return App.getColorForUser();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#mintColors1', App.upload1);
    $(document).on('click', '#mintColors2', App.upload2);
    $(document).on('click', '#color', App.generateNewColor);
  },

  generateNewColor: function(event) { 
    document.getElementById('color').setAttribute('style', 'background-color: ' + App.getRandomColor())
  },

  upload1: function (event){
    event.preventDefault();
        var colorContractInstance;
    
        web3.eth.getAccounts(function(error, accounts) {
          if (error) {
            console.log(error);
          }
    
          var account = accounts[0];
          App.contracts.TutorialToken.deployed().then(function(instance) {
            colorContractInstance = instance;
            return colorContractInstance.mint(0, {from: account, value: new web3.BigNumber(1000000000000000)});
          }).then(function(result) {
            console.log("upload1 " + JSON.parse(result))
            App.addImage(0)
          }).catch(function(err) {
            console.log(err.message);
          });
        });
  },
  upload2: function (event){
    event.preventDefault();
        var colorContractInstance;
    
        web3.eth.getAccounts(function(error, accounts) {
          if (error) {
            console.log(error);
          }
    
          var account = accounts[0];
          App.contracts.TutorialToken.deployed().then(function(instance) {
            colorContractInstance = instance;
            return colorContractInstance.mint(1, {from: account, value: new web3.BigNumber(1000000000000000)});
          }).then(function(result) {
            console.log(" upload 2 ")
              
            App.addImage(1)
            // App.addColorBlock(new web3.BigNumber(parseInt(App.currentColor, 16)))
          }).catch(function(err) {
            console.log(err.message);
          });
        });
  },

  // uploadHash: function(event) {
  //   event.preventDefault();

  //   var ontractInstance;

  //   web3.eth.getAccounts(function(error, accounts) {
  //     if (error) {
  //       console.log(error);
  //     }

  //     var account = accounts[0];
  //     App.contracts.TutorialToken.deployed().then(function(instance) {
  //       colorContractInstance = instance;
  //       return colorContractInstance.mint(parseInt(App.currentColor, 16), {from: account, value: new web3.BigNumber(1000000000000000)});
  //     }).then(function(result) {
  //       App.addColorBlock(new web3.BigNumber(parseInt(App.currentColor, 16)))
  //     }).catch(function(err) {
  //       console.log(err.message);
  //     });
  //   });
  // },

  //   mintColors: function(event) {
  //   event.preventDefault();

  //   var colorContractInstance;

  //   web3.eth.getAccounts(function(error, accounts) {
  //     if (error) {
  //       console.log(error);
  //     }

  //     var account = accounts[0];
  //     App.contracts.TutorialToken.deployed().then(function(instance) {
  //       colorContractInstance = instance;
  //       return colorContractInstance.mint(parseInt(App.currentColor, 16), {from: account, value: new web3.BigNumber(1000000000000000)});
  //     }).then(function(result) {
  //       App.addColorBlock(new web3.BigNumber(parseInt(App.currentColor, 16)))
  //     }).catch(function(err) {
  //       console.log(err.message);
  //     });
  //   });
  // },

  getColorForUser: function() {
    var colorContractInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.TutorialToken.deployed().then(function(instance) {
        colorContractInstance = instance;
        return colorContractInstance.tokensOf(account);
      }).then((result) => { 
        result.forEach((bigIntColor) => { 
          console.log("^^ "+bigIntColor)
          // App.addImage(bigIntColor)
         
        })
      }).catch(function(err) {
        console.log(err.message);
      });

    });
  },

  addImage: function(imageIndex){
    var img=document.createElement("img");
    img.src=dogMap[imageIndex];
    console.log("dogMap");
    console.log("%% " + img.src + " index " + imageIndex);
    var foo = document.getElementById("fooBar");
    foo.appendChild(img);
    document.querySelector('#owner-colors').appendChild(foo)
    
  },

  addColorBlock: function (bigIntColor) { 
    let mainelement = document.createElement('div')
    let textElement = document.createElement('p')
    mainelement.setAttribute('style', 'display:inline-block;')
    let element = document.createElement('div')
    let colorString = "#" + "0".repeat(Math.max(0, 6 - bigIntColor.toNumber().toString(16).length)) + bigIntColor.toNumber().toString(16)
    textElement.innerText = colorString;
    element.setAttribute('style', 'background-color:' + colorString)
    element.setAttribute('class', "color-blocks")
    mainelement.appendChild(element)
    mainelement.appendChild(textElement)
    document.querySelector('#owner-colors').appendChild(mainelement)
  },

  getRandomColor: function() {
    var letters = '0123456789ABCDEF';
    let color = "";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    App.currentColor = color;
    return "#" + color;
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
