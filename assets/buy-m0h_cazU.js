import{d as _,u as L,a as $,b as G,j as s,T as p,B as a,Y as i,c as o,e as ee,J as se,g as J,N as q,f as te,h as oe,i as ne,L as re,H as ae,C as E,k as z,l as ie,m as ce,n as le}from"./index-_f6n9-9P.js";import{B as Q,T as de,a as _e,A as ue,d as S,s as F,g as pe}from"./AirdropHelper-B2FUO3es.js";const be="_buy__wrapper_1kl9d_1",fe="_buy__back_1kl9d_10",ge="_buy__back_icon_1kl9d_19",ye="_buy__container_1kl9d_23",he="_buy__title_and_logo_1kl9d_30",me="_buy__title_1kl9d_30",xe="_buy__heading_1kl9d_39",Ae="_buy__buy_rows_1kl9d_47",Ce="_buy__balance_1kl9d_52",ke="_buy__balance_value_1kl9d_61",we="_buy__footer_connect_1kl9d_67",Se="_buy__footer_connect_container_1kl9d_78",ve="_buy__footer_connect_score_1kl9d_85",Te="_buy__footer_connect_tokens_1kl9d_91",Be="_buy__footer_connect_wallet_1kl9d_96",r={buy__wrapper:be,buy__back:fe,buy__back_icon:ge,buy__container:ye,buy__title_and_logo:he,buy__title:me,buy__heading:xe,buy__buy_rows:Ae,buy__balance:Ce,buy__balance_value:ke,buy__footer_connect:we,buy__footer_connect_container:Se,buy__footer_connect_score:ve,buy__footer_connect_tokens:Te,buy__footer_connect_wallet:Be},K=[{id:1,countSpins:100,countWhisks:3600},{id:2,countSpins:250,countWhisks:8900},{id:3,countSpins:500,countWhisks:17700},{id:4,countSpins:1e3,countWhisks:35200}],Y={hex:"b5ee9c72410107010089000114ff00f4a413f4bcf2c80b01020120040201bcf26c21018209312d00bef2e2c0ed44d0d20001f2d2be88ed54fa40d3ffd3ff3003d33fd43020f9005003baf2e2c1f800820898968070fb02821043c7d5c9c8cb1fcb3fcc12cbffc9718010c8cb055003cf1670fa0212cb6accc98306fb00030001c002014806050011a098d7da89a1ae14010002d0f6f532a9"},je="_buy_row__wrapper_en39z_1",Oe="_buy_row__container_en39z_8",Ne="_buy_row__spins_en39z_13",Ie="_buy_row__whisks_en39z_18",N={buy_row__wrapper:je,buy_row__container:Oe,buy_row__spins:Ne,buy_row__whisks:Ie};function We(f){return _.beginCell().storeCoins(0).storeAddress(f.admin).storeRef(f.content).storeRef(f.walletCode).endCell()}class I{constructor(t,e){this.address=t,this.init=e}static createFromAddress(t){return new I(t)}static createFromConfig(t,e,u=0){const b=We(t),d={code:e,data:b};return new I(_.contractAddress(u,d),d)}async sendDeploy(t,e,u){await t.internal(e,{value:u,sendMode:_.SendMode.PAY_GAS_SEPARATELY,body:_.beginCell().endCell()})}async sendMint(t,e,u,b,d,h){await t.internal(e,{sendMode:_.SendMode.PAY_GAS_SEPARATELY,body:_.beginCell().storeUint(21,32).storeUint(0,64).storeAddress(d).storeCoins(b).storeRef(_.beginCell().storeUint(395134233,32).storeUint(0,64).storeCoins(h).storeAddress(this.address).storeAddress(this.address).storeCoins(0).storeUint(0,1).endCell()).endCell(),value:u+b})}async getWalletAddressOf(t,e){return(await t.get("get_wallet_address",[{type:"slice",cell:_.beginCell().storeAddress(e).endCell()}])).stack.readAddress()}async getWalletCode(t){const e=(await t.get("get_jetton_data",[])).stack;return e.skip(4),e.readCell()}}const He=f=>{const t=L({query:"(max-width: 600px)"}),{updateBonusSpins:e}=$(),[u]=G(),b=u.connected,{id:d,countSpin:h,countWhisk:m,userId:v,userTonAddress:g}=f,W=async A=>{if(!g)a.error("Please connect TON wallet!",{position:"bottom-left",autoClose:3e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"dark",transition:i});else if(!b)a.error("Please connect TON Wallet!",{position:"bottom-left",autoClose:3e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"dark",transition:i});else if(v&&g){const T=o.toNano(m),B=o.Address.parse(ee),H=o.Address.parse(g),P=o.beginCell().endCell(),c=o.toNano("0.01"),C=o.beginCell().endCell(),l=se.transferMessage(T,B,H,P,c,C),k=await J({network:q}),M=new o.TonClient({endpoint:k}),j=new I(o.Address.parse(te)),x=await M.open(j).getWalletAddressOf(o.Address.parse(g)),n=o.toNano("0.05");try{await u.sendTransaction({messages:[{address:x.toString(),amount:n.toString(),payload:l==null?void 0:l.toBoc().toString("base64")}],validUntil:Date.now()+5*60*1e3});const w=await oe(v,{countSpins:A});(w==null?void 0:w.status)===200?(e(A),a.success(`You bought ${A} spins`,{position:"bottom-left",autoClose:3e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"dark",transition:i})):a.error("Can't buy spins.",{position:"bottom-left",autoClose:3e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"dark",transition:i})}catch{a.error("User reject transaction",{position:"bottom-left",autoClose:3e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"dark",transition:i})}}};return s.jsx("div",{className:N.buy_row__wrapper,children:s.jsxs("div",{className:N.buy_row__container,children:[s.jsxs("div",{className:N.buy_row__spins,children:[s.jsx(p,{fontSize:t?"26px":"50px",fontFamily:"Roundy Rainbows, sans-serif",children:h}),s.jsx(p,{fontSize:t?"16px":"24px",fontFamily:"Montserrat, sans-serif",children:"spins"})]}),s.jsxs("div",{className:N.buy_row__whisks,children:[s.jsx(p,{fontSize:t?"16px":"28px",fontFamily:"Montserrat, sans-serif",children:BigInt(m).toLocaleString()}),s.jsx(p,{fontSize:t?"16px":"26px",fontFamily:"Montserrat, sans-serif",children:"WHISK"})]}),s.jsx(Q,{onClick:()=>W(h),fontFamily:"Montserrat, sans-serif",height:t?"28px":"52px",fontSize:t?"14px":"28px",boxShadow:"0px 2px 2px rgba(0, 0, 0, 0.1), inset 0px 1px 1px rgb(255 161 161 / 60%), inset 0px -3px 2px rgba(0, 0, 0, 0.2)",text:"Buy now",fontWeight:"normal",width:"fit-content",textTransform:"none",borderRadius:"24px"})]})},d)},Pe="/whiskers/assets/back-arrow-BYp4F-0z.png",Me=()=>{const f=ne(),t=L({query:"(max-width: 600px)"}),{userData:e,jettonBalance:u,isClaimable:b,airdropList:d,airdropCell:h,campaignNumber:m,updateClaimedWhisks:v}=$(),[g]=G(),W=g.connected,A=()=>{f(-1)},T=d.findIndex(c=>o.Address.parse(c.userTonAddress).toString()==o.Address.parse((e==null?void 0:e.userTonAddress)||"UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ").toString());let B=0;T!=-1&&(B=d[T].unclaimedWhisks);async function H(c,C){let l=!1,k=25;for(;!l&&k>0;){if(k--,l=await C.isContractDeployed(c),l)return;await F(3e3)}throw new Error("Timeout")}const P=async()=>{if(b!=1)a.error("No snapshot yet. Claim after 7:00 GMT",{position:"bottom-left",autoClose:3e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"dark",transition:i});else if(!W)a.error("Connect your TON Wallet and try again",{position:"bottom-left",autoClose:3e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"dark",transition:i});else if(e!=null&&e.userId&&(e!=null&&e.userTonAddress)&&m){const c=d.findIndex(n=>n.userId.toString()==(e==null?void 0:e.userId.toString()));if(c!=-1&&d[c].userTonAddress.toString()!=(e==null?void 0:e.userTonAddress.toString())){a.error("Please connect with previous wallet to claim or wait until next snapshot at 7:00 GMT",{position:"bottom-left",autoClose:3e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"dark",transition:i});return}const C=await J({network:q}),l=new o.TonClient({endpoint:C}),M=_.Cell.fromBase64(h||"").beginParse().loadDictDirect(_.Dictionary.Keys.BigUint(256),_e),j=d.findIndex(n=>o.Address.parse(n.userTonAddress).toString()==o.Address.parse(e==null?void 0:e.userTonAddress.toString()).toString());if(j==-1){a.error("Not in the airdrop list. Please wait for the next snapshot!",{position:"bottom-left",autoClose:3e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"dark",transition:i});return}const O=BigInt(j.toString()),x=M.generateMerkleProof(O);if(!l)a.error("Cannot claim WHISK. Try again",{position:"bottom-left",autoClose:3e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"dark",transition:i});else{const n=l.open(ue.createFromConfig({campaign_number:BigInt(m),airdrop:o.Address.parse(E),index:O,proofHash:x.hash()},_.Cell.fromBoc(z.from(Y.hex,"hex"))[0]));if(await n.getClaimed()){a.error("Already claimed! Please wait for the next snapshot",{position:"bottom-left",autoClose:3e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"dark",transition:i});return}if(!await l.isContractDeployed(n.address)){const Z=new S.StateInit({code:S.Cell.fromBoc(z.from(Y.hex,"hex"))[0],data:S.beginCell().storeBit(!1).storeAddress(S.Address.parse(E)).storeBuffer(x.hash()).storeUint(O,256).storeUint(BigInt(m),16).endCell()}),R=new S.Cell;Z.writeTo(R);try{const U=await g.sendTransaction({messages:[{address:n.address.toString(),amount:_.toNano("0.1").toString(),stateInit:R.toBoc().toString("base64")}],validUntil:Date.now()+3e5});await H(n.address,l),await F(1500),await n.sendClaim(123n,x);const V=U.boc,X=await pe(o.Address.parse(e==null?void 0:e.userTonAddress),V);try{const y=`${ie}${X}`,D=(await ce.get(y)).data.children[0].transaction.success;console.log("txStatus: ",D)}catch(y){console.log(y)}try{const y=await le(e.userId);y&&(v(),y.message=="successfully claimed whisks"&&a.success(`You claimed ${B} $WHISK`,{position:"bottom-left",autoClose:3e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"dark",transition:i}))}catch{a.error("Cannot claim WHISK. Try again",{position:"bottom-left",autoClose:3e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"dark",transition:i})}}catch{a.error("User reject transaction",{position:"bottom-left",autoClose:3e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"dark",transition:i});return}}await l.isContractDeployed(n.address)&&(await n.getClaimed()||await n.sendClaim(123n,x))}}else a.error("Unknown error. Please try again later!",{position:"bottom-left",autoClose:3e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"dark",transition:i})};return s.jsx("div",{className:r.buy__wrapper,children:s.jsxs("div",{className:r.buy__container,children:[s.jsxs("div",{className:r.buy__title_and_logo,children:[s.jsx(re,{fontSize:"42px"}),s.jsx("span",{className:r.buy__title,children:s.jsx(ae,{className:r.buy__heading,level:"h1",children:"Spin&Earn"})})]}),s.jsx(p,{fontSize:"16px",fontFamily:"Montserrat, sans-serif",children:"Buy bonus spins with WHISK"}),s.jsx("div",{className:r.buy__buy_rows,children:K&&K.map(c=>s.jsx(He,{id:c.id,countSpin:c.countSpins,countWhisk:c.countWhisks,userId:e==null?void 0:e.userId,userTonAddress:e==null?void 0:e.userTonAddress},c.id))}),s.jsxs("div",{className:r.buy__balance,children:[s.jsxs("div",{onClick:A,className:r.buy__back,children:[s.jsx("img",{src:Pe,className:r.buy__back_icon,alt:"back to main screen"}),s.jsx(p,{children:"Back"})]}),s.jsxs("div",{className:r.buy__balance_value,children:[s.jsx(p,{fontSize:"14px",fontFamily:"Montserrat, sans-serif",children:"Wallet balance"}),s.jsxs(p,{fontSize:"16px",fontFamily:"Montserrat, sans-serif",children:[u.toLocaleString()," WHISK"]})]})]}),s.jsx("div",{className:r.buy__footer_connect,children:s.jsxs("div",{className:r.buy__footer_connect_container,children:[s.jsxs("div",{className:r.buy__footer_connect_score,children:[s.jsx(p,{fontSize:t?"18px":"40px",children:"Unclaimed WHISK"}),s.jsxs("div",{className:r.buy__footer_connect_tokens,children:[s.jsx(p,{fontSize:t?"30px":"50px",fontFamily:"Roundy Rainbows, sans-serif",children:((e==null?void 0:e.points)||0)-((e==null?void 0:e.claimedWhisks)||0)}),s.jsx(Q,{onClick:P,fontFamily:"Montserrat, sans-serif",height:t?"24px":"42px",fontSize:t?"16px":"40px",backgroundColor:"#0080bb",text:"Claim tokens",fontWeight:"normal",width:"fit-content",textTransform:"none",borderRadius:"24px"})]})]}),s.jsx("div",{className:r.buy__footer_connect_wallet,children:s.jsx(de,{})})]})})]})})},ze=()=>s.jsx(Me,{});export{ze as default};
