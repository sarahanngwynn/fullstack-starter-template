"use client";

import React, { useEffect, useState } from "react";
import { trpc } from "../../../utils/trpc";

type Child = { id: string; name: string; age: number };

export default function ParentProfilePage() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("parent_access_token"));
  }, []);

  const meQuery = trpc.parents.me.useQuery(undefined, { enabled: !!token });

  if (!token) {
    return (
      <div style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
        <h1>Parent Profile</h1>
        <p>You’re not signed in.</p>
        <a href="/parent/auth">Go to sign in</a>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1>Parent Profile</h1>

      {meQuery.isLoading && <p>Loading…</p>}

      {meQuery.error && (
        <p style={{ color: "crimson" }}>
          Couldn’t load profile: {meQuery.error.message}
        </p>
      )}

      {meQuery.data && (
        <>
          <h2 style={{ marginTop: 12 }}>{meQuery.data.parentName}</h2>
          <p style={{ marginTop: 0, color: "#555" }}>{meQuery.data.email}</p>

          <h3 style={{ marginTop: 18 }}>Children</h3>
          {meQuery.data.children.length === 0 ? (
            <p style={{ color: "#666" }}>No children added yet.</p>
          ) : (
            <ul>
              {meQuery.data.children.map((c: Child) => (
                <li key={c.id}>
                  {c.name} — {c.age}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
