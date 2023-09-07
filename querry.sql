-- TABLE USERS
CREATE TABLE users(
    id VARCHAR NOT NULL PRIMARY KEY,
    name VARCHAR(30),
    email VARCHAR,
    phone VARCHAR(15),
    password VARCHAR,
    job_position VARCHAR,
    company_name VARCHAR,
    location VARCHAR,
    description VARCHAR,
    photo VARCHAR,
    role VARCHAR,
    -- new added
    verify text not null,
    updated_on timestamp default CURRENT_TIMESTAMP not null
);
ALTER TABLE users ADD verify VARCHAR;
ALTER TABLE users ADD updated_on VARCHAR;

CREATE  FUNCTION update_updated_on_users()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_on = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_on
    BEFORE UPDATE
    ON
        users
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_on_users();

create table users_verification (
    id text not null ,
    users_id text ,
    token text ,
    created_on timestamp default CURRENT_TIMESTAMP not null	,
    constraint 	users foreign key(users_id) 	references 	users(id) ON DELETE CASCADE,
primary key (id)
);

-- Table Skills
create table skills(
    id VARCHAR primary key,
    skill_name VARCHAR(20),
    id_users VARCHAR
);

-- Table hire
create table hire(
    id VARCHAR not null,
    offering VARCHAR,
    description TEXT,
    worker_id VARCHAR,
    worker_name VARCHAR,
    worker_email VARCHAR,
    rec_id VARCHAR,
    rec_email VARCHAR,
    rec_company VARCHAR
);
-- create table socials(
--     id varchar primary key,
--     social_name varchar(25),
--     social_link varchar(25),
--     id_users varchar
-- );

-- Table Portfolio
CREATE TABLE portofolio(
    id VARCHAR NOT NULL PRIMARY KEY,
    name VARCHAR,
    repository VARCHAR,
    photo VARCHAR,
    id_users VARCHAR
);


-- Table Experience
CREATE TABLE experience(
    id VARCHAR NOT NULL PRIMARY KEY,
    job_position VARCHAR,
    company_name VARCHAR,
    working_started VARCHAR,
    working_ended VARCHAR,
    description VARCHAR,
    id_users VARCHAR
);

