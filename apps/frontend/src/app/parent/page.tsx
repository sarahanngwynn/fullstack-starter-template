"use client";

import React, { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc"; // adjust path if needed

export default function ParentDashboard() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("parent_access_token"));
  }, []);

  // If you want to start showing real data now:
  const meQuery = trpc.parents.me.useQuery(undefined, {
    enabled: !!token, // only call when token exists
  });

  if (!token) {
    return (
      <div style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
        <h1>Parent Portal</h1>
        <p>You’re not signed in.</p>
        <a href="/parent/auth">Go to sign in</a>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1>Parent Portal</h1>
      <p>✅ Signed in (token found)</p>

      {meQuery.isLoading && <p>Loading your profile…</p>}

      {meQuery.error && (
        <div style={{ marginTop: 12 }}>
          <p style={{ color: "crimson" }}>
            Couldn’t load your profile: {meQuery.error.message}
          </p>
          <p style={{ fontSize: 12, color: "#666" }}>
            If this says “UNAUTHORIZED”, it usually means the token wasn’t set
            during sign-in, or the backend context isn’t decoding parent tokens yet.
          </p>
        </div>
      )}

      {meQuery.data && (
        <div style={{ marginTop: 16 }}>
          <h2 style={{ marginBottom: 6 }}>Welcome, {meQuery.data.parentName}</h2>
          <p style={{ marginTop: 0, color: "#555" }}>{meQuery.data.email}</p>

          <h3 style={{ marginTop: 18 }}>Children</h3>
          {meQuery.data.children.length === 0 ? (
            <p style={{ color: "#666" }}>No children added yet.</p>
          ) : (
            <ul>
              {meQuery.data.children.map(
  (c: { id: string; name: string; age: number }) => (
    <li key={c.id}>
      {c.name} — {c.age}
    </li>
  )
)}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

