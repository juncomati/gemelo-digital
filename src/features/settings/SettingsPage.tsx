import { useState } from "react";
import { useDemo } from "@/app/DemoProvider";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { formatAbsoluteDate, formatRelativeDate } from "@/lib/format";
import type { Source } from "@/domain/types";

export function SettingsPage() {
  const { state, updateSettings, updateSourceStatus, resetDemo } = useDemo();
  const [locale, setLocale] = useState(state?.settings.locale ?? "es-AR");
  const [digest, setDigest] = useState(state?.settings.notifications.dailyDigest ?? true);
  const [disconnectId, setDisconnectId] = useState<string | null>(null);

  if (!state) return null;

  const roleLabels: Record<string, string> = {
    admin: "Administrador",
    direction: "Dirección",
    owner: "Responsable",
    viewer: "Consulta",
  };

  return (
    <div className="page-enter space-y-6">
      <section className="card-surface p-5">
        <h3 className="section-title">Perfil de empresa</h3>
        <dl className="mt-3 grid gap-3 text-sm md:grid-cols-2">
          <div>
            <dt className="text-text-600">Nombre</dt>
            <dd className="font-medium">{state.tenant.name}</dd>
          </div>
          <div>
            <dt className="text-text-600">Industria</dt>
            <dd className="font-medium">{state.tenant.industry}</dd>
          </div>
          <div>
            <dt className="text-text-600">Zona horaria</dt>
            <dd className="font-medium">{state.tenant.timezone}</dd>
          </div>
          <div>
            <dt className="text-text-600">Moneda</dt>
            <dd className="font-medium">{state.tenant.currencyLabel}</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-text-600">
          Entorno dedicado y aislado para esta empresa ficticia. Los datos son sintéticos.
        </p>
      </section>

      <section className="card-surface p-5">
        <h3 className="text-lg font-semibold">Usuarios y roles</h3>
        <ul className="mt-3 space-y-2">
          {state.users.map((user) => (
            <li
              key={user.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border-200 px-3 py-2 text-sm"
            >
              <span>
                <strong>{user.name}</strong> · {user.area}
              </span>
              <Badge>{roleLabels[user.role] ?? user.role}</Badge>
            </li>
          ))}
        </ul>
      </section>

      <section className="card-surface p-5">
        <h3 className="text-lg font-semibold">Fuentes</h3>
        <ul className="mt-3 space-y-2">
          {state.sources.map((source) => (
            <li
              key={source.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border-200 px-3 py-3 text-sm"
            >
              <div>
                <p className="font-medium">
                  {source.name} <Badge tone="info">Simulación</Badge>
                </p>
                <p className="text-text-600">
                  {source.status === "connected"
                    ? "Conectada"
                    : source.status === "review"
                      ? "Requiere revisión"
                      : "Desconectada"}{" "}
                  · {formatRelativeDate(source.lastSyncAt, state.metadata.demoNow)} (
                  {formatAbsoluteDate(source.lastSyncAt)})
                </p>
              </div>
              {source.status !== "disconnected" ? (
                <Button variant="secondary" onClick={() => setDisconnectId(source.id)}>
                  Desconectar
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => void updateSourceStatus(source.id, "connected")}
                >
                  Reconectar
                </Button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="card-surface p-5">
        <h3 className="text-lg font-semibold">Notificaciones y preferencias</h3>
        <div className="mt-4 space-y-3 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={digest}
              onChange={(e) => setDigest(e.target.checked)}
            />
            Resumen diario
          </label>
          <label className="block">
            Idioma / locale
            <input
              className="mt-1 h-10 w-full max-w-xs rounded-lg border border-border-200 px-3"
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
            />
          </label>
          <Button
            onClick={() =>
              void updateSettings({
                locale,
                notifications: {
                  ...state.settings.notifications,
                  dailyDigest: digest,
                },
              })
            }
          >
            Guardar preferencias
          </Button>
        </div>
      </section>

      <section className="card-surface p-5">
        <h3 className="text-lg font-semibold">Políticas de aprobación</h3>
        <ul className="mt-3 space-y-2 text-sm">
          {state.settings.approvalPolicies.map((policy) => (
            <li key={policy.id} className="rounded-lg border border-border-200 p-3">
              <p className="font-medium">{policy.label}</p>
              <p className="text-text-600">{policy.condition}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="card-surface p-5">
        <h3 className="text-lg font-semibold">Privacidad y datos</h3>
        <p className="mt-2 text-sm text-text-600">
          Retención, exportación y aislamiento están simulados. El entorno se describe como dedicado y
          aislado, sin exponer infraestructura interna.
        </p>
        <Button className="mt-4" variant="secondary" onClick={() => void resetDemo()}>
          Restablecer configuración inicial
        </Button>
      </section>

      <ConfirmDialog
        open={Boolean(disconnectId)}
        title="Desconectar fuente"
        description="En la demo la desconexión es local y no realiza llamadas externas."
        confirmLabel="Desconectar"
        onCancel={() => setDisconnectId(null)}
        onConfirm={() => {
          if (!disconnectId) return;
          void updateSourceStatus(disconnectId, "disconnected" as Source["status"]);
          setDisconnectId(null);
        }}
      />
    </div>
  );
}
