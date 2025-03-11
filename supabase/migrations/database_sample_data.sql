-- RankStudy Sample Data
-- This file contains sample data for the database schema

-- Sample data for ranks
INSERT INTO public.ranks (id, name, imageUrl, "order") VALUES
('11111111-1111-1111-1111-111111111111', 'E-1', 'https://example.com/ranks/e1.png', 1),
('22222222-2222-2222-2222-222222222222', 'E-2', 'https://example.com/ranks/e2.png', 2),
('33333333-3333-3333-3333-333333333333', 'E-3', 'https://example.com/ranks/e3.png', 3),
('44444444-4444-4444-4444-444444444444', 'E-4', 'https://example.com/ranks/e4.png', 4),
('55555555-5555-5555-5555-555555555555', 'E-5', 'https://example.com/ranks/e5.png', 5);

-- Sample data for chevrons
INSERT INTO public.chevrons (id, rank, image_url, description, active) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Seaman Recruit', 'https://example.com/chevrons/sr.png', 'Seaman Recruit Chevron', true),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Seaman Apprentice', 'https://example.com/chevrons/sa.png', 'Seaman Apprentice Chevron', true),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Seaman', 'https://example.com/chevrons/sn.png', 'Seaman Chevron', true),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Petty Officer Third Class', 'https://example.com/chevrons/po3.png', 'Petty Officer Third Class Chevron', true),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Petty Officer Second Class', 'https://example.com/chevrons/po2.png', 'Petty Officer Second Class Chevron', true);

-- Sample data for insignias
INSERT INTO public.insignias (id, rate, image_url, description, active) VALUES
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'IT', 'https://example.com/insignias/it.png', 'Information Systems Technician', true),
('gggggggg-gggg-gggg-gggg-gggggggggggg', 'ET', 'https://example.com/insignias/et.png', 'Electronics Technician', true),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'CTN', 'https://example.com/insignias/ctn.png', 'Cryptologic Technician Networks', true),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'IS', 'https://example.com/insignias/is.png', 'Intelligence Specialist', true),
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'OS', 'https://example.com/insignias/os.png', 'Operations Specialist', true);

