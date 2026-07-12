-- AssetFlow Supabase PostgreSQL Schema
-- Instructions: Copy and paste this entire script into your Supabase SQL Editor and hit "Run".

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE employee_role AS ENUM ('Admin', 'Asset Manager', 'Department Head', 'Employee');
CREATE TYPE account_status AS ENUM ('Active', 'Inactive');
CREATE TYPE asset_status AS ENUM ('Available', 'Allocated', 'Reserved', 'Under Maintenance', 'Lost', 'Retired', 'Disposed');
CREATE TYPE allocation_status AS ENUM ('Active', 'Returned', 'Overdue');
CREATE TYPE booking_status AS ENUM ('Upcoming', 'Ongoing', 'Completed', 'Cancelled');
CREATE TYPE maintenance_status AS ENUM ('Pending', 'In Progress', 'Resolved');

-- 3. TABLES

-- Departments
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    parent_id UUID REFERENCES departments(id),
    status account_status DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles (Extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    role employee_role DEFAULT 'Employee',
    status account_status DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assign Department Head (Circular dependency resolution)
ALTER TABLE departments ADD COLUMN head_id UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- Asset Categories
CREATE TABLE asset_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    prefix VARCHAR(10) NOT NULL,
    custom_fields JSONB DEFAULT '[]'::jsonb,
    bookable BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assets
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_tag VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES asset_categories(id) ON DELETE RESTRICT,
    serial_number VARCHAR(100),
    acquisition_date DATE,
    acquisition_cost NUMERIC,
    condition VARCHAR(50),
    location VARCHAR(255),
    status asset_status DEFAULT 'Available',
    metadata JSONB DEFAULT '{}'::jsonb, -- Store custom field values here
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Allocations (Assignments of assets to people/departments)
CREATE TABLE allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    holder_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- Assuming assigned to person for now
    allocated_date DATE DEFAULT CURRENT_DATE,
    expected_return_date DATE,
    status allocation_status DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings (For shared resources)
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    requester_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status booking_status DEFAULT 'Upcoming',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Maintenance Requests
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

-- Activity Logs (Immutable Audit Trail)
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Who did it
    action VARCHAR(255) NOT NULL,
    entity VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 4. ROW LEVEL SECURITY (RLS) SETUP

-- Enable RLS on all tables
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Creating permissive policies for initial testing phase
-- (These allow any authenticated user to read/write for now, to ensure the UI wires up correctly)

CREATE POLICY "Allow authenticated full access" ON departments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access" ON profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access" ON asset_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access" ON assets FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access" ON allocations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access" ON bookings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access" ON maintenance_requests FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access" ON activity_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- 5. TRIGGERS (Automate profile creation on signup)
-- This creates a profile row whenever a new user signs up via Supabase Auth
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

-- END OF SCRIPT
