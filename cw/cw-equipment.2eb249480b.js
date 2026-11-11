(function(){
  var hero=document.getElementById('bbEquipHero'),light=document.getElementById('bbHeroLight'),cursor=document.getElementById('bbHeroCursor');
  hero.addEventListener('mousemove',function(e){var r=hero.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;light.style.setProperty('--mx',(x/r.width*100)+'%');light.style.setProperty('--my',(y/r.height*100)+'%');cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';cursor.style.display='block'});
  hero.addEventListener('mouseleave',function(){cursor.style.display='none'});

  var categories = [
    {key:'all',label:'全部'},{key:'lifting',label:'提升'},{key:'laser',label:'激光'},
    {key:'skincare',label:'皮膚管理'},{key:'body',label:'瘦身美體'}
  ];

  var equipmentData = {
    lifting: [
      {name:'ULTHERAPY PRIME',nameKo:'Ultherapy Prime 美國音波二代',img:'https://hk.beautyblossom.kr/api/media/file/hk-equipment-xhk2ng-73b918992d.jpg?prefix=hk%2Fcommon',
       desc:'第二代Ultherapy Prime採用高強度聚焦超聲波（HIFU），將能量傳遞至SMAS筋膜層的頂級提升設備。相較以往<strong>可觀察至8mm深度</strong>，使治療更加精準；透過即時超聲波影像（DeepSee™）觀察皮膚層並提供<strong>客製化提升</strong>。',
       tags:['HIFU','SMAS 提升','FDA 認證','即時影像']},
      {name:'SOFWAVE',nameKo:'Sofwave 索夫波',img:'https://hk.beautyblossom.kr/api/media/file/hk-equipment-9hfqks-9a02e81a0d.png?prefix=hk%2Fcommon',
       desc:'採用SUPERB™技術，7個換能器將超聲波能量水平傳遞至真皮中層（1.5mm）的次世代提升設備。<strong>不造成臉頰凹陷</strong>，促進膠原蛋白與彈性蛋白再生，並以自有冷卻系統<strong>將疼痛降至最低</strong>。',
       tags:['SUPERB™ 技術','膠原蛋白再生','低疼痛','FDA 認證']},
      {name:'THERMAGE FLX',nameKo:'Thermage FLX 鳳凰電波',img:'https://hk.beautyblossom.kr/api/media/file/hk-equipment-cw5qk4-4b869eb9fe.jpg?prefix=hk%2Fcommon',
       desc:'第四代Thermage FLX以獨家射頻（RF）技術，促使真皮層膠原蛋白收縮與再生的彈力專用設備。以<strong>AccuREP™ 技術</strong>即時測量皮膚阻抗並傳遞最佳能量，搭配震動功能<strong>大幅減輕疼痛</strong>。',
       tags:['射頻 RF','膠原蛋白重塑','AccuREP™','疼痛最小化']},
      {name:'ONDA',nameKo:'ONDA 超微波',img:'https://hk.beautyblossom.kr/api/media/file/equipment-rdXO6P-v1.png?prefix=hk%2Fpages%2Fequipment',
       desc:'以Coolwaves™微波技術同時提供<strong>皮膚緊緻</strong>與脂肪減少。可應用於臉部與身體的<strong>3種手具</strong>，實現客製化提升。',
       tags:['Coolwaves™','皮膚緊緻','客製化提升']},
      {name:'INMODE',nameKo:'Inmode',img:'https://hk.beautyblossom.kr/api/media/file/equipment-QhKKkw-v1.png?prefix=hk%2Fpages%2Fequipment',
       desc:'結合射頻能量與吸引技術的複合提升設備。以<strong>FaceTite、Forma、BodyTite</strong>等多種手具，從臉部彈力到身體線條提供<strong>全方位解決方案</strong>。',
       tags:['射頻','彈力改善','脂肪減少','全方位']},
      {name:'SHURINK UNIVERSE',nameKo:'海芙音波宇宙版',img:'https://hk.beautyblossom.kr/api/media/file/equipment-ba4ZrY-v1.png?prefix=hk%2Fpages%2Fequipment',
       desc:'以聚焦超聲波（HIFU）為基礎的提升設備，透過均勻能量傳遞，對<strong>改善鬆弛</strong>與<strong>皮膚緊緻</strong>具有效果。以多種探頭可從1.5~4.5mm進行不同深度的客製化治療。',
       tags:['HIFU','改善鬆弛','緊緻','深度客製化']},
      {name:'VOLNUMER',nameKo:'Volnewmer 黃金V塑',img:'https://hk.beautyblossom.kr/api/media/file/hk-equipment-z2llbt-27c5a39d17.png?prefix=hk%2Fcommon',
       desc:'運用射頻能量<strong>恢復皮膚飽滿度</strong>並改善彈力的設備。以自然的飽滿提升效果，改善下垂的臉頰與下顎線。',
       tags:['射頻','飽滿提升','彈力改善']},
      {name:'POTENZA',nameKo:'Potenza 黃金微針',img:'https://hk.beautyblossom.kr/api/media/file/equipment-FSg471-v1.jpg?prefix=hk%2Fpages%2Fequipment',
       desc:'以射頻微針直接將能量傳遞至真皮層，提供<strong>提升與緊緻</strong>效果。以4種模式，從毛孔、疤痕到提升皆可進行複合解決方案。',
       tags:['射頻微針','提升','緊緻','複合解決方案']},
      {name:'DENSITY',nameKo:'Density',img:'https://hk.beautyblossom.kr/api/media/file/equipment-9txoRo-v1.png?prefix=hk%2Fpages%2Fequipment',
       desc:'以6.78MHz <strong>單極與雙極兩種射頻能量</strong>，最高400W輸出，將能量傳遞至真皮層、皮下脂肪層及筋膜層的提升設備。以阻抗回饋系統即時測量個人皮膚阻抗值，實現<strong>均勻能量傳遞</strong>，並以5段冷卻系統<strong>將疼痛降至最低</strong>。',
       tags:['單極·雙極 RF','400W 高輸出','阻抗回饋','5段冷卻']},
      {name:'LINEARZ',nameKo:'LinearZ',img:'https://hk.beautyblossom.kr/api/media/file/equipment-gAxVYv-v1.png?prefix=hk%2Fpages%2Fequipment',
       desc:'以高強度聚焦超聲波（HIFU）為基礎，具備<strong>點（Dot）·線（Linear）2種模式</strong>及1.5~13mm深度調節的次世代提升設備。無需更換探頭即可選擇多種深度，實現<strong>客製化提升</strong>，並以通過食藥處認證的正品探頭進行安全治療。',
       tags:['HIFU','點·線 模式','1.5~13mm 深度','客製化提升']},
      {name:'XERF',nameKo:'XERF',img:'https://hk.beautyblossom.kr/api/media/file/equipment-XERF_body_arm-v1.png?prefix=hk%2Fpages%2Fequipment',
       desc:'搭載6.78MHz與2MHz <strong>雙頻單極射頻</strong>的次世代提升設備。以雙頻組合實現3階段（Shallow-Middle-Deep）深度調節，從皮膚淺層至深層選擇性地傳遞熱能。搭配4種專利申請中的<strong>蜘蛛網圖案效應器</strong>與內建ICD冷卻系統，無需麻醉亦可進行治療，並已<strong>獲得韓國食藥處及美國FDA認證</strong>。',
       tags:['雙頻單極 RF','3段深度','蜘蛛網圖案','FDA 認證','ICD 冷卻']},
      {name:'ALLTITE',nameKo:'奧泰特',img:'https://hk.beautyblossom.kr/api/media/file/equipment-alltite-device-v1.webp?prefix=hk%2Fpages%2Fequipment',
       desc:'將原本用於癌症治療與復健治療的介電加熱原理應用於美容醫療儀器的 <strong>DLTD® 集中介電加熱</strong>射頻拉提儀器。透過藍寶石透鏡在近距離聚焦能量，<strong>同時向真皮層與 SMAS 層傳遞熱能</strong>，表皮則由即時冷卻系統降溫保護。設計上兼顧療程後即時的緊緻感與膠原蛋白的逐步再生。',
       tags:['射頻 RF','DLTD®','真皮·SMAS 同時','藍寶石透鏡','即時冷卻']},
      {name:'FORTRA QUATTRO',nameKo:'福特拉·夸特羅',img:'https://hk.beautyblossom.kr/api/media/file/equipment-fortra-quattro-device-v1.png?prefix=hk%2Fpages%2Fequipment',
       desc:'同時發射 755·808·940·1064nm <strong>四種波長</strong>的二極體激光儀器。在傳統三波長基礎上加入 940nm，從表皮膚色調理到真皮層、脂肪層及 SMAS 層進行分層處理，並透過 Intensive 與 Dynamic <strong>兩種模式</strong>依需求傳遞能量。可低至 -5℃ 的藍寶石接觸式冷卻與 11×24mm 照射面，有助於降低療程時的刺激感。',
       tags:['二極體激光','四波長同時照射','940nm','接觸式冷卻','雙模式']}
    ],
    laser: [
      {name:'POTENZA',nameKo:'Potenza 黃金微針',img:'https://hk.beautyblossom.kr/api/media/file/equipment-FSg471-v1.jpg?prefix=hk%2Fpages%2Fequipment',
       desc:'射頻微針設備，透過微針<strong>將射頻能量直接傳遞至真皮層</strong>。從毛孔、疤痕、色素、泛紅到提升皆可以<strong>4種模式</strong>，以一台設備解決多種皮膚困擾的複合解決方案。',
       tags:['射頻微針','毛孔·疤痕','色素','提升']},
      {name:'PICOSURE',nameKo:'PicoSure 皮秒激光',img:'https://hk.beautyblossom.kr/api/media/file/hk-equipment-6rjd9o-c5b3585238.png?prefix=hk%2Fcommon',
       desc:'以755nm亞歷山大激光為基礎的皮秒激光設備。以<strong>皮秒（一兆分之一秒）</strong>單位精細擊碎色素粒子，對肝斑、斑點、刺青去除具有效果，並可透過<strong>Focus Lens Array</strong>改善毛孔與疤痕。',
       tags:['皮秒','色素擊碎','肝斑','毛孔·疤痕']},
      {name:'CO2 LASER',nameKo:'CO2 Laser',img:'https://hk.beautyblossom.kr/api/media/file/hk-equipment-nzo44c-08628ea74c.jpg?prefix=hk%2Fcommon',
       desc:'以飛梭CO2激光對皮膚表面給予微細熱刺激，誘導<strong>自我再生</strong>。對深層疤痕、寬大毛孔、皺紋改善具強力效果，並可<strong>精準調節深度</strong>。',
       tags:['飛梭','自我再生','疤痕','毛孔']},
      {name:'V-LASER',nameKo:'V 激光',img:'https://hk.beautyblossom.kr/api/media/file/hk-equipment-d1pzav-35d0b15abd.png?prefix=hk%2Fcommon',
       desc:'搭載1064nm與532nm <strong>雙波長</strong>的次世代血管·色素專用激光。從微血管擴張、泛紅、色素沉澱、黑眼圈至<strong>皮膚緊緻</strong>皆可應用於廣泛適應症，以精準能量控制系統<strong>縮短術後恢復時間</strong>。',
       tags:['雙波長','泛紅','血管','色素','緊緻']},
      {name:'ACCUTONING',nameKo:'Accu Toning 祛痘激光',img:'https://hk.beautyblossom.kr/api/media/file/hk-equipment-cl2rs8-1e1b0de7a0.png?prefix=hk%2Fcommon',
       desc:'以1064nm Nd:YAG為基礎的激光淨膚設備，以<strong>均勻能量分布</strong>提升色素治療的安全性。循序漸進地改善肝斑、斑點、暗沉膚色，並<strong>將色素反彈現象降至最低</strong>。',
       tags:['激光淨膚','肝斑','膚色改善','安全性']},
      {name:'APOGEE ELITE',nameKo:'Apogee Elite',img:'https://hk.beautyblossom.kr/api/media/file/equipment-dgf3b6-v1.png?prefix=hk%2Fpages%2Fequipment',
       desc:'搭載755nm亞歷山大與1064nm Nd:YAG <strong>雙波長</strong>的頂級脫毛設備。已通過美國FDA認證，最大24mm光點尺寸與強力<strong>空氣冷卻系統（Cryo6）</strong>實現快速舒適的治療。適用於所有膚質。',
       tags:['雙波長','FDA 認證','空氣冷卻','快速治療']},
      {name:'DENSITY',nameKo:'Density',img:'https://hk.beautyblossom.kr/api/media/file/equipment-9txoRo-v1.png?prefix=hk%2Fpages%2Fequipment',
       desc:'以6.78MHz <strong>單極與雙極兩種射頻能量</strong>，最高400W輸出，將能量傳遞至真皮層、皮下脂肪層及筋膜層的提升設備。以阻抗回饋系統即時測量個人皮膚阻抗值，實現<strong>均勻能量傳遞</strong>，並以5段冷卻系統<strong>將疼痛降至最低</strong>。',
       tags:['單極·雙極 RF','400W 高輸出','阻抗回饋','5段冷卻']},
      {name:'LINEARZ',nameKo:'LinearZ',img:'https://hk.beautyblossom.kr/api/media/file/equipment-gAxVYv-v1.png?prefix=hk%2Fpages%2Fequipment',
       desc:'以高強度聚焦超聲波（HIFU）為基礎，具備<strong>點（Dot）·線（Linear）2種模式</strong>及1.5~13mm深度調節的次世代提升設備。無需更換探頭即可選擇多種深度，實現<strong>客製化提升</strong>，並以通過食藥處認證的正品探頭進行安全治療。',
       tags:['HIFU','點·線 模式','1.5~13mm 深度','客製化提升']}
    ],
    skincare: [
      {name:'LDM SMART TRI',nameKo:'LDM Smart Tri',img:'https://hk.beautyblossom.kr/api/media/file/equipment-n64HbD-v1.jpg?prefix=hk%2Fpages%2Fequipment',
       desc:'運用三種頻率（3·10·1MHz）的超聲波調節細胞間水分流動，<strong>促進膠原蛋白生成</strong>。在皮膚再生的同時，還可期待<strong>彈力改善、屏障強化、提升</strong>效果的醫療美膚設備。',
       tags:['三重超聲波','皮膚再生','屏障強化','彈力']},
      {name:'DERMASHINE',nameKo:'Dermashine',img:'https://hk.beautyblossom.kr/api/media/file/hk-equipment-680njc-944e033370.jpg?prefix=hk%2Fcommon',
       desc:'以真空吸引與自動注入系統在<strong>均勻深度</strong>精準注入玻尿酸、維他命等營養成分的水光設備。一次治療即可同時期待<strong>補水與皮膚再生</strong>。',
       tags:['水光注射','補水','均勻注入','皮膚再生']},
      {name:'OTODERM',nameKo:'Otoderm',img:'https://hk.beautyblossom.kr/api/media/file/hk-equipment-73f8hl-a2b53db096.jpg?prefix=hk%2Fcommon',
       desc:'同時將高濃度氧氣與有效成分供應至皮膚，幫助<strong>術後快速鎮靜與再生</strong>的醫療美膚設備。亦可安全應用於敏感肌膚。',
       tags:['供氧','皮膚再生','鎮靜','敏感肌膚']},
      {name:'AQUAPEEL',nameKo:'Aquapeel',img:'https://hk.beautyblossom.kr/api/media/file/hk-equipment-nbsysz-e27c241c39.png?prefix=hk%2Fcommon',
       desc:'運用水壓去除毛孔中廢物與皮脂，並將<strong>水分補充至皮膚深處</strong>的深層潔淨護理設備。治療後立即可感受明亮潔淨的肌膚紋理。',
       tags:['深層潔淨','補水','毛孔護理','膚質改善']},
      {name:'Q-FACIAL',nameKo:'Q-Facial',img:'https://hk.beautyblossom.kr/api/media/file/hk-equipment-nlbfmp-df1f47c35e.png?prefix=hk%2Fcommon',
       desc:'以<strong>4階段複合潔淨系統</strong>（潔淨→去角質→萃取→補水）護理皮膚的設備。徹底清除毛孔中廢物並滲透有效成分，提供術後健康的肌膚。',
       tags:['4階段潔淨','去角質','補水','毛孔護理']},
      {name:'SKINBLEE',nameKo:'Skinblee 複合儀',img:'https://hk.beautyblossom.kr/api/media/file/equipment-yOo5SA-v1.png?prefix=hk%2Fpages%2Fequipment',
       desc:'將<strong>冷凍（Cryo）、離子導入（Ionto）、超聲波（Sono）</strong>3種功能整合於一台設備的全方位醫療美膚設備。術後鎮靜、有效成分滲透、促進膠原蛋白生成皆可一次完成。',
       tags:['冷凍','離子導入','超聲波','全方位護理']}
    ],
    body: [
      {name:'ONDA',nameKo:'ONDA 超微波',img:'https://hk.beautyblossom.kr/api/media/file/equipment-rdXO6P-v1.png?prefix=hk%2Fpages%2Fequipment',
       desc:'以獲專利的Coolwaves™微波技術，非侵入性治療<strong>橘皮組織與局部脂肪</strong>的身體專用設備。以3種手具（皮膚緊緻、橘皮組織、脂肪減少）實現<strong>客製化身體護理</strong>。',
       tags:['Coolwaves™','橘皮組織','脂肪減少','身體緊緻']},
      {name:'INMODE',nameKo:'Inmode',img:'https://hk.beautyblossom.kr/api/media/file/equipment-QhKKkw-v1.png?prefix=hk%2Fpages%2Fequipment',
       desc:'結合射頻能量與吸引技術的複合設備，以<strong>BodyTite、BodyFX</strong>手具同時提供身體脂肪減少與皮膚緊緻。對<strong>非侵入性身體輪廓</strong>改善具有效果。',
       tags:['射頻','身體緊緻','脂肪減少','輪廓改善']}
    ]
  };

  var sectionInfo = {
    lifting:  {badge:'LIFTING',title:'Beauty Blossom 提升',desc:'擁有高強度超聲波、射頻、複合波長等\n多種頂級提升設備，\n依據皮膚厚度、鬆弛程度、改善目標\n提供客製化治療。'},
    laser:    {badge:'LASER',title:'Beauty Blossom 激光',desc:'從色素、毛孔、疤痕、血管到脫毛，\n以最適合各症狀的激光設備，\n提供精準診斷與客製化治療。'},
    skincare: {badge:'MEDICAL SKINCARE',title:'Beauty Blossom 醫療美膚',desc:'為術後快速鎮靜與再生，\n運用多種設備提供\n客製化術後護理服務，\n最大化治療效果。'},
    body:     {badge:'BODY',title:'Beauty Blossom 瘦身美體',desc:'針對橘皮組織、局部脂肪、身體曲線等\n體態困擾的專業設備，\n提供非侵入性且有效的\n身體解決方案。'}
  };

  var allEquipment=[],seenNames={},equipMap={};
  var catKeys=Object.keys(equipmentData);
  for(var c=0;c<catKeys.length;c++){var items=equipmentData[catKeys[c]];for(var i=0;i<items.length;i++){if(!equipMap[items[i].name])equipMap[items[i].name]=items[i];if(!seenNames[items[i].name]){allEquipment.push(items[i]);seenNames[items[i].name]=true}}}
  var tabsEl=document.getElementById('bbEquipTabs'),tabsHTML='';
  for(var t=0;t<categories.length;t++)tabsHTML+='<button class="bb-equip-tab'+(t===0?' active':'')+'" data-cat="'+categories[t].key+'">'+categories[t].label+'</button>';
  tabsEl.innerHTML=tabsHTML;
  function buildCard(item){return '<div class="bb-equip-card" data-equip="'+item.name+'"><div class="bb-equip-card-img"><img src="'+item.img+'" alt="'+item.name+'" loading="lazy"></div><div class="bb-equip-card-bottom"><h4>'+item.nameKo+'</h4><p class="bb-equip-card-name-en">('+item.name+')</p><span class="bb-equip-card-btn">查看詳情</span></div></div>'}
  var contentsEl=document.getElementById('bbEquipContents'),contentsHTML='';
  for(var t=0;t<categories.length;t++){
    var cat=categories[t],isActive=t===0?' active':'';
    contentsHTML+='<div class="bb-equip-tab-content'+isActive+'" data-cat="'+cat.key+'">';
    if(cat.key==='all'){contentsHTML+='<div class="bb-equip-section"><div class="bb-equip-grid grid-5">';for(var i=0;i<allEquipment.length;i++)contentsHTML+=buildCard(allEquipment[i]);contentsHTML+='</div></div>'}
    else{var info=sectionInfo[cat.key],items=equipmentData[cat.key]||[];contentsHTML+='<div class="bb-equip-section"><div class="bb-equip-section-header"><div class="bb-equip-section-badge">'+info.badge+'</div><h3>'+info.title+'</h3><p>'+info.desc.replace(/\n/g,'<br>')+'</p></div><div class="bb-equip-grid grid-3">';for(var i=0;i<items.length;i++)contentsHTML+=buildCard(items[i]);contentsHTML+='</div></div>'}
    contentsHTML+='</div>'
  }
  contentsEl.innerHTML=contentsHTML;
  var tabs=tabsEl.querySelectorAll('.bb-equip-tab'),contents=contentsEl.querySelectorAll('.bb-equip-tab-content');
  for(var i=0;i<tabs.length;i++)tabs[i].addEventListener('click',function(){var sel=this.getAttribute('data-cat');for(var j=0;j<tabs.length;j++)tabs[j].classList.remove('active');this.classList.add('active');for(var j=0;j<contents.length;j++){contents[j].classList.remove('active');if(contents[j].getAttribute('data-cat')===sel)contents[j].classList.add('active')}});
  var modal=document.getElementById('bbModal');
  document.addEventListener('click',function(e){var card=e.target.closest('.bb-equip-card');if(!card)return;var data=equipMap[card.getAttribute('data-equip')];if(!data)return;document.getElementById('bbModalImg').src=data.img;document.getElementById('bbModalImg').alt=data.name;document.getElementById('bbModalNameEn').textContent=data.name;document.getElementById('bbModalNameKo').textContent=data.nameKo;document.getElementById('bbModalDesc').innerHTML=data.desc;var tHTML='';for(var i=0;i<data.tags.length;i++)tHTML+='<span class="bb-modal-tag">'+data.tags[i]+'</span>';document.getElementById('bbModalTags').innerHTML=tHTML;modal.classList.add('show');document.body.style.overflow='hidden'});
  function closeModal(){modal.classList.remove('show');document.body.style.overflow=''}
  document.getElementById('bbModalClose').addEventListener('click',closeModal);
  modal.addEventListener('click',function(e){if(e.target===modal||e.target.classList.contains('bb-modal-center'))closeModal()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal()});
})();