-- Sample data for profiles
INSERT INTO public.profiles (id, username, full_name, avatar_url, bio, preferences, rank, rate, duty_station, years_of_service, specializations, awards, chevron_id, is_admin, email) VALUES
('user1-uuid-1111-1111-111111111111', 'sailor1', 'John Doe', 'https://example.com/avatars/john.png', 'Navy IT specialist with 5 years of experience', '{"theme": "dark", "notifications": true}', 'E-4', 'IT', 'San Diego', '5', 'Network Administration, Cybersecurity', 'Navy Achievement Medal', 'dddddddd-dddd-dddd-dddd-dddddddddddd', false, 'john.doe@example.com'),
('user2-uuid-2222-2222-222222222222', 'sailor2', 'Jane Smith', 'https://example.com/avatars/jane.png', 'Electronics Technician with 3 years of experience', '{"theme": "light", "notifications": false}', 'E-3', 'ET', 'Norfolk', '3', 'Radar Systems, Communications', 'Good Conduct Medal', 'cccccccc-cccc-cccc-cccc-cccccccccccc', false, 'jane.smith@example.com'),
('admin-uuid-3333-3333-333333333333', 'admin', 'Admin User', 'https://example.com/avatars/admin.png', 'System Administrator', '{"theme": "dark", "notifications": true}', 'E-5', 'IT', 'Washington DC', '8', 'System Administration, Database Management', 'Navy Commendation Medal', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', true, 'admin@example.com');

-- Sample data for flashcards
INSERT INTO public.flashcards (id, title, description, cards, user_id, metadata, last_studied_at, completed_count, current_cycle) VALUES
('flash1-uuid-1111-1111-111111111111', 'Navy Terminology', 'Common Navy terms and definitions', '[{"front": "What is a bulkhead?", "back": "A wall on a ship"}, {"front": "What is the deck?", "back": "The floor on a ship"}, {"front": "What is the overhead?", "back": "The ceiling on a ship"}]', 'user1-uuid-1111-1111-111111111111', '{"tags": ["navy", "terminology"]}', '2025-02-25T12:00:00Z', 5, 2),
('flash2-uuid-2222-2222-222222222222', 'Navy Ranks', 'Navy rank structure and insignias', '[{"front": "What rank is an E-1?", "back": "Seaman Recruit"}, {"front": "What rank is an E-5?", "back": "Petty Officer Second Class"}, {"front": "What rank is an O-1?", "back": "Ensign"}]', 'user1-uuid-1111-1111-111111111111', '{"tags": ["navy", "ranks"]}', '2025-02-26T14:30:00Z', 3, 1),
('flash3-uuid-3333-3333-333333333333', 'IT Fundamentals', 'Basic IT concepts and terminology', '[{"front": "What is RAM?", "back": "Random Access Memory"}, {"front": "What is a firewall?", "back": "A network security device that monitors and filters incoming and outgoing network traffic"}, {"front": "What is an IP address?", "back": "A numerical label assigned to each device connected to a computer network"}]', 'user2-uuid-2222-2222-222222222222', '{"tags": ["it", "fundamentals"]}', '2025-02-27T09:15:00Z', 2, 1);

-- Sample data for summarizer
INSERT INTO public.summarizer (id, user_id, title, content, format, original_text, tags) VALUES
('summ1-uuid-1111-1111-111111111111', 'user1-uuid-1111-1111-111111111111', 'Navy Uniform Regulations', 'This document outlines the proper wear of Navy uniforms including: 1) Service Dress Blues, 2) Service Khakis, 3) Navy Working Uniform (NWU)', 'bullet', 'The United States Navy Uniform Regulations serve as the official guide to proper uniform wear for all Navy personnel. This comprehensive document details the proper wear of Service Dress Blues, which are worn for formal occasions. Service Khakis are the daily working uniform for officers and chief petty officers. The Navy Working Uniform (NWU) is the standard working uniform for all sailors.', ARRAY['navy', 'uniforms', 'regulations']),
('summ2-uuid-2222-2222-222222222222', 'user2-uuid-2222-2222-222222222222', 'Basic Electronics Principles', 'Key concepts: 1) Ohm''s Law: V=IR, 2) Kirchhoff''s Laws for circuit analysis, 3) Series vs Parallel circuits', 'bullet', 'Basic electronics principles form the foundation of all electronic systems. Ohm''s Law (V=IR) defines the relationship between voltage, current, and resistance. Kirchhoff''s Laws are essential for analyzing complex circuits. Understanding the differences between series and parallel circuits is crucial for proper circuit design and troubleshooting.', ARRAY['electronics', 'fundamentals']),
('summ3-uuid-3333-3333-333333333333', 'admin-uuid-3333-3333-333333333333', 'Network Security Best Practices', 'Essential security measures: 1) Regular password updates, 2) Two-factor authentication, 3) Network segmentation, 4) Regular security audits', 'bullet', 'Network security best practices are essential for protecting sensitive information. Regular password updates prevent unauthorized access. Two-factor authentication adds an extra layer of security. Network segmentation limits the spread of security breaches. Regular security audits identify and address vulnerabilities before they can be exploited.', ARRAY['security', 'network', 'best practices']);

-- Sample data for quizzes
INSERT INTO public.quizzes (id, user_id, title, description, questions) VALUES
('quiz1-uuid-1111-1111-111111111111', 'user1-uuid-1111-1111-111111111111', 'Navy Ranks Quiz', 'Test your knowledge of Navy ranks and insignias', '[{"question": "What is the rank of an E-4 in the Navy?", "options": ["Seaman", "Petty Officer Third Class", "Petty Officer Second Class", "Petty Officer First Class"], "answer": 1}, {"question": "What is the rank of an O-3 in the Navy?", "options": ["Ensign", "Lieutenant Junior Grade", "Lieutenant", "Lieutenant Commander"], "answer": 2}, {"question": "What is the rank of an E-7 in the Navy?", "options": ["Petty Officer First Class", "Chief Petty Officer", "Senior Chief Petty Officer", "Master Chief Petty Officer"], "answer": 1}]'),
('quiz2-uuid-2222-2222-222222222222', 'user2-uuid-2222-2222-222222222222', 'Basic Electronics Quiz', 'Test your knowledge of basic electronics principles', '[{"question": "What is Ohm''s Law?", "options": ["V=IR", "P=IV", "F=ma", "E=mc²"], "answer": 0}, {"question": "What is the unit of electrical resistance?", "options": ["Volt", "Ampere", "Ohm", "Watt"], "answer": 2}, {"question": "What does AC stand for in electronics?", "options": ["Alternating Current", "Ampere Current", "Actual Current", "Accumulated Charge"], "answer": 0}]'),
('quiz3-uuid-3333-3333-333333333333', 'admin-uuid-3333-3333-333333333333', 'Network Security Quiz', 'Test your knowledge of network security concepts', '[{"question": "What is a firewall?", "options": ["A physical barrier", "A network security device", "A type of computer virus", "A backup system"], "answer": 1}, {"question": "What does VPN stand for?", "options": ["Very Private Network", "Virtual Private Network", "Visual Processing Node", "Verified Protocol Network"], "answer": 1}, {"question": "What is phishing?", "options": ["A type of fishing", "A network protocol", "A social engineering attack", "A hardware component"], "answer": 2}]');

-- Sample data for user_activities
INSERT INTO public.user_activities (id, user_id, activity_type, content_id, content_type, content_title, created_at) VALUES
('act1-uuid-1111-1111-111111111111', 'user1-uuid-1111-1111-111111111111', 'quiz_completion', 'quiz1-uuid-1111-1111-111111111111', 'quiz', 'Navy Ranks Quiz', '2025-02-25T10:30:00Z'),
('act2-uuid-2222-2222-222222222222', 'user1-uuid-1111-1111-111111111111', 'flashcard_study', 'flash1-uuid-1111-1111-111111111111', 'flashcard', 'Navy Terminology', '2025-02-25T14:45:00Z'),
('act3-uuid-3333-3333-333333333333', 'user2-uuid-2222-2222-222222222222', 'content_creation', 'summ2-uuid-2222-2222-222222222222', 'summarizer', 'Basic Electronics Principles', '2025-02-26T09:15:00Z'),
('act4-uuid-4444-4444-444444444444', 'user2-uuid-2222-2222-222222222222', 'quiz_completion', 'quiz2-uuid-2222-2222-222222222222', 'quiz', 'Basic Electronics Quiz', '2025-02-26T11:20:00Z'),
('act5-uuid-5555-5555-555555555555', 'admin-uuid-3333-3333-333333333333', 'content_creation', 'quiz3-uuid-3333-3333-333333333333', 'quiz', 'Network Security Quiz', '2025-02-27T08:45:00Z');

-- Sample data for app_settings
INSERT INTO public.app_settings (id, key, value, created_at, updated_at) VALUES
('set1-uuid-1111-1111-111111111111', 'maintenance_mode', 'false', '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),
('set2-uuid-2222-2222-222222222222', 'version', '1.0.0', '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),
('set3-uuid-3333-3333-333333333333', 'max_flashcards_per_user', '100', '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),
('set4-uuid-4444-4444-444444444444', 'max_quizzes_per_user', '50', '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),
('set5-uuid-5555-5555-555555555555', 'max_summaries_per_user', '200', '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z');

-- Sample data for reminder_settings
INSERT INTO public.reminder_settings (id, user_id, email_enabled, notification_time, frequency) VALUES
('rem1-uuid-1111-1111-111111111111', 'user1-uuid-1111-1111-111111111111', true, '08:00:00', 'daily'),
('rem2-uuid-2222-2222-222222222222', 'user2-uuid-2222-2222-222222222222', true, '18:00:00', 'weekly'),
('rem3-uuid-3333-3333-333333333333', 'admin-uuid-3333-3333-333333333333', false, '12:00:00', 'monthly');

-- Sample data for daily_active_users
INSERT INTO public.daily_active_users (id, user_id, date, session_count) VALUES
('dau1-uuid-1111-1111-111111111111', 'user1-uuid-1111-1111-111111111111', '2025-02-25', 3),
('dau2-uuid-2222-2222-222222222222', 'user2-uuid-2222-2222-222222222222', '2025-02-25', 2),
('dau3-uuid-3333-3333-333333333333', 'admin-uuid-3333-3333-333333333333', '2025-02-25', 1),
('dau4-uuid-4444-4444-444444444444', 'user1-uuid-1111-1111-111111111111', '2025-02-26', 2),
('dau5-uuid-5555-5555-555555555555', 'user2-uuid-2222-2222-222222222222', '2025-02-26', 1);

-- Sample data for user_retention
INSERT INTO public.user_retention (id, user_id, first_seen_date, last_seen_date, visit_count) VALUES
('ret1-uuid-1111-1111-111111111111', 'user1-uuid-1111-1111-111111111111', '2025-01-15', '2025-02-26', 25),
('ret2-uuid-2222-2222-222222222222', 'user2-uuid-2222-2222-222222222222', '2025-01-20', '2025-02-26', 18),
('ret3-uuid-3333-3333-333333333333', 'admin-uuid-3333-3333-333333333333', '2025-01-01', '2025-02-27', 40);

-- Sample data for platform_usage
INSERT INTO public.platform_usage (id, user_id, device_type, browser, platform, session_start, session_end) VALUES
('plat1-uuid-1111-1111-111111111111', 'user1-uuid-1111-1111-111111111111', 'desktop', 'Chrome', 'Windows', '2025-02-25T10:00:00Z', '2025-02-25T11:30:00Z'),
('plat2-uuid-2222-2222-222222222222', 'user1-uuid-1111-1111-111111111111', 'mobile', 'Safari', 'iOS', '2025-02-25T14:00:00Z', '2025-02-25T14:45:00Z'),
('plat3-uuid-3333-3333-333333333333', 'user2-uuid-2222-2222-222222222222', 'desktop', 'Firefox', 'macOS', '2025-02-26T09:00:00Z', '2025-02-26T10:30:00Z'),
('plat4-uuid-4444-4444-444444444444', 'admin-uuid-3333-3333-333333333333', 'desktop', 'Chrome', 'Windows', '2025-02-27T08:30:00Z', '2025-02-27T12:00:00Z');

-- Sample data for learning_path_progress
INSERT INTO public.learning_path_progress (id, user_id, path_id, current_step, total_steps, completed_at) VALUES
('lpp1-uuid-1111-1111-111111111111', 'user1-uuid-1111-1111-111111111111', 'path1-uuid-1111-1111-111111111111', 3, 5, NULL),
('lpp2-uuid-2222-2222-222222222222', 'user2-uuid-2222-2222-222222222222', 'path2-uuid-2222-2222-222222222222', 2, 4, NULL),
('lpp3-uuid-3333-3333-333333333333', 'admin-uuid-3333-3333-333333333333', 'path1-uuid-1111-1111-111111111111', 5, 5, '2025-02-20T15:30:00Z');