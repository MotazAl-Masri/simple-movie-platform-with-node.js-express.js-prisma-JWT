--
-- PostgreSQL database dump
--

\restrict 8pHv1gNsaK4ZG0pwS1XNubwD56okHOez0Man7h4EeAqg7uScdTabhIu4pe1lGb8

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-04-08 22:13:17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 867 (class 1247 OID 16521)
-- Name: WatchlistItemStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."WatchlistItemStatus" AS ENUM (
    'PLANNED',
    'WATCHING',
    'COMPLETED',
    'DROPPED'
);


ALTER TYPE public."WatchlistItemStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 16445)
-- Name: Movie; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Movie" (
    id integer NOT NULL,
    title text NOT NULL,
    "releaseYear" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "directorId" integer NOT NULL,
    genres text[] DEFAULT ARRAY[]::text[],
    overview text,
    "posterUrl" text,
    runtime integer,
    "anotherTitles" text[] DEFAULT ARRAY[]::text[],
    rating double precision
);


ALTER TABLE public."Movie" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16444)
-- Name: Movie_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Movie_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Movie_id_seq" OWNER TO postgres;

--
-- TOC entry 5056 (class 0 OID 0)
-- Dependencies: 222
-- Name: Movie_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Movie_id_seq" OWNED BY public."Movie".id;


--
-- TOC entry 221 (class 1259 OID 16429)
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16428)
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- TOC entry 5057 (class 0 OID 0)
-- Dependencies: 220
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- TOC entry 225 (class 1259 OID 16534)
-- Name: WatchlistItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WatchlistItem" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "movieId" integer NOT NULL,
    status public."WatchlistItemStatus" DEFAULT 'PLANNED'::public."WatchlistItemStatus" NOT NULL,
    rating integer,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."WatchlistItem" OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16533)
-- Name: WatchlistItem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."WatchlistItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."WatchlistItem_id_seq" OWNER TO postgres;

--
-- TOC entry 5058 (class 0 OID 0)
-- Dependencies: 224
-- Name: WatchlistItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."WatchlistItem_id_seq" OWNED BY public."WatchlistItem".id;


--
-- TOC entry 219 (class 1259 OID 16414)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- TOC entry 4877 (class 2604 OID 16448)
-- Name: Movie id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Movie" ALTER COLUMN id SET DEFAULT nextval('public."Movie_id_seq"'::regclass);


--
-- TOC entry 4875 (class 2604 OID 16432)
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- TOC entry 4881 (class 2604 OID 16537)
-- Name: WatchlistItem id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WatchlistItem" ALTER COLUMN id SET DEFAULT nextval('public."WatchlistItem_id_seq"'::regclass);


--
-- TOC entry 5048 (class 0 OID 16445)
-- Dependencies: 223
-- Data for Name: Movie; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Movie" (id, title, "releaseYear", "createdAt", "directorId", genres, overview, "posterUrl", runtime, "anotherTitles", rating) FROM stdin;
1	Inception	2010	2026-03-30 04:33:14.744	1	{Sci-Fi}	A thief who steals corporate secrets...	\N	\N	{}	8.8
2	The Matrix	1999	2026-03-30 04:33:14.76	1	{Action}	A computer hacker learns...	\N	\N	{}	8.7
3	Interstellar	2014	2026-03-30 04:33:14.761	1	{Sci-Fi}	A team of explorers travel...	\N	\N	{}	8.6
4	Tenet	2020	2026-03-30 04:33:14.763	1	{Action}	A man travels back in time...	\N	\N	{}	7.3
5	Dunkirk	2017	2026-03-30 04:33:14.764	1	{War}	Allied soldiers are surrounded...	\N	\N	{}	7.9
\.


--
-- TOC entry 5046 (class 0 OID 16429)
-- Dependencies: 221
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, email, password, "createdAt", "updatedAt") FROM stdin;
1	motaz	haitm_1969@icloud.com	$2b$10$xXd7ZxioH4joxMDN17FNquXCIxmnUeax3ePLJQTv6DvxFkHmcRTv6	2026-03-29 17:42:41.127	2026-03-29 17:42:41.127
\.


