BEGIN TRANSACTION;

INSERT INTO users (name, email, entries, joined) 
VALUES ('test', 'test@test.com', 4, '2018-01-01');

INSERT INTO login (hash, email)
VALUES ('$2a$10$n0hlXfGWIU1HzWARrlxTxeuwo6XafWAZsS7MH4vtizVdU0TMBxHOq', 'test@test.com');

COMMIT;