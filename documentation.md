
# EduChain Multi-Tenant LMS Documentation

## 1. Multi-Tenant Isolation Strategy
EduChain implements **Isolated Data Multi-Tenancy** using Supabase's Row Level Security (RLS).
- **Core Column**: Every academic table (Classes, Students, Results, etc.) contains an `institution_id` column.
- **Enforcement**: Postgres RLS policies ensure that any `SELECT`, `INSERT`, `UPDATE`, or `DELETE` query automatically filters data based on the authenticated user's `institution_id` stored in their profile.
- **Super Admin**: A global policy checks the `profiles.role` to allow cross-tenant access for platform management.

## 2. CRUD Query Examples (Frontend)

### Fetching Students for a Tenant
```typescript
const { data, error } = await supabase
  .from('student_details')
  .select('*, profiles(full_name, email)')
  .eq('institution_id', myInstitutionId);
```

### Recording Attendance
```typescript
const { error } = await supabase
  .from('attendance')
  .insert(attendanceArray.map(att => ({
    ...att,
    institution_id: myInstitutionId,
    recorded_by: auth.uid()
  })));
```

## 3. Report Card PDF Logic
To generate report cards, we use a structured React component that presents the data (Grades, GPA, Remarks) and trigger the browser's print functionality or use `jspdf`.
- **Backend**: Aggregate `exam_results` joined with `subjects`.
- **Calculation**: Percentage = (Marks Obtained / Total Marks) * 100. Grade = Case-Switch on Percentage.

## 4. Deployment Guide

### Supabase Setup
1. Create a new project on [Supabase](https://supabase.com).
2. Run the provided `schema.sql` in the SQL Editor.
3. Enable Email Auth and create your first Super Admin user.
4. Set up Storage buckets: `assignments`, `report-cards`, `submissions`.

### Frontend Deployment (Vercel)
1. Fork/Push your code to GitHub.
2. Connect Vercel to the repository.
3. Add Environment Variables:
   - `SUPABASE_URL`: Your project URL.
   - `SUPABASE_ANON_KEY`: Your project anon/public key.
4. Deploy!

### Post-Deployment
- Configure subdomains (optional) to allow institutions to access `schoolname.educhain.com`.
- Set up automated backups via Supabase Dashboard.
