import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ACCESS_DENIED_MESSAGE } from "@/lib/accessMessages";
import { saveRememberPreference } from "@/lib/sessionPreference";
import { Mail, Lock, Loader2, Info } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { safeReturnTo } from "@/lib/authReturnTo";

// Fondo a pantalla completa de la pantalla de acceso (ilustración de marca).
const BACKGROUND_IMAGE = "https://media.base44.com/images/public/6a7d30a899098694894dbd88/4397b3992_ImagendefondoBIENVENIDAautoreiki.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Marcada por defecto: si no se toca, la sesión se comporta como hasta ahora.
  const [remember, setRemember] = useState(true);
  // El backend cierra la sesión y vuelve aquí con ?denied=1 cuando el correo no
  // tiene una compra aprobada y activa en Hotmart (validación invisible).
  const [error, setError] = useState(() =>
    new URLSearchParams(window.location.search).get("denied") === "1" ? ACCESS_DENIED_MESSAGE : ""
  );
  const [loading, setLoading] = useState(false);
  // Post-login destination (e.g. the MCP OAuth consent page sends users here
  // with returnTo so the grant flow can resume). Same-origin paths only.
  const returnTo = safeReturnTo();

  // Comprueba en backend que el correo tenga una compra aprobada y activa en
  // Hotmart, sin mostrar nada al usuario. Si no la tiene, cierra la sesión
  // recién creada y vuelve al login con el mensaje de acceso denegado.
  // Los admins siempre pasan, igual que en ProtectedRoute.
  const denyAccessIfNotPurchased = async () => {
    try {
      const me = await base44.auth.me();
      if (!me || me.role === "admin") return false;
      const res = await base44.functions.invoke("verifyHotmartAccess", { email: me.email || email });
      if ((res.data || {}).authorized !== true) {
        await base44.auth.logout("/login?denied=1");
        return true;
      }
    } catch (e) {
      // Si la verificación no se puede hacer, el control final sigue siendo
      // ProtectedRoute (que vuelve a validar contra Hotmart).
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    saveRememberPreference(remember);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      if (await denyAccessIfNotPurchased()) return;
      window.location.href = returnTo;
    } catch (err) {
      setError(err.message || "Correo o contraseña inválidos");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    saveRememberPreference(remember);
    base44.auth.loginWithProvider("google", returnTo);
  };

  return (
    <AuthLayout
      backgroundImage={BACKGROUND_IMAGE}
      glass
      footer={
        <>
          ¿Aún no tienes acceso?{" "}
          <a
            href="https://scarad131-source.github.io/landing-page-AUTOREIKI/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium hover:underline"
          >
            Descubre AutoReiki
          </a>
        </>
      }
    >
      <Button
        variant="outline"
        className="w-full h-10 text-[13px] font-semibold bg-foreground text-background border-transparent hover:bg-foreground/90 hover:text-background"
        onClick={handleGoogle}
      >
        <GoogleIcon className="w-5 h-5 mr-2" />
        Continuar con Google
      </Button>

      <div className="relative my-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-foreground/15" />
        </div>
        <div className="relative flex justify-center">
          <span className="rounded-full border border-foreground/15 bg-background/60 px-3 py-1 text-[11px] text-muted-foreground">
            o continúa con tu correo
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="tu@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-3">
            <Label htmlFor="password">Contraseña</Label>
            <Link to="/forgot-password" className="shrink-0 text-xs text-primary hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-10"
              required
            />
          </div>
          <p className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Usa el mismo correo con el que compraste en Hotmart
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-10 font-semibold bg-gradient-to-r from-primary to-purple text-primary-foreground shadow-lg hover:opacity-90"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Ingresando...
            </>
          ) : (
            "Ingresar a mi cuenta"
          )}
        </Button>

        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={remember}
            onCheckedChange={(value) => setRemember(value === true)}
          />
          <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground cursor-pointer">
            Recordarme
          </Label>
        </div>
      </form>
    </AuthLayout>
  );
}