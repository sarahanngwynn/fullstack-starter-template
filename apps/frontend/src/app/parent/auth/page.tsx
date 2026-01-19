"use client";
import React from "react";
import { ParentAuthCard } from "../../../components/ParentAuthCard";

export default function ParentAuthPage() {
  return (
    <div style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1>Parent Portal</h1>
      <p>Sign in or create an account to continue.</p>

      <ParentAuthCard
        onAuthed={() => {
          window.location.href = "/parent";
        }}
      />
    </div>
  );
}
