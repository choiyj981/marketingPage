--
-- PostgreSQL database dump
--

\restrict FzIDN7fOnAccq67qqrGXfRBGC4p83np9mzY2J9grCWZKG5b4mKRBk1Nbf1Nd78E

-- Dumped from database version 15.14
-- Dumped by pg_dump version 15.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: choiyj981
--

CREATE TABLE public.blog_posts (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text NOT NULL,
    content text NOT NULL,
    category text NOT NULL,
    image_url text NOT NULL,
    author text DEFAULT 'Business Platform'::text NOT NULL,
    author_image text DEFAULT '/avatar.png'::text NOT NULL,
    published_at text NOT NULL,
    read_time text NOT NULL,
    featured integer DEFAULT 0 NOT NULL,
    tags text[] DEFAULT '{}'::text[] NOT NULL
);


ALTER TABLE public.blog_posts OWNER TO choiyj981;

--
-- Name: contacts; Type: TABLE; Schema: public; Owner: choiyj981
--

CREATE TABLE public.contacts (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    subject text NOT NULL,
    message text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.contacts OWNER TO choiyj981;

--
-- Name: faq_entries; Type: TABLE; Schema: public; Owner: choiyj981
--

CREATE TABLE public.faq_entries (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    category text NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    status text DEFAULT 'published'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.faq_entries OWNER TO choiyj981;

--
-- Name: metrics_snapshots; Type: TABLE; Schema: public; Owner: choiyj981
--

CREATE TABLE public.metrics_snapshots (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    value integer DEFAULT 0 NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.metrics_snapshots OWNER TO choiyj981;

--
-- Name: newsletter_subscriptions; Type: TABLE; Schema: public; Owner: choiyj981
--

CREATE TABLE public.newsletter_subscriptions (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    subscribed_at timestamp without time zone DEFAULT now() NOT NULL,
    status text DEFAULT 'active'::text NOT NULL
);


ALTER TABLE public.newsletter_subscriptions OWNER TO choiyj981;

--
-- Name: products; Type: TABLE; Schema: public; Owner: choiyj981
--

CREATE TABLE public.products (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text NOT NULL,
    full_description text NOT NULL,
    price text NOT NULL,
    image_url text NOT NULL,
    category text NOT NULL,
    badge text,
    featured integer DEFAULT 0 NOT NULL,
    features text[] NOT NULL,
    tags text[] DEFAULT '{}'::text[] NOT NULL
);


ALTER TABLE public.products OWNER TO choiyj981;

--
-- Name: resources; Type: TABLE; Schema: public; Owner: choiyj981
--

CREATE TABLE public.resources (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text NOT NULL,
    file_type text NOT NULL,
    file_size text NOT NULL,
    download_url text NOT NULL,
    category text NOT NULL,
    downloads integer DEFAULT 0 NOT NULL,
    author text DEFAULT 'Business Platform'::text NOT NULL,
    published_at text NOT NULL,
    featured integer DEFAULT 0 NOT NULL,
    tags text[] NOT NULL
);


ALTER TABLE public.resources OWNER TO choiyj981;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: choiyj981
--

CREATE TABLE public.reviews (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    product_id character varying NOT NULL,
    rating integer NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    author_name text NOT NULL,
    author_email text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL
);


ALTER TABLE public.reviews OWNER TO choiyj981;

--
-- Name: services; Type: TABLE; Schema: public; Owner: choiyj981
--

CREATE TABLE public.services (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text NOT NULL,
    icon text NOT NULL,
    features text[] NOT NULL
);


ALTER TABLE public.services OWNER TO choiyj981;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: choiyj981
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO choiyj981;

--
-- Name: users; Type: TABLE; Schema: public; Owner: choiyj981
--

CREATE TABLE public.users (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    email character varying NOT NULL,
    password_hash character varying NOT NULL,
    first_name character varying,
    last_name character varying,
    profile_image_url character varying,
    is_admin boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO choiyj981;

--
-- Data for Name: blog_posts; Type: TABLE DATA; Schema: public; Owner: choiyj981
--

COPY public.blog_posts (id, title, slug, excerpt, content, category, image_url, author, author_image, published_at, read_time, featured, tags) FROM stdin;
f8a3f903-0c59-4f79-b429-2aec30fb843b	ChatGPT로 시작하는 블로그 자동화 완벽 가이드	chatgpt-blog-automation-guide	AI를 활용한 블로그 콘텐츠 제작부터 SEO 최적화까지, 블로그 운영을 혁신하는 실전 노하우를 공개합니다.	<h2>왜 지금 블로그 자동화인가?</h2><p>2025년, 콘텐츠 소비의 시대입니다. 하지만 매일 양질의 콘텐츠를 생산하는 것은 쉽지 않죠. ChatGPT를 활용하면 누구나 전문가 수준의 블로그 콘텐츠를 빠르게 제작할 수 있습니다.</p>\n        \n<h2>블로그 자동화 3단계 전략</h2><p>1단계에서는 키워드 검색과 분석을 진행합니다. 2단계에서 SEO 최적화된 본문을 생성하고, 3단계에서 이미지와 메타데이터를 완성합니다. 각 단계별 GPT 활용법을 자세히 알려드립니다.</p>\n\n<h2>실전 사례: 월 100만 조회수 달성 비법</h2><p>실제로 이 방법을 활용해 3개월 만에 월 100만 조회수를 달성한 사례를 공유합니다. 키워드 선정부터 포스팅 주기 관리까지, 검증된 전략을 확인해보세요.</p>\n\n<h2>수익화 전략</h2><p>애드센스, 제휴 마케팅, 디지털 상품 판매까지. 블로그를 통한 다양한 수익화 방법과 각각의 장단점을 분석합니다.</p>	AI 마케팅	https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop	알파GOGOGO	/avatar.png	2025-01-15	8분	1	{}
3f508d9c-104d-484e-946d-7a8c064bb40a	퍼스널 브랜딩 성공 사례 - 비전문가도 가능한 브랜딩 전략	personal-branding-success-story	개발 지식 없이도 나만의 브랜드를 만들 수 있습니다. 실제 성공 사례를 통해 배우는 퍼스널 브랜딩 노하우.	<h2>퍼스널 브랜딩의 시작</h2><p>콘텐츠 소비의 시대, 콘텐츠가 돈이 되는 세상입니다. 이제 비전문인, 비개발자도 누구나 브랜딩할 수 있습니다. 나만의 전문성과 개성을 어떻게 브랜드로 만들 수 있을까요?</p>\n\n<h2>본질을 찾아서 - 마케팅의 본질</h2><p>퍼스널 브랜딩 전략과 효과적인 콘텐츠 마케팅을 통해 시장에서의 가치를 높이는 방법을 배웁니다. SNS부터 블로그, 유튜브까지 플랫폼별 전략을 공유합니다.</p>\n\n<h2>AI 시대의 브랜딩 전략</h2><p>노코드 툴과 AI를 활용하면 개발 지식 없이도 전문적인 웹사이트와 콘텐츠를 만들 수 있습니다. 실제 도구 활용법과 함께 단계별 가이드를 제공합니다.</p>	퍼스널 브랜딩	https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop	알파GOGOGO	/avatar.png	2025-01-10	6분	1	{}
5b402b18-0945-40f9-8401-125f52824d85	블로그 SEO 최적화 완벽 가이드 - 검색 1페이지 진입 전략	blog-seo-optimization-guide	구글과 네이버 검색 상위 노출을 위한 실전 SEO 전략. 키워드 분석부터 메타태그 최적화까지 모든 것을 알려드립니다.	<h2>SEO의 기초 이해하기</h2><p>검색 엔진 최적화(SEO)는 블로그 성공의 핵심입니다. 알고리즘을 이해하고 전략적으로 접근하면 누구나 검색 상위에 노출될 수 있습니다.</p>\n\n<h2>키워드 검색 & 분석 전략</h2><p>효과적인 블로그 작성을 위한 첫 단계로, 관련 키워드를 검색하고 분석하는 방법을 배웁니다. GPT를 활용한 자동화된 키워드 분석 도구 사용법도 함께 소개합니다.</p>\n\n<h2>메타태그와 구조화된 데이터</h2><p>title, description, og 태그 등 메타데이터 최적화는 필수입니다. 검색 엔진이 선호하는 구조화된 데이터 마크업 방법을 실전 예제와 함께 설명합니다.</p>\n\n<h2>백링크 전략과 콘텐츠 품질</h2><p>단순히 키워드만 넣는다고 SEO가 되지 않습니다. 고품질 콘텐츠 작성법과 자연스러운 백링크 확보 전략을 공유합니다.</p>	SEO 최적화	https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800&auto=format&fit=crop	알파GOGOGO	/avatar.png	2025-01-05	10분	1	{}
5463111d-f906-4096-9b5c-10159878cee0	유튜브 데이터 분석으로 트렌드 파악하기	youtube-data-analysis-trends	AI 챗봇 어시스턴트를 활용한 유튜브 데이터 수집과 분석 방법. 트렌드를 읽고 콘텐츠 전략을 수립하세요.	<h2>데이터 기반 콘텐츠 전략</h2><p>감이 아닌 데이터로 콘텐츠를 기획하는 시대입니다. 유튜브 API를 활용해 조회수, 댓글, 키워드 트렌드를 분석하고 성공 확률 높은 콘텐츠를 만드세요.</p>\n\n<h2>AI 챗봇 어시스턴트 활용법</h2><p>유튜브 데이터를 수집하고 분석하는 프로그램을 무료로 배포합니다. AI 챗봇을 통해 자동으로 인사이트를 추출하고 리포트를 생성할 수 있습니다.</p>	데이터 분석	https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop	알파GOGOGO	/avatar.png	2024-12-28	7분	0	{}
\.


--
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: choiyj981
--

COPY public.contacts (id, name, email, subject, message, created_at) FROM stdin;
\.


--
-- Data for Name: faq_entries; Type: TABLE DATA; Schema: public; Owner: choiyj981
--

COPY public.faq_entries (id, question, answer, category, display_order, status, created_at) FROM stdin;
\.


--
-- Data for Name: metrics_snapshots; Type: TABLE DATA; Schema: public; Owner: choiyj981
--

COPY public.metrics_snapshots (id, name, value, updated_at) FROM stdin;
\.


--
-- Data for Name: newsletter_subscriptions; Type: TABLE DATA; Schema: public; Owner: choiyj981
--

COPY public.newsletter_subscriptions (id, email, name, subscribed_at, status) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: choiyj981
--

COPY public.products (id, title, slug, description, full_description, price, image_url, category, badge, featured, features, tags) FROM stdin;
b485b625-0406-40ea-993f-e65faf85be52	본질을 찾아서 Vol.3 - 퍼스널 브랜딩의 시작	personal-branding-course-vol3	콘텐츠 소비의 시대, 콘텐츠가 돈이 되는 세상. 비전문가도 가능한 브랜딩 전략	이제 비전문인, 비개발자도 누구나 브랜딩할 수 있습니다. 마케팅의 본질부터 AI를 활용한 실전 브랜딩까지, 퍼스널 브랜딩 성공을 위한 모든 것을 담았습니다.	₩199,000	https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&auto=format&fit=crop	온라인 강의	모집중	1	{"마케팅의 본질 이해하기","퍼스널 브랜딩 전략 수립","AI 도구를 활용한 콘텐츠 제작","노코드 웹 개발 기초","수익화 전략 및 실전 사례"}	{}
a9bfe9f8-4802-48e3-801c-43d10bc9e370	블로그 수익화 마스터 과정	blog-monetization-master	ChatGPT와 함께하는 블로그 자동화부터 월 100만원 수익까지	검색 엔진 최적화(SEO)부터 애드센스, 제휴 마케팅, 디지털 상품 판매까지. 블로그로 수익을 만드는 모든 전략을 실전 사례와 함께 배웁니다.	₩149,000	https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop	온라인 강의	HOT	1	{"블로그 자동화 3단계 전략","SEO 최적화 완벽 가이드","키워드 분석 및 콘텐츠 기획","ChatGPT 활용한 글쓰기","애드센스 & 제휴 마케팅 실전"}	{}
4b806c47-f78c-4ae1-a223-7d3a2273c20f	AI 콘텐츠 자동화 패키지	ai-content-automation-package	유튜브, 블로그, SNS 콘텐츠를 AI로 자동 생성하는 올인원 솔루션	데이터 수집부터 콘텐츠 생성, 이미지 제작, 자동 포스팅까지. AI를 활용한 완전한 콘텐츠 자동화 시스템을 구축하세요.	₩299,000	https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop	프로그램	프리미엄	1	{"유튜브 데이터 수집 프로그램","블로그 자동화 프로그램","AI 이미지 생성기 통합","SEO 최적화 자동 적용","평생 무료 업데이트"}	{}
\.


--
-- Data for Name: resources; Type: TABLE DATA; Schema: public; Owner: choiyj981
--

COPY public.resources (id, title, slug, description, file_type, file_size, download_url, category, downloads, author, published_at, featured, tags) FROM stdin;
53074168-e61c-4b80-9f18-be5f0c5833fc	유튜브 데이터 수집 + 분석 + AI 챗봇 어시스턴트 프로그램 무료 배포	youtube-data-analysis-ai-assistant	유튜브 API를 활용한 데이터 수집부터 AI 챗봇 어시스턴트를 통한 자동 분석까지, 완전한 유튜브 분석 솔루션입니다.	템플릿	41.4 MB	#	프로그램	1838	알파GOGOGO	2025-01-10	1	{유튜브,AI,무료}
74363ee4-5eaf-4cc1-8a92-effe9212f1a1	블로그 자동화 프로그램	blog-automation-program	ChatGPT를 활용한 블로그 콘텐츠 자동 생성 및 포스팅 프로그램. SEO 최적화 기능 포함.	기타	126.65 MB	#	프로그램	3802	알파GOGOGO	2025-01-05	1	{AI,프리미엄,무료}
0c39de6a-15a1-4365-b5cc-5947a151e5f3	AdSense SEO 블로그 글쓰기 마스터 GPT 지침	adsense-seo-blog-gpt-guide	구글 애드센스 승인과 수익 극대화를 위한 SEO 최적화 블로그 글쓰기 GPT 프롬프트 모음집.	PDF	3.2 MB	#	가이드	2156	알파GOGOGO	2024-12-28	0	{SEO,애드센스,GPT}
1642fc28-73ac-414b-8476-d6fd447f04d5	누구나 쉽게 만드는 크롤링 프로그램 - 올리브영 크롤링 프롬프트	crawling-program-prompt	코딩 지식 없이도 ChatGPT로 크롤링 프로그램을 만드는 방법. 올리브영 크롤링 실전 예제 포함.	프롬프트	2.8 MB	#	템플릿	1547	알파GOGOGO	2024-12-20	0	{크롤링,AI,프롬프트}
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: choiyj981
--

COPY public.reviews (id, product_id, rating, title, body, author_name, author_email, created_at, status) FROM stdin;
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: choiyj981
--

COPY public.services (id, title, slug, description, icon, features) FROM stdin;
5c981251-7eae-494f-a4db-bf20b298cd4d	블로그 1단계, 키워드 검색 & 분석 GPT	blog-keyword-search-gpt	효과적인 블로그 작성을 위한 첫 단계로, 관련 키워드를 검색하고 분석해주는 AI 도구입니다.	search	{"네이버/구글 키워드 트렌드 분석","경쟁도 자동 분석","주차별 키워드 생성","검색량 기반 우선순위 제안"}
cffcf0c1-cf5d-466b-b478-71661df91770	블로그 2단계, SEO 블로그 글 생성기 GPT	seo-blog-generator-gpt	검색 엔진 최적화를 고려한 블로그 콘텐츠를 자동으로 생성해주는 AI 도구입니다.	file-text	{"SEO 최적화 콘텐츠 자동 생성","메타태그 및 description 작성","키워드 밀도 자동 조절","마크다운 및 HTML 형식 지원"}
8fb84c29-7c4b-45b2-85d5-136ccf17e1cd	블로그 3단계, 이미지 생성기 GPT	blog-image-generator-gpt	블로그 콘텐츠에 어울리는 맞춤형 이미지를 AI로 생성해주는 도구입니다.	image	{"블로그 주제에 맞는 이미지 자동 생성","썸네일 최적화","저작권 걱정 없는 AI 이미지","다양한 스타일 선택 가능"}
add880d8-dfb2-4416-89a0-9c68f9b695bf	블로그 버튼 생성기	blog-button-creator	블로그용 커스텀 HTML 버튼을 쉽게 디자인하고 생성할 수 있는 도구입니다.	mouse-pointer	{"색상/폰트/크기 커스터마이징","HTML 코드 자동 생성","반응형 디자인 지원","다양한 버튼 스타일 템플릿"}
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: choiyj981
--

COPY public.sessions (sid, sess, expire) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: choiyj981
--

COPY public.users (id, email, password_hash, first_name, last_name, profile_image_url, is_admin, created_at, updated_at) FROM stdin;
\.


--
-- Name: blog_posts blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: choiyj981
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);


--
-- Name: blog_posts blog_posts_slug_unique; Type: CONSTRAINT; Schema: public; Owner: choiyj981
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_slug_unique UNIQUE (slug);


--
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: choiyj981
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- Name: faq_entries faq_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: choiyj981
--

ALTER TABLE ONLY public.faq_entries
    ADD CONSTRAINT faq_entries_pkey PRIMARY KEY (id);


--
-- Name: metrics_snapshots metrics_snapshots_name_unique; Type: CONSTRAINT; Schema: public; Owner: choiyj981
--

ALTER TABLE ONLY public.metrics_snapshots
    ADD CONSTRAINT metrics_snapshots_name_unique UNIQUE (name);


--
-- Name: metrics_snapshots metrics_snapshots_pkey; Type: CONSTRAINT; Schema: public; Owner: choiyj981
--

ALTER TABLE ONLY public.metrics_snapshots
    ADD CONSTRAINT metrics_snapshots_pkey PRIMARY KEY (id);


--
-- Name: newsletter_subscriptions newsletter_subscriptions_email_unique; Type: CONSTRAINT; Schema: public; Owner: choiyj981
--

ALTER TABLE ONLY public.newsletter_subscriptions
    ADD CONSTRAINT newsletter_subscriptions_email_unique UNIQUE (email);


--
-- Name: newsletter_subscriptions newsletter_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: choiyj981
--

ALTER TABLE ONLY public.newsletter_subscriptions
    ADD CONSTRAINT newsletter_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: choiyj981
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_slug_unique; Type: CONSTRAINT; Schema: public; Owner: choiyj981
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_slug_unique UNIQUE (slug);


--
-- Name: resources resources_pkey; Type: CONSTRAINT; Schema: public; Owner: choiyj981
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_pkey PRIMARY KEY (id);


--
-- Name: resources resources_slug_unique; Type: CONSTRAINT; Schema: public; Owner: choiyj981
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_slug_unique UNIQUE (slug);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: choiyj981
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: choiyj981
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: services services_slug_unique; Type: CONSTRAINT; Schema: public; Owner: choiyj981
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_slug_unique UNIQUE (slug);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: choiyj981
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: choiyj981
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: choiyj981
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: choiyj981
--

CREATE INDEX "IDX_session_expire" ON public.sessions USING btree (expire);


--
-- Name: reviews reviews_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: choiyj981
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- PostgreSQL database dump complete
--

\unrestrict FzIDN7fOnAccq67qqrGXfRBGC4p83np9mzY2J9grCWZKG5b4mKRBk1Nbf1Nd78E

