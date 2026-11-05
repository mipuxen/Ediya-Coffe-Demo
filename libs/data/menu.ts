/* Ediya Coffee 블루로드점 — menu data (prices in KRW from the in-store board) */
import { MenuItem, MenuCategory } from '../types/menu/menu';

type RawRow = [MenuCategory, string, string, number, number | null, string, number, number, number, string, string, 'n' | 'c' | 'f', string[], [string, string]];

/* [cat, ko, en, L, E, flags, sweet, bitter, caffeine, col1, col2, top, variants(ko|en), [uz, en]]
   flags: I=iced only, Z=zero sugar, M=milk, F=fruity   top: n none, c cream, f foam */
const RAW: RawRow[] = [
['cf','아메리카노','Americano',3200,4200,'',0,4,3,'#1b0e07','','n',[],['Espresso va suvdan tayyorlanadigan klassika: quyuq, toza, biroz achchiq, shokolad va yong\'oq izlari bilan. Muz bilan ayniqsa tetiklantiradi.','The classic of espresso and water: bold, clean, gently bitter with cocoa and nutty notes.']],
['cf','달달커피','Mixed Coffee',3200,4200,'M',4,2,2,'#b07a55','','n',[],['Shirin, sutli aralash kofe: yumshoq va mayin, achchiqlik deyarli sezilmaydi. Kofeni yoqtirmaydiganlar uchun ham mos.','A sweet, milky mixed coffee: soft and smooth, with almost no bitterness.']],
['cf','제로슈가달달커피','Zero Sugar Mixed Coffee',3200,4200,'ZM',2,2,2,'#b58a68','','n',[],['Shakarsiz (ZERO SUGAR) variant: oddiy달달커피ga yaqin sutli ta\'m, lekin yengilroq va kamroq shirin.','The ZERO SUGAR take on the mixed coffee: milky and mellow, but lighter and less sweet.']],
['cf','헤이즐넛 아메리카노','Hazelnut Americano',3900,4900,'',2,3,3,'#2a160b','','n',[],['Americano ustiga findiq (hazelnut) aromati: yong\'oqsimon xushbo\'y, yumshoq va ozgina shirin.','Americano with hazelnut aroma: nutty, smooth and lightly sweet.']],
['cf','꿀화이트 아메리카노','Honey White Americano',3900,5100,'IM',3,3,3,'#1b0e07','#f3e6d3','n',[],['Americano ustida asalli sutli qatlam: tepasi shirin va yumshoq, pastki qismi quyuq va achchiq.','Americano topped with a honey-milk layer: sweet and soft on top, dark and bold below.']],
['cf','콜드브루','Cold Brew',4200,5200,'I',0,3,3,'#170b05','','n',[],['Sovuq suvda uzoq damlangan kofe: silliq, kislotaliligi past, tabiiy shirin ta\'mi bor.','Slow-steeped in cold water: silky, low acidity, with a naturally sweet finish.']],
['cf','카페라떼','Caffè Latte',4200,5400,'M',1,2,2,'#c79a72','','n',[],['Espresso va sutning muvozanati: yumshoq, sutli va issiq ham sovuq ham yaxshi.','A balance of espresso and milk: soft, creamy, great hot or iced.']],
['cf','카푸치노','Cappuccino',4200,5400,'M',1,2,2,'#b98862','','f',[],['Qalin sut ko\'pigi ostida espresso, ustida dolchin kukuni: havodor va xushbo\'y.','Espresso under thick milk foam, dusted with cinnamon: airy and aromatic.']],
['cf','흑당콜드브루','Black Sugar Cold Brew',4500,5700,'I',4,2,3,'#2a1409','#6b3a1a','n',[],['Sovuq damlangan kofe va qora shakar (흑당) siropi: karamelsimon, chuqur shirinlik.','Cold brew with black-sugar syrup: deep, caramel-like sweetness.']],
['cf','바닐라라떼','Vanilla Latte',4500,5700,'M',4,1,2,'#d0a67f','','n',[],['Vanil sirop bilan latte: shirin, yumshoq va xushbo\'y.','Latte with vanilla syrup: sweet, smooth and fragrant.']],
['cf','연유카페라떼','Condensed Milk Caffè Latte',4500,5700,'M',5,1,2,'#d8b998','','n',[],['Quyultirilgan sut (연유) bilan latte: boy, qaymoqli va juda shirin.','Latte with condensed milk: rich, creamy and very sweet.']],
['cf','카페모카','Caffè Mocha',4500,5700,'M',4,2,2,'#4a2a1a','','c',[],['Espresso, shokolad va sut, ustiga qaymoq: shokoladli kofe sevuvchilar uchun.','Espresso, chocolate and milk under whipped cream: for chocolate-coffee lovers.']],
['cf','화이트초콜릿모카','White Chocolate Mocha',4500,5700,'M',5,1,2,'#d9c3a8','','c',[],['Oq shokolad va espresso: sutli, juda shirin, yumshoq.','White chocolate and espresso: milky, very sweet and mellow.']],
['cf','카라멜마끼아또','Caramel Macchiato',4500,5700,'M',4,2,2,'#c48a5a','#7a4320','n',[],['Vanil, sut va espresso, tepasida karamel to\'ri: qatlamli va shirin.','Vanilla, milk and espresso with a caramel drizzle: layered and sweet.']],
['cf','아포가토','Affogato',4700,null,'I',4,3,2,'#3a2316','#efe4d3','c',[],['Muzqaymoq ustiga espresso quyiladigan desert: issiq-sovuq kontrasti, shirin va achchiq uyg\'unligi.','A dessert of espresso poured over ice cream: hot-cold contrast, sweet meets bitter.']],
['cf','시그니처라떼','Signature Latte',4700,5900,'M',3,2,2,'#b98458','#e7cfae','n',[],['Filialning firma latte\'si: boyroq sutli ta\'m va mayin shirinlik.','The signature latte: a richer milky body with gentle sweetness.']],
['cf','넛츠크림라떼','Nut Cream Latte',4700,5900,'IM',4,2,2,'#c08a5c','','c',[],['Yong\'oq kremi bilan latte: yog\'li-yong\'oqsimon, shirin va kremli.','Latte topped with nut cream: buttery, nutty, sweet and creamy.']],
['cf','콜드브루라떼','Cold Brew Latte',4700,5900,'IM',2,2,3,'#b58f6c','#2a160b','n',[],['Sovuq damlangan kofe va sut: silliq, kuchli kofe ta\'mi va yumshoq sutli yakun.','Cold brew with milk: smooth, strong coffee flavour with a soft milky finish.']],
['cf','민트모카','Mint Mocha',4900,6100,'M',4,2,2,'#2f1a12','','c',[],['Yalpiz, shokolad va espresso: salqin-shirin kombinatsiya, qaymoq bilan.','Mint, chocolate and espresso: a cool-sweet mix crowned with cream.']],
['cf','연유콜드브루','Condensed Milk Cold Brew',4900,6100,'IM',5,2,3,'#3a2012','#f1e4cf','n',[],['Sovuq damlangan kofe va quyultirilgan sut: kuchli kofe ustida shirin-sutli qatlam.','Cold brew with condensed milk: a sweet, milky layer over strong coffee.']],
['nc','흑당라떼','Black Sugar Latte',3900,5100,'IM',4,0,0,'#e8d3b8','#4a2411','n',[],['Qora shakar siropi tomgan sut: karamelsimon, kofesiz, bolalarbop shirin.','Milk with black-sugar syrup: caramel-like and caffeine-free.']],
['nc','미숫가루라떼','Mixed Grain Latte',3900,5100,'M',3,0,0,'#c9a889','','n',[],['Ko\'p donli un (미숫가루) va sut: to\'yimli, donli, yengil shirin.','Multigrain powder blended with milk: hearty, toasty and lightly sweet.']],
['nc','초콜릿','Chocolate',4200,5400,'M',4,0,0,'#3a1e12','','c',[],['Quyuq issiq/sovuq shokolad ichimligi: boy kakao ta\'mi, qaymoq bilan.','A thick chocolate drink with deep cocoa flavour, topped with cream.']],
['nc','달고나라떼','Dalgona Latte',4200,5400,'IM',4,0,0,'#d9b389','#8a5224','n',[],['Dalgona (karamel qand) ta\'mli latte: qovurilgan shakar, yong\'oq bo\'laklari bilan.','Dalgona-style latte: toasted caramel sugar flavour with crunchy nuts.']],
['nc','말차라떼','Matcha Latte',4500,5700,'M',2,2,1,'#8fae63','','n',[],['Yaponcha matcha va sut: o\'tsimon, mayin achchiq va yumshoq. Kofein oz.','Matcha and milk: grassy, gently bitter and smooth, with a little caffeine.']],
['nc','민트초콜릿','Mint Chocolate',4500,5700,'M',4,0,0,'#2f1a12','','c',[],['Yalpiz va shokolad: salqin, shirin, qaymoq bilan.','Mint and chocolate: cool, sweet and topped with cream.']],
['nc','화이트초콜릿','White Chocolate',4500,5700,'M',5,0,0,'#f0e6e1','','c',[],['Oq shokolad ichimligi: juda shirin, sutli, qaymoqli.','White chocolate drink: very sweet, milky and creamy.']],
['nc','토피넛라떼','Toffee Nut Latte',4500,5700,'M',4,0,0,'#c79a8a','','n',[],['Toffi va yong\'oq ta\'mli sut ichimligi: karamel-yong\'oq shirinligi.','A toffee-and-nut milk drink with caramelly, nutty sweetness.']],
['nc','고구마라떼','Sweet Potato Latte',4500,5700,'M',3,0,0,'#f0cf7a','','n',[],['Shirin kartoshka (고구마) va sut: tabiiy shirin, qaymoqsimon, kuz ta\'mi.','Sweet potato and milk: naturally sweet, velvety, a cosy autumn flavour.']],
['nc','딸기듬뿍라떼','Strawberry Latte',4500,5700,'IMF',4,0,0,'#f2a9bd','#e86a8a','n',[],['Qulupnay bo\'laklari bilan sut: shirin, yangi meva ta\'mi.','Milk loaded with strawberry pieces: sweet, fresh and fruity.']],
['nc','딸기초코라떼','Strawberry Chocolate Latte',4700,5900,'IMF',5,0,0,'#f4dede','#5a2a2a','n',[],['Qulupnay va shokolad: shirin, qatlamli, desert ta\'mi.','Strawberry meets chocolate: sweet, layered, dessert-like.']],
['nc','말차초코라떼','Matcha Chocolate Latte',4700,5900,'IM',4,1,1,'#6e7d48','#2f1a12','n',[],['Matcha va shokolad: o\'tsimon achchiq bilan shirin kakao uyg\'unligi.','Matcha with chocolate: earthy bitterness balanced by sweet cocoa.']],
['nc','버블흑당라떼','Bubble Black Sugar Latte',5100,6300,'IM',5,0,0,'#e8c9a6','#4a2411','n',[],['Tapioka sharlari va qora shakar sirop: shirin, chaynaladigan, bubble tea uslubi.','Tapioca pearls and black-sugar syrup: sweet, chewy, bubble-tea style.']],
['bl','과일플랫치노','Fruit Flatccino',3900,5100,'IF',4,0,0,'#f6a58f','','f',['꿀복숭아|Honey Peach','망고|Mango','유자몽|Citron&Grapefruit'],['Muzli mevali smuzi: asal shaftoli, mango yoki yuza-greypfrut, tetiklantiruvchi va shirin.','An icy fruit blend: honey peach, mango or citron-grapefruit, refreshing and sweet.']],
['bl','밀크플랫치노','Milk Flatccino',4700,5900,'IMF',4,0,0,'#5a3322','','c',['초콜릿칩|Chocolate Chip','민트초콜릿칩|Mint Chocolate Chip','토피넛|Toffee Nut'],['Sutli muzli ichimlik (frappe): shokolad bo\'laklari, yalpizli shokolad yoki toffi yong\'oq bilan.','A milky frozen drink with chocolate chips, mint chocolate chips or toffee nut.']],
['bl','요거트플랫치노','Yogurt Flatccino',4900,6100,'IMF',3,0,0,'#f3eef0','','f',['플레인|Plain','딸기|Strawberry','블루베리|Blueberry','꿀복숭아|Honey Peach'],['Yogurtli muzli ichimlik: nordon-shirin, yengil va sovuq.','Frozen yogurt drink: tangy-sweet, light and cold.']],
['bl','밀크쉐이크','Milk Shake',4900,6100,'IM',4,0,0,'#f6f6f2','','n',[],['Klassik sut shake: qaymoqsimon, vanilsimon, silliq.','Classic milkshake: creamy, vanilla-like and silky.']],
['bl','초코쿠키쉐이크','Chocolate Cookie Shake',5100,6300,'IM',5,0,0,'#7a6270','','c',[],['Shokoladli pechenye bo\'laklari bilan shake: shirin va xrustli.','Shake with chocolate cookie pieces: sweet and crunchy.']],
['bl','에스프레소쉐이크','Espresso Shake',5100,6300,'IM',4,2,2,'#c5a58b','#f3e6d3','c',[],['Espresso va muzqaymoqli shake: kofe achchig\'i va sutli shirinlik.','Espresso shake: coffee bitterness with milky sweetness.']],
['bl','딸기쉐이크','Strawberry Shake',5400,6600,'IMF',5,0,0,'#f4a7bd','','f',[],['Qulupnayli sut shake: shirin, pushti va yengil mevali.','Strawberry milkshake: sweet, pink and gently fruity.']],
['bl','말차초코쉐이크','Matcha Chocolate Shake',5400,6600,'IM',5,1,1,'#9fb877','#3a1e12','n',[],['Matcha va shokolad shake: shokolad oqimi bilan, shirin va o\'tsimon.','Matcha chocolate shake with a chocolate drizzle: sweet and earthy.']],
['bl','에이드','Ade',4700,5900,'IF',3,0,0,'#f27d7d','','n',['자몽포멜로|Grapefruit Pomelo','감귤레몬|Tangerine Lemon','꿀복숭아|Honey Peach','머스캣모히또|Muscat Mojito','샹그리아|Sangria'],['Gazlangan mevali ichimlik: greypfrut-pomelo, mandarin-limon, shaftoli, muskat mojito yoki sangriya.','Sparkling fruit ade: grapefruit pomelo, tangerine lemon, peach, muscat mojito or sangria.']],
['jt','클렌즈주스','Cleanse Juice',4200,5400,'IF',1,0,0,'#f0833e','','n',['사과당근|Apple&Carrot','키위케일샐러리|Kiwi&Kale&Celery'],['Sog\'lom sharbat: olma-sabzi yoki kivi-kale-selderey. Yengil va yangi.','A wellness juice: apple-carrot or kiwi-kale-celery. Light and fresh.']],
['jt','과일주스','Fruit Juice',4900,6100,'IF',3,0,0,'#f06a8a','','n',['딸기|Strawberry','망고|Mango','블루베리|Blueberry'],['Qulupnay, mango yoki blueberry sharbati: quyuq, shirin va meva ta\'mi aniq.','Strawberry, mango or blueberry juice: thick, sweet and richly fruity.']],
['jt','티 (5종)','Tea (5 kinds)',3200,4200,'',0,1,1,'#c9a35a','','n',['캐모마일|Chamomile','히비스커스|Hibiscus','페퍼민트|Peppermint','얼그레이|Earl Grey','루이보스|Rooibos'],['5 xil choy: romashka, gibiskus, yalpiz, Earl Grey, rooibos. Kofein turiga qarab farq qiladi.','Five teas: chamomile, hibiscus, peppermint, Earl Grey, rooibos. Caffeine varies by tea.']],
['jt','아이스티','Iced Tea',3200,4200,'IF',3,0,1,'#c4623a','','n',['복숭아|Peach','제로슈가 복숭아|Zero Sugar Peach','레몬|Lemon'],['Shaftoli yoki limonli muzli choy: shirin, tetiklantiruvchi. Zero sugar varianti ham bor.','Peach or lemon iced tea: sweet and refreshing, with a zero sugar peach option.']],
['jt','아샷추','Iced Tea with Espresso',3700,4700,'IF',2,2,3,'#6a2a1a','#1b0e07','n',['복숭아|Peach','제로슈가 복숭아|Zero Sugar Peach'],['Shaftoli muzli choyga espresso shoti: shirin-nordon va kofe achchig\'i, kofeini yuqori.','Peach iced tea with an espresso shot: sweet-tangy with coffee bite, high caffeine.']],
['jt','아망추','Peach Iced Tea with Mango',4200,5200,'IF',4,0,1,'#c4623a','#f2b84b','n',['복숭아|Peach'],['Shaftoli muzli choy ustida mango bo\'laklari: tropik, shirin va mevali.','Peach iced tea with mango chunks: tropical, sweet and fruity.']],
['jt','쌍화차','Black Herbal Tea',4500,5700,'',2,1,0,'#2a140c','','n',[],['An\'anaviy koreys o\'simlik choyi: dorivor, yong\'oq va ziravorlar bilan, isituvchi.','A traditional Korean herbal tea: earthy, nutty and warming.']],
['jt','배모과차','Pear&Quince Tea',4500,5700,'',3,0,0,'#e9c9a4','','n',[],['Nok va behi choyi: yumshoq shirin, tomoqqa yoqimli, mayin.','Pear and quince tea: soft sweetness, soothing and gentle.']],
['jt','살얼음식혜','Sweet Rice Drink',4500,5700,'I',4,0,0,'#efe4de','','n',[],['Sikhye: guruchli an\'anaviy shirin ichimlik, yupqa muz parchalari bilan.','Sikhye: a traditional sweet rice drink with fine slushy ice.']],
['jt','유자차','Citron Tea',4500,5700,'F',4,0,0,'#f2b84b','','n',[],['Yuza (sitrus) murabbosi choyi: shirin, nordon, vitaminga boy hid.','Citron tea: sweet, tart and citrusy.']],
['jt','자몽차','Grapefruit Tea',4500,5700,'F',4,1,0,'#f09a7a','','n',[],['Greypfrut murabbosi choyi: shirin, ozgina achchiq va yangi.','Grapefruit tea: sweet with a little bitter edge, fresh.']],
['jt','레몬차','Lemon Tea',4500,5700,'F',4,0,0,'#f4d45c','','n',[],['Limon choyi: nordon-shirin, tetiklantiradi, shamollashga yoqimli.','Lemon tea: tart-sweet and refreshing.']],
['jt','생강차','Ginger Tea',4500,5700,'',3,1,0,'#e9b96a','','n',[],['Zanjabil choyi: o\'tkir, isituvchi, shirinlik bilan yumshatilgan.','Ginger tea: spicy and warming, softened with sweetness.']],
['jt','복분자뱅쇼','Bokbunja Vin Chaud',4900,6100,'F',3,0,0,'#7a1f3a','','n',[],['Korean qora malina (복분자) va ziravorlar: issiq vin-sho uslubida, alkogolsiz.','Korean black raspberry and spices in a vin-chaud style, alcohol-free.']],
['jt','로열밀크티','Royal Milk Tea',4900,6100,'M',3,1,2,'#c79c82','','n',[],['Qora choy va sut: boy, yumshoq, klassik milk tea ta\'mi.','Black tea and milk: rich, smooth, a classic milk tea.']],
['sf','(컵)소프트 아이스크림','Soft Ice Cream (Cup)',3500,null,'M',4,0,0,'#f6f6f4','','f',[],['Klassik yumshoq vanil muzqaymoq stakanda: sutli va yengil.','Classic soft-serve in a cup: milky and light.']],
['sf','딸기쿠키 아이스크림','Strawberry Cookie Ice Cream',4000,null,'MF',5,0,0,'#f6d9e2','','f',[],['Muzqaymoq ustida qulupnay sousi va pechenye uvog\'i: shirin va xrustli.','Soft-serve with strawberry sauce and cookie crumbs: sweet and crunchy.']],
['sf','초코쿠키 아이스크림','Choco Cookie Ice Cream',4000,null,'M',5,0,0,'#e6dcd6','#3a2316','f',[],['Muzqaymoq, shokolad sousi va pechenye: shokoladli va xrustli.','Soft-serve with chocolate and cookie crumbs: rich and crunchy.']],
['sf','꿀인절미 아이스크림','Honey Injeolmi Ice Cream',4500,null,'M',4,0,0,'#f4ecd2','#e8c77a','f',[],['Asal va injeolmi (qovurilgan soya uni): yong\'oqsimon, shirin, koreys ta\'mi.','Honey and injeolmi (roasted soybean flour): nutty, sweet and distinctly Korean.']]
];

