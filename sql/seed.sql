-- RetroVault sample data for Supabase/PostgreSQL.
-- Run schema.sql first. This seed is safe to run more than once.
BEGIN;

INSERT INTO manufacturers (name, country, founded_year) VALUES
  ('Sony', 'Jepang', 1946),
  ('Nintendo', 'Jepang', 1889),
  ('Sega', 'Jepang', 1960)
ON CONFLICT (name) DO UPDATE
SET country = EXCLUDED.country,
    founded_year = EXCLUDED.founded_year;

INSERT INTO consoles (manufacturer_id, name, release_year)
SELECT m.id, seed.name, seed.release_year
FROM (VALUES
  ('Sony', 'PlayStation 2', 2000),
  ('Sony', 'PlayStation', 1994),
  ('Nintendo', 'Nintendo 64', 1996),
  ('Nintendo', 'Super Nintendo', 1990),
  ('Sega', 'Dreamcast', 1998)
) AS seed(manufacturer_name, name, release_year)
JOIN manufacturers m ON m.name = seed.manufacturer_name
WHERE NOT EXISTS (
  SELECT 1 FROM consoles c
  WHERE c.manufacturer_id = m.id AND c.name = seed.name
);

INSERT INTO games (console_id, title, genre, release_year, description)
SELECT c.id, seed.title, seed.genre, seed.release_year, seed.description
FROM (VALUES
  ('PlayStation 2', 'Shadow of the Colossus', 'Action Adventure', 2005, 'Petualangan sunyi melawan para colossus di dunia yang luas.'),
  ('PlayStation 2', 'Final Fantasy X', 'RPG', 2001, 'Perjalanan Tidus dan Yuna dalam kisah RPG klasik.'),
  ('PlayStation 2', 'Gran Turismo 4', 'Racing', 2004, 'Simulasi balap dengan koleksi mobil dan lintasan yang luas.'),
  ('PlayStation', 'Crash Bandicoot', 'Platformer', 1996, 'Petualangan platformer Crash di pulau Wumpa.'),
  ('Nintendo 64', 'The Legend of Zelda: Ocarina of Time', 'Action Adventure', 1998, 'Petualangan Link melintasi waktu di Hyrule.'),
  ('Nintendo 64', 'Mario Kart 64', 'Racing', 1996, 'Balapan kart multiplayer bersama karakter Mushroom Kingdom.'),
  ('Super Nintendo', 'Super Mario World', 'Platformer', 1990, 'Mario menjelajahi Dinosaur Land untuk menyelamatkan Peach.'),
  ('Dreamcast', 'Sonic Adventure', 'Platformer', 1998, 'Petualangan Sonic dan kawan-kawan di dunia 3D.')
) AS seed(console_name, title, genre, release_year, description)
JOIN consoles c ON c.name = seed.console_name
WHERE NOT EXISTS (
  SELECT 1 FROM games g
  WHERE g.console_id = c.id AND g.title = seed.title
);

INSERT INTO transactions (game_id, status, purchase_price, purchase_date)
SELECT g.id, seed.status, seed.purchase_price, seed.purchase_date::date
FROM (VALUES
  ('Shadow of the Colossus', 'Koleksi', 350000.00, '2024-06-12'),
  ('Final Fantasy X', 'Koleksi', 180000.00, '2023-11-03'),
  ('Gran Turismo 4', 'Wishlist', 0.00, NULL),
  ('The Legend of Zelda: Ocarina of Time', 'Koleksi', 420000.00, '2024-02-20'),
  ('Sonic Adventure', 'Terjual', 250000.00, '2022-08-15')
) AS seed(title, status, purchase_price, purchase_date)
JOIN games g ON g.title = seed.title
WHERE NOT EXISTS (
  SELECT 1 FROM transactions t
  WHERE t.game_id = g.id AND t.status = seed.status
    AND t.purchase_price = seed.purchase_price
    AND t.purchase_date IS NOT DISTINCT FROM seed.purchase_date::date
);

INSERT INTO game_reviews (game_id, rating, status_tamat, review_text)
SELECT g.id, seed.rating, seed.status_tamat, seed.review_text
FROM (VALUES
  ('Shadow of the Colossus', 5, TRUE, 'Atmosfer dan pertarungannya masih terasa istimewa.'),
  ('Final Fantasy X', 5, TRUE, 'Cerita yang berkesan dengan sistem pertarungan yang seru.'),
  ('The Legend of Zelda: Ocarina of Time', 5, TRUE, 'Petualangan klasik yang selalu menyenangkan untuk dimainkan ulang.'),
  ('Sonic Adventure', 4, FALSE, 'Kecepatan Sonic terasa seru dan penuh nostalgia.')
) AS seed(title, rating, status_tamat, review_text)
JOIN games g ON g.title = seed.title
WHERE NOT EXISTS (
  SELECT 1 FROM game_reviews r
  WHERE r.game_id = g.id AND r.rating = seed.rating
    AND r.review_text = seed.review_text
);

COMMIT;