--
-- TOC entry 5050 (class 0 OID 16534)
-- Dependencies: 225
-- Data for Name: WatchlistItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."WatchlistItem" (id, "userId", "movieId", status, rating, notes, "createdAt") FROM stdin;
2	1	2	PLANNED	8	\N	2026-03-30 08:10:10.685
\.


--
-- TOC entry 5044 (class 0 OID 16414)
-- Dependencies: 219
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
d33f100e-8ee3-4ec0-ad66-c2aa456b13a3	b7b7f5f2c8fc459ca46e39abc702aec84e339ee4ace25d253c6298b55dbf39b9	2026-03-27 17:08:30.265925+03	20260327140830_add_users_table	\N	\N	2026-03-27 17:08:30.250951+03	1
d50a8f2e-e4e9-4626-ab8a-8558fd8a3cbb	6a9d8c4ee1ac84eb4a649cf721df0622938f2fbf919a5fb45105c951ac2476bd	2026-03-27 21:05:27.189708+03	20260327180527_add_other_tables	\N	\N	2026-03-27 21:05:27.08138+03	1
063a6bec-f5c7-40ea-8563-60a47debfc62	b4106b8a1eb9b2492c4cf5d8ba2af52b5e44fc5711d17e32665ce7bab4244244	2026-03-29 20:54:27.700004+03	20260329175427_init	\N	\N	2026-03-29 20:54:27.664369+03	1
83152959-dcce-4397-8647-07d0bff39293	d0563bd24ac1971d84caaf79840433de622542278213b9224624b1e5245f7c7a	2026-03-30 07:13:27.28859+03	20260330041327_add_new_field_to_movie_table	\N	\N	2026-03-30 07:13:27.273729+03	1
ecf1c9ad-03cf-4bba-ae83-f1ff2ab015aa	7e2cfd082a8d51947582abcd8b12849d525618cd8a2ccd4777459a325496589e	2026-03-30 07:43:08.537037+03	20260330044308_added_constraint	\N	\N	2026-03-30 07:43:08.496447+03	1
9743af50-5db8-4361-8fa6-ed972c02a07c	5f32dad7b4a21d1353cb1862aaa614438f9de13aa664b5c3366550c45b0806c1	2026-04-06 18:26:39.743981+03	20260406152639_fix_bugs	\N	\N	2026-04-06 18:26:39.738374+03	1
\.


--
-- TOC entry 5059 (class 0 OID 0)
-- Dependencies: 222
-- Name: Movie_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Movie_id_seq"', 5, true);


--
-- TOC entry 5060 (class 0 OID 0)
-- Dependencies: 220
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, true);


--
-- TOC entry 5061 (class 0 OID 0)
-- Dependencies: 224
-- Name: WatchlistItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."WatchlistItem_id_seq"', 2, true);


--
-- TOC entry 4890 (class 2606 OID 16456)
-- Name: Movie Movie_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Movie"
    ADD CONSTRAINT "Movie_pkey" PRIMARY KEY (id);


--
-- TOC entry 4888 (class 2606 OID 16443)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- TOC entry 4892 (class 2606 OID 16548)
-- Name: WatchlistItem WatchlistItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WatchlistItem"
    ADD CONSTRAINT "WatchlistItem_pkey" PRIMARY KEY (id);


--
-- TOC entry 4885 (class 2606 OID 16427)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4886 (class 1259 OID 16457)
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- TOC entry 4893 (class 1259 OID 17933)
-- Name: WatchlistItem_userId_movieId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "WatchlistItem_userId_movieId_key" ON public."WatchlistItem" USING btree ("userId", "movieId");


--
-- TOC entry 4894 (class 2606 OID 16549)
-- Name: Movie Movie_directorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Movie"
    ADD CONSTRAINT "Movie_directorId_fkey" FOREIGN KEY ("directorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4895 (class 2606 OID 16559)
-- Name: WatchlistItem WatchlistItem_movieId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WatchlistItem"
    ADD CONSTRAINT "WatchlistItem_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES public."Movie"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4896 (class 2606 OID 16554)
-- Name: WatchlistItem WatchlistItem_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WatchlistItem"
    ADD CONSTRAINT "WatchlistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2026-04-08 22:13:18

--
-- PostgreSQL database dump complete
--

\unrestrict 8pHv1gNsaK4ZG0pwS1XNubwD56okHOez0Man7h4EeAqg7uScdTabhIu4pe1lGb8

