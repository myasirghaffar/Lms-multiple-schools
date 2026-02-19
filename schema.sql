
-- SQL Schema Update for Super Admin functionality

-- 16. SUBSCRIPTION PLANS
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    features JSONB DEFAULT '[]',
    billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'yearly')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. INSTITUTION SUBSCRIPTIONS
CREATE TABLE institution_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES subscription_plans(id),
    status TEXT CHECK (status IN ('active', 'past_due', 'canceled')),
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- REFINED RLS POLICIES FOR SUPER ADMIN
-- Enable RLS on new tables
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE institution_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow Super Admin full access to everything
CREATE POLICY super_admin_manage_institutions ON institutions 
FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin');

CREATE POLICY super_admin_manage_profiles ON profiles 
FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin');

CREATE POLICY super_admin_manage_plans ON subscription_plans 
FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin');

CREATE POLICY super_admin_manage_subscriptions ON institution_subscriptions 
FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin');

-- Tenant admins can view their own subscription
CREATE POLICY tenant_view_own_subscription ON institution_subscriptions
FOR SELECT USING (institution_id = get_my_institution());

-- Public view for active plans (for registration)
CREATE POLICY public_view_plans ON subscription_plans
FOR SELECT USING (true);
