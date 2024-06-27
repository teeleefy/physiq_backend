\echo 'Delete and recreate physiq db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE physiq;
CREATE DATABASE physiq;
\connect physiq

\i physiq-schema.sql
\i physiq-seed.sql

\echo 'Delete and recreate physiq_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE physiq_test;
CREATE DATABASE physiq_test;
\connect physiq_test

\i physiq-schema.sql
