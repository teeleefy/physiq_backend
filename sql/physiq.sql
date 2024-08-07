\echo 'Delete and recreate physiq db?'
\prompt 'Return for yes or anything else to cancel > ' foo

SELECT ('' = :'foo') as continue \gset
\if :continue
  \echo 'Yay, lets do this!'
\else
  \echo 'Operation cancelled.'
  \quit
\endif

DROP DATABASE IF EXISTS physiq;
CREATE DATABASE physiq;
\connect physiq

\i sql/physiq-schema.sql

--uncomment out the line below if you want to seed main database with seed file
-- \i physiq-seed.sql

\echo 'Delete and recreate physiq_test db?'
\prompt 'Return for yes or anything else to cancel > ' foo

SELECT ('' = :'foo') as continue \gset
\if :continue
  \echo 'Yay, lets do this again!'
\else
  \echo 'Operation cancelled.'
  \quit
\endif

DROP DATABASE IF EXISTS physiq_test;
CREATE DATABASE physiq_test;
\connect physiq_test

\i sql/physiq-schema.sql

--uncomment out the line below if you want to seed test database with seed file
-- \i physiq-seed.sql
