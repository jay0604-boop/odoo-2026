-- ⚠️ COMPLETE RESET SCRIPT ⚠️
-- Instructions: Open a NEW blank query in Supabase, paste this entire script, and run it.
-- This will wipe the custom tables clean, recreate them perfectly (with acquisition_cost), and insert the seed data.

-- ==========================================
-- 1. CLEAN SLATE (DROP EVERYTHING EXISTING)
-- ==========================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS maintenance_requests CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS allocations CASCADE;
DROP TABLE IF EXISTS assets CASCADE;
DROP TABLE IF EXISTS asset_categories CASCADE;
-- departments has a circular dependency with profiles, CASCADE handles it
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TYPE IF EXISTS employee_role CASCADE;
DROP TYPE IF EXISTS account_status CASCADE;
DROP TYPE IF EXISTS asset_status CASCADE;
DROP TYPE IF EXISTS allocation_status CASCADE;
DROP TYPE IF EXISTS booking_status CASCADE;
DROP TYPE IF EXISTS maintenance_status CASCADE;

-- ==========================================
-- 2. CREATE EXTENSIONS & ENUMS
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE employee_role AS ENUM ('Admin', 'Asset Manager', 'Department Head', 'Employee');
CREATE TYPE account_status AS ENUM ('Active', 'Inactive');
CREATE TYPE asset_status AS ENUM ('Available', 'Allocated', 'Reserved', 'Under Maintenance', 'Lost', 'Retired', 'Disposed');
CREATE TYPE allocation_status AS ENUM ('Active', 'Returned', 'Overdue');
CREATE TYPE booking_status AS ENUM ('Upcoming', 'Ongoing', 'Completed', 'Cancelled');
CREATE TYPE maintenance_status AS ENUM ('Pending', 'In Progress', 'Resolved');

-- ==========================================
-- 3. CREATE TABLES
-- ==========================================
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    parent_id UUID REFERENCES departments(id),
    status account_status DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    role employee_role DEFAULT 'Employee',
    status account_status DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE departments ADD COLUMN head_id UUID REFERENCES profiles(id) ON DELETE SET NULL;

CREATE TABLE asset_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    prefix VARCHAR(10) NOT NULL,
    custom_fields JSONB DEFAULT '[]'::jsonb,
    bookable BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_tag VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES asset_categories(id) ON DELETE RESTRICT,
    serial_number VARCHAR(100),
    acquisition_date DATE,
    acquisition_cost NUMERIC, -- Here is our missing column!
    condition VARCHAR(50),
    location VARCHAR(255),
    status asset_status DEFAULT 'Available',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    holder_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    allocated_date DATE DEFAULT CURRENT_DATE,
    expected_return_date DATE,
    status allocation_status DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    requester_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status booking_status DEFAULT 'Upcoming',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE maintenance_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    requester_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    issue_description TEXT NOT NULL,
    priority VARCHAR(50) DEFAULT 'Medium',
    status maintenance_status DEFAULT 'Pending',
    technician_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    entity VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 4. ROW LEVEL SECURITY (RLS) SETUP
-- ==========================================
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated full access" ON departments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access" ON profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access" ON asset_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access" ON assets FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access" ON allocations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access" ON bookings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access" ON maintenance_requests FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access" ON activity_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==========================================
-- 5. TRIGGERS
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, status)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email, 'Employee', 'Active');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- 6. SEED DATA (Populate the database)
-- ==========================================
INSERT INTO departments (name, status) VALUES
('Engineering', 'Active'),
('IT Support', 'Active'),
('Facilities', 'Active'),
('Human Resources', 'Active');

INSERT INTO asset_categories (name, prefix, bookable) VALUES
('Laptop', 'LT', false),
('Vehicle', 'VH', true),
('Meeting Room', 'RM', true),
('Peripherals', 'PR', false);

DO $$
DECLARE
    cat_laptop UUID;
    cat_vehicle UUID;
    cat_room UUID;
BEGIN
    SELECT id INTO cat_laptop FROM asset_categories WHERE name = 'Laptop' LIMIT 1;
    SELECT id INTO cat_vehicle FROM asset_categories WHERE name = 'Vehicle' LIMIT 1;
    SELECT id INTO cat_room FROM asset_categories WHERE name = 'Meeting Room' LIMIT 1;

    INSERT INTO assets (asset_tag, name, category_id, serial_number, acquisition_date, condition, location, status) VALUES
    ('AF-0012', 'Dell XPS 15', cat_laptop, 'SN-123456', '2025-01-15', 'Good', 'Desk 4A', 'Allocated'),
    ('AF-0088', 'Ford Transit Van', cat_vehicle, 'VIN-987654', '2024-05-10', 'Fair', 'Garage A', 'Available'),
    ('AF-0100', 'Conference Room A1', cat_room, NULL, NULL, 'New', 'Building 1, Floor 2', 'Available');
END $$;
