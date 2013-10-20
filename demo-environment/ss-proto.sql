-- phpMyAdmin SQL Dump
-- version 3.4.3.1
-- http://www.phpmyadmin.net
--
-- Host: localhost:3306
-- Erstellungszeit: 20. Okt 2013 um 17:27
-- Server Version: 5.5.27
-- PHP-Version: 5.5.3

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Datenbank: `ss-proto`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `artikel`
--

CREATE TABLE IF NOT EXISTS `artikel` (
  `ANr` int(11) NOT NULL,
  `ean` bigint(20) DEFAULT NULL,
  `bezeichnung` text,
  `mwst` int(11) NOT NULL,
  `weightDependant` tinyint(1) NOT NULL DEFAULT '0',
  `linkedANr` int(11) DEFAULT NULL,
  `warengruppe` varchar(50) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ANr`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `artikel`
--

INSERT INTO `artikel` (`ANr`, `ean`, `bezeichnung`, `mwst`, `weightDependant`, `linkedANr`, `warengruppe`, `timestamp`) VALUES
(1111, 11112222, 'test', 19, 1, 1122, NULL, '2013-10-20 15:21:58'),
(1234, 11223344, 'Elefantenbein', 19, 1, NULL, NULL, '2013-10-20 13:59:14'),
(1235, 42141259, 'Mineralwasser Still 0,5l', 7, 0, NULL, NULL, '2013-10-20 13:57:13'),
(2222, NULL, NULL, 0, 0, NULL, NULL, '2013-09-30 09:27:40'),
(5555, 12341234, 'testartikel', 19, 1, NULL, NULL, '2013-10-20 13:47:27'),
(6122, NULL, NULL, 0, 0, NULL, NULL, '2013-09-20 13:28:45'),
(6666, 42141105, 'Mineralwasser Classic 0,6l', 7, 0, NULL, NULL, '2013-10-20 12:38:23'),
(9645, NULL, NULL, 0, 0, NULL, NULL, '2013-09-24 08:44:25'),
(9999, 9999999, 'asdf Artikel 2', 19, 0, NULL, NULL, '2013-10-20 12:38:34');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `filialen`
--

CREATE TABLE IF NOT EXISTS `filialen` (
  `FNr` int(11) NOT NULL,
  `GNr` int(11) NOT NULL,
  `PLZ` int(5) NOT NULL,
  `Ort` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `Str` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`FNr`,`GNr`),
  KEY `GNr` (`GNr`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `filialen`
--

INSERT INTO `filialen` (`FNr`, `GNr`, `PLZ`, `Ort`, `Str`) VALUES
(0, 0, 0, 'Alle Filialen', ''),
(0, 12, 0, 'Alle Filialen', ''),
(53, 12, 79787, 'Lauchringen', 'Riedstraße 18'),
(54, 12, 79801, 'Hohentengen a.H.', 'Hauptstraße 66');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `gesellschaften`
--

CREATE TABLE IF NOT EXISTS `gesellschaften` (
  `GNr` int(3) NOT NULL,
  `PLZ` int(5) NOT NULL,
  `Ort` varchar(50) DEFAULT NULL,
  `Str` varchar(50) NOT NULL,
  PRIMARY KEY (`GNr`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `gesellschaften`
--

INSERT INTO `gesellschaften` (`GNr`, `PLZ`, `Ort`, `Str`) VALUES
(0, 0, 'Alle Gesellschaften', ''),
(12, 78166, 'Donaueschingen', 'Pfohrener Str. 50'),
(927, 40764, 'Langenfeld', 'Karl-Benz-Str. 4-6');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `listung`
--

CREATE TABLE IF NOT EXISTS `listung` (
  `ANr` int(11) NOT NULL,
  `FNr` int(11) NOT NULL DEFAULT '0',
  `GNr` int(11) NOT NULL DEFAULT '0',
  `VKP` double(5,2) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Datum_von` date DEFAULT NULL,
  `Datum_bis` date DEFAULT NULL,
  PRIMARY KEY (`ANr`,`FNr`,`GNr`),
  KEY `FNr` (`FNr`),
  KEY `GNr` (`GNr`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `listung`
--

INSERT INTO `listung` (`ANr`, `FNr`, `GNr`, `VKP`, `timestamp`, `Datum_von`, `Datum_bis`) VALUES
(1111, 0, 0, 9.95, '2013-10-20 15:15:49', NULL, NULL),
(1111, 53, 12, NULL, '2013-09-27 11:55:52', NULL, NULL),
(1234, 0, 0, 19.00, '2013-10-20 15:18:19', NULL, NULL),
(1235, 0, 0, 0.29, '2013-10-01 06:30:58', NULL, NULL),
(1235, 53, 12, 0.50, '2013-09-30 15:25:37', NULL, NULL),
(5555, 0, 0, 12.50, '2013-09-25 13:52:07', NULL, NULL),
(5555, 0, 12, 5.00, '2013-09-27 12:18:58', NULL, NULL),
(5555, 53, 12, NULL, '2013-10-03 15:44:49', NULL, NULL),
(6666, 0, 0, 6.00, '2013-10-20 14:28:54', NULL, NULL),
(6666, 0, 12, 0.19, '2013-10-03 14:13:48', NULL, NULL),
(6666, 53, 12, NULL, '2013-10-03 14:25:21', NULL, NULL),
(9999, 0, 0, NULL, '2013-09-24 14:44:39', NULL, NULL),
(9999, 0, 12, 8.00, '2013-09-24 09:16:39', NULL, NULL),
(9999, 53, 12, NULL, '2013-09-24 07:34:13', NULL, NULL);

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `filialen`
--
ALTER TABLE `filialen`
  ADD CONSTRAINT `filialen_ibfk_1` FOREIGN KEY (`GNr`) REFERENCES `gesellschaften` (`GNr`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `listung`
--
ALTER TABLE `listung`
  ADD CONSTRAINT `listung_ibfk_1` FOREIGN KEY (`ANr`) REFERENCES `artikel` (`ANr`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `listung_ibfk_2` FOREIGN KEY (`FNr`) REFERENCES `filialen` (`FNr`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `listung_ibfk_3` FOREIGN KEY (`GNr`) REFERENCES `filialen` (`GNr`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
