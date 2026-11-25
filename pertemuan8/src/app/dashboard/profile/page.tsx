// File: src/app/dashboard/profile/page.tsx
import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

async function ProfileContent() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("praktikum_session");

  if (!sessionCookie) redirect("/login");

  const userData = JSON.parse(sessionCookie.value);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-5 mb-6">
        <div>
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-2">
            PROFIL TERPROTEKSI
          </span>
          <h1 className="text-2xl font-bold text-slate-800">Profil Pengguna</h1>
        </div>
        <Link
          href="/dashboard"
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          &larr; Kembali ke Dashboard
        </Link>
      </div>

      <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 space-y-3 text-sm text-slate-700">
        <p><strong>Nama Lengkap:</strong> {userData.name}</p>
        <p><strong>NIM:</strong> {userData.nim || "-"}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Hak Akses:</strong> {userData.role}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <Suspense
        fallback={
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-sm text-slate-500">
            Memuat profil...
          </div>
        }
      >
        <ProfileContent />
      </Suspense>
    </main>
  );
}