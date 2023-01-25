const CardanocliJs = require("./lib");
const os = require("os");
const path = require("path");
const dir = path.join(os.homedir(), "/configuration/cardano/");
const shelleyGenesisPath = dir + "preprod-shelley-genesis.json";
const options = {
  shelleyGenesisPath: shelleyGenesisPath,
  network: "testnet-magic 1"
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
  price,
  sellerPkh,
  marketplacePkh,
  royaltyPkh,
  royaltyPercentage
) => {
  const activityTokenName = '4143544956495459';
  const activityPolicyId = '20edea925974af2102c63adddbb6a6e789f8d3a16500b15bd1e1c32b';
  const marketplacePrice = price * 2.5 / 100;
  const royaltyPrice = (price - marketplacePrice) * royaltyPercentage / 100;
  const sellerPrice = price - marketplacePrice - royaltyPrice;
  return {
    "constructor": 0,
    "fields": [
      {
        "bytes": sellerPkh
      },
      {
        "list": [
          {
            "constructor": 0,
            "fields": [
              {
                "bytes": sellerPkh
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
                          "k":
                          {
                            "bytes": ""
                          },
                          "v":
                          {
                            "int": sellerPrice
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
                "bytes": marketplacePkh
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
                        {
                          "k":
                          {
                            "bytes": ""
                          }
                          ,
                          "v":
                          {
                            "int": marketplacePrice
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
                "bytes": royaltyPkh
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
                            "int": royaltyPrice
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
      {
        "constructor": 1,
        "fields": []
      },
      {
        "bytes": activityTokenName
      },
      {
        "bytes": activityPolicyId
      }
    ]
  }
}

const getBuyScript = (
  price,
  assetName,
  policyId,
  buyerPkh,
  marketplacePkh,
  royaltyPkh,
  timestamp,
  royaltyPercentage,
) => {
  const activityTokenName = '4143544956495459';
  const activityPolicyId = '20edea925974af2102c63adddbb6a6e789f8d3a16500b15bd1e1c32b';
  const marketplacePrice = price * 2.5 / 100;
  const royaltyPrice = (price - marketplacePrice) * royaltyPercentage / 100;
  return {
    "constructor": 0,
    "fields": [
      {
        "bytes": buyerPkh
      },
      {
        "list": [
          {
            "constructor": 0,
            "fields": [
              {
                "bytes": buyerPkh
              },
              {
                "map": [
                  {
                    "k": {
                      "bytes": policyId
                    },
                    "v": {
                      "map": [
                        {
                          "k": {
                            "bytes": assetName
                          },
                          "v": {
                            "int": 1
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
                "bytes": marketplacePkh
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
                        {
                          "k":
                          {
                            "bytes": ""
                          }
                          ,
                          "v":
                          {
                            "int": marketplacePrice
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
                "bytes": royaltyPkh
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
                            "int": royaltyPrice
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
      {
        "constructor": 0,
        "fields": [
          {
            "constructor": 0,
            "fields": [
              {
                "constructor": 0,
                "fields": [
                  {
                    "int": timestamp
                  }
                ]
              },
              {
                "constructor": 1,
                "fields": []
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
                            "int": price
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
      {
        "bytes": activityTokenName
      },
      {
        "bytes": activityPolicyId
      }
    ]
  }
}

module.exports = {
  cardanocliJs,
  createWallet,
  generatePolicyID,
  getListScript,
  getBuyScript
};