-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 28 juin 2024 à 20:12
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `tvaccessoryverificationdb`
--

-- --------------------------------------------------------

--
-- Structure de la table `accessoire`
--

CREATE TABLE `accessoire` (
  `id` int(11) NOT NULL,
  `nom` varchar(55) NOT NULL,
  `quantite` varchar(55) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `accessoire`
--

INSERT INTO `accessoire` (`id`, `nom`, `quantite`) VALUES
(1, 'Remote BV1', NULL),
(2, 'Remote BV9', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `acceteleviseur`
--

CREATE TABLE `acceteleviseur` (
  `id` int(11) NOT NULL,
  `televiseur` int(11) NOT NULL,
  `accessoire` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `acceteleviseur`
--

INSERT INTO `acceteleviseur` (`id`, `televiseur`, `accessoire`) VALUES
(1, 1, 1),
(3, 1, 2);

-- --------------------------------------------------------

--
-- Structure de la table `categorie`
--

CREATE TABLE `categorie` (
  `id` int(11) NOT NULL,
  `nom` varchar(55) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `categorie`
--

INSERT INTO `categorie` (`id`, `nom`) VALUES
(2, 'OS');

-- --------------------------------------------------------

--
-- Structure de la table `lot`
--

CREATE TABLE `lot` (
  `id` int(11) NOT NULL,
  `numero` int(11) NOT NULL,
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL,
  `taille` int(11) NOT NULL DEFAULT 600
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `lot`
--

INSERT INTO `lot` (`id`, `numero`, `startTime`, `endTime`, `taille`) VALUES
(25, 1, '2024-07-01 08:00:00', '2024-08-01 10:00:00', 2),
(26, 2, '2024-08-02 08:00:00', '2024-08-22 10:00:00', 1);

-- --------------------------------------------------------

--
-- Structure de la table `photos`
--

CREATE TABLE `photos` (
  `id` int(11) NOT NULL,
  `chemin` varchar(55) NOT NULL,
  `televiseur` int(11) DEFAULT NULL,
  `accessoire` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `photos`
--

INSERT INTO `photos` (`id`, `chemin`, `televiseur`, `accessoire`) VALUES
(10, '1719399712301.jpg', 0, 1),
(11, '1719399712305.jpg', 0, 1),
(12, '1719399712310.jpg', 0, 1),
(13, '1719399721335.jpg', 1, 0),
(14, '1719399721339.jpg', 1, 0),
(15, '1719399721343.jpg', 1, 0),
(16, '1719399818498.jpg', 1, 0),
(17, '1719399818506.jpg', 1, 0),
(18, '1719399818514.jpg', 1, 0);

-- --------------------------------------------------------

--
-- Structure de la table `televiseur`
--

CREATE TABLE `televiseur` (
  `id` int(11) NOT NULL,
  `modele` varchar(55) NOT NULL,
  `marque` varchar(55) NOT NULL,
  `categorie` int(11) NOT NULL,
  `lot` int(11) DEFAULT NULL,
  `taille` varchar(55) NOT NULL,
  `resolution` varchar(55) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `televiseur`
--

INSERT INTO `televiseur` (`id`, `modele`, `marque`, `categorie`, `lot`, `taille`, `resolution`) VALUES
(4, 'YTG63432V4', 'STREAM', 2, 1, '32 pouces', '2560x1600'),
(5, 'Y64562V4', 'STREAM', 2, 1, '32 pouces', '2560x1600'),
(6, 'Y645GDDF62V4', 'STREAM', 2, 2, '32 pouces', '2560x1600');

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(55) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `username`, `password`) VALUES
(1, 'admin', '$2b$10$hLFRhU9KiIgetdL/lc8HAOzA1LDXboHOudl1QcsAjXnh/dTGeLEse');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `accessoire`
--
ALTER TABLE `accessoire`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `acceteleviseur`
--
ALTER TABLE `acceteleviseur`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `categorie`
--
ALTER TABLE `categorie`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `lot`
--
ALTER TABLE `lot`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `photos`
--
ALTER TABLE `photos`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `televiseur`
--
ALTER TABLE `televiseur`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `accessoire`
--
ALTER TABLE `accessoire`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `acceteleviseur`
--
ALTER TABLE `acceteleviseur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `categorie`
--
ALTER TABLE `categorie`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `lot`
--
ALTER TABLE `lot`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT pour la table `photos`
--
ALTER TABLE `photos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT pour la table `televiseur`
--
ALTER TABLE `televiseur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
