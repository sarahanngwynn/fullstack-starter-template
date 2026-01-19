import React, { useMemo, useState } from "react";
import { trpc } from "../utils/trpc"; // <-- adjust path if your trpc client lives elsewhere

type ChildInput = { name: string; age: number };

type Props = {
  onAuthed?: (token: string) => void;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function ParentAuthCard({ onAuthed }: Props) {
  const [mode, setMode] = useState<"signup" | "signin">("signup");

  const [email, setEmail] = useState("");
  const [parentName, setParentName] = useState("");
  const [password, setPassword] = useState("");

  const [children, setChildren] = useState<ChildInput[]>([
    { name: "", age: 3 },
  ]);

  const emailNormalized = useMemo(() => normalizeEmail(email), [email]);

  const checkEmailQuery = trpc.parents.checkEmail.useQuery(
    { email: emailNormalized },
    {
      enabled: emailNormalized.length > 3 && emailNormalized.includes("@"),
      retry: false,
    }
  );

  const signUp = trpc.parents.signUp.useMutation();
  const signIn = trpc.parents.signIn.useMutation();

  const emailExists = checkEmailQuery.data?.exists;

  function persistToken(token: string) {
    localStorage.setItem("parent_access_token", token);
    onAuthed?.(token);
  }

  function addChildRow() {
    setChildren((prev) => [...prev, { name: "", age: 3 }]);
  }

  function removeChildRow(index: number) {
    setChildren((prev) => prev.filter((_, i) => i !== index));
  }

  function updateChild(index: number, patch: Partial<ChildInput>) {
    setChildren((prev) =>
      prev.map((c, i) => (i === index ? { ...c, ...patch } : c))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const cleanedEmail = emailNormalized;

    if (!cleanedEmail) return;

    // If you want: auto-switch based on email existence
    // (super nice UX)
    if (emailExists === true) setMode("signin");
    if (emailExists === false) setMode("signup");

    try {
      if (mode === "signup") {
        const cleanedChildren = children
          .map((c) => ({
            name: c.name.trim(),
            age: Number.isFinite(c.age) ? c.age : 0,
          }))
          .filter((c) => c.name.length > 0);

        const res = await signUp.mutateAsync({
          parentName: parentName.trim(),
          email: cleanedEmail,
          password,
          children: cleanedChildren,
        });

        persistToken(res.accessToken);
      } else {
        const res = await signIn.mutateAsync({
          email: cleanedEmail,
          password,
        });

        persistToken(res.accessToken);
      }
    } catch {
      // errors are shown below from mutation error messages
    }
  }

  const busy = signUp.isPending || signIn.isPending;

  return (
    <div
      style={{
        maxWidth: 520,
        margin: "0 auto",
        padding: 16,
        border: "1px solid #ddd",
        borderRadius: 12,
      }}
    >
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button
          type="button"
          onClick={() => setMode("signup")}
          disabled={busy}
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid #ccc",
            background: mode === "signup" ? "#eee" : "#fff",
            cursor: "pointer",
          }}
        >
          Sign up
        </button>
        <button
          type="button"
          onClick={() => setMode("signin")}
          disabled={busy}
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid #ccc",
            background: mode === "signin" ? "#eee" : "#fff",
            cursor: "pointer",
          }}
        >
          Sign in
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: 6 }}>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            disabled={busy}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 10,
              border: "1px solid #ccc",
              marginTop: 6,
            }}
          />
        </label>

        <div style={{ fontSize: 13, marginBottom: 10, minHeight: 18 }}>
          {checkEmailQuery.isFetching && emailNormalized ? (
            <span>Checking email…</span>
          ) : emailExists === true ? (
            <span>
              Account found — you can{" "}
              <button
                type="button"
                onClick={() => setMode("signin")}
                disabled={busy}
                style={{ border: "none", background: "transparent", color: "#06c", cursor: "pointer", padding: 0 }}
              >
                sign in
              </button>
              .
            </span>
          ) : emailExists === false && emailNormalized ? (
            <span>
              No account yet — you can{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                disabled={busy}
                style={{ border: "none", background: "transparent", color: "#06c", cursor: "pointer", padding: 0 }}
              >
                create one
              </button>
              .
            </span>
          ) : null}
        </div>

        {mode === "signup" && (
          <>
            <label style={{ display: "block", marginBottom: 10 }}>
              Parent name
              <input
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                autoComplete="name"
                disabled={busy}
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 10,
                  border: "1px solid #ccc",
                  marginTop: 6,
                }}
              />
            </label>
          </>
        )}

        <label style={{ display: "block", marginBottom: 12 }}>
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            disabled={busy}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 10,
              border: "1px solid #ccc",
              marginTop: 6,
            }}
          />
        </label>

        {mode === "signup" && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Children</div>

            {children.map((c, idx) => (
              <div
                key={idx}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 120px 90px",
                  gap: 8,
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <input
                  placeholder="Child name"
                  value={c.name}
                  onChange={(e) => updateChild(idx, { name: e.target.value })}
                  disabled={busy}
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    border: "1px solid #ccc",
                  }}
                />
                <input
                  placeholder="Age"
                  value={c.age}
                  onChange={(e) =>
                    updateChild(idx, { age: Number(e.target.value) })
                  }
                  type="number"
                  min={0}
                  max={25}
                  disabled={busy}
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    border: "1px solid #ccc",
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeChildRow(idx)}
                  disabled={busy || children.length === 1}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid #ccc",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                  title={children.length === 1 ? "Keep at least one row" : "Remove"}
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addChildRow}
              disabled={busy}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ccc",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              + Add another child
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={busy || !emailNormalized || !password || (mode === "signup" && !parentName.trim())}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 12,
            border: "1px solid #333",
            background: "#111",
            color: "white",
            cursor: "pointer",
            opacity:
              busy || !emailNormalized || !password || (mode === "signup" && !parentName.trim())
                ? 0.7
                : 1,
          }}
        >
          {busy ? "Working…" : mode === "signup" ? "Create account" : "Sign in"}
        </button>

        <div style={{ marginTop: 12, minHeight: 18, color: "#b00020" }}>
          {signUp.error?.message || signIn.error?.message || ""}
        </div>
      </form>

      <div style={{ marginTop: 10, fontSize: 12, color: "#666" }}>
        Token is stored as <code>parent_access_token</code> in localStorage.
      </div>
    </div>
  );
}
