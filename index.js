const { cardanocliJs, getListScript, generatePolicyID, getBuyScript } = require("./cardanocli");
const { resolvePaymentKeyHash, resolvePlutusScriptHash } = require('@meshsdk/core');
const fs = require('fs')

const testPolicyId = () => {
    const policyID = generatePolicyID('Test');
    console.log(policyID)
}

const buildListingTransaction = () => {
    const sellerPk = 'addr_test1qzsd2q6gn64t4r72puu5canr0mh0v4037fs4n9j589a6tfzpq4h29pkf2k5sh0sl2te298n4vfyrgqh47xq6a8k4rx8shfkkh4';
    const marketplacePk = 'addr_test1vq0smr77axmdr7sh3vsklpkqzq9hevv55tzm46vj4l3nxhqxe0vrc';
    const royaltyPk = 'addr_test1vq9ksly6y728ccr2c3npq0r3zfaj322l28y2kvf5e8af00s05v5nw';
    const assetId = '54657374';
    const policyId = '9b7f532518d0d917fc462d7a36e19ba5af95f427de10ce567d4ab9e9';
    const price = 2000000;
    const directlySale = 'addr_test1wqg9q96l0k2r56t7dqhsp0926m7u0nqdjcc2pnpf7erlg8qw4et2m';

    const directlySalePkh = resolvePlutusScriptHash(directlySale);
    const sellerPkh = resolvePaymentKeyHash(sellerPk);
    const marketplacePkh = resolvePaymentKeyHash(marketplacePk);
    const royaltyPkh = resolvePaymentKeyHash(royaltyPk);
    console.log({ sellerPkh, marketplacePkh, royaltyPkh, directlySalePkh });
    const datumHash = cardanocliJs?.transactionHashScriptData(
        getListScript(price, sellerPkh, marketplacePkh, royaltyPkh, 3))
    console.log(datumHash)
    const txIn = cardanocliJs?.queryUtxo(sellerPk)
    console.log(txIn)
    const otherTxOutValues = txIn.filter((t) => Object.keys(t.value).length > 1 && Object.keys(t.value).indexOf(policyId + '.' + assetId) === -1);
    const assetUtxo = txIn.find(t => Object.keys(t.value).indexOf(policyId + '.' + assetId) > -1)
    if (!assetUtxo) {
        console.log('no balance asset');
        return;
    }

    if (datumHash) {
        const filePath = cardanocliJs?.transactionBuild({
            alonzoEra: true,
            txIn: [
                assetUtxo,
                ...txIn.filter((t) => Object.keys(t.value).length === 1 && t.value.lovelace)
            ],
            txOut: [{
                address: directlySale,
                value: {
                    lovelace: 1700000,
                    [policyId + '.' + assetId]: 1
                },
                datumHash: datumHash
            },
                // ...otherTxOutValues.map(o => {
                //     o.value.lovelace = 1744798;
                //     return {
                //         address: sellerPk,
                //         value: o.value
                //     }
                // })
            ],
            changeAddress: sellerPk,
        })

        const buildResult = fs.readFileSync(filePath)
        console.log(buildResult)
        console.log(JSON.parse(buildResult))
        return;
    }
    console.log('error')
}

const buildBuyTransaction = () => {
    const buyerPk = 'addr_test1qq47fgcrudhk9r32qmvh0ct0wl8zhyzxhrzk2a4m22rdr0sqcga2xfzv6crryyt0sfphksfr947jjddy3t4u0qwfmmfq2h0pj8';

    const assetName = '54657374';
    const policyId = '9b7f532518d0d917fc462d7a36e19ba5af95f427de10ce567d4ab9e9';
    const price = 2000000;
    const sellerPk = 'addr_test1qzsd2q6gn64t4r72puu5canr0mh0v4037fs4n9j589a6tfzpq4h29pkf2k5sh0sl2te298n4vfyrgqh47xq6a8k4rx8shfkkh4';
    const marketplacePk = 'addr_test1vq0smr77axmdr7sh3vsklpkqzq9hevv55tzm46vj4l3nxhqxe0vrc';
    const directlySale = 'addr_test1wqg9q96l0k2r56t7dqhsp0926m7u0nqdjcc2pnpf7erlg8qw4et2m';

    const buyerPkh = resolvePaymentKeyHash(buyerPk);
    const marketplacePkh = resolvePaymentKeyHash(marketplacePk);
    const royaltyPkh = resolvePaymentKeyHash(sellerPk);

    const timestamp = Date.now() + 100000;
    const buyDatumObject = getBuyScript(
        price,
        assetName,
        policyId,
        buyerPkh,
        marketplacePkh,
        royaltyPkh,
        timestamp,
        3);
    const sellDatumObject = getListScript(
        price, royaltyPkh, marketplacePkh, royaltyPkh, 3);
    const closeRedeemerObject = {
        "constructor": 1,
        "fields": []
    };
    const datumHash = cardanocliJs?.transactionHashScriptData(buyDatumObject)
    const sellDatumHash = cardanocliJs?.transactionHashScriptData(sellDatumObject)
    if (datumHash) {
        const txIn = cardanocliJs?.queryUtxo(buyerPk)
        if (!txIn) {
            console.log(({ err: 'balance not enough' }))
            return;
        }

        const contractUtxos = cardanocliJs?.queryUtxo(directlySale)
        console.log(contractUtxos, datumHash, sellDatumHash)
        const listUtxo = contractUtxos?.find(u => u.datumHash === datumHash);
        if (!listUtxo) {
            console.log(({ err: 'not found list hash' }))
            return;
        }

        const currentTip = cardanocliJs?.queryTip();

        const otherTxOutValues = txIn.filter((t) => Object.keys(t.value).length > 1 && Object.keys(t.value).indexOf(policyId + '.' + assetName) === -1);
        const filePath = cardanocliJs?.transactionBuild({
            // @ts-ignore
            txIn: [...txIn, {
                // @ts-ignore
                txHash: listUtxo.txHash,
                // @ts-ignore
                txId: listUtxo.txId
            },
            // @ts-ignore
            {
                script: '../../../cardano/plutus/testnet/direct-sale.plutus'
            },
            // @ts-ignore
            {
                datum: buyDatumObject
            },
            // @ts-ignore
            {
                redeemer: closeRedeemerObject
            }
            ],

            txOut: [{
                address: buyerPk,
                value: {
                    lovelace: price
                },
                datumHash: ''
            }, ...otherTxOutValues.map(o => {
                o.value.lovelace = 1744798 + price;
                return {
                    address: buyerPk,
                    value: o.value,
                    datumHash: ''
                }
            })],
            // @ts-ignore
            changeAddress: buyerPk,
            invalidBefore: currentTip?.slot,
            invalidAfter: currentTip ? currentTip.slot + 150 : undefined
        })

        if (!filePath) {
            console.log('transaction build error')
            return;
        }

        const buildResult = fs.readFileSync(filePath)
        // @ts-ignore
        const { cborHex } = JSON.parse(buildResult)
        console.log(cborHex)
    }
}

// buildListingTransaction()
buildBuyTransaction()