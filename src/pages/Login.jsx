import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { safeReturnTo } from "@/lib/authReturnTo";

const SALES_URL = "https://www.ebookmaker.online/builder/gerador-de-pagina/pagina-de-vendas-9aa15497-6fe9-42fc-a517-57f6818e9902";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showActivate, setShowActivate] = useState(false);
  const [activateEmail, setActivateEmail] = useState("");
  const [activateError, setActivateError] = useState("");
  const [activateLoading, setActivateLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState("");
  // Post-login destination (e.g. the MCP OAuth consent page sends users here
  // with returnTo so the grant flow can resume). Same-origin paths only.
  const returnTo = safeReturnTo();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = returnTo;
    } catch (err) {
      setError(err.message || "Correo o contraseña inválidos");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    base44.auth.loginWithProvider("google", returnTo);
  };

  // Verifica en backend si el correo tiene una compra activa en Hotmart.
  // El backend devuelve únicamente { authorized, hasAccount } (sin datos
  // internos). Si autoriza y ya tiene cuenta, va a Login; si no tiene cuenta,
  // va a Register con el email pre-rellenado. La decisión final de acceso
  // se re-valida en backend tras autenticar (syncUserAccess + ProtectedRoute).
  const handleActivate = async (e) => {
    e.preventDefault();
    setActivateError("");
    setActivateLoading(true);
    try {
      const res = await base44.functions.invoke("verifyHotmartAccess", { email: activateEmail });
      const data = res.data || {};
      if (!data.authorized) {
        setActivateError("no_access");
        return;
      }
      if (data.hasAccount) {
        setEmail(activateEmail);
        setLoginInfo("Ya tienes una cuenta con este correo. Inicia sesión con tu contraseña o Google.");
        setShowActivate(false);
        setActivateEmail("");
        setActivateError("");
      } else {
        const returnParam = returnTo !== "/" ? "?returnTo=" + encodeURIComponent(returnTo) : "";
        navigate("/register" + returnParam, { state: { hotmartEmail: activateEmail } });
      }
    } catch (err) {
      setActivateError("error");
    } finally {
      setActivateLoading(false);
    }
  };

  return (
    <AuthLayout
      icon={LogIn}
      title="Bienvenido/a a AutoReiki"
      subtitle="Tu espacio de bienestar comienza aquí"
      footer={
        <>
          ¿Aún no tienes acceso?{" "}
          <a
            href="https://scarad131-source.github.io/landing-page-AUTOREIKI/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium hover:underline"
          >
            Obtén acceso a AUTOREIKI
          </a>
        </>
      }
    >
      <Button
        variant="outline"
        className="w-full h-12 text-sm font-medium mb-6"
        onClick={handleGoogle}
      >
        <GoogleIcon className="w-5 h-5 mr-2" />
        Continuar con Google
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">o</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {loginInfo && (
        <div className="mb-4 p-3 rounded-lg bg-primary/10 text-primary text-sm">
          {loginInfo}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Correo</Label>
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
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Contraseña</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
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
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Iniciando sesión...
            </>
          ) : (
            "Iniciar sesión"
          )}
        </Button>
      </form>

      {!showActivate && (
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => { setShowActivate(true); setActivateError(""); setLoginInfo(""); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ¿Ya compraste? Activa tu acceso
          </button>
        </div>
      )}

      {showActivate && (
        <div className="mt-6 space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Ingresa el correo que usaste para comprar en Hotmart.
          </p>
          <form onSubmit={handleActivate} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <Input
                type="email"
                placeholder="tu@ejemplo.com"
                value={activateEmail}
                onChange={(e) => setActivateEmail(e.target.value)}
                className="pl-10 h-12"
                required
              />
            </div>
            {activateError === "no_access" && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm space-y-2">
                <p>No encontramos una compra activa asociada a este correo. Verifica que sea el mismo que utilizaste al comprar en Hotmart.</p>
                <a href={SALES_URL} target="_blank" rel="noopener noreferrer" className="block text-primary font-medium hover:underline">
                  ¿Necesitas acceso? Obtener AutoReiki
                </a>
              </div>
            )}
            {activateError === "error" && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                No pudimos verificar tu acceso. Inténtalo de nuevo.
              </div>
            )}
            <Button type="submit" variant="outline" className="w-full h-12" disabled={activateLoading}>
              {activateLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Verificar acceso"
              )}
            </Button>
            <button
              type="button"
              onClick={() => { setShowActivate(false); setActivateError(""); setActivateEmail(""); }}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Volver
            </button>
          </form>
        </div>
      )}
    </AuthLayout>
  );
}