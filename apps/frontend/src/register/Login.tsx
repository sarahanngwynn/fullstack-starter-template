"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

/* ================= TYPES ================= */

type Kid = {
  name: string;
  dob: string | null; // YYYY-MM-DD
};

type Registration = {
  email?: string;
  password?: string;
  parentName?: string;
  kids?: Kid[];
  childrenOptions?: Array<{ id: string; label: string }>;
  userId?: string;
  sessionToken?: string;
  [key: string]: any;
};

type Props = {
  registration: Registration;
  setRegistration: React.Dispatch<React.SetStateAction<Registration>>;
  onAuthed?: () => void;
};

/* ============== TEMP tRPC STUB ============== */
/* Replace with real backend later */

function useFakeTrpc() {
  return {
    checkEmail: async (_email: string) => ({ exists: false }),

    signIn: async (_email: string, _password: string) => ({
      userId: "u1",
      sessionToken: "token",
      children: [
        { id: "c1", name: "Elsie", dob: "2019-05-12" },
        { id: "c2", name: "Oliver", dob: "2021-08-03" },
      ],
    }),

    signUp: async (_data: {
      parentName: string;
      email: string;
      password: string;
      kids: Kid[];
    }) => ({
      userId: "u1",
      sessionToken: "token",
    }),
  };
}

/* ================= COMPONENT ================= */

export default function Login({ registration, setRegistration, onAuthed }: Props) {
  const trpc = useFakeTrpc();

  const [mode, setMode] = React.useState<"email" | "login" | "register">("email");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const email = registration.email ?? "";
  const password = registration.password ?? "";
  const parentName = registration.parentName ?? "";

  const kids: Kid[] = Array.isArray(registration.kids)
    ? registration.kids
    : [{ name: "", dob: null }];

  const setEmail = (v: string) => setRegistration((p) => ({ ...p, email: v }));
  const setPassword = (v: string) => setRegistration((p) => ({ ...p, password: v }));
  const setParentName = (v: string) => setRegistration((p) => ({ ...p, parentName: v }));
  const setKids = (next: Kid[]) => setRegistration((p) => ({ ...p, kids: next }));

  const addKid = () => setKids([...kids, { name: "", dob: null }]);
  const removeKid = (idx: number) => setKids(kids.filter((_, i) => i !== idx));

  const updateKid = (idx: number, patch: Partial<Kid>) =>
    setKids(kids.map((k, i) => (i === idx ? { ...k, ...patch } : k)));

  /* ================= HELPERS ================= */

  const ageFromDob = (dob: string) =>
    dayjs().diff(dayjs(dob), "year");

  /* ================= ACTIONS ================= */

  const handleContinue = async () => {
    setError(null);
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }

    setLoading(true);
    try {
      const res = await trpc.checkEmail(cleanEmail);
      setRegistration((p) => ({ ...p, email: cleanEmail }));
      setMode(res.exists ? "login" : "register");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await trpc.signIn(email, password);

      const childrenOptions = res.children.map((c: any) => ({
        id: c.id,
        label: `${c.name} (${ageFromDob(c.dob)} )`,
      }));

      setRegistration((p) => ({
        ...p,
        userId: res.userId,
        sessionToken: res.sessionToken,
        kids: res.children.map((c: any) => ({
          name: c.name,
          dob: c.dob,
        })),
        childrenOptions,
      }));

      onAuthed?.();
    } catch {
      setError("Email/password didn’t match.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError(null);

    const cleanedKids = kids
      .filter((k) => k.name.trim() && k.dob)
      .map((k) => ({
        name: k.name.trim(),
        dob: k.dob!,
      }));

    if (!cleanedKids.length) {
      setError("Please add at least one child with a birthdate.");
      return;
    }

    setLoading(true);
    try {
      const res = await trpc.signUp({
        parentName: parentName.trim(),
        email,
        password,
        kids: cleanedKids,
      });

      const childrenOptions = cleanedKids.map((k, idx) => ({
        id: String(idx),
        label: `${k.name} (${ageFromDob(k.dob)})`,
      }));

      setRegistration((p) => ({
        ...p,
        userId: res.userId,
        sessionToken: res.sessionToken,
        kids: cleanedKids,
        childrenOptions,
      }));

      onAuthed?.();
    } catch {
      setError("Couldn’t create your account.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RENDER ================= */

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <Typography variant="h6">Continue with email</Typography>

      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />

      {mode === "email" && (
        <Button variant="contained" onClick={handleContinue}>
          Continue
        </Button>
      )}

      {mode === "register" && (
        <>
          <Divider />
          <TextField
            label="Your name"
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            fullWidth
          />

          <TextField
            label="Create password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />

          <Typography variant="subtitle1">Child(ren)</Typography>

          {kids.map((kid, idx) => (
            <Box key={idx} sx={{ display: "grid", gridTemplateColumns: "2fr 2fr auto", gap: 1 }}>
              <TextField
                label="Child name"
                value={kid.name}
                onChange={(e) => updateKid(idx, { name: e.target.value })}
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Birthdate"
                  value={kid.dob ? dayjs(kid.dob) : null}
                  onChange={(v) =>
                    updateKid(idx, { dob: v ? v.format("YYYY-MM-DD") : null })
                  }
                  disableFuture
                />
              </LocalizationProvider>

              <IconButton onClick={() => removeKid(idx)} disabled={kids.length <= 1}>
                <RemoveIcon />
              </IconButton>
            </Box>
          ))}

          <Button startIcon={<AddIcon />} onClick={addKid}>
            Add another child
          </Button>

          <Button variant="contained" onClick={handleRegister}>
            Create account
          </Button>
        </>
      )}

      {mode === "login" && (
        <>
          <Divider />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={handleLogin}>
            Sign in
          </Button>
        </>
      )}

      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
}


