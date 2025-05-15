--------------------------------------------------------------------------------
--  Up
--------------------------------------------------------------------------------

CREATE TABLE provinces (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE cities (
  id TEXT PRIMARY KEY,
  parent_id TEXT NOT NULL,
  name TEXT NOT NULL UNIQUE,

  CONSTRAINT cities_fk_parent_id FOREIGN KEY (parent_id)
    REFERENCES provinces (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE districts (
  id TEXT PRIMARY KEY,
  parent_id TEXT NOT NULL,
  name TEXT NOT NULL,

  UNIQUE (parent_id, name),

  CONSTRAINT districts_fk_parent_id FOREIGN KEY (parent_id)
    REFERENCES cities (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE subdistricts (
  id TEXT PRIMARY KEY,
  parent_id TEXT NOT NULL,
  name TEXT NOT NULL,

  UNIQUE (parent_id, name),

  CONSTRAINT subdistricts_fk_parent_id FOREIGN KEY (parent_id)
    REFERENCES districts (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX provinces_idx_name ON provinces (name);

CREATE INDEX cities_idx_parent_id ON cities (parent_id, name);
CREATE INDEX cities_idx_name ON cities (name);

CREATE INDEX districts_idx_parent_id ON districts (parent_id, name);
CREATE INDEX districts_idx_name ON districts (name);

CREATE INDEX subdistricts_idx_parent_id ON subdistricts (parent_id, name);
CREATE INDEX subdistricts_idx_name ON subdistricts (name);
