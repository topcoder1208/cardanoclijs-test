const CardanocliJs = require("cardanocli-js");
const os = require("os");
const path = require("path");
const dir = path.join(os.homedir(), "/configuration/cardano/");
const shelleyGenesisPath = dir + "testnet-shelley-genesis.json";
console.log(shelleyGenesisPath)
const options = {
  shelleyGenesisPath: shelleyGenesisPath,
  network: "testnet-magic 1097911063"
}

const cardanocliJs = new CardanocliJs(options);

const createWallet = (account) => {
  try {
    const paymentKeys = cardanocliJs.addressKeyGen(account);
    const stakeKeys = cardanocliJs.stakeAddressKeyGen(account);
    const stakeAddr = cardanocliJs.stakeAddressBuild(account);
    const paymentAddr = cardanocliJs.addressBuild(account, {
      "paymentVkey": paymentKeys.vkey,
      "stakeVkey": stakeKeys.vkey
    });
    return cardanocliJs.wallet(account);
  } catch (e) {
    console.log(e)
  }
};

const generatePolicyID = (name) => {
  const wallet = createWallet(name);
  if (wallet) {
    const mintScript = {
      keyHash: cardanocliJs.addressKeyHash(wallet.name),
      type: "sig"
    }
    const POLICY_ID = cardanocliJs.transactionPolicyid(mintScript)
    return POLICY_ID;
  } else {
    return '';
  }
}

const getListScript = (
  sellerPkh,
  marketplacePkh,
  royaltyPkh,
  activityTokenName,
  activityPolicyId
) => {
  return `{
    "constructor": 0,
    "fields": [
      {
        "bytes": "${sellerPkh}"
      },
      {
        "list": [
          {
            "constructor": 0,
            "fields": [
              {
                "bytes": "${sellerPkh}"
              },
              {
                "map": [
                  {
                    "k": {
                        "bytes": ""
                      },
                    "v": {
                      "map":[
                        { "k":
                          {
                            "bytes": ""
                          },
                          "v":
                          {
                            "int": 8000000
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            ]
          },
          {
            "constructor": 0,
            "fields": [
              {
                "bytes": "${marketplacePkh}"
              },
              {
                "map": [
                  {
                    "k":
                      {
                        "bytes": ""
                      },
                    "v": {
                      "map": [
                        { "k":
                          {
                            "bytes": ""
                          }
                        ,
                          "v":
                          {
                            "int": 1000000
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            ]
          },
          {
            "constructor": 0,
            "fields": [
              {
                "bytes": "${royaltyPkh}"
              },
              {
                "map": [
                  {
                    "k": {
                        "bytes": ""
                      },
                    "v": {
                      "map": [
                        {
                          "k": {
                        "bytes": ""
                      },
                          "v":
                          {
                            "int": 1000000
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      { "constructor": 1,
        "fields": []
      },
      {
        "bytes": "${activityTokenName}"
      },
      {
        "bytes": "${activityPolicyId}"
      }
    ]
  }`
}

module.exports = {
  cardanocliJs,
  createWallet,
  generatePolicyID,
  getListScript
};