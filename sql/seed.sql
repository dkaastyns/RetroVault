-- RetroVault sample data for Supabase/PostgreSQL.
-- Run schema.sql first. This seed is safe to run more than once.
BEGIN;

ALTER TABLE games ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN NOT NULL DEFAULT FALSE;

INSERT INTO manufacturers (name, country, founded_year) VALUES
  ('Sony', 'Jepang', 1946),
  ('Nintendo', 'Jepang', 1889),
  ('Sega', 'Jepang', 1960)
ON CONFLICT (name) DO UPDATE
SET country = EXCLUDED.country,
    founded_year = EXCLUDED.founded_year;

INSERT INTO consoles (manufacturer_id, name, release_year, image_url)
SELECT m.id, seed.name, seed.release_year, seed.image_url
FROM (VALUES
  ('Sony', 'PlayStation 2', 2000, '/covers/console-ps2.svg'),
  ('Sony', 'PlayStation', 1994, '/covers/console-playstation.svg'),
  ('Nintendo', 'Nintendo 64', 1996, '/covers/console-n64.svg'),
  ('Nintendo', 'Super Nintendo', 1990, '/covers/console-snes.svg'),
  ('Sega', 'Dreamcast', 1998, '/covers/console-dreamcast.svg')
) AS seed(manufacturer_name, name, release_year, image_url)
JOIN manufacturers m ON m.name = seed.manufacturer_name
WHERE NOT EXISTS (
  SELECT 1 FROM consoles c
  WHERE c.manufacturer_id = m.id AND c.name = seed.name
);

UPDATE consoles c SET image_url=seed.image_url
FROM (VALUES
  ('PlayStation 2','/covers/console-ps2.svg'),
  ('PlayStation','/covers/console-playstation.svg'),
  ('Nintendo 64','/covers/console-n64.svg'),
  ('Super Nintendo','/covers/console-snes.svg'),
  ('Dreamcast','/covers/console-dreamcast.svg')
) AS seed(name,image_url)
WHERE c.name=seed.name AND (c.image_url IS NULL OR c.image_url LIKE '/covers/%');

INSERT INTO games (console_id, title, genre, release_year, description, image_url)
SELECT c.id, seed.title, seed.genre, seed.release_year, seed.description, seed.image_url
FROM (VALUES
  ('PlayStation 2', 'Shadow of the Colossus', 'Action Adventure', 2005, 'Petualangan sunyi melawan para colossus di dunia yang luas.', '/covers/shadow-of-the-colossus.svg'),
  ('PlayStation 2', 'Final Fantasy X', 'RPG', 2001, 'Perjalanan Tidus dan Yuna dalam kisah RPG klasik.', '/covers/final-fantasy-x.svg'),
  ('PlayStation 2', 'Gran Turismo 4', 'Racing', 2004, 'Simulasi balap dengan koleksi mobil dan lintasan yang luas.', '/covers/gran-turismo-4.svg'),
  ('PlayStation', 'Crash Bandicoot', 'Platformer', 1996, 'Petualangan platformer Crash di pulau Wumpa.', '/covers/crash-bandicoot.svg'),
  ('Nintendo 64', 'The Legend of Zelda: Ocarina of Time', 'Action Adventure', 1998, 'Petualangan Link melintasi waktu di Hyrule.', '/covers/ocarina-of-time.svg'),
  ('Nintendo 64', 'Mario Kart 64', 'Racing', 1996, 'Balapan kart multiplayer bersama karakter Mushroom Kingdom.', '/covers/mario-kart-64.svg'),
  ('Super Nintendo', 'Super Mario World', 'Platformer', 1990, 'Mario menjelajahi Dinosaur Land untuk menyelamatkan Peach.', '/covers/super-mario-world.svg'),
  ('Dreamcast', 'Sonic Adventure', 'Platformer', 1998, 'Petualangan Sonic dan kawan-kawan di dunia 3D.', '/covers/sonic-adventure.svg')
) AS seed(console_name, title, genre, release_year, description, image_url)
JOIN consoles c ON c.name = seed.console_name
WHERE NOT EXISTS (
  SELECT 1 FROM games g WHERE g.console_id=c.id AND g.title=seed.title
);

UPDATE games g SET image_url=seed.image_url
FROM (VALUES
  ('Shadow of the Colossus','/covers/shadow-of-the-colossus.svg'),
  ('Final Fantasy X','/covers/final-fantasy-x.svg'),
  ('Gran Turismo 4','/covers/gran-turismo-4.svg'),
  ('Crash Bandicoot','/covers/crash-bandicoot.svg'),
  ('The Legend of Zelda: Ocarina of Time','/covers/ocarina-of-time.svg'),
  ('Mario Kart 64','/covers/mario-kart-64.svg'),
  ('Super Mario World','/covers/super-mario-world.svg'),
  ('Sonic Adventure','/covers/sonic-adventure.svg')
) AS seed(title,image_url)
WHERE g.title=seed.title AND (g.image_url IS NULL OR g.image_url LIKE '/covers/%');

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