const KD: Record<string, string> = {"아메리카노": "진하고 깔끔한 에스프레소에 물을 더한 기본 커피", "달달커피": "부드럽고 달콤한 우유 믹스 커피", "제로슈가달달커피": "설탕 없이 가볍게 즐기는 달달한 믹스 커피", "헤이즐넛 아메리카노": "고소한 헤이즐넛 향이 은은한 아메리카노", "꿀화이트 아메리카노": "꿀 우유 층이 올라간 달콤한 아메리카노", "콜드브루": "차갑게 오래 우려 부드럽고 산미가 적은 커피", "카페라떼": "에스프레소와 우유가 어우러진 부드러운 라떼", "카푸치노": "풍성한 우유 거품과 에스프레소의 진한 조화", "흑당콜드브루": "콜드브루에 흑당 시럽의 깊은 단맛을 더했어요", "바닐라라떼": "달콤한 바닐라 향의 부드러운 라떼", "연유카페라떼": "연유의 진한 단맛이 느껴지는 고소한 라떼", "카페모카": "에스프레소와 초콜릿, 휘핑크림의 달콤한 만남", "화이트초콜릿모카": "달콤한 화이트초콜릿과 에스프레소의 부드러운 조합", "카라멜마끼아또": "카라멜 드리즐이 올라간 달콤한 층층 라떼", "아포가토": "아이스크림 위에 에스프레소를 부어 먹는 디저트 커피", "시그니처라떼": "고소하고 은은하게 달콤한 시그니처 라떼", "넛츠크림라떼": "고소한 견과 크림을 올린 달콤한 라떼", "콜드브루라떼": "진한 콜드브루에 부드러운 우유를 더한 라떼", "민트모카": "시원한 민트와 초콜릿 모카의 달콤한 조합", "연유콜드브루": "콜드브루 위에 달콤한 연유 층을 더했어요", "흑당라떼": "커피 없이 흑당의 달콤함을 즐기는 우유 음료", "미숫가루라떼": "곡물의 고소함이 가득한 든든한 라떼", "초콜릿": "진한 카카오 맛의 달콤한 초콜릿 음료", "달고나라떼": "달고나의 달콤 쌉싸름한 맛과 견과의 식감", "말차라떼": "쌉싸름한 말차와 부드러운 우유", "민트초콜릿": "시원한 민트와 달콤한 초콜릿 맛", "화이트초콜릿": "부드럽고 달콤한 화이트초콜릿 음료", "토피넛라떼": "토피와 견과의 고소하고 달콤한 맛", "고구마라떼": "고구마의 자연스러운 단맛이 가득한 라떼", "딸기듬뿍라떼": "딸기 과육이 듬뿍 들어간 상큼달콤한 라떼", "딸기초코라떼": "딸기와 초콜릿이 어우러진 디저트 같은 라떼", "말차초코라떼": "쌉싸름한 말차에 달콤한 초콜릿을 더했어요", "버블흑당라떼": "쫄깃한 버블과 흑당 시럽의 달콤한 라떼", "과일플랫치노": "시원하게 갈아 만든 상큼한 과일 음료", "밀크플랫치노": "우유로 갈아 만든 달콤하고 시원한 프라페", "요거트플랫치노": "새콤달콤한 요거트를 시원하게 갈아 만든 음료", "밀크쉐이크": "진하고 부드러운 클래식 우유 쉐이크", "초코쿠키쉐이크": "초코쿠키가 씹히는 달콤한 쉐이크", "에스프레소쉐이크": "에스프레소의 쌉싸름함과 달콤함이 함께하는 쉐이크", "딸기쉐이크": "상큼한 딸기 맛의 부드러운 쉐이크", "말차초코쉐이크": "말차와 초콜릿이 어우러진 달콤한 쉐이크", "에이드": "톡 쏘는 탄산과 과일의 시원하고 상큼한 맛", "클렌즈주스": "가볍고 신선한 건강 과채 주스", "과일주스": "과일 본연의 달콤함이 가득한 진한 주스", "티 (5종)": "카모마일부터 루이보스까지 취향대로 고르는 티", "아이스티": "상큼한 복숭아·레몬 맛의 시원한 아이스티", "아샷추": "복숭아 아이스티에 에스프레소 샷을 더한 조합", "아망추": "복숭아 아이스티에 망고 과육을 더한 상큼한 음료", "쌍화차": "고소하고 따뜻한 전통 한방차", "배모과차": "은은하게 달콤해 목이 편안한 차", "살얼음식혜": "살얼음이 서걱서걱 씹히는 시원한 전통 음료", "유자차": "새콤달콤한 유자 향이 가득한 차", "자몽차": "상큼하고 살짝 쌉싸름한 자몽차", "레몬차": "새콤달콤하고 상큼한 레몬차", "생강차": "알싸하고 따뜻하게 몸을 데워주는 차", "복분자뱅쇼": "복분자와 향신료가 어우러진 따뜻한 과일차", "로열밀크티": "진한 홍차와 우유의 부드러운 밀크티", "(컵)소프트 아이스크림": "부드럽고 담백한 소프트 아이스크림", "딸기쿠키 아이스크림": "딸기와 쿠키 조각이 올라간 달콤한 아이스크림", "초코쿠키 아이스크림": "초코와 쿠키 조각이 어우러진 진한 아이스크림", "꿀인절미 아이스크림": "꿀과 인절미의 고소하고 달콤한 맛"};

