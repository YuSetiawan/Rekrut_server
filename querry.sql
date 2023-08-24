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
    place VARCHAR,
    description VARCHAR,
    photo VARCHAR,
    role VARCHAR
);

create table skills(
    id varchar primary key,
    skill_name varchar(20),
    id_users varchar
);

create table socials(
    id varchar primary key,
    social_name varchar(25),
    social_link varchar(25),
    id_users varchar
);

CREATE TABLE portofolio(
    id VARCHAR NOT NULL PRIMARY KEY,
    name VARCHAR,
    repository VARCHAR,
    photo VARCHAR,
    id_users VARCHAR
);

CREATE TABLE experience(
    id VARCHAR NOT NULL PRIMARY KEY,
    job_position VARCHAR,
    company_name VARCHAR,
    working_started VARCHAR,
    working_ended VARCHAR,
    description VARCHAR,
    id_users VARCHAR
);

