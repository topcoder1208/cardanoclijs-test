const { cardanocliJs, getListScript } = require("./cardanocli");
const { resolvePaymentKeyHash } = require('@meshsdk/core');

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
    const price = '100000';

    const sellerPkh = resolvePaymentKeyHash(sellerPk);
    const marketplacePkh = resolvePaymentKeyHash(marketplacePk);
    const royaltyPkh = resolvePaymentKeyHash(royaltyPk);

    const datumHash = cardanocliJs?.transactionHashScriptData(
        getListScript(sellerPkh, marketplacePkh, royaltyPkh, assetId, policyId))
    if (datumHash) {
        const transactionHash = cardanocliJs?.transactionBuild({
            txIn: [],
            txOut: [{
                address: process.env.DIRECTLY_SALE_CONTRACT || '',
                value: (price * 1000000) + ' lovelace + 1 ' + policyId + '.' + assetId,
                datumHash: datumHash,
            }],
        })

        console.log(transactionHash);
        return;
    }
    console.log('error')
}

buildListingTransaction()