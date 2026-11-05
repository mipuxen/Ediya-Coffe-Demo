/** Help-centre content. It describes how THIS site works (and general drink terms) - it makes no claims about the real store's policies. **/
export interface HelpItem {
	q: string;
	a: string;
}
export interface HelpPack {
	guide: HelpItem[];
	faq: HelpItem[];
}

const kr: HelpPack = {
	guide: [
		{ q: '이 사이트는 무엇인가요?', a: '영덕 블루로드 인근 이디야커피 매장을 위해 바리스타가 직접 만든 비공식 콘셉트 포트폴리오입니다. 이디야커피 공식 사이트가 아니며, 주문·결제 기능은 없습니다.' },
		{ q: '주문 문구는 어떻게 쓰나요?', a: '메뉴에서 음료를 담으면 장바구니가 "아이스 아메리카노 라지 2잔 주문할게요." 같은 한국어 문장으로 바뀝니다. 복사하거나 카운터에서 그대로 읽어 주문하세요.' },
		{ q: '소리 버튼은 무엇인가요?', a: '파도 소리와 카페 분위기, 그리고 홈 애니메이션과 맞춰 움직이는 그라인더·물 소리를 켭니다. 버튼을 누르기 전에는 아무 소리도 나지 않습니다.' },
		{ q: '내 정보는 어디에 저장되나요?', a: '즐겨찾기, 최근 본 메뉴, 주문 내역과 닉네임은 이 브라우저(localStorage)에만 저장됩니다. 서버로 보내지 않으며 설정에서 언제든 삭제할 수 있어요.' },
	],
	faq: [
		{ q: 'L과 E 사이즈는 무엇인가요?', a: 'L은 기본(라지) 사이즈, E는 더 큰 엑스트라 사이즈입니다. 아이스크림류는 사이즈가 없습니다.' },
		{ q: '카페인이 없는 메뉴는 어떻게 찾나요?', a: '메뉴 화면의 "카페인 없음" 필터를 누르면 논커피·주스·티·아이스크림 등 카페인이 거의 없는 메뉴만 보입니다.' },
		{ q: '제로슈가 메뉴가 따로 있나요?', a: '"제로슈가" 필터로 모아볼 수 있습니다. 맛 설명은 일반적인 소개이며 실제 레시피와 다를 수 있습니다.' },
		{ q: '핫으로도 주문할 수 있나요?', a: '메뉴 상세에서 "핫 가능" 표시가 있는 음료는 아이스/핫을 고를 수 있고, 아이스 전용 음료는 선택지가 없습니다.' },
		{ q: '가격은 정확한가요?', a: '매장 메뉴판을 기준으로 정리했지만 가격은 바뀔 수 있습니다. 최종 가격은 매장에서 확인해 주세요.' },
		{ q: '언어를 바꿀 수 있나요?', a: '상단의 국기 버튼에서 한국어, English, Русский 중에서 고를 수 있습니다.' },
	],
};

const en: HelpPack = {
	guide: [
		{ q: 'What is this site?', a: 'An unofficial concept portfolio made by a barista for the Ediya Coffee store near the Yeongdeok Blue Road. It is not the official Ediya website and has no ordering or payment.' },
		{ q: 'How do I use the order phrase?', a: 'Add drinks from the menu and the cart turns into a Korean sentence like "아이스 아메리카노 라지 2잔 주문할게요." Copy it, or read it out at the counter.' },
		{ q: 'What does the sound button do?', a: 'It turns on sea and café ambience plus grinder and water sounds that follow the home animation. Nothing plays until you press it.' },
		{ q: 'Where is my data stored?', a: 'Favourites, recently viewed drinks, order history and your nickname stay in this browser only (localStorage). Nothing is sent to a server, and you can clear it in Settings.' },
	],
	faq: [
		{ q: 'What are the L and E sizes?', a: 'L is the standard large size and E is the bigger Extra size. Ice cream items have no size.' },
		{ q: 'How do I find caffeine-free drinks?', a: 'Use the "No caffeine" filter on the menu to see non-coffee drinks, juices, teas and ice cream.' },
		{ q: 'Is there a zero-sugar option?', a: 'Use the "Zero sugar" filter. Taste descriptions are general introductions and may differ from the real recipe.' },
		{ q: 'Can I order a drink hot?', a: 'Drinks marked "Hot available" on their detail page can be hot or iced; iced-only drinks have no choice.' },
		{ q: 'Are the prices accurate?', a: 'They follow the in-store menu board but can change. Please confirm the final price at the store.' },
		{ q: 'Can I change the language?', a: 'Yes, use the flag button in the top bar to switch between Korean, English and Russian.' },
	],
};

const ru: HelpPack = {
	guide: [
		{ q: 'Что это за сайт?', a: 'Неофициальный концепт-портфолио, созданный бариста для кофейни Ediya Coffee у тропы Блу-роуд в Ёндоке. Это не официальный сайт Ediya, заказов и оплаты здесь нет.' },
		{ q: 'Как пользоваться фразой заказа?', a: 'Добавьте напитки из меню — корзина превратится в корейскую фразу вроде «아이스 아메리카노 라지 2잔 주문할게요.». Скопируйте её или прочитайте на кассе.' },
		{ q: 'Что делает кнопка звука?', a: 'Включает шум моря и кафе, а также звуки кофемолки и воды в такт анимации на главной. Пока вы не нажмёте, звука нет.' },
		{ q: 'Где хранятся мои данные?', a: 'Избранное, недавние напитки, история заказов и ник хранятся только в этом браузере (localStorage). На сервер ничего не отправляется, всё можно удалить в настройках.' },
	],
	faq: [
		{ q: 'Что такое размеры L и E?', a: 'L — стандартный большой размер, E — увеличенный Extra. У мороженого размеров нет.' },
		{ q: 'Как найти напитки без кофеина?', a: 'В меню включите фильтр «Без кофеина»: покажутся напитки не на кофе, соки, чаи и мороженое.' },
		{ q: 'Есть ли напитки без сахара?', a: 'Используйте фильтр «Zero sugar». Описания вкуса носят общий характер и могут отличаться от настоящего рецепта.' },
		{ q: 'Можно ли заказать напиток горячим?', a: 'Напитки с пометкой «Можно горячим» на странице описания доступны горячими и холодными; остальные — только со льдом.' },
		{ q: 'Цены точные?', a: 'Они сверены с меню в кофейне, но могут меняться. Итоговую цену уточняйте на месте.' },
		{ q: 'Можно ли сменить язык?', a: 'Да, кнопка с флагом в верхней панели переключает корейский, английский и русский.' },
	],
};

export const HELP: Record<string, HelpPack> = { kr, en, ru };
