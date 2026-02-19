
export type UserRole = 'super_admin' | 'institution_admin' | 'teacher' | 'student';

export interface Institution {
  id: string;
  name: string;
  subdomain: string;
  logo_url?: string;
  address?: string;
  is_active: boolean;
  created_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  billing_cycle: 'monthly' | 'yearly';
}

export interface Profile {
  id: string;
  institution_id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
}

export interface AcademicSession {
  id: string;
  name: string;
  is_current: boolean;
}

export interface Class {
  id: string;
  name: string;
}

export interface Section {
  id: string;
  class_id: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
}

export interface Student {
  id: string;
  profile_id: string;
  full_name: string;
  student_id_no: string;
  class_id: string;
  section_id: string;
  parent_contact: string;
  class_name?: string;
  section_name?: string;
}

export interface Teacher {
  id: string;
  profile_id: string;
  full_name: string;
  employee_id: string;
  specialization: string;
  joined_date: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
}

export interface FeeRecord {
  id: string;
  title: string;
  amount: number;
  amount_paid: number;
  status: 'paid' | 'pending' | 'partial';
  due_date: string;
}

export interface Exam {
  id: string;
  title: string;
  date: string;
  total_marks: number;
  class_id: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  due_date: string;
  subject: string;
  status: 'open' | 'closed';
}
