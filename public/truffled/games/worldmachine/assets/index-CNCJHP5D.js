(function(){const ne=document.createElement("link").relList;if(ne&&ne.supports&&ne.supports("modulepreload"))return;for(const de of document.querySelectorAll('link[rel="modulepreload"]'))he(de);new MutationObserver(de=>{for(const re of de)if(re.type==="childList")for(const ve of re.addedNodes)ve.tagName==="LINK"&&ve.rel==="modulepreload"&&he(ve)}).observe(document,{childList:!0,subtree:!0});function ue(de){const re={};return de.integrity&&(re.integrity=de.integrity),de.referrerPolicy&&(re.referrerPolicy=de.referrerPolicy),de.crossOrigin==="use-credentials"?re.credentials="include":de.crossOrigin==="anonymous"?re.credentials="omit":re.credentials="same-origin",re}function he(de){if(de.ep)return;de.ep=!0;const re=ue(de);fetch(de.href,re)}})();let e=Symbol,t=Array,[l,r,n,s,i,f,o,a,u,c,_]=t.from(t(11),e),h=e.toPrimitive,g=Object.assign,p=globalThis,w=M=>new Map(M),d=w(),I=!1,y=new WeakMap,v=M=>y.get(M),m=(M,ne)=>{v(M).t.push(ne)},S=M=>{let ne={l:M,t:[],i:{}},ue=new Proxy(M,{get(he,de,re){if(I){let ve=e(),me={o:ue,u:[de]};return d.set(ve,me),new Proxy({},{get(be,ke,Fe){return ke===h?()=>ve:(me.u.push(ke),Fe)}})}return ne.i[de]?ne.i[de].value:Reflect.get(he,de,re)},set(he,de,re,ve){return(ne.i[de]?ne.i[de]._(re):Reflect.set(he,de,re,ve))&&ne.t.map(me=>me(de,ue)),!0}});return y.set(ue,ne),ue},b=(M,ne)=>{m(M,(ue,he)=>ne(he[ue],ue))},P=(M,ne,ue)=>{v(M).i[ne]=ue,ue.listen(he=>v(M).t.map(de=>de(ne,he)))},$=M=>!!v(M),A=new WeakMap,C=M=>j(M.h),x=(M,ne)=>ne.reduce((ue,he)=>ue[C(he)],M),k=(M,ne)=>{let ue=M.get(ne);return O(ue)?ue:ue?new E({t:[],p:0,o:ue.o,u:ue.u.map(he=>({h:k(M,he)}))}):ne};class E{I=e();m;get S(){return A.get(this)}P(ne,ue,he){he.o&&((re,ve)=>{let me=v(re);me.t=me.t.filter(be=>be!==ve)})(he.o,he.A);let de=ue.u.slice(0,ne);he.C=x(ue.o,de)[C(he)],he.o=de.reverse().find(re=>$(re.C))?.C||ue.o,m(he.o,he.A)}k(ne,ue){let he=this.S;if(!ue||ue===C(he.u[ne])){for(;ne<he.u.length;ne++)this.P(ne,he,he.u[ne]);this.M()}}M(){this.S.t.map(ne=>ne(this.value))}constructor(ne){A.set(this,ne),ne.p==0?ne.u.map((ue,he)=>{ue.A=this.k.bind(this,he),O(ue.h)&&ue.h.listen(de=>ue.A()),this.P(he,ne,ue)}):ne.p==1?ne.S.listen(ue=>this.M()):ne.p==2&&ne.O.map(ue=>ue.listen(he=>this.M()))}get value(){let ne=this.S;return ne.p==0?x(ne.o,ne.u):ne.p==1?ne.j(ne.S.value):ne.p==2?ne.O.map(ue=>ue.value):void 0}_(ne){let ue,he=this.S;return he.p==0?(x(he.o,he.u.slice(0,-1))[C(he.u[he.u.length-1])]=ne,!0):!(he.p!=1||!he.T||(ue=he.T(ne))===r||(he.S.value=ue,0))}set value(ne){this._(ne)}[l](){return this.S.O||null}[h](){return I&&d.set(this.I,this),this.I}listen(ne){this.S.t.push(ne)}zip(...ne){return new E({t:[],p:2,O:[this,...ne]})}andThen(ne,ue){return this.map(he=>{let de=he?ne:ue;return typeof de=="function"?de(he):de})}map(ne,ue){return new E({t:[],p:1,S:this,j:ne,T:ue})}mapEach(ne){return this.map(ue=>t.from(ue).map(ne))}}let O=M=>M instanceof E,j=M=>O(M)?M.value:M,T=(M,ne,ue)=>{O(M)&&(ue?.(),M.listen(ne)),ne(j(M))},N=M=>M instanceof Y,R=M=>M instanceof Array,W=M=>M instanceof E,J=()=>{throw Error("dl")},L=w([[c,/\[\s*(?:(?<ns>\*|[-\w\P{ASCII}]*)\|)?(?<nm>[-\w\P{ASCII}]+)\s*(?:(?<op>\W?=)\s*(?<val>.+?)\s*(\s(?<case>[iIsS]))?\s*)?\]/gu],[i,/#(?<nm>[-\w\P{ASCII}]+)/gu],[f,/\.(?<nm>[-\w\P{ASCII}]+)/gu],[n,/\s*,\s*/g],[s,/\s*[\s>+~]\s*/g],[o,/::(?<nm>[-\w\P{ASCII}]+)(?:\((?<arg>¶*)\))?/gu],[a,/:(?<nm>[-\w\P{ASCII}]+)(?:\((?<arg>¶*)\))?/gu],[u,/(?:(?<ns>\*|[-\w\P{ASCII}]*)\|)?\*/gu],[_,/(?:(?<ns>\*|[-\w\P{ASCII}]*)\|)?(?<nm>[-\w\P{ASCII}]+)/gu]]),z=M=>M==a||M==o?RegExp(L.get(M).source.replace("¶","."),"gu"):L.get(M),q=(M,ne)=>{let ue=0,he="";for(;ne<M.length;ne++){let de=M[ne];if(de=="("?++ue:de==")"&&--ue,he+=de,ue===0)return he}return he},B=/(['"])([^\\\n]*?)\1/g,D=M=>{if((M=M.trim())==="")return[];let ne=[];M=(M=M.replace(/\\./g,(de,re)=>(ne.push({N:de,R:re}),"".repeat(de.length)))).replace(B,(de,re,ve,me)=>(ne.push({N:de,R:me}),`${re}${"".repeat(ve.length)}${re}`));{let de,re=0;for(;(de=M.indexOf("(",re))>-1;){let ve=q(M,de);ne.push({N:ve,R:de}),M=`${M.substring(0,de)}(${"¶".repeat(ve.length-2)})${M.substring(de+ve.length)}`,re=de+ve.length}}let ue=(de=>{if(!de)return[];let re=[de];for(let[me,be]of L.entries())for(let ke=0;ke<re.length;ke++){let Fe=re[ke];if(typeof Fe!="string")continue;be.lastIndex=0;let xe=be.exec(Fe);if(!xe)continue;let Se=xe.index-1,ye=[],Me=xe[0],Oe=Fe.slice(0,Se+1);Oe&&ye.push(Oe),ye.push({...xe.groups,p:me,W:Me});let Ge=Fe.slice(Se+Me.length+1);Ge&&ye.push(Ge),re.splice(ke,1,...ye)}let ve=0;for(let me of re)typeof me=="string"?J():(me.J=[ve,ve+=me.W.length],me.p!=s&&me.p!=n||(me.W=me.W.trim()||" "));return re})(M),he=[];for(let de of ne.reverse())for(let re of ue){let{R:ve,N:me}=de;if(re.J[0]>ve||ve+me.length>re.J[1])continue;let{W:be}=re,ke=ve-re.J[0];re.W=be.slice(0,ke)+me+be.slice(ke+me.length),re.W!==be&&he.push(re)}for(let de of he){let re=z(de.p);re||J(),re.lastIndex=0;let ve=re.exec(de.W);ve||J(),g(de,ve.groups)}return ue},F=M=>M.map(ne=>ne.W).join(""),G=(M,...ne)=>({L:M,q:ne,B:U}),H="dlc",K=()=>[...t(16)].reduce(M=>M+Math.random().toString(36)[2],""),Q=":global(",U=(M,ne,ue)=>{let he=D(`:where(.${ue})`),de=`:where(._${K()} `,re=(me,be)=>{for(let ke=0;ke<me.length;ke++){let Fe,xe,Se,ye=me[ke];if(ye.p==a&&ye.arg){let Me=ye.nm=="global",Oe=re(D(ye.arg),Me||be);Me?(Fe=ke,xe=1,Se=Oe):(ye.arg=F(Oe),ye.W=`:${ye.nm}(${ye.arg})`)}else if(!be&&(ke===me.length-1||[s,n].includes(me[ke+1].p))){for(Fe=ke;Fe>0&&me[Fe].p==o;)Fe--;Fe++,xe=0,Se=he}Se&&(me.splice(Fe,xe,...Se),ke+=Se.length)}return me},ve=me=>[...me].map(be=>(be.selectorText&&(be.selectorText=F(re(D(be.selectorText.replaceAll(de,Q)))).replace(/:scope/g,`.${ue}.${H}`)),be.cssRules&&ve(be.cssRules),be));M.innerText=ne.replaceAll(Q,de),ve(M.sheet.cssRules)},V="dlcss-",X=p.document,Y=p.Node,Z=M=>new Text(M),ee=M=>new Comment(M),te=()=>V+K(),le=()=>!1,se=null,ie=(M,ne,ue,he)=>{if(M==null)return[ee()];if(W(M)){let de=ee("["),re=ee("]"),ve=null;return T(M,me=>{if(ve&&!de.parentNode)return;let be=ie(me,ne,ue,M.m);if(ve){let ke=w(ve.map((ye,Me)=>[ye,Me])),Fe=be.filter(ye=>ke.has(ye)).map(ye=>ke.get(ye)),xe=w((ye=>{let Me,Oe=[0],Ge=[],Ce=1,$e=[];for(let Ae in ye){let Te,We,Pe=1,Ne=Ce+1;for(;Ne>Pe;)Te=Pe+Math.floor((Ne-Pe)/2),ye[Oe[Te]]<ye[Ae]?Pe=Te+1:Ne=Te;We=Pe,Ge[Ae]=Oe[We-1],Oe[We]=Ae,We>Ce&&(Ce=We)}Me=Oe[Ce];for(let Ae=Ce-1;Ae>=0;Ae--)$e[Ae]=ye[Me],Me=Ge[Me];return $e})(Fe).map(ye=>[ve[ye],,])),Se=de;be.map(ye=>{ke.has(ye)&&xe.has(ye)||ne.insertBefore(ye,Se.nextSibling),Se=ye}),ve.filter(ye=>!be.includes(ye)&&ye.parentNode===ne).map(ye=>ne.removeChild(ye))}ve=be}),[de,...ve,re]}if(N(M)){let de,re=ve=>{if(de=ve.classList){let me=[...de],be=me.find(ke=>ke.startsWith(V));if(me.find(ke=>ke==H))return;be?he&&be!==he&&(de.remove(be),de.add(he)):de.add(he||ue),[...ve.childNodes].map(re)}};return(he||ue)&&re(M),[M]}return R(M)?M.flatMap(de=>ie(de,ne,ue,he)):[Z(M)]},fe="createElement",oe=w(),ae=[],ce=(M,ne,ue)=>{let{children:he,...de}=ne;ue&&(de.key=ue),he||=[];let re,ve=R(he)?he:[he];if(typeof M=="function"){let me=S({});for(let xe in de){let Se=de[xe];W(Se)?P(me,xe,Se):me[xe]=Se}for(let xe of ve)W(xe)&&(xe.m||=se);let be=oe.get(M);if(M.style){let xe=M.style,Se=X[fe]("style");if(!be){be={I:te(),D:[]};let ye="";for(let Me=0;Me<xe.L.length;Me++)if(ye+=xe.L[Me],Me+1<xe.L.length){let Oe=xe.q[Me];if(typeof Oe=="string")ye+=Oe;else{let Ge=K();ye+=`var(--${Ge})`,be.D.push([Ge,Oe])}}Se.setAttribute(H,M.name),Se.setAttribute(V+"id",be.I),X.head.append(Se),xe.B(Se,ye,be.I),oe.set(M,be)}}let ke={state:me,children:ve,id:be?.I},Fe=se;if(se=be?.I,re=M.call(me,ke),se=Fe,ke.root=re,N(re)&&(re.$=ke,re.classList.add(H),be))for(let[xe,Se]of be.D){let ye="--"+xe,Me=re.style;T(Se(ke.state),Oe=>{Oe===void 0?Me.removeProperty(ye):Me.setProperty(ye,Oe)})}ke.init?.(),N(re)&&le?.()?ae.push(ke):le&&ke.mount?.()}else{let me=de?.xmlns;re=X[fe+(me?"NS":"")](me||M,me&&M,de,ve);let be=(Fe,xe)=>{xe===void 0||xe===!1?re.removeAttribute(Fe):re.setAttribute(Fe,xe)};for(let Fe of ve)ie(Fe,re,se).map(xe=>{xe.parentNode!==re&&re.appendChild(xe)});let ke=re.classList;for(let Fe in de){let xe=de[Fe];if(Fe==="this")xe.value=re;else if(Fe==="value"||Fe==="checked")T(xe,Se=>{be(Fe,Se),re.value=Se},()=>{re.addEventListener("input",()=>xe.value=re[Fe])});else if(Fe==="class"){let Se=[];T(xe,ye=>{let Me=ye.split(" ").filter(Oe=>Oe.length);Se.length&&ke.remove(...Se),Me.length&&ke.add(...Me),Se=Me})}else if(Fe.startsWith("on:"))re.addEventListener(Fe.substring(3),Se=>xe(Se));else if(Fe.startsWith("class:")){let Se=Fe.substring(6);T(xe,ye=>{ye?ke.add(Se):ke.remove(Se)})}else if(Fe.startsWith("attr:")){let Se=Fe.substring(5);T(xe,ye=>{re[Se]=ye})}else if(Fe!="style"||typeof xe!="object"||W(xe))T(xe,Se=>be(Fe,Se));else for(let Se in xe)T(xe[Se],ye=>{re.style.setProperty(Se,ye)})}se&&![...ke].find(Fe=>Fe.startsWith(V))&&ke.add(se),me&&(re.innerHTML=re.innerHTML)}return re},_e=M=>M.children,ge=p.localStorage||{},pe="__dls_ty",we=(M,ne)=>{let{ident:ue,backing:he,autosave:de}=ne;ue="dls-"+ue;let re=de==="auto";he==="localstorage"&&(he={read:Se=>ge[Se]||null,write:(Se,ye)=>ge[Se]=ye});let ve=Promise.all([]),me=()=>{ve=(async()=>{await ve;let Se=JSON.stringify(M,(ye,Me)=>{return $(Me)?{[pe]:"s",v:(Oe=Me,v(Oe).l)}:Me;var Oe});Se!==""&&await he.write(ue,Se)})()},be=Se=>{$(Se)&&b(Se,be),me()},ke=(Se,ye)=>{for(let Me in ye){let Oe=ye[Me];$(Oe)&&re&&b(Oe,be),Oe instanceof Object&&Me in Se&&g(Oe,ke(Se[Me],Oe))}g(Se,ye)},Fe=Se=>{Se&&ke(M,JSON.parse(Se,(Me,Oe)=>Oe&&Oe[pe]==="s"?S(Oe.v):Oe));let ye=S(M);return b(ye,be),ye},xe=he.read(ue);return xe instanceof Promise?xe.then(Fe):Fe(xe)},Ie=()=>{let M=[],ne=ue=>((he,de)=>de.map(re=>{let ve=se;se=re.m,re.A(he),se=ve}))(ue,M);return ne.listen=ue=>{M.push({A:ue,m:se})},ne};Object.defineProperty(globalThis,"use",{get:()=>(I=!0,(M,...ne)=>{I=!1;let ue=d;if(d=w(),M instanceof Array&&"raw"in M)return((de,re,ve)=>{let me=S({}),be=[];for(let ke in re)if(be.push(re[ke]),ve[ke]){let Fe=ve[ke],xe=k(de,Fe[h]());if(O(xe)){let Se=be.length;xe.listen(ye=>{be[Se]=ye,me.F=be.join("")}),be.push(xe.value)}else be.push(Fe)}return me.F=be.join(""),use(me.F)})(ue,M,ne);let he=de=>k(ue,de[h]());return M=he(M),ne.length?M.zip(...ne.map(he)):M}),configurable:!0}),ce[l]=()=>oe=w(),ce[r]=()=>ae.splice(0,ae.length);let settings=we({name:""},{backing:"localstorage",autosave:"auto",ident:"oneshot-wasm"});globalThis.settings=settings;let SteamJS={GetAchievement(M){return console.debug("[Steamworks] GetAchievement",M),!1},SetAchievement(M){console.debug("[Steamworks] SetAchievement",M)},GetStat(M){return console.debug("[Steamworks] GetStat",M),0},SetStat(M,ne){console.debug("[Steamworks] SetStat",M,ne)},GetPersonaName(){return console.debug("[Steamworks] GetPersonaName"),settings.name},GetLanguage(){console.debug("[Steamworks] GetLanguage");const M={"zh-CN":"schinese","zh-SG":"schinese","zh-TW":"tchinese","zh-HK":"tchinese","pt-BR":"brazilian","pt-PT":"portuguese","es-419":"latam","es-ES":"spanish",de:"german",fr:"french",it:"italian",ja:"japanese",ko:"korean",ru:"russian"};return M[navigator.language]||M[navigator.language.split("-")[0]]||"english"}};const SEAMLESSCOUNT=10,gameState=S({ready:!1,assetsReady:!1,diskInserted:!1,initting:!1,playing:!1}),loglisteners=[];function proxyConsole(M,ne){return console[M].bind(console)}proxyConsole("error","var(--error)");proxyConsole("warn","var(--warning)");proxyConsole("log","var(--fg)");proxyConsole("info","var(--info)");proxyConsole("debug","var(--fg4)");let wasm,dotnet,exports$1;function getDlls(){const M=wasm.dotnet.instance.config;return[...M.resources?.coreAssembly||[],...M.resources?.assembly||[]].map(ue=>[ue.name,ue.virtualPath])}async function preInit(){if(console.log("preinit"),gameState.ready)return;let url="../_framework/dotnet.js";wasm=await eval(`import("${url}")`),dotnet=wasm.dotnet,console.debug("initializing dotnet");const runtime=await dotnet.withConfig({}).withRuntimeOptions(["--jiterpreter-minimum-trace-hit-count=500","--jiterpreter-trace-monitoring-period=100","--jiterpreter-trace-monitoring-max-average-penalty=150",`--jiterpreter-wasm-bytes-limit=${64*1024*1024}`,`--jiterpreter-table-size=${32*1024}`,"--jiterpreter-stats-enabled"]).create(),config=runtime.getConfig();exports$1=await runtime.getAssemblyExports(config.mainAssemblyName),console.log(exports$1),runtime.setModuleImports("SteamJS",SteamJS),self.wasm={Module:runtime.Module,FS:runtime.Module.FS,dotnet,runtime,config,exports:exports$1};const dlls=getDlls(),loc=location.pathname;await runtime.runMain(),await exports$1.OneshotLoader.PreInit(loc,dlls.map(M=>`${M[0]}|${M[1]}`)),console.debug("dotnet initialized"),gameState.ready=!0}async function patch(){console.log(exports$1),await exports$1.OneshotPatcher.Patch()}async function run(){document.body.dataset.worldmachinePlaying="1",gameState.playing=!0,gameState.initting=!0,console.log("Init..."),console.time("Init "),await exports$1.OneshotLoader.Init(),console.timeLog("Init ");for(let M=0;M<SEAMLESSCOUNT;M++)if(console.debug(`SeamlessInit${M}...`),!await exports$1.OneshotLoader.RunOneFrame())throw new Error("RunOneFrame() Failed!");console.timeEnd("Init "),gameState.initting=!1,await exports$1.OneshotLoader.MainLoop(),console.debug("Cleanup..."),await exports$1.OneshotLoader.Cleanup(),gameState.playing=!1,delete document.body.dataset.worldmachinePlaying}const rootFolder=await navigator.storage.getDirectory();let sourceFolder=null;function setSourceFolder(M){sourceFolder=M,gameState.diskInserted=!0}function getSourceFolder(){return sourceFolder}function hasSourceFolder(){return sourceFolder!==null}async function copyFile(M,ne){const ue=await M.getFile().then(re=>re.stream()),de=await(await ne.getFileHandle(M.name,{create:!0})).createWritable();await ue.pipeTo(de)}async function countFolder(M){let ne=0;async function ue(he){for await(const[de,re]of he)re.kind==="file"?ne++:await ue(re)}return await ue(M),ne}async function copyFolder(M,ne,ue){async function he(re,ve){for await(const[me,be]of re)if(be.kind==="file")await copyFile(be,ve),ue&&ue(me);else{const ke=await ve.getDirectoryHandle(me,{create:!0});await he(be,ke)}}const de=await ne.getDirectoryHandle(M.name,{create:!0});await he(M,de)}let GAMEDATA_FOLDERS=["autotiles","loc","maps","music","music_effects","sfx","tilesets","twm","txt"],CONTENT_FOLDERS=["autotiles","facepics","fogs","footprints","glyphs","item_icons","lightmaps","npc","panoramas","partner_logos","pictures","shaders","the_world_machine","tilesets","titles","transitions","ui"];async function verifyGameFolder(M){try{try{console.debug("[verifyGameFolder] verifying OneShotMGMac.dll"),await M.getFileHandle("OneShotMGMac.dll")}catch{console.debug("[verifyGameFoler] Uploaded game is not the Mac version, checking for Windows version"),console.debug("[verifyGameFolder] verifying OneShotMG.exe"),await M.getFileHandle("OneShotMG.exe")}console.debug("[verifyGameFolder] verifying content");let ne=await M.getDirectoryHandle("content");console.debug("[verifyGameFolder] verifying gamedata");let ue=await M.getDirectoryHandle("gamedata");for(let he of CONTENT_FOLDERS)console.debug("[verifyGameFolder] verifying content/"+he),await ne.getDirectoryHandle(he);for(let he of GAMEDATA_FOLDERS)console.debug("[verifyGameFolder] verifying gamedata/"+he),await ue.getDirectoryHandle(he);return!0}catch{return!1}}async function copyGame(M,ne){if(!await verifyGameFolder(M))throw new Error("Invalid game folder");let ue=await rootFolder.getDirectoryHandle("OneSht4",{create:!0}),he=await M.getDirectoryHandle("content"),de=await M.getDirectoryHandle("gamedata"),re=-1,ve=1+await countFolder(he)+await countFolder(de),me=be=>{re++,ne(re/ve,be)};me("");try{await M.getFileHandle("OneShotMGMac.dll"),await copyFile(await M.getFileHandle("OneShotMGMac.dll"),ue)}catch{await copyFile(await M.getFileHandle("OneShotMG.exe"),ue)}me("OneShotMG"),await copyFolder(he,ue,me),await copyFolder(de,ue,me)}async function wasGameCopied(){let M;try{M=await rootFolder.getDirectoryHandle("OneSht5")}catch{return!1}return await verifyGameFolder(M)}async function wasPatched(){try{return await rootFolder.getFileHandle("OneShot.dll"),!0}catch{return!1}}let autoInstallPromise=null;async function ensureBundledAssets(){if(!window.worldMachineAutoInstall)return!1;autoInstallPromise||=window.worldMachineAutoInstall();await autoInstallPromise;const M=await wasGameCopied();return gameState.diskInserted=M,gameState.assetsReady=M&&await wasPatched(),M}let copiedAtStartup=await wasGameCopied(),patchedAtStartup=await wasPatched();gameState.assetsReady=copiedAtStartup&&patchedAtStartup;gameState.diskInserted=copiedAtStartup;setTimeout(()=>{ensureBundledAssets().catch(M=>console.warn("[worldmachine] automatic bundled install failed",M))},0);let Header=function(){return ce("div",{class:"header",children:this.text})};Header.style=G`
	:scope {
		border-bottom: 4px double var(--oneshot);
		padding: .25rem;
		padding-left: 1rem;
		padding-top: .5rem;
		width: max-content;
	}
`;let GenericFooter=function(){return ce("div",{class:"footer",children:use(this.status)})};GenericFooter.style=G`
	:scope {
		border-top: 1px solid var(--oneshot);
		padding: 0.25rem;
		padding-inline: 0.5rem;
		width: 100%;
		min-height: 2rem;
	}
`;let CopyFooter=function(){return ce("div",{class:"footer",children:ce("div",{class:"message",children:use(this.status)})})};CopyFooter.style=G`
	:scope {
		border-top: 1px solid var(--oneshot);
		width: 100%;
		min-height: 2rem;
		padding: .25rem;
		display: flex;
		justify-content: flex-end;
	}

	.message {
		border-left: 1px solid var(--oneshot);
		padding-inline: 0.5rem;
	}
`;let InsertDiskScreen=function(){return ce("div",{class:"setup-screen",children:[ce(Header,{text:"World Machine Setup"}),ce("div",{class:"setup-content",children:ce("p",{children:"Please insert the World Machine OS disk into Drive A:"})}),ce(GenericFooter,{status:"Waiting for disk"})]})};InsertDiskScreen.style=G`
	p {
		max-width: 15rem;
		text-align: center;
	}

	.setup-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
`;let WelcomeScreen=function(){return ce("div",{class:"setup-screen",children:[ce(Header,{text:"World Machine Setup"}),ce("div",{class:"setup-content",children:[ce("b",{children:"Welcome to Setup."}),ce("p",{children:"The Setup program for the TWM Labs World Machine operating system prepares World Machine to run on your computer."}),ce("ul",{children:[ce("li",{children:"To learn more about Setup before continuing, refer to the attached notes."}),ce("li",{children:"To set up World Machine now, click the Continue button."}),ce("li",{children:"To quit Setup without installing World Machine, press Ctrl+W."})]}),ce("br",{}),ce("button",{class:"setup-button","on:click":this.next,children:"Continue"})]}),ce(GenericFooter,{status:"Ctrl+W=Exit"})]})},NameEntryScreen=function(){this.nameInput="";let M=()=>{this.nameInput.trim()&&(settings.name=this.nameInput.trim(),this.next()),document.querySelector("#sticky-note-widget")?.classList.add("hint"),setTimeout(()=>{document.querySelector("#sticky-note-widget")?.classList.remove("hint")},1400)};return ce("div",{class:"setup-screen",children:[ce(Header,{text:"World Machine Setup"}),ce("div",{class:"setup-content",children:[ce("b",{children:"Owner Registration"}),ce("br",{}),ce("p",{children:"Enter the first name of this machine's owner:"}),ce("input",{class:"name-input",placeholder:"Your name...",value:use(this.nameInput),"on:keydown":ne=>ne.key==="Enter"&&M()}),ce("br",{}),ce("br",{}),ce("button",{class:"setup-button","on:click":M,disabled:use(this.nameInput).map(ne=>!ne.trim()),children:"Continue"})]}),ce(GenericFooter,{status:""})]})},CopyingScreen=function(){return ce("div",{class:"setup-screen",children:[ce(Header,{text:"World Machine Setup"}),ce("div",{class:"setup-content",children:ce("div",{class:"inner-content",children:[ce("p",{children:["Please wait while Setup copies files to the World Machine installation folders.",ce("br",{}),"Please do not exit this screen until the process is complete."]}),ce("br",{}),ce("div",{class:"box",children:use(this.patching).andThen(ce("p",{children:"Preparing..."}),ce(_e,{children:[ce("span",{children:"Setup is copying files..."}),ce("p",{children:[use(this.progress).map(M=>Math.floor(M*100)),"%"]}),ce("div",{class:"progress-bar",children:ce("div",{class:"progress-fill",style:{width:use`calc(${this.progress}*100%)`}})})]}))})]})}),use(this.patching).andThen(ce(CopyFooter,{status:"Applying patches..."}),ce(CopyFooter,{status:use`Copying: ${this.currentFile}`}))]})};CopyingScreen.style=G`
	p {
		text-align: center;
		margin: .5rem;
	}
	.setup-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}
	.inner-content {
		max-width: 40rem;
	}

	.box {
		border: 4px double var(--oneshot);
		padding: 1rem;
	}

	.progress-bar {
		width: 100%;
		height: 2rem;
		border: 2px solid var(--oneshot);
		background: #000;
		margin-top: 0.25rem;

		display: flex;
		align-items: center;
		justify-content: flex-start;
	}

	.progress-fill {
		height: 100%;
		background: var(--oneshot);
	}
`;let SetupOverlay=function(){return ce("div",{class:"setup-overlay",children:[use(this.step).map(M=>M==="welcome").andThen(ce(WelcomeScreen,{next:this.onWelcomeNext})),use(this.step).map(M=>M==="insert-disk").andThen(ce(InsertDiskScreen,{})),use(this.step).map(M=>M==="copying").andThen(ce(CopyingScreen,{progress:use(this.progress),patching:use(this.patching),currentFile:use(this.currentFile)})),use(this.step).map(M=>M==="name").andThen(ce(NameEntryScreen,{next:this.onNameNext}))]})};SetupOverlay.style=G`
	:scope {
		position: absolute;
		inset: 0;
		background: #000;
		color: var(--oneshot);
		font-size: 1.25rem;
		display: flex;
		z-index: 10;
	}
`;let PlayButton=function(){return ce("button",{"on:click":this.onPower,disabled:use(gameState.playing),"class:ready":use(gameState.ready).map(M=>M),children:ce("svg",{xmlns:"http://www.w3.org/2000/svg",height:"24px",viewBox:"0 -960 960 960",width:"24px",fill:"currentcolor",children:ce("path",{d:"M480-46q-91 0-169.99-34.08-78.98-34.09-137.41-92.52-58.43-58.43-92.52-137.41Q46-389 46-480q0-91.34 33.5-170.17Q113-729 172-788l90 89q-42 42-66 98.17t-24 121.06Q172-350 261-261t219 89q130 0 219-89t89-218.77q0-64.89-23.5-121.06T699-699l89-89q59 59 92.5 137.83Q914-571.34 914-480q0 91-34.08 169.99-34.09 78.98-92.52 137.41-58.43 58.43-137.41 92.52Q571-46 480-46Zm-63-371v-497h126v497H417Z"})})})};PlayButton.style=G`
	:scope {
		height: 100%;
		aspect-ratio: 1 / 1;
		
		border: none;
		border-radius: 50%;

		cursor: not-allowed;

		--led-color: var(--play-led-not-ready);

		background: color-mix(in srgb, var(--button-bg), var(--led-color) 60%);
		color: var(--button-fg);

		transition: background 0.15s linear;

		display: flex;
		align-items: center;
		justify-content: center;
	}

	:scope.ready {
		cursor: auto;
		--led-color: var(--play-led-ready);
	}

	:scope:disabled {
		cursor: not-allowed;
		--led-color: var(--button-bg);
	}
`;let CopyAssetsSlot=function(){return ce("button",{"on:click":this.insertDisk,disabled:use(gameState.playing),children:[use(gameState.diskInserted).map(M=>M?"Disk Inserted":"Insert a Disk"),ce("div",{class:"led","class:blinking":use(gameState.diskInserted).map(M=>!M)})]})};CopyAssetsSlot.style=G`
	:scope {
		background: var(--button-bg);
		color: var(--button-fg);
		border: none;
		border-radius: 8px;

		cursor: pointer;

		display: flex;
		gap: 0.5rem;
		align-items: center;
		padding: 0.5rem;

		font-size: 1.5rem;
	}
	:scope:disabled {
		cursor: not-allowed;
	}

	.led {
		align-self: start;
		width: 12px;
		border-radius: 100%;
		aspect-ratio: 1 / 1;
		background: var(--led-ok);
	}
	.led.blinking {
		animation: 1s ease assets-led infinite;
	}

	@keyframes assets-led {
		from, to { background: #000; }
		50% {
			background: var(--led-error);
		}
	}
`;let MONOMOD_WASM="https://github.com/r58Playz/MonoMod",GITHUB="https://github.com/MercuryWorkshop/webshot",StickyNote=function(){let M=ne=>{ne.stopPropagation(),this.done()};return ce("div",{children:[ce("div",{class:"headline",children:"WebShot – README"}),ce("p",{class:"info",children:["Machine Owned By:",ce("input",{type:"text",value:use(settings.name),style:"font-family: var(--font-script); font-style: italic;"})]}),ce("p",{children:["This is a port of OneShot: World Machine Edition to the browser using dotnet and FNA's threaded WebAssembly support. It also technically supports hotpatching the game through ",ce("a",{href:MONOMOD_WASM,target:"_blank",children:"MonoMod.WASM"})," but there's no modloader yet!"]}),ce("p",{children:["You will need to own the game and have it downloaded to play this port. The source is available on ",ce("a",{href:GITHUB,target:"_blank",children:"GitHub"}),"."]}),ce("div",{class:"exit",children:ce("button",{"on:click":M,children:[ce("span",{children:"["})," CLOSE ",ce("span",{children:"]"})]})})]})};StickyNote.style=G`
	:scope {
		background: var(--sticky-note);
		color: #000;
		aspect-ratio: 1 / 1;
		height: 100%;
		overflow: hidden;
		
		padding: 2rem;
		font-size: 1.25rem;
	}

	.headline {
		font-size: 1.6rem;
		/* text-align: center; */
		/* margin-bottom: .5rem; */
	}

	.info {
		margin-bottom: .5rem;
		margin-top: .5rem;
	}

	input, button {
		background: none;
		outline: none;
		border: none;
		padding: 0 0.25rem;
		font-size: 1.25rem;
	}

	input {
		border: none;
	}

	.exit {
		display: flex;
		justify-content: center;
	}

	button {
		font-size: 1.4rem;
	}
	button span {
		visibility: hidden;
	}
	button:hover span {
		visibility: visible;
	}
`;let StickyNoteWidget=function(){return this.expanded=!1,ce("div",{"class:expanded":use(this.expanded),id:"sticky-note-widget",class:"sticky-note-widget",children:[ce("div",{class:"placeholder"}),ce("div",{class:"backdrop","on:click":()=>this.expanded=!1}),ce("div",{class:"sticky-note","on:click":()=>this.expanded=!this.expanded,children:ce(StickyNote,{done:()=>{this.expanded=!1}})})]})};StickyNoteWidget.style=G`
	:scope {
		align-self: flex-end;
		overflow: visible;
	}

	.placeholder {
		width: 16rem;
		height: 2.25rem;
		transition: height 0.2s linear;
	}

	:scope:hover:not(.expanded) .placeholder {
		height: 3rem;
	}

	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 99;
		backdrop-filter: blur(0px);
		background: transparent;
		pointer-events: none;
		transition: backdrop-filter 0.4s ease, background 0.4s ease;
	}

	:scope.expanded .backdrop {
		pointer-events: auto;
		backdrop-filter: blur(1px);
		background: rgba(0, 0, 0, 0.15);
	}

	.sticky-note {
		position: fixed;
		bottom: 1rem;
		left: 17rem;
		width: 30rem;
		height: 30rem;
		cursor: pointer;
		transform: rotate(2deg) translateY(calc(100% - 2.75rem));
		transform-origin: top right;
		transition: transform 0.4s, bottom 0.4s, left 0.4s;
		z-index: 100;
	}

	:scope:hover:not(.expanded) .sticky-note {
		transform: rotate(0deg) translateY(calc(100% - 5rem));
	}

	:scope.hint:not(.expanded) .sticky-note {
		transform: rotate(0deg) translateY(calc(100% - 7rem));
	}

	.sticky-note > * {
		width: 100%;
		height: 100%;
	}

	:scope.expanded .sticky-note {
		bottom: 50%;
		left: 50%;
		transform: rotate(0deg) translate(-50%, 50%);
	}
`;let GameView=function(){this.preinit.listen(async()=>{await preInit()}),this.setupStep="none",this.copyProgress=0,this.patching=!1,this.currentFile="";let M=async()=>{let re=await showDirectoryPicker();if(!await verifyGameFolder(re)){alert("Invalid game folder");return}setSourceFolder(re),this.setupStep==="insert-disk"&&await ne()},ne=async()=>{this.setupStep="copying",this.copyProgress=0,this.currentFile="";let re=getSourceFolder();try{await copyGame(re,(ve,me)=>{this.copyProgress=ve,this.currentFile=me})}catch(ve){alert("There was an error while copying: "+ve.message),this.setupStep="none";return}await preInit(),this.patching=!0,this.copyProgress=0,await patch(),gameState.assetsReady=await wasGameCopied()&&await wasPatched(),this.patching=!1,this.setupStep="none",run()},ue=async()=>{if(gameState.assetsReady&&settings.name){await preInit(),run();return}this.setupStep="welcome"},he=()=>{this.setupStep="name"},de=async()=>{try{await ensureBundledAssets()}catch(re){console.warn("[worldmachine] automatic bundled install failed",re)}if(await wasGameCopied()){await preInit(),this.patching=!0,this.copyProgress=0,await patch(),gameState.assetsReady=await wasGameCopied()&&await wasPatched(),this.patching=!1,this.setupStep="none",run();return}hasSourceFolder()?await ne():this.setupStep="welcome"};return ce("div",{children:[ce("div",{class:"screen",children:[use(this.setupStep).map(re=>re!=="none").andThen(ce(SetupOverlay,{step:use(this.setupStep),progress:use(this.copyProgress),patching:use(this.patching),currentFile:use(this.currentFile),onWelcomeNext:he,onNameNext:de})),ce("div",{class:"canvas-wrapper","on:contextmenu":re=>re.preventDefault(),children:ce("canvas",{id:"canvas",class:"canvas"})})]}),ce("div",{class:"buttons",children:[ce(StickyNoteWidget,{}),ce("div",{class:"expand"}),ce(PlayButton,{onPower:ue})]})]})};GameView.style=G`
	:scope {
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: var(--monitor-bg);

		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
	}

	.screen {
		background: #000;
		flex: 1;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		border-radius: 4px;
		overflow: hidden;
		position: relative;
	}
	.canvas-wrapper {
		--height: min(calc(calc(100vw - 2rem) * 9 / 16), calc(100vh - 6rem));
		--width: calc(var(--height) * 16 / 9);
		height: var(--height);
		aspect-ratio: 16 / 9;
		cursor: none;
		position: relative;
	}
	.canvas-wrapper > * {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.copying-overlay {
		display: flex;
		flex-direction: column;
		gap: calc(var(--height) * 0.02);
		align-items: center;
		justify-content: center;

		color: var(--oneshot);
		font-size: calc(var(--height) * 0.07);
	}
	.copying-overlay .progress {
		border: calc(var(--height) * 0.01) solid var(--oneshot);
		width: calc(var(--width) * 0.5);
		height: calc(var(--height) * 0.1);
		padding: calc(var(--height) * 0.0075);
	}

	.copying-overlay .progress-inner {
		width: 100%;
		height: 100%;

		position: relative;
		overflow: hidden;
	}
	.copying-overlay .bar {
		background: var(--oneshot);
		width: calc(100% * var(--progress));
		height: 100%;
	}
	.copying-overlay .bar.patching {
		position: absolute;
		width: 40%;
		animation: 3s linear progress-indeterminate infinite;
	}
	.copying-overlay .tiny {
		font-size: calc(var(--height) * 0.03);
	}

	.buttons {
		height: 3rem;
		display: flex;
		gap: 2rem;
	}

	.expand { flex: 1; }

	@keyframes progress-indeterminate {
		0% { left: -40%; }
		100% { left: 100%; }
	}
`;let App=function(){let M=Ie();return ce("div",{id:"app",children:ce(GameView,{preinit:M})})};App.style=G`
	:scope {
		width: 100%;
		height: 100%;

		position: relative;
		overflow: hidden;
	}
`;document.querySelector("#app")?.replaceWith(ce(App,{}));
