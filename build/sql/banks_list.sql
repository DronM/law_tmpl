-- Table: public.banks

-- DROP TABLE public.banks;

CREATE TABLE public.banks
(
  bik character varying(9) NOT NULL,
  codegr character varying(9),
  name character varying(50),
  korshet character varying(20),
  adres character varying(70),
  gor character varying(31),
  tgroup boolean,
  CONSTRAINT banks_pkey PRIMARY KEY (bik)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.banks
  OWNER TO law_tmpl;

-- Index: public.banks_codegr_idx

-- DROP INDEX public.banks_codegr_idx;

CREATE INDEX banks_codegr_idx
  ON public.banks
  USING btree
  (codegr COLLATE pg_catalog."default");


-- View: public.banks_list

-- DROP VIEW public.banks_list;

CREATE OR REPLACE VIEW public.banks_list AS 
 SELECT b.bik,
    b.codegr,
    b.name,
    b.korshet,
    b.adres,
    b.gor,
    b.tgroup,
    bgr.name AS gr_descr
   FROM banks b
     LEFT JOIN banks bgr ON b.codegr::text = bgr.bik::text
  WHERE b.tgroup = false
  ORDER BY b.bik;

ALTER TABLE public.banks_list
  OWNER TO law_tmpl;

