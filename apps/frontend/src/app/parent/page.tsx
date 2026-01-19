"use client";
import React, { useEffect, useState } from "react";

export default function ParentDashboard() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("parent_access_token"));
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1>Parent Portal</h1>

      {!token ? (
        <>
          <p>You’re not signed in.</p>
          <a href="/parent/auth">Go to sign in</a>
        </>
      ) : (
        <>
          <p>✅ Signed in (token stored)</p>
          <p style={{ fontSize: 12, color: "#666" }}>
            Next: we’ll call <code>parents.me</code> and show real parent data here.
          </p>
        </>
      )}
    </div>
  );
}
