import React from "react";
import { Image } from "@/components/ui/image";

export default function AuthLayout({ icon: Icon, logo, title, subtitle, footer, children, backgroundImage, glass = false }) {
  return (
    <div
      className="relative flex min-h-[100svh] flex-col overflow-y-auto bg-background px-4 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
      style={{ "--art-h": "1200px" }}
    >
      {backgroundImage && (
        // Móvil: fondo a pantalla completa, cubriendo toda la vista.
        <div className="absolute inset-x-0 top-0 h-[100svh] overflow-hidden lg:hidden" aria-hidden="true">
          <Image
            src={backgroundImage}
            alt=""
            fittingType="fill"
            focalPointX={0.5}
            focalPointY={0.25}
            quality={85}
            className="block w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/25 to-background/70" />
        </div>
      )}

      {backgroundImage && (
        // Escritorio: la ilustración completa como marco de fondo, con la
        // misma imagen difuminada rellenando los laterales. El arte se ancla
        // arriba y mide --art-h, así el mensaje de bienvenida queda visible y
        // el recuadro se coloca justo debajo, en su espacio vacío.
        <div className="hidden lg:block absolute inset-x-0 top-0 overflow-hidden" style={{ height: "var(--art-h)" }} aria-hidden="true">
          <div
            className="absolute inset-0 opacity-50 blur-2xl"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-background/55" />
          <div
            className="absolute inset-x-0 top-0 bg-no-repeat"
            style={{
              height: "var(--art-h)",
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "contain",
              backgroundPosition: "center top",
            }}
          />
        </div>
      )}

      <div className="relative w-full flex-1">
        {backgroundImage && (
          // Reserva la franja del arte que ocupa el logo y el mensaje de
          // bienvenida, para que el recuadro nunca los tape.
          <div aria-hidden="true" className="h-[max(36vh,50vw)] w-full shrink-0 lg:h-[calc(var(--art-h)*0.34)]" />
        )}
        <div
          className={`relative w-full ${
            backgroundImage ? "mx-auto my-auto max-w-[350px] lg:my-0" : "m-auto max-w-md"
          }`}
        >
          {title && (
            <div className="text-center mb-10">
              {logo ? (
                <img
                  src={logo}
                  alt="AutoReiki"
                  className="w-20 h-20 rounded-2xl object-cover mx-auto mb-4 gold-glow"
                />
              ) : (
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-4">
                  <Icon className="w-7 h-7 text-primary-foreground" aria-hidden="true" />
                </div>
              )}
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
              {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
            </div>
          )}
          <div
            className={
              glass
                ? "rounded-3xl border border-foreground/10 bg-[rgba(20,5,35,0.65)] p-3 pt-3 shadow-2xl backdrop-blur-[10px] sm:p-4 sm:pt-3"
                : "bg-card rounded-2xl shadow-sm border border-border p-8"
            }
          >
            {children}
          </div>
          {footer && (
            <p className={`text-center text-sm text-muted-foreground ${backgroundImage ? "mt-4" : "mt-6"}`}>{footer}</p>
          )}
        </div>
      </div>
      {backgroundImage && (
        // Reserva inferior solo en móvil: sube un poco el recuadro dentro del hueco del arte.
        <div aria-hidden="true" className="h-[10vh] w-full shrink-0 lg:h-[5vh]" />
      )}
    </div>
  );
}