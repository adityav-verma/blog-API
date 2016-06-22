-- MySQL dump 10.13  Distrib 5.7.13, for osx10.11 (x86_64)
--
-- Host: localhost    Database: blog
-- ------------------------------------------------------
-- Server version	5.7.13

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
INSERT INTO `blog_images` VALUES (8,'default','images/default.jpeg'),(9,'default','images/default.jpeg'),(10,'default','images/default.jpeg'),(11,'default','images/default.jpeg'),(20,'7ad247b8b6de8376d33bf8ef86d6666e','images/7ad247b8b6de8376d33bf8ef86d6666e.jpeg'),(21,'c4b47bf2a4701f3688e325679ff7992c','images/c4b47bf2a4701f3688e325679ff7992c.jpeg'),(22,'28e3d3e9d18d5a7c8b5151a9f4c43982','images/28e3d3e9d18d5a7c8b5151a9f4c43982.jpeg'),(23,'3f045440d11795aadca24049fb8e0614','images/3f045440d11795aadca24049fb8e0614.jpeg'),(24,'b0f2f061e36fa4159d02540abe6ff310','images/b0f2f061e36fa4159d02540abe6ff310.jpeg');
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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blogs`
--

LOCK TABLES `blogs` WRITE;
/*!40000 ALTER TABLE `blogs` DISABLE KEYS */;
INSERT INTO `blogs` VALUES (8,1,'Testing',1,'Testing blog body!',0,'2016-06-21 09:47:00','2016-06-21 08:55:34'),(9,2,'Testing 2',1,'Testing 2 blog body!',0,'2016-06-21 09:47:04','2016-06-21 08:55:47'),(10,2,'Testing 3',1,'Testing 3 blog body!',1,'2016-06-21 09:43:48','2016-06-21 08:55:55'),(11,2,'Testing 4',1,'Testing 4 blog body!',1,'2016-06-21 09:43:54','2016-06-21 08:56:09'),(12,1,'title',2,'body of the blog',0,'2016-06-21 09:18:02','2016-06-21 09:18:02'),(13,1,'title',2,'body of the blog',0,'2016-06-21 09:18:48','2016-06-21 09:18:48'),(14,1,'title',2,'body of the blog',0,'2016-06-21 09:18:59','2016-06-21 09:18:59'),(15,1,'title',2,'body of the blog',0,'2016-06-21 09:29:08','2016-06-21 09:29:08'),(16,1,'title',2,'body of the blog',0,'2016-06-21 09:29:08','2016-06-21 09:29:08'),(17,1,'title',2,'body of the blog',0,'2016-06-21 09:29:58','2016-06-21 09:29:58'),(18,1,'title',2,'body of the blog',0,'2016-06-21 09:30:16','2016-06-21 09:30:16'),(19,1,'title',2,'body of the blog',0,'2016-06-21 09:30:44','2016-06-21 09:30:44'),(20,1,'title',2,'body of the blog',0,'2016-06-21 09:31:18','2016-06-21 09:31:18'),(21,1,'title',2,'body of the blog',0,'2016-06-21 09:36:16','2016-06-21 09:36:16'),(22,1,'title',2,'body of the blog',0,'2016-06-21 09:39:00','2016-06-21 09:39:00'),(23,1,'title',2,'body of the blog',0,'2016-06-21 09:42:34','2016-06-21 09:42:34'),(24,1,'asdsad',2,'asdsadasdsadsadasd',0,'2016-06-21 09:48:29','2016-06-21 09:48:29');
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Lifestyle','All about living life!!!'),(2,'Geeks Corner','All about the geeky stuff!!'),(3,'Fun','All about fun!!');
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
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session`
--

