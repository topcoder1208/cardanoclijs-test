const { cardanocliJs, getListScript, generatePolicyID, getBuyScript } = require("./cardanocli");
const { resolvePaymentKeyHash, resolvePlutusScriptHash } = require('@meshsdk/core');
const { TransactionUnspentOutput } = require('@emurgo/cardano-serialization-lib-nodejs');
const fs = require('fs')

const DirectSalePlutus = {
    "type": "PlutusScriptV1",
    "description": "",
    "cborHex": "59182e59182b01000033233223232333222323232323233223322333222323333222232323232323232332232323322332233322232323333222232323233223332223332223332223322332233223232323232323333333322222222332233223322332232323322323322332232323232323233223232323232333322223232323232323333322222332232332233223322323232323232323232323232323232323232323233333222223355505b2232323232322323223232533530a80133300d3333573466e1cd55cea805a40004666660526eb8d5d0a80599a80a00a9aba1500a33501723232323333573466e1cd55cea801a4000466606466a038eb4d5d0a80199a80e3ae35742a004666aa03ceb94074d5d09aba2500223263530b30133573804e16802164021620226ae8940044d55cf280089baa00135742a0126eb8d5d0a8041bae357426ae8940208c98d4c2b804cd5ce0110578085680856009999ab9a3370ea0089003100811999ab9a3370ea00a9002100911999ab9a3370ea00c90011180a99a80b00b9aba135573ca01046666ae68cdc3a803a4000402a464c6a61620266ae700942c8042c0042bc042b8042b4042b004cccd5cd19b8735573aa004900011981819191919191919191919191999ab9a3370e6aae754029200023333333333063335020232323333573466e1cd55cea801240004660fa60546ae854008c098d5d09aba2500223263530be0133573806417e0217a021780226aae7940044dd50009aba1500a33502002235742a012666aa04aeb94090d5d0a804199aa812bae502435742a00e66a0400546ae854018cd4080cd540b40add69aba150053232323333573466e1cd55cea80124000466a0d26464646666ae68cdc39aab9d5002480008cd41c4cd40c1d69aba150023031357426ae8940088c98d4c30804cd5ce01b06180860808600089aab9e5001137540026ae854008c8c8c8cccd5cd19b8735573aa0049000119a83799a8183ad35742a00460626ae84d5d1280111931a98610099ab9c0360c3010c1010c001135573ca00226ea8004d5d09aba2500223263530be0133573806417e0217a021780226aae7940044dd50009aba1500433502075c6ae85400ccd4080cd540b5d710009aba150023027357426ae8940088c98d4c2e804cd5ce01705d8085c8085c0089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aab9e5001137540026ae854008c8c8c8cccd5cd19b875001480188c0e4c088d5d09aab9e500323333573466e1d40092004230383024357426aae7940108cccd5cd19b875003480088c0e0c080d5d09aab9e500523333573466e1d401120002303b375c6ae84d55cf280311931a985a8099ab9c0290b6010b4010b3010b2010b1010b001135573aa00226ea8004d5d09aba2500223263530ae0133573804415e0215a0215802215c02264c6a615a0266ae7124103505435000ae010ac01135573ca00226ea80044d55cea80089baa001135744a00226ae8940044d5d1280089aab9e50011375400244646444646464a6666a601400a426607e66aa0cc466aa0ce664466aa0046a086a08200260702400246a6aa13c020024466606ca00c00400200266aa0cc666aaa09a606e2400266444466aa60802400246a6aa142020024466aa14802004666a6aa07e002400244660100040024002666aaa07400800400207a4466606a094004002a1360266aa0cc6aa60a02400266aaa0ca6446a6aa13c0200244660080040024466a1380266aa13e02004002a13a0246a604e0024466aa140020040026644666aa60cc24002a1380200200460420120026607e66a06860a2a0046666aaa09a606e240024466606a4466098666a08ea094a096004666a08ea094a0960026a605000444002002a136020026607ea66a6a0dc6046012426a6052002444a66a6a0e4006426664446a6a0b80024466446a6a0c4004446a6a0c800644a666a614802666a116020160080042a66a616a020062a66a616a02002216c02216e02216c02216e02216c0266a0c26a1120200816202002a11c020026a6aaaaaaaaaaa11802a01244444444444008215602214e026607ea66a6a1320266a0c666aaa0ca46607c002604601466aaa0ca0f4aa0f2a0062614002931109a9aa84f0080111299a9a84e8080189984a009806000a805910985300a4c6607ea66a6a1320266a0c666aaa0ca46607c002a66a6a134026a6aaaaaaaaaaa11002a00a44444444444006261460293110a99a9a84e008008801110985380a4c66aaa0ca0f4aa0f2a0062614202931109a9aa84f0080111299a9a84e8080189984a009806000a805910985380a4c661200260106a6aaaaaaaaaaa10e02a0084444444444400e6466e092004001500713301f50013021008153353506d30220082135302800122253353507100321330433330365006302600d00233043333222353505b0012235350610022253335309f013335086010073508a010060021533530b00100110b10110b20110b10110b201508d010013535555555555508b0150082222222222200433503830555006002130a6014984c2880526153353506d3022008213530280012225335350710022133043330245006001330433330365006302600d00233503830555006002130a7014984c28c05261353555555555550850150022222222222200b1533535096013355304d12001235306800122253353506f00121335509f013322323232323333573466e1d400520022308c01323232323333573466e1cd55cea801a40004666128026eb4d5d0a8019bae35742a0046eb8d5d09aba2500223263530b8013357380581720216e0216c0226ae8940044d55cf280089baa001357426aae79400c8cccd5cd19b875002480008c23804c8c8cccd5cd19b8735573aa002900011856009bae357426aae7940088c98d4c2dc04cd5ce01585c0085b0085a8089baa001357426aae7940108c98d4c2d004cd5ce01405a8085980859008588089aab9d5001137540026002006640026aa1600244a66a6a13e020022c4426a6aa1480200444a66a615e02666ae68cdc780100385880858008800898030019a9aaaaaaaaaaa84480a8031111111111100100080189a854808560099a83011a9834000911199119a983b801119a983c001119821001000905580919a983c0011055809198210010009a983680191001183b0059a9aaaaaaaaaaa84200a800911111111110048984a80a4c4426a6aa136020044466a6106020044a66a6a136020082613402931109a9aa850008011119a9844008011299a9a8500080209919a800a85100a851808911980119aa853008040049980119aa85300801802000910985080a4c4613e02931184d00a4c26a609c604c002444444444466666666666aaaaaaaaaaa11c02606001601401201000e00c00a008006004002266aa0be6116029001199119b83002001333355504630301200122353021002223304500333301c00107e07e48000c0680092080b48913233301800135301d0022222200135301d00222222002212222300400512222003122220021222200120011232230023758002640026aa13a02446666aae7c0049423c048cd423804c010d5d080118019aba200209e01232323333573466e1cd55cea801240004660346eb8d5d0a801199aa8043ae5007357426ae8940088c98d4c27404cd5ce00884f0084e0084d8089aab9e50011375400246464646666ae68cdc39aab9d5003480008ccc178c8c8c8cccd5cd19b8735573aa004900011983218099aba1500233500a012357426ae8940088c98d4c28404cd5ce00a851008500084f8089aab9e5001137540026ae85400cccd54021d728039aba1500233500675c6ae84d5d1280111931a984e8099ab9c01109e0109c0109b01135744a00226aae7940044dd500089119191999ab9a3370ea002900011a83118029aba135573ca00646666ae68cdc3a801240044a0c4464c6a613a0266ae70044278042700426c04268044d55cea80089baa0011335500175ceb44488c88c008dd5800990009aa84c8091191999aab9f0022508c01233508b01335508e01300635573aa004600a6aae794008c010d5d100184d8089aba1001232323333573466e1cd55cea801240004660cc600a6ae854008dd69aba135744a004464c6a61300266ae700302640425c04258044d55cf280089baa0012323333573466e1cd55cea800a400046eb8d5d09aab9e500223263530960133573801412e0212a021280226ea8004488c8c8cccd5cd19b87500148010941a88cccd5cd19b875002480088d41b4c018d5d09aab9e500423333573466e1d400d20002506d23263530990133573801a134021300212e0212c0212a0226aae7540044dd50009191999ab9a3370ea002900110488091999ab9a3370ea004900010488091931a984a8099ab9c00909601094010930109201135573a6ea80048c8c8c8c8c8cccd5cd19b8750014803081288cccd5cd19b8750024802881308cccd5cd19b875003480208cc128dd71aba15005375a6ae84d5d1280291999ab9a3370ea00890031198261bae35742a00e6eb8d5d09aba2500723333573466e1d40152004233051300c35742a0126eb8d5d09aba2500923333573466e1d4019200223053300d357426aae79402c8cccd5cd19b875007480008c148c038d5d09aab9e500c232635309d0133573802213c02138021360213402132021300212e0212c0212a0226aae7540104d55cf280189aab9e5002135573ca00226ea80048c8c8c8c8cccd5cd19b875001480088ccc174dd69aba15004375a6ae85400cdd69aba135744a00646666ae68cdc3a80124000460be60106ae84d55cf280311931a984b0099ab9c00a09701095010940109301135573aa00626ae8940044d55cf280089baa001232323333573466e1d400520022305d375c6ae84d55cf280191999ab9a3370ea00490001182f9bae357426aae7940108c98d4c24c04cd5ce00384a0084900848808480089aab9d5001137540022244464646666ae68cdc39aab9d5002480008cd5421804c018d5d0a80118029aba135744a004464c6a61260266ae7001c2500424804244044d55cf280089baa00149103505431002223232300100532001355091012233535080010014800088d4d5421404008894cd4c24004ccd5cd19b8f002009092010910113007001130060033200135509001223353507f0014800088d4d5421004008894cd4c23c04ccd5cd19b8f002007091010900110011300600322353034002222222222253353505a3335530231200133503b2253353505c002210031001505b25335309201333573466e3c0300042500424c044d41740045417000c84250044248048d4c010004888880108d4c00c004888880148d4c0080048888800c8888848ccccc00401801401000c00880048848cc00400c008800488848ccc00401000c00880048d4c008004880088848cc00400c0088004848888c010014848888c00c014848888c008014848888c0040148004888cd4014ccd54c0d448004c01006541b0d4c08c00c8888888888ccd54c0fc4800488d4c11c008888d4c13000c88cd4c15800894cd4c22004ccd5cd19b8f01400108a0108901133507d0050071007200750760090012223355300c1200123535506d0012233550700023355300f12001235355070001223355073002333535500e00123300a4800000488cc02c0080048cc028005200000133005002001122333553005120013500e500c23535506b001223335530081200135011500f23535506e00122333535500c00123305f4800000488cc1800080048cc17c00520000013300300200122335530091200123535506a00122335506d002333535500800123355300d1200123535506e00122335507100235500f0010012233355500800f00200123355300d1200123535506e00122335507100235500d00100133355500300a002001111222333553031120015067335530091200123535506a00122335506d00235500b00133355303112001223535506b002225335307633355300812001323350212233353501f003220020020013501600133501d2253353078002107a100107723535506e001223300a0020050061003133506b0040035068001335530091200123535506a0012232335506e00330010053200135507c2253353506b001135500b00322135355070002225335307b3300c00200813355010007001130060030023200135507522112225335350670011353501c0032200122133353501e005220023004002333553007120010050040011121222300300411221222330020050041121222300100411200132001355070221122533535061001150632213350643004002335530061200100400122333573466e3c0080041b01ac4cd40100041a4894cd4c1a0008400441a448cd404088ccd4d401000c88008008004d4d40080048800448848cc00400c0084800448894cd4c194ccd4d412c00c88888888018004d4010d40140084ccd4d402400888004d4010d4014008004400448d4d40200048800448d4d4014004880084cccccccd411812813411c12012411013012c4cd400ccd4014005200022337020040024466e0000800448848cc00400c0084800448848cc00400c008480044448888cccd54010cd4018888c00cc008004800400c00400848848cc00400c00848004c8004d541708844894cd4d41340045413c884cd4140c010008cd54c018480040100048cd54058cd5540548d4c06c0048880080494cd4d4124cd54058cd554054d404ccd5540548d4c07400488cd4c09c0088168816ccd5540548d4c06c00488800c0488d4c00c00488888888880280044c05d2622153353504b0011002221301b498888888888848cccccccccc00402c02802402001c01801401000c008800448848cc00400c0084800448848cc00400c0084800448848cc00400c00848004848888888c01c0208848888888cc018024020848888888c014020488888880104888888800c8848888888cc0080240208848888888cc00402402080048d4c01c0048800448cd54c00848004894cd4c114c00c0084cd40e8008004400540e4c8004d5412088448894cd4d40e80044008884cc014008ccd54c01c48004014010004444888c00cc0080044488c0080048c98d4c110cd5ce24812165787065637465642065786163746c79206f6e652073637269707420696e7075740004504322123300100300220012221233300100400300220012212330010030022001121223002003112200112001212230020032221223330010050040032001212230020032122300100320012212330010030022001112353550240012200223530250012001122232323232533353500800621533353500900621533353500a0082130044984c00d261533353500a0072130044984c00d2610251023153335350090072130044984c00d26153335350090062130044984c00d261024153335350080052102210231021153335350080052153335350090072130054984c01126153335350090062130054984c0112610241022153335350080062130054984c01126153335350080052130054984c0112610232533353500800521533353500900721533353500a00721333500f00a00200116161610231533353500800621533353500900621333500e009002001161616102210212533353500700421533353500800621533353500900621333500e00900200116161610221533353500700521533353500800521333500d008002001161616102110202533353500600321533353500700521533353500800521333500d00800200116161610211533353500600421533353500700421333500c0070020011616161020101f2533353500500221533353500600421533353500700421333500c00700200116161610201533353500500321533353500600321333500b006002001161616101f101e121222300300411222002112220011200112353500c00122222222007488100212230020032122300100320012221233300100400300220011111111111122222222222123333333333300100c00b00a009008007006005004003002111111111112001133333333500300700a00400500600100900822333573466e2000800407807c48888888848cccccccc00402402001c01801401000c0084800488ccd5cd19b8800200101c01b22333573466e2400800406c06888ccd5cd19b8900200101901a22333573466e1c008004064060894cd4c058ccd5cd19b89002001018017100210012253353015333573466e2400800405c05840044008894cd4c050ccd5cd19b870020010160151006153353014333573466e2400800405805440104014488800c4888008488800480048d40440504488008488488cc00401000c48004448848cc00400c008448004848c00400880048d40240308d402002c8d401c0288d40180248d4014020488008488004800448c98d4c00c00400926120012001112323001001223300330020020014891c09a9135020d57c1299f3bb2a209e6f9c2c350993daae6d97fbd0d0370001"
}


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

    const sellerPkh = resolvePaymentKeyHash(sellerPk);
    const marketplacePkh = resolvePaymentKeyHash(marketplacePk);
    const royaltyPkh = resolvePaymentKeyHash(royaltyPk);
    const datumHash = cardanocliJs?.transactionHashScriptData(
        getListScript(price, sellerPkh, marketplacePkh, royaltyPkh, 3))
    console.log(datumHash)
    const txIn = cardanocliJs?.queryUtxo(sellerPk)
    console.log(txIn)
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
    const royaltyPk = 'addr_test1vq9ksly6y728ccr2c3npq0r3zfaj322l28y2kvf5e8af00s05v5nw';
    const marketplacePk = 'addr_test1vq0smr77axmdr7sh3vsklpkqzq9hevv55tzm46vj4l3nxhqxe0vrc';
    const directlySale = 'addr_test1wqg9q96l0k2r56t7dqhsp0926m7u0nqdjcc2pnpf7erlg8qw4et2m';
    const exchanger = 'addr_test1wqy6jy6syr2hcy5e7waj5gy7d7wzcdgfj0d2umvhl0gdqdchhc0ch';

    const buyerPkh = resolvePaymentKeyHash(buyerPk);
    const marketplacePkh = resolvePaymentKeyHash(marketplacePk);
    const royaltyPkh = resolvePaymentKeyHash(royaltyPk);
    const sellerPkh = resolvePaymentKeyHash(sellerPk);
    const activeMinterh = '20edea925974af2102c63adddbb6a6e789f8d3a16500b15bd1e1c32b';
    const activeTokenName = '4143544956495459';
    const activeToken = activeMinterh + '.' + activeTokenName;

    const sellDatumObject = getListScript(
        price, sellerPkh, marketplacePkh, royaltyPkh, 3);

    const buyRedeemer = {
        "constructor": 1,
        "fields": [
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
                    }
                ]
            }
        ]
    }

    const sellerExhcangeDatum = {
        "constructor": 0,
        "fields": [
            {
                "constructor": 0,
                "fields": [
                    {
                        "bytes": sellerPkh
                    }
                ]
            }
        ]
    }

    const buyerExchangeDatum = {
        "constructor": 0,
        "fields": [
            {
                "constructor": 0,
                "fields": [
                    {
                        "bytes": buyerPkh
                    }
                ]
            }
        ]
    }

    const activeMinterPlutus = {
        "type": "PlutusScriptV1",
        "description": "",
        "cborHex": "590565590562010000333233223332223322323233322233223332223322332232323233223233322233223322332233223332223232323222332230020012232232325335300d330063333573466e1d40112002201b23333573466e1d40152000201b232635303133573804406404204003e6666ae68cdc39aab9d5002480008cc050c8c8c8c8c8c8c8c8c8c8c8cccd5cd19b8735573aa0149000119999999998111918161bac00135742a0146ae854024d5d0a804199aa81dbae503a35742a00e6ae854018d5d0a8029aba1500435742a0066ae854008d5d09aba25002232635303c33573805a07a05805626ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226aae7940044dd50009aba1500232323333573466e1cd55cea800a4000460366eb8d5d09aab9e5002232635303333573804806804604426ea8004d5d09aba25002232635303033573804206204003e2060264c6a605e66ae712401035054350003001f135573ca00226ea80044d55ce9baa0012235300e00122353012002222222222235301e00b25335302100f153353502e333550120140010082153353502f3335501301501200121333573466e20005200001a01913501403a135013039133355015302412001235302b0012235302f00122235303700322335303b002202023335501e302d1200123301e00200101900b112232230020013200135502f2253353502c0011502122135355031002225335300c33008002007135026001130060031232635302600101622333573466e3c0080040180144488cd54008c8cd405088ccd4d402400c88008008004d4d401c00488004cd401c894cd4c014008401c4004010004488008488004800448848cc00400c008480048848cc00400c0088004888888888848cccccccccc00402c02802402001c01801401000c0088004848c00400880044880084880048004c8004d5406c88448894cd4d406c0044d4d401800c88004884ccd4d402001488008c010008ccd54c01c4800401401000448848cc00400c00848004c8004d5406088cccd55cf8009280c119a80b9919191999ab9a3370e6aae754009200023300b35742a004646464646666ae68cdc39aab9d5003480008ccc048c8c8c8cccd5cd19b8735573aa004900011980d9919191999ab9a3370ea0029001118109bae357426aae79400c8cccd5cd19b875002480008c08cdd71aba135573ca008464c6a604c66ae7005c09c0580540504d55cea80089baa00135742a0046ae84d5d1280111931a981099ab9c012022011010135573ca00226ea8004d5d0a801999aa80e3ae501b35742a0046464646666ae68cdc3a800a400046a0326eb8d5d09aab9e500323333573466e1d4009200225019232635302233573802604602402202026aae7540044dd50009aba135744a004464c6a603a66ae700380780340304d5d1280089aab9e5001137540026ae84d5d1280111931a980c19ab9c009019008007135573ca00226ea8004d5d080118019aba2002014499241035054310022123300100300220012221233300100400300220011212230020031122001120012212330010030022001212230020032122300100320011335500175ceb44488c88c008dd5800990009aa80511191999aab9f0022500b233500a335500d300635573aa004600a6aae794008c010d5d100180389aba100112001200111220021221223300100400312001112212330010030021120011123230010012233003300200200148810841435449564954590033322233500248811c071638c15e6620e650a78a1ef7b4596d729b77ec60850492f4d3072e0033500248811c1050175f7d943a697e682f00bcaad6fdc7cc0d9630a0cc29f647f41c005003112200212212233001004003120011"
    }

    const marketplacePrice = price * 2.5 / 100;
    const royaltyPrice = (price - marketplacePrice) * 3 / 100;
    const sellerPrice = price - marketplacePrice - royaltyPrice;
    const sellDatumHash = cardanocliJs?.transactionHashScriptData(sellDatumObject)

    if (sellDatumHash) {
        const txIn = cardanocliJs?.queryUtxo(buyerPk)
        if (!txIn) {
            console.log(({ err: 'balance not enough' }))
            return;
        }

        const contractUtxos = cardanocliJs?.queryUtxo(directlySale)
        const listUtxo = contractUtxos?.find(u => u.datumHash === sellDatumHash);
        if (!listUtxo) {
            console.log(({ err: 'not found list hash' }))
            return;
        }

        console.log(listUtxo)
        const currentTip = cardanocliJs?.queryTip();

        const collateral = "82825820dbf7f56f844cc4b85daccb62bedf4eeff0a84cb060f0f79b206c7f087b3f0ba100825839002be4a303e36f628e2a06d977e16f77ce2b9046b8c56576bb5286d1be00c23aa3244cd60632116f82437b41232d7d2935a48aebc781c9ded21a004c4b40";
        const collateralUtxo = TransactionUnspentOutput.from_bytes(Buffer.from(collateral, 'hex'));
        const collateralTxIn = JSON.parse(collateralUtxo.input().to_json())

        const filePath = cardanocliJs?.transactionBuild({
            alonzoEra: true,
            // @ts-ignore
            txIn: [{
                // @ts-ignore
                txHash: listUtxo.txHash,
                // @ts-ignore
                txId: listUtxo.txId,
                datumHash: sellDatumHash
            },
            // @ts-ignore
            {
                script: DirectSalePlutus
            },
            // @ts-ignore
            {
                datum: sellDatumObject
            },
            // @ts-ignore
            {
                redeemer: buyRedeemer
            }
            ],

            txInCollateral: [
                {
                    txHash: collateralTxIn.transaction_id,
                    txId: collateralTxIn.index,
                }
            ],

            txOut: [{
                address: sellerPk,
                value: {
                    lovelace: sellerPrice
                },
                datumHash: sellDatumHash
            }, {
                address: buyerPk,
                value: {
                    lovelace: 1700000,
                    [policyId + '.' + assetName]: 1
                },
                datumHash: sellDatumHash
            }, {
                address: marketplacePk,
                value: {
                    lovelace: marketplacePrice
                },
                datumHash: sellDatumHash
            }, {
                address: royaltyPk,
                value: {
                    lovelace: royaltyPrice
                },
                datumHash: sellDatumHash
            }, {
                address: exchanger,
                value: {
                    lovelace: 2000000,
                    [activeToken]: 1
                },
                // datumEmbed: sellerExhcangeDatum,
                datumHash: sellDatumHash
            }, {
                address: exchanger,
                value: {
                    lovelace: 2000000,
                    [activeToken]: 1
                },
                // datumEmbed: buyerExchangeDatum,
                datumHash: sellDatumHash
            }],
            // @ts-ignore
            changeAddress: buyerPk,
            invalidBefore: currentTip?.slot,
            invalidAfter: currentTip ? currentTip.slot + 150 : undefined,
            mint: [{
                action: 'mint',
                asset: activeToken,
                quantity: 2
            }, {
                script: activeMinterPlutus
            }, {
                redeemer: {
                    "constructor": 0,
                    "fields": []
                }
            }]
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