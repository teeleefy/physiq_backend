CREATE TABLE families (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  password TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY, 
   family_id INTEGER NOT NULL
        REFERENCES families ON DELETE CASCADE,
    first_name VARCHAR(35) NOT NULL,
    last_name VARCHAR(35) NOT NULL,
    birthday DATE
); 

CREATE TABLE allergies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    reaction VARCHAR(100) NOT NULL,
    user_id INTEGER NOT NULL
        REFERENCES users ON DELETE CASCADE,
    notes VARCHAR (250) 
);

CREATE TABLE symptoms (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL
        REFERENCES users ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    start_date DATE,
    end_date DATE,
    notes VARCHAR (250) 
);

CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL
        REFERENCES users ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    specialty VARCHAR(50) NOT NULL,
    clinic VARCHAR(50),
    address VARCHAR(100),
    phone VARCHAR(25),
    notes VARCHAR (250)
);

CREATE TABLE diagnoses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL
        REFERENCES users ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    date_received DATE,
    notes VARCHAR (250) 
);

CREATE TABLE visits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL
        REFERENCES users ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES doctors ON DELETE CASCADE,
    title VARCHAR(50) NOT NULL,
    date DATE,
    description VARCHAR (250)
);

CREATE TABLE meds (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL
        REFERENCES users ON DELETE CASCADE,
    prescriber_id INTEGER REFERENCES doctors ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    start_date DATE,
    end_date DATE,
    indication VARCHAR(50),
    dose VARCHAR(100),
    notes VARCHAR (250) 
);

CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL
        REFERENCES users ON DELETE CASCADE,
    path TEXT NOT NULL
);

CREATE TABLE insurance (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL
        REFERENCES users ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    insurance_name VARCHAR(50) NOT NULL,
    insured_name VARCHAR(75) NOT NULL,
    start_date DATE,
    end_date DATE,
    group_num VARCHAR(25),
    contract_num VARCHAR(25),
    notes VARCHAR (100),
    front_image_id INTEGER 
        REFERENCES images ON DELETE CASCADE,
    back_image_id INTEGER 
        REFERENCES images ON DELETE CASCADE
);