LOCK TABLES `session` WRITE;
/*!40000 ALTER TABLE `session` DISABLE KEYS */;
INSERT INTO `session` VALUES (1,'dew','7b18d61dac635580c3c3fcebbd35a7d2','2016-06-21 06:05:51'),(2,'dew','2dd266c71c7787d24b113f512aec3e27','2016-06-21 06:06:56'),(3,'dew','254891c9751de41ff69ed72709e0c9d7','2016-06-21 06:07:46'),(4,'dew','8e6fa1ef306ce74e119df02e1325ded2','2016-06-21 06:16:21'),(5,'dew','78ba02c47705ce70fadc8d5c53c211bc','2016-06-21 06:20:01'),(6,'dew','2d046d9f2da8fe9d536589a4a19f1c48','2016-06-21 06:21:46'),(7,'dew','1e7abdf10f750ab58c7026df35c37d44','2016-06-21 06:24:33'),(8,'dew','597f7c503c50fc273e7d26d24de21696','2016-06-21 06:27:22'),(9,'dew','897c883d366ace984e3481dc34385485','2016-06-21 06:28:26'),(10,'dew','24cc4b06923cba0a66cf6e344ccd7949','2016-06-21 06:32:11'),(11,'dew','63205de49ebd8edcd7ee2117ccee4a8a','2016-06-21 06:33:25'),(12,'dew','63205de49ebd8edcd7ee2117ccee4a8a','2016-06-21 06:33:25'),(13,'dew','a1d5e7d7ee1506874a9288445499a1c3','2016-06-21 06:39:02'),(14,'dew','b9202a6ad597a2921652bd404c9a1a99','2016-06-21 06:39:53'),(15,'dew','04a4d72eebc5e3f91946a1721b48182d','2016-06-21 06:41:38'),(16,'admin','5d91a1f939ce2f7fcf7fe87009cc1151','2016-06-21 06:41:45'),(17,'dew','774ce88a55cf12ef085347e96a0dd941','2016-06-21 06:41:59'),(18,'dew','b2e16dc3724798c910986f124c2c9635','2016-06-21 06:42:23'),(19,'dew','2fcb8734ffc1d4b6ccbe0c3a6308bd9f','2016-06-21 06:43:00'),(20,'dew','8f486ca1d8da8838dd79feeb8e958b80','2016-06-21 06:43:52'),(21,'dew','89d7191ab6545c4aed9bfad959a29bf5','2016-06-21 06:44:39'),(22,'dew','6e73eed08a019d7c49f8b142927c8071','2016-06-21 06:46:02'),(23,'dew','3291884a585ea4b497cf38738229135a','2016-06-21 06:46:32'),(24,'dew','1623c49d9dd68dcf110f21028c96db2d','2016-06-21 06:46:53'),(25,'dew','75f19161faa3993de237e013f290162e','2016-06-21 06:47:21'),(26,'dew','c1a2dff7ba7193a65e67ed8c084b6ce8','2016-06-21 06:48:01'),(27,'dew','cfeb31d49d6bc26281b9b9af45ac87c1','2016-06-21 06:48:23'),(28,'dew','fa2e46899ce7870e8df72beb6b694d5d','2016-06-21 06:48:47'),(29,'dew','aec6dc6c1b4ea77708b2006a1bc5f6e2','2016-06-21 06:49:13'),(30,'dew','6ac9e25557441251ef0c78cb96a380ef','2016-06-21 06:50:06'),(31,'dew','5b460cab68b42b681672a54086131dcb','2016-06-21 06:50:41'),(32,'dew','58e0e23e867415ad3cfc7206f7fed8a9','2016-06-21 07:14:19'),(33,'dew','0bd3e90e1bacde093ea67b3274dff9f2','2016-06-21 07:16:06'),(34,'aditya','3bea73884e239c5387a0bb142aa9ec6f','2016-06-21 09:10:42'),(35,'aditya','ef356e5349c99c17f654f80a48dc650c','2016-06-21 09:11:37'),(36,'aditya','e40c112060f715478cc2d4ec65dbbcf6','2016-06-21 09:11:48'),(37,'aditya','bc28d6d84d72d1fc56836e4c464e88cd','2016-06-21 09:11:51'),(38,'aditya','e80e39f435b3990aca715d9a531233e4','2016-06-21 09:12:18'),(39,'aditya','0d7ae688f99757fa3330cd5bb819f3f7','2016-06-21 09:12:30'),(40,'dew','18cf73488c69ce1a50dc4921ceea0237','2016-06-21 10:24:08'),(41,'dew','28af0adcd77a13365ada77883067e358','2016-06-21 10:24:40'),(42,'dew','2092a319591c7a7d1e849a2cdff883b7','2016-06-21 10:25:23'),(43,'dew','c6b23bb58dd6e325fc18e9b49d1e2a7f','2016-06-21 10:26:01'),(44,'dew','3f64dd6cfffe67c1d39a890b3dee6a70','2016-06-21 10:27:09'),(45,'dew','ccd46ca023d25df2c8c1a7fd08b1c77d','2016-06-21 10:27:28'),(46,'dew','d78fc8f8f7960887118899eb34abecc2','2016-06-21 10:28:53'),(47,'dew','6fdbf0581effdb7170b5a3f8dd3418aa','2016-06-21 10:29:14'),(48,'abd','1230205dc85f6f474ec589040bfb9164','2016-06-21 10:29:49'),(49,'dew','6f3ce1f3d2ca1b9c153045bd7290f96f','2016-06-21 11:06:13'),(50,'dew','92df2bbaf4429b1cea60d1e6b044bb49','2016-06-21 11:10:59'),(51,'aditya','-1','2016-06-22 05:55:42'),(52,'admin','32484b2b49f4331b2b753b846d442654','2016-06-22 05:59:06');
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'aditya','meetadi3@gmail.com','057829fa5a65fc1ace408f490be486ac',1,'2016-06-21 05:52:39','user'),(2,'asfdf','dewwrat6@gmail.com','56d09aa3852decfe4695612c67db15dd',1,'2016-06-21 05:57:37','user'),(3,'sdafd','sdafd@fdja.com','f6aff6cf1805715fe4d20dc724c30775',1,'2016-06-21 05:58:08','user'),(4,'dew','dewrat6@gmail.com','1801bc89e752077204c92b3dd9f9f62d',1,'2016-06-21 06:05:33','user'),(5,'admin','admin@gmail.com','21232f297a57a5a743894a0e4a801fc3',0,'2016-06-21 06:40:16','admin'),(6,'gaurav','gaurav@gmail.com','29be54a52396750258d886abc5417fda',0,'2016-06-21 09:58:03','user'),(7,'jaswant','jaswant@gmail.com','61f771031c30ca2af194a17d6e9a6b7b',0,'2016-06-21 09:58:17','user'),(8,'abd','adf@fd.com','4911e516e5aa21d327512e0c8b197616',1,'2016-06-21 10:29:34','user'),(9,'asdf','asdf@gmail.com','912ec803b2ce49e4a541068d495ab570',1,'2016-06-21 10:30:51','user');
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

-- Dump completed on 2016-06-22 13:25:51
