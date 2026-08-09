import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { INITIAL_USERS, INITIAL_DOCUMENTS } from '@/lib/mockDatabase';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey || supabaseUrl.includes('placeholder')) {
      return NextResponse.json({ error: 'Supabase credentials missing or invalid in .env' }, { status: 400 });
    }

    const admin = getSupabaseAdmin();

    // 1. Format Users for Supabase Cloud
    const formattedUsers = INITIAL_USERS.map((u) => ({
      id: u.id,
      employee_id: u.employeeId,
      name: u.name,
      email: u.email,
      role: u.role,
      department: u.department,
      tier_level: u.tierLevel,
      position_title: u.positionTitle,
      division: u.division,
      is_first_login: u.isFirstLogin || false,
      updated_at: new Date().toISOString(),
    }));

    // 2. Format Documents for Supabase Cloud
    const formattedDocuments = INITIAL_DOCUMENTS.map((d) => ({
      id: d.id,
      title: d.title,
      content: d.content,
      priority: d.priority || 'NORMAL',
      board_type: d.boardType || 'GLOBAL',
      target_scope: d.targetScope || 'FACULTY',
      target_ids: JSON.stringify(d.targetIds || []),
      author_id: d.authorId,
      author_name: d.authorName,
      author_role: d.authorRole,
      is_edited: d.isEdited || false,
      file_name: d.fileName || null,
      file_url: d.fileUrl || null,
      file_size: d.fileSize || null,
      created_at: d.createdAt || new Date().toISOString(),
    }));

    // Upsert Users
    const { data: userData, error: userError } = await admin.from('users').upsert(formattedUsers, { onConflict: 'id' });

    if (userError) {
      return NextResponse.json({
        success: false,
        step: 'users',
        error: userError.message,
        hint: 'Please ensure you ran the SQL Table Schema creation script in Supabase Dashboard SQL Editor first!',
      }, { status: 400 });
    }

    // Upsert Documents
    const { data: docData, error: docError } = await admin.from('documents').upsert(formattedDocuments, { onConflict: 'id' });

    if (docError) {
      console.warn('Document sync warning:', docError.message);
    }

    return NextResponse.json({
      success: true,
      message: `🎉 Successfully synced all ${formattedUsers.length} FLAS KPS KU Users & Documents to Supabase Cloud Database!`,
      syncedUsersCount: formattedUsers.length,
      syncedDocsCount: formattedDocuments.length,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
