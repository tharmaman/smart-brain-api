-- Deploy fresh database tables
\i '/docker-entrypoint-initdb.d/tables/users.sql'
\i '/docker-entrypoint-initdb.d/tables/login.sql'

-- Seed with users
\i '/docker-entrypoint-initdb.d/seed/seed.sql'