export const MENU: MenuItem[] = RAW.map((r, i) => ({
	id: i,
	cat: r[0],
	ko: r[1],
	en: r[2],
	L: r[3],
	E: r[4],
	sweet: r[6],
	bitter: r[7],
	caffeine: r[8],
	c1: r[9],
	c2: r[10],
	top: r[11],
	variants: r[12].map((x) => {
		const p = x.split('|');
		return { ko: p[0], en: p[1] };
	}),
	descKo: KD[r[1]] || '',
	descEn: r[13][1],
	descUz: r[13][0],
	iced: r[5].includes('I'),
	zero: r[5].includes('Z'),
	milk: r[5].includes('M'),
	fruit: r[5].includes('F'),
	hotDefault: /차$|뱅쇼/.test(r[1]) && !/티 \(5종\)|아이스티|아샷추|아망추/.test(r[1]),
	hotOk: !r[5].includes('I') && r[0] !== 'sf',
}));

export const CATEGORIES: MenuCategory[] = ['cf', 'nc', 'bl', 'jt', 'sf'];
export const SIGNATURE_IDS = [0, 15, 8, 16, 32, 29, 41, 46];
export const BANANA_ITEMS = ['과일주스'];
export const fmtWon = (n: number) => n.toLocaleString('en-US') + '원';
export const getItem = (id: number | string) => MENU.find((m) => m.id === Number(id));
