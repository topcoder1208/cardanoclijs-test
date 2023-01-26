const { resolvePaymentKeyHash } = require('@meshsdk/core');
const fs = require('fs');
const execSync = typeof window !== "undefined" || require("child_process").execSync;
const network = '--testnet-magic 1';
const transactionBuildOutputFile = "./tx.raw"

const buildBuyTransaction = () => {
    const buyerAddr = 'addr_test1vq6ww4d9qtgu059ssk6kuzamj8hy5qgnal7cu5y3qnf949gt56mv7'
    const sellerAddr = 'addr_test1vqu3wfxvmkume0lvqpu47duvykl3n7p3fj3s227jw4452xgfgls2x'
    const marketplaceAddr = 'addr_test1vq0smr77axmdr7sh3vsklpkqzq9hevv55tzm46vj4l3nxhqxe0vrc'
    const value = '1724100 lovelace + 1 d6cfdbedd242056674c0e51ead01785497e3a48afbbb146dc72ee1e2.123456'
    const sellerAmount = '8000000 lovelace'
    const marketPlaceAmount = '1000000 lovelace'
    const datumFile = '/home/ubuntu/dev/marketplace/temp/testnet/datums/0/buy.json'
    const royalitiesAddr = 'addr_test1vq9ksly6y728ccr2c3npq0r3zfaj322l28y2kvf5e8af00s05v5nw'
    const royalitiesAmount = '1000000 lovelace'
    const redeemerFile = "/home/ubuntu/dev/marketplace/temp/testnet/redeemers/0/buy.json"
    const datumHash = "17de5fda4462ee46989ccaca48c7e55a778b79d0c48d40886c7283b022205ba8"
    const spenderAddress = "addr_test1vq6ww4d9qtgu059ssk6kuzamj8hy5qgnal7cu5y3qnf949gt56mv7"
    const buyerExchangerDatum = "/home/ubuntu/dev/marketplace/temp/testnet/datums/0/buyerExchange.json"
    const subtractOutput = "0 lovelace"
    const nftValidatorFile = "/home/ubuntu/dev/marketplace/scripts/direct-sale.plutus"
    const scriptHash = "addr_test1wqg9q96l0k2r56t7dqhsp0926m7u0nqdjcc2pnpf7erlg8qw4et2m"

    const utxoScript = execSync(`cardano-cli query utxo --address ${scriptHash} ${network} | grep ${datumHash} | head -n 1 | cardano-cli-balance-fixer parse-as-utxo`).toString().trim()
    const changeOutput = execSync(`cardano-cli-balance-fixer change --address ${spenderAddress} -o "${subtractOutput}" ${network}`).toString().trim()

    const activityToken = "20edea925974af2102c63adddbb6a6e789f8d3a16500b15bd1e1c32b.4143544956495459"
    const mintValue = `2 ${activityToken}`
    const activityMinterFile = '/home/ubuntu/dev/marketplace/scripts/activity-minter.plutus'
    const mintActivityTokenFile = '/home/ubuntu/dev/marketplace/scripts/redeemers/mint.json'

    let extraOutput = ""
    if (changeOutput != "") {
        extraOutput = `+ ${changeOutput}`
    }

    const exchanger = 'addr_test1wqy6jy6syr2hcy5e7waj5gy7d7wzcdgfj0d2umvhl0gdqdchhc0ch'
    const sellerExchangerDatum = '/home/ubuntu/dev/marketplace/temp/testnet/datums/0/sellerExchange.json'
    const protocolParams = '/home/ubuntu/dev/marketplace/scripts/testnet/protocol-parameters.json'

    const currentSlot = execSync(`cardano-cli query tip ${network} | jq .slot`).toString().trim()
    const startSlot = currentSlot
    const nextTenSlots = parseInt(currentSlot) + 150;

    const remainTxIns = execSync(`cardano-cli-balance-fixer input --address ${spenderAddress} ${network}`).toString().trim();
    const collateral = execSync(`cardano-cli-balance-fixer collateral --address ${spenderAddress} ${network}`).toString().trim();


    const signingKey = '34e755a502d1c7d0b085b56e0bbb91ee4a0113effd8e509104d25a95'
    const spenderHash = resolvePaymentKeyHash(spenderAddress);
    console.log({ spenderHash, signingKey })
    return;

    const buildCommand = `cardano-cli transaction build --alonzo-era ${network
        } ${remainTxIns
        } --tx-in ${utxoScript
        } --tx-in-script-file ${nftValidatorFile
        } --tx-in-datum-file ${datumFile
        } --tx-in-redeemer-file ${redeemerFile
        } --required-signer-hash ${signingKey
        } --tx-in-collateral ${collateral
        } --tx-out "${sellerAddr} + ${sellerAmount
        }" --tx-out "${buyerAddr} + ${value
        }" --tx-out "${marketplaceAddr} + ${marketPlaceAmount
        }" --tx-out "${royalitiesAddr} + ${royalitiesAmount
        }" --tx-out "${spenderAddress} + 3000000 lovelace ${extraOutput
        }" --tx-out "${exchanger} + 2000000 lovelace + 1 ${activityToken
        }" --tx-out-datum-embed-file ${sellerExchangerDatum
        } --tx-out "${exchanger} + 2000000 lovelace + 1 ${activityToken
        }" --tx-out-datum-embed-file ${buyerExchangerDatum
        } --change-address ${spenderAddress
        } --protocol-params-file ${protocolParams
        } --mint "${mintValue
        }" --mint-script-file ${activityMinterFile
        } --mint-redeemer-file ${mintActivityTokenFile
        } --invalid-before ${startSlot
        } --invalid-hereafter ${nextTenSlots
        } --out-file ${transactionBuildOutputFile}`

    execSync(buildCommand)
    const buildResult = fs.readFileSync(transactionBuildOutputFile).toString();
    console.log(buildResult);
    return buildResult;
}

buildBuyTransaction()