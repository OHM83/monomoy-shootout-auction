"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/actions/auth";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-4 text-xl font-black text-slate-800">Admin login</h1>
      <form action={formAction} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <label htmlFor="password" className="field-label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            className="field-input"
          />
        </div>
        {state.error && (
          <div className="bg-red-50 border border-red-300 text-red-700 rounded-xl px-4 py-3 text-sm font-medium">
            {state.error}
          </div>
        )}
        <button type="submit" disabled={pending} className="btn-primary w-full">
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
