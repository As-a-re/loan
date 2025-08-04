-- Insert sample profiles (these would normally be created via auth signup)
INSERT INTO profiles (id, full_name, phone, rating, total_loans_given, total_loans_received, total_amount_lent, total_amount_borrowed) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Sarah Johnson', '+233 24 123 4567', 4.8, 5, 2, 2500.00, 800.00),
('550e8400-e29b-41d4-a716-446655440002', 'Michael Asante', '+233 24 234 5678', 4.5, 3, 1, 1500.00, 500.00),
('550e8400-e29b-41d4-a716-446655440003', 'Grace Osei', '+233 24 345 6789', 4.7, 2, 3, 1000.00, 1200.00),
('550e8400-e29b-41d4-a716-446655440004', 'James Mensah', '+233 24 456 7890', 4.9, 4, 1, 2000.00, 600.00);

-- Insert sample savings groups
INSERT INTO savings_groups (id, name, description, target_amount, current_amount, contribution_frequency, contribution_amount, created_by) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Family Savings Circle', 'Saving for family emergencies and celebrations', 5000.00, 2450.00, 'weekly', 50.00, '550e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440002', 'Business Growth Fund', 'Supporting small business expansion in our community', 10000.00, 3200.00, 'monthly', 200.00, '550e8400-e29b-41d4-a716-446655440002'),
('660e8400-e29b-41d4-a716-446655440003', 'Education Support Group', 'Helping members pay for education expenses', 8000.00, 1800.00, 'bi-weekly', 75.00, '550e8400-e29b-41d4-a716-446655440003');

-- Insert sample group members
INSERT INTO group_members (group_id, user_id, is_admin) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', true),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', false),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', false),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', true),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', false),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', true);

-- Insert sample loan offers
INSERT INTO loan_offers (id, lender_id, amount, interest_rate, repayment_period, description) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 1000.00, 8.00, 6, 'Quick loan for small business needs. Flexible terms available.'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 500.00, 10.00, 3, 'Emergency loan available. Fast approval process.');

-- Insert sample loan requests
INSERT INTO loan_requests (id, borrower_id, amount, purpose, repayment_plan) VALUES
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 800.00, 'School fees for my daughter', 'Monthly payments over 8 months'),
('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 1200.00, 'Expand my tailoring business', 'Weekly payments over 12 weeks');

-- Insert sample contributions
INSERT INTO contributions (group_id, user_id, amount, contribution_date) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 50.00, '2024-01-15'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 50.00, '2024-01-15'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 200.00, '2024-01-01'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 200.00, '2024-01-01');
