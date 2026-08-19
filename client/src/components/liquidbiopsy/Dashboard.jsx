import { useState } from "react";
import DashboardShell from "./layout/DashboardShell";
import OverviewPage from "./pages/OverviewPage";
import VariantsPage from "./pages/VariantsPage";
import VafRiskPage from "./pages/VafRiskPage";
import ResistancePage from "./pages/ResistancePage";
import QualityPage from "./pages/QualityPage";
import PatientPage from "./pages/PatientPage";
import TechnicalPage from "./pages/TechnicalPage";

const PAGES = {
  overview: OverviewPage,
  variants: VariantsPage,
  vaf: VafRiskPage,
  resistance: ResistancePage,
  quality: QualityPage,
  patient: PatientPage,
  technical: TechnicalPage,
};

export default function Dashboard({ data, onReset, onBack, theme, toggleTheme }) {
  const [activePage, setActivePage] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const PageComponent = PAGES[activePage] || OverviewPage;

  return (
    <DashboardShell
      activePage={activePage}
      onNavigate={setActivePage}
      meta={data.meta}
      tierSummary={data.tier_summary}
      callerAdapterValidated={data.meta?.caller_adapter_validated !== false}
      theme={theme}
      toggleTheme={toggleTheme}
      onReset={onReset}
      onBack={onBack}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    >
      <PageComponent data={data} theme={theme} />
    </DashboardShell>
  );
}
