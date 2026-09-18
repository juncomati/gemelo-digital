import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import { DemoProvider } from "@/app/DemoProvider";
import { AppShell } from "@/components/layout/AppShell";
import { ActivityPage } from "@/features/activity/ActivityPage";
import { ApprovalsPage } from "@/features/approvals/ApprovalsPage";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { DocumentsPage } from "@/features/documents/DocumentsPage";
import { MetricsPage } from "@/features/metrics/MetricsPage";
import { ProcessPage } from "@/features/process/ProcessPage";
import { ConsultorPage } from "@/features/consultor/ConsultorPage";
import { NewsPage } from "@/features/news/NewsPage";
import { ResultsPage } from "@/features/results/ResultsPage";
import { SettingsPage } from "@/features/settings/SettingsPage";
import { TwinPage } from "@/features/twin/TwinPage";
import { Button } from "@/components/ui/Button";

function NotFoundPage() {
  return (
    <div className="card-surface page-enter p-8 text-center">
      <h3 className="font-display text-2xl font-semibold">Página no encontrada</h3>
      <p className="mt-2 text-text-600">La ruta solicitada no existe en esta demo.</p>
      <Link to="/inicio">
        <Button className="mt-6">Volver a Inicio</Button>
      </Link>
    </div>
  );
}

export function App() {
  return (
    <DemoProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Navigate to="/inicio" replace />} />
            <Route path="/inicio" element={<DashboardPage />} />
            <Route path="/proceso" element={<ProcessPage />} />
            <Route path="/documentacion" element={<DocumentsPage />} />
            <Route path="/documentacion/:documentoId" element={<DocumentsPage />} />
            <Route path="/gemelo" element={<TwinPage />} />
            <Route path="/gemelo/:entidadId" element={<TwinPage />} />
            <Route path="/resultados" element={<ResultsPage />} />
            <Route path="/resultados/:resultadoId" element={<ResultsPage />} />
            <Route path="/aprobaciones" element={<ApprovalsPage />} />
            <Route path="/aprobaciones/:aprobacionId" element={<ApprovalsPage />} />
            <Route path="/actividad" element={<ActivityPage />} />
            <Route path="/metricas" element={<MetricsPage />} />
            <Route path="/consultor" element={<ConsultorPage />} />
            <Route path="/novedades" element={<NewsPage />} />
            <Route path="/configuracion" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DemoProvider>
  );
}
