-- NeuroPrep AI Database Setup Script
-- Run this script to create the MySQL database and tables

-- Create database
CREATE DATABASE IF NOT EXISTS neuroprep_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE neuroprep_ai;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255),
    google_id VARCHAR(255),
    linkedin_id VARCHAR(255),
    twitter_id VARCHAR(255),
    name VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(100),
    level VARCHAR(50),
    is_pro BOOLEAN DEFAULT FALSE,
    sessions_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_google_id (google_id),
    INDEX idx_linkedin_id (linkedin_id),
    INDEX idx_twitter_id (twitter_id)
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36),
    role VARCHAR(100),
    difficulty INT,
    mode VARCHAR(50),
    status ENUM('active', 'completed', 'abandoned') DEFAULT 'active',
    questions_asked INT DEFAULT 0,
    avg_score DECIMAL(5,2),
    technical_score DECIMAL(5,2),
    eq_score DECIMAL(5,2),
    authenticity_score DECIMAL(5,2),
    session_data JSON,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_started_at (started_at)
);

-- Session questions table
CREATE TABLE IF NOT EXISTS session_questions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    session_id VARCHAR(36),
    question_text TEXT,
    user_response TEXT,
    technical_score DECIMAL(5,2),
    response_time INT,
    difficulty INT,
    topic VARCHAR(100),
    question_type VARCHAR(50),
    asked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
    INDEX idx_session_id (session_id),
    INDEX idx_topic (topic),
    INDEX idx_asked_at (asked_at)
);

-- Biometrics table
CREATE TABLE IF NOT EXISTS biometrics (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    session_id VARCHAR(36),
    stress_level DECIMAL(3,2),
    heart_rate INT,
    emotion VARCHAR(50),
    gaze_variance DECIMAL(5,4),
    voice_tremor DECIMAL(5,4),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
    INDEX idx_session_id (session_id),
    INDEX idx_recorded_at (recorded_at)
);

-- Express session store table
CREATE TABLE IF NOT EXISTS express_sessions (
    session_id VARCHAR(128) COLLATE utf8mb4_bin NOT NULL,
    expires INT(11) UNSIGNED NOT NULL,
    data MEDIUMTEXT COLLATE utf8mb4_bin,
    PRIMARY KEY (session_id)
);

-- Insert sample data for testing
INSERT INTO users (email, name, role, level, is_pro) VALUES 
('demo@neuroprep.ai', 'Demo User', 'Software Engineer', 'Senior', TRUE),
('test@example.com', 'Test User', 'Frontend Engineer', 'Mid-Level', FALSE);

-- Create indexes for performance
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_sessions_completed_at ON sessions(completed_at);
CREATE INDEX idx_questions_technical_score ON session_questions(technical_score);
CREATE INDEX idx_biometrics_stress_level ON biometrics(stress_level);

-- Show table structure
SHOW TABLES;
DESCRIBE users;
DESCRIBE sessions;
DESCRIBE session_questions;
DESCRIBE biometrics;