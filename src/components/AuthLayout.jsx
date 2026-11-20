import React from "react";
import { Image } from "@/components/ui/image";

export default function AuthLayout({ icon: Icon, logo, title, subtitle, footer, children, backgroundImage, glass = false }) {
  return (
    <div
      className="relative flex min-h-[100svh] flex-col overflow-y-auto bg-background"
      style={{ "--art-h": "1200px" }}
    >
      {backgroundImage && (
        // Relleno difuminado a lo ancho de la pantalla (solo escritorio): el
        // marco de la ilustración queda centrado sobre un halo de su mismo color.
        <div
          className="hidden lg:block absolute inset-x-0 top-0 overflow-hidden"
          style={{ height: "var(--art-h)" }}
          aria-hidden="true"
        >
          <div
            className="absolute inset-0 opacity-50 blur-2xl"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-background/55" />
        </div>
      )}

      {/* Un solo bloque: la ilustración y el recuadro forman una sola imagen y
          se desplazan juntos. El recuadro cae en el hueco vacío de la
          ilustración, así el mensaje de bienvenida queda libre y el agua se ve
          por los lados y por debajo. */}
      <div
        className={`relative w-full ${backgroundImage ? "lg:mx-auto lg:max-w-[800px]" : ""}`}
        style={backgroundImage ? { height: "var(--art-h)" } : undefined}
      >
        {backgroundImage && (
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <Image
              src={backgroundImage}
              alt=""
              fittingType="fill"
              focalPointX={0.5}
              focalPointY={0.5}
              quality={85}
              className="block w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/5 to-background/35" />
          </div>
        )}

        <div className="relative px-4 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          {backgroundImage && (
            // Reserva la franja superior del arte que ocupa el mensaje de
            // bienvenida: el recuadro nunca lo tapa.
            <div aria-hidden="true" className="h-[calc(var(--art-h)*0.34)] w-full" />
          )}
          <div
            className={`relative w-full ${
              backgroundImage ? "mx-auto max-w-[350px]" : "m-auto max-w-md"
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
      </div>
    </div>
  );
}