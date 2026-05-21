"use client";

import { ParentDashboard } from "../../components/parent/ParentDashboard";
import { RequireParentAuth } from "../../components/parent/RequireParentAuth";

export default function ParentPage() {
  return (
    <RequireParentAuth>
      <ParentDashboard />
    </RequireParentAuth>
  );
}
