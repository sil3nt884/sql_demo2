CREATE TABLE IF NOT EXISTS  items (
    id uuid PRIMARY KEY,
    name varchar(255) NOT NULL,
    minecraft_name varchar(255) NOT NULL

);

CREATE TABLE IF NOT EXISTS item_images (
    id uuid PRIMARY KEY,
    item_id uuid NOT NULL,
    path varchar(255) NOT NULL

);