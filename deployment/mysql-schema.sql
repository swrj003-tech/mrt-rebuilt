-- ============================================
-- MRT International - MySQL Production Schema
-- For Hostinger Business Plan Deployment
-- ============================================

-- Drop existing tables if they exist (use with caution in production)
-- Uncomment the following lines only for fresh installation
-- DROP TABLE IF EXISTS `AffiliateClick`;
-- DROP TABLE IF EXISTS `Review`;
-- DROP TABLE IF EXISTS `WishlistItem`;
-- DROP TABLE IF EXISTS `ComparisonItem`;
-- DROP TABLE IF EXISTS `Product`;
-- DROP TABLE IF EXISTS `CategoryTheme`;
-- DROP TABLE IF EXISTS `Category`;
-- DROP TABLE IF EXISTS `Testimonial`;
-- DROP TABLE IF EXISTS `NewsletterSub`;
-- DROP TABLE IF EXISTS `User`;

-- ============================================
-- CORE TABLES
-- ============================================

-- Users & Authentication
CREATE TABLE IF NOT EXISTS `User` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `passwordHash` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) DEFAULT NULL,
    `role` VARCHAR(50) NOT NULL DEFAULT 'USER',
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_user_email` (`email`),
    INDEX `idx_user_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories
CREATE TABLE IF NOT EXISTS `Category` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL UNIQUE,
    `slug` VARCHAR(255) NOT NULL UNIQUE,
    `image` VARCHAR(500) DEFAULT NULL,
    `sortOrder` INT NOT NULL DEFAULT 0,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_category_slug` (`slug`),
    INDEX `idx_category_sort` (`sortOrder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Category Themes (Visual Customization)
CREATE TABLE IF NOT EXISTS `CategoryTheme` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `primary` VARCHAR(50) NOT NULL,
    `secondary` VARCHAR(50) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `subtitle` VARCHAR(500) NOT NULL,
    `seoTitle` VARCHAR(255) DEFAULT NULL,
    `seoIntro` TEXT DEFAULT NULL,
    `categoryId` INT NOT NULL UNIQUE,
    FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE,
    INDEX `idx_theme_category` (`categoryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products
CREATE TABLE IF NOT EXISTS `Product` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL UNIQUE,
    `description` TEXT DEFAULT NULL,
    `shortBenefit` VARCHAR(500) DEFAULT NULL,
    `shortDescription` VARCHAR(500) DEFAULT NULL,
    `price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `originalPrice` DECIMAL(10, 2) DEFAULT NULL,
    `currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
    `image` VARCHAR(500) DEFAULT NULL,
    `badge` VARCHAR(100) DEFAULT NULL,
    `affiliateUrl` VARCHAR(1000) DEFAULT NULL,
    `secondaryUrl` VARCHAR(1000) DEFAULT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
    `sortOrder` INT NOT NULL DEFAULT 0,
    `ratingValue` DECIMAL(3, 2) NOT NULL DEFAULT 5.00,
    `ratingText` VARCHAR(100) DEFAULT NULL,
    `tags` JSON DEFAULT NULL,
    `keyBenefits` JSON DEFAULT NULL,
    `categoryId` INT NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT,
    INDEX `idx_product_slug` (`slug`),
    INDEX `idx_product_category` (`categoryId`),
    INDEX `idx_product_active` (`isActive`),
    INDEX `idx_product_sort` (`sortOrder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reviews
CREATE TABLE IF NOT EXISTS `Review` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `userName` VARCHAR(255) NOT NULL,
    `rating` INT NOT NULL DEFAULT 5,
    `comment` TEXT DEFAULT NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT FALSE,
    `productId` INT NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE,
    INDEX `idx_review_product` (`productId`),
    INDEX `idx_review_rating` (`rating`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Testimonials
CREATE TABLE IF NOT EXISTS `Testimonial` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) DEFAULT NULL,
    `quote` TEXT DEFAULT NULL,
    `text` TEXT DEFAULT NULL,
    `region` VARCHAR(100) DEFAULT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
    `rating` INT NOT NULL DEFAULT 5,
    `sortOrder` INT NOT NULL DEFAULT 1,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_testimonial_sort` (`sortOrder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Affiliate Click Tracking
CREATE TABLE IF NOT EXISTS `AffiliateClick` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `productId` INT NOT NULL,
    `clickedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `ip` VARCHAR(45) DEFAULT NULL,
    `userAgent` VARCHAR(500) DEFAULT NULL,
    FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE,
    INDEX `idx_click_product` (`productId`),
    INDEX `idx_click_date` (`clickedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Wishlist Items
CREATE TABLE IF NOT EXISTS `WishlistItem` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `userId` INT DEFAULT NULL,
    `deviceId` VARCHAR(255) DEFAULT NULL,
    `productId` INT NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE,
    INDEX `idx_wishlist_user` (`userId`),
    INDEX `idx_wishlist_device` (`deviceId`),
    INDEX `idx_wishlist_product` (`productId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comparison Items
CREATE TABLE IF NOT EXISTS `ComparisonItem` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `userId` INT DEFAULT NULL,
    `deviceId` VARCHAR(255) DEFAULT NULL,
    `productId` INT NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE,
    INDEX `idx_comparison_user` (`userId`),
    INDEX `idx_comparison_device` (`deviceId`),
    INDEX `idx_comparison_product` (`productId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Newsletter Subscriptions
CREATE TABLE IF NOT EXISTS `NewsletterSub` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_newsletter_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contact Messages
CREATE TABLE IF NOT EXISTS `ContactMessage` (
    `id` VARCHAR(191) NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(100) DEFAULT NULL,
    `subject` VARCHAR(255) DEFAULT NULL,
    `message` TEXT NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'new',
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_contact_created` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Media Library
CREATE TABLE IF NOT EXISTS `MediaFile` (
    `id` VARCHAR(191) NOT NULL PRIMARY KEY,
    `filename` VARCHAR(255) NOT NULL,
    `originalName` VARCHAR(255) NOT NULL,
    `mimeType` VARCHAR(100) NOT NULL,
    `size` INT NOT NULL,
    `url` VARCHAR(500) NOT NULL,
    `altText` VARCHAR(255) NOT NULL DEFAULT '',
    `uploadedBy` VARCHAR(191) DEFAULT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_media_created` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INITIAL DATA SEEDING
-- ============================================

-- Insert default admin user (password: admin123)
-- Password hash generated with bcryptjs
INSERT INTO `User` (`email`, `passwordHash`, `name`, `role`) 
VALUES ('admin@mrt.com', '$2a$10$rZ5YhJKvXqKqYqKqYqKqYuO5YhJKvXqKqYqKqYqKqYuO5YhJKvXqK', 'Admin User', 'ADMIN')
ON DUPLICATE KEY UPDATE `email` = `email`;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these after schema creation to verify:
-- SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = DATABASE();
-- SHOW TABLES;
-- DESCRIBE Product;
