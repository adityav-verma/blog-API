-- MySQL dump 10.13  Distrib 5.6.30, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: blog
-- ------------------------------------------------------
-- Server version	5.6.30-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `blog_images`
--

DROP TABLE IF EXISTS `blog_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blog_images` (
  `blog_id` int(11) NOT NULL,
  `image_title` varchar(255) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  KEY `blog_id` (`blog_id`),
  CONSTRAINT `blog_images_ibfk_1` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`blog_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_images`
--

LOCK TABLES `blog_images` WRITE;
/*!40000 ALTER TABLE `blog_images` DISABLE KEYS */;
INSERT INTO `blog_images` VALUES (38,'60584eaecaeb9df3674abc07a109e367','images/60584eaecaeb9df3674abc07a109e367.jpg'),(39,'default','images/default.jpeg'),(40,'890dfb57d00e6539001a40a62ad93150','images/890dfb57d00e6539001a40a62ad93150.jpg'),(41,'01a41149e80df5783edbb3e19cd79a0b','images/01a41149e80df5783edbb3e19cd79a0b.jpg');
/*!40000 ALTER TABLE `blog_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blogs`
--

DROP TABLE IF EXISTS `blogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blogs` (
  `blog_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `blog_title` text NOT NULL,
  `category_id` int(11) NOT NULL,
  `blog_body` text NOT NULL,
  `published` int(11) NOT NULL DEFAULT '0',
  `published_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `creation_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`blog_id`),
  KEY `user_id` (`user_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `blogs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `blogs_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blogs`
--

LOCK TABLES `blogs` WRITE;
/*!40000 ALTER TABLE `blogs` DISABLE KEYS */;
INSERT INTO `blogs` VALUES (38,10,'Blog title',4,'adf asdjaskdj',0,'2016-06-23 07:26:41','2016-06-22 08:17:37'),(39,10,'New Blog title',4,'adf asdjaskdjasjdsa kjasd as',0,'2016-06-22 08:18:15','2016-06-22 08:18:15'),(40,10,'New Blog title',4,'adf asdjaskdjasjdsa kjasd as',0,'2016-06-22 08:18:22','2016-06-22 08:18:22'),(41,10,'New Blog titleasdasd',4,'adf asdjaskdjasjdsa kjasd asasdasd',0,'2016-06-22 08:18:39','2016-06-22 08:18:39');
/*!40000 ALTER TABLE `blogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) NOT NULL,
  `category_details` text NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `u_name` (`category_name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (4,'LifeStyle','All about life'),(5,'Geeks Corner','All about Geeky Life');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `session`
--

DROP TABLE IF EXISTS `session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `session` (
  `session_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `login_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`session_id`),
  KEY `username` (`username`),
  CONSTRAINT `session_ibfk_1` FOREIGN KEY (`username`) REFERENCES `users` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session`
--

LOCK TABLES `session` WRITE;
/*!40000 ALTER TABLE `session` DISABLE KEYS */;
INSERT INTO `session` VALUES (53,'aditya','da0be7abf538083ca8ef855c8508471e','2016-06-23 06:36:04'),(54,'aditya','6ac8ff27da90d32578568b43ee5a96bc','2016-06-23 06:36:17'),(55,'aditya','c641f1b65a7d9e76b0108bec1f01e63c','2016-06-23 06:37:00'),(56,'aditya','1f66d301af8247b0c3a41e4ae9d8f528','2016-06-23 06:37:55'),(57,'aditya','d67d81514dfdb2c9f5247b12c6193c22','2016-06-23 06:39:14'),(58,'aditya','c0d8f62f31c36f9e0ed1d852c9ce9444','2016-06-23 06:39:49'),(59,'aditya','1caefcbb2020f8f9d26d80382814f34f','2016-06-23 06:49:49'),(60,'aditya','8ad5c9eff0a82015733fa3f46a1a0170','2016-06-23 07:59:50'),(61,'aditya','d58f3f83f16d4782c316c96d78ed59c0','2016-06-23 08:01:22'),(62,'aditya','2f68d93d24b0b03b193600fc09d32f25','2016-06-23 08:02:23'),(63,'aditya','94862f6773c24fc3d34005c9a7c87dc5','2016-06-23 08:02:57'),(64,'aditya','35883b53f4345593044aec4a7ac0d33d','2016-06-23 08:04:35');
/*!40000 ALTER TABLE `session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `active` int(11) NOT NULL,
  `time_of_registration` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `role` varchar(100) NOT NULL DEFAULT 'user',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `u_username` (`username`),
  UNIQUE KEY `u_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (10,'aditya','aditya@gmail.com','057829fa5a65fc1ace408f490be486ac',0,'2016-06-22 08:05:18','user'),(12,'sanju','sanju@gmail.com','c24526bfc0fe42d8b09a314e64d7b0d9',1,'2016-06-22 08:05:35','user'),(13,'admin','admin@gmail.com','21232f297a57a5a743894a0e4a801fc3',1,'2016-06-22 08:05:51','admin');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-06-23  8:27:42
