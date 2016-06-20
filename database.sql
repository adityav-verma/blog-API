CREATE TABLE users(
  user_id INT AUTO_INCREMENT NOT NULL,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  active INT NOT NULL,
  time_of_registration TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  CONSTRAINT u_username UNIQUE(username),
  CONSTRAINT u_email UNIQUE(email)
);


CREATE TABLE session(
  session_id INT AUTO_INCREMENT NOT NULL,
  username VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  login_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (session_id),
  FOREIGN KEY (username) REFERENCES users(username)
);
