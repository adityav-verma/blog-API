CREATE TABLE users(
  user_id INT AUTO_INCREMENT NOT NULL,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  active INT NOT NULL,
  time_of_registration TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  role VARCHAR(100) NOT NULL DEFAULT "user",
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


CREATE TABLE categories(
  category_id INT AUTO_INCREMENT NOT NULL,
  category_name VARCHAR(255) NOT NULL,
  category_details TEXT NOT NULL,
  PRIMARY KEY (category_id),
  CONSTRAINT u_name UNIQUE(category_name)
);

CREATE TABLE blogs(
  blog_id INT AUTO_INCREMENT NOT NULL,
  user_id INT NOT NULL,
  blog_title TEXT NOT NULL,
  category_id INT NOT NULL,
  blog_body TEXT NOT NULL,
  published INT NOT NULL DEFAULT 0,
  published_date TIMESTAMP,
  creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (category_id) REFERENCES categories(category_id),
  PRIMARY KEY (blog_id)
);

CREATE TABLE blog_images(
  blog_id INT NOT NULL,
  image_title VARCHAR(255),
  image_path VARCHAR(255),
  FOREIGN KEY (blog_id) REFERENCES blogs(blog_id)
);
