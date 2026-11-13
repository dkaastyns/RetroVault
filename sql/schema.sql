CREATE TABLE IF NOT EXISTS manufacturers (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  country VARCHAR(100) NOT NULL,
  founded_year SMALLINT CHECK (founded_year BETWEEN 1800 AND 2100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS consoles (
  id BIGSERIAL PRIMARY KEY,
  manufacturer_id BIGINT NOT NULL REFERENCES manufacturers(id) ON DELETE RESTRICT,
  name VARCHAR(160) NOT NULL,
  release_year SMALLINT CHECK (release_year BETWEEN 1970 AND 2100),
  image_url TEXT,
  image_public_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (manufacturer_id, name)
);

CREATE TABLE IF NOT EXISTS games (
  id BIGSERIAL PRIMARY KEY,
  console_id BIGINT NOT NULL REFERENCES consoles(id) ON DELETE RESTRICT,
  title VARCHAR(200) NOT NULL,
  genre VARCHAR(100) NOT NULL,
  release_year SMALLINT CHECK (release_year BETWEEN 1970 AND 2100),
  image_url TEXT,
  image_public_id TEXT,
  description TEXT,
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE games ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS transactions (
  id BIGSERIAL PRIMARY KEY,
  game_id BIGINT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('Koleksi', 'Wishlist', 'Terjual')),
  purchase_price NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (purchase_price >= 0),
  purchase_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS game_reviews (
  id BIGSERIAL PRIMARY KEY,
  game_id BIGINT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  status_tamat BOOLEAN NOT NULL DEFAULT FALSE,
  review_text TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consoles_manufacturer ON consoles(manufacturer_id);
CREATE INDEX IF NOT EXISTS idx_games_console ON games(console_id);
CREATE INDEX IF NOT EXISTS idx_transactions_game ON transactions(game_id);
CREATE INDEX IF NOT EXISTS idx_reviews_game ON game_reviews(game_id);
