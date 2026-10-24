import React from "react";
import { Image } from "@/components/ui/image";

export default function AuthLayout({ icon: Icon, logo, title, subtitle, footer, children, backgroundImage, glass = false }) {
  return (
    <div
      className={`relative flex min-h-screen items-center justify-center px-4 py-8 ${
        backgroundImage ? "pt-24" : "bg-background"
      }`}
    >
      {backgroundImage && (
        <div className="fixed inset-0" aria-hidden="true">
          <Image
            src={backgroundImage}
            alt=""
            fittingType="fill"
            quality={85}
            className="block w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/35 to-background/85" />
        </div>
      )}
      <div className="relative w-full max-w-md">
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
              ? "rounded-3xl border border-foreground/10 bg-[rgba(20,5,35,0.65)] p-6 shadow-2xl backdrop-blur-[10px] sm:p-8"
              : "bg-card rounded-2xl shadow-sm border border-border p-8"
          }
        >
          {children}
        </div>
        {footer && (
          <p className="text-center text-sm text-muted-foreground mt-6">{footer}</p>
        )}
      </div>
    </div>
  );
}