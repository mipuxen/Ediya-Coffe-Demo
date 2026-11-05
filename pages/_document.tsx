import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="ko">
			<Head>
				<meta name="robots" content="index,follow" />
				<link rel="icon" type="image/svg+xml" href="/img/logo/ediya-mark.svg" />
				<meta name="theme-color" content="#06131f" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css" />

				{/* SEO */}
				<meta name="keyword" content={'ediya coffee, 이디야커피, 블루로드점, 영덕, blue road, yeongdeok, iced americano'} />
				<meta
					name={'description'}
					content={'Ediya Coffee 블루로드점 콘셉트 사이트 — 3D 아이스 아메리카노 스토리, 실제 메뉴와 가격, 영덕 블루로드. Unofficial concept portfolio.'}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
