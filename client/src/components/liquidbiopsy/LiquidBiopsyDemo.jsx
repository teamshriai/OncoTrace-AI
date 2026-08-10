import { useState, useCallback } from "react";
import FileUpload from "./File";
import Dashboard from "./Dashboard";

export default function LiquidBiopsyDemo({ onBack }) {
  const [theme, setTheme] = useState("dark");
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const handleAnalyze = useCallback((selectedFile) => {
    setFile(selectedFile);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAnalyzed(true);
    }, 1000);
  }, []);

  const handleReset = useCallback(() => {
    setAnalyzed(false);
    setLoading(false);
    setFile(null);
  }, []);

  if (analyzed) {
    return (
      <Dashboard
        onReset={handleReset}
        fileName={file?.name || "Sample_S5.vcf"}
        theme={theme}
        toggleTheme={toggleTheme}
        onBack={onBack}
      />
    );
  }

  return (
    <FileUpload
      onAnalyze={handleAnalyze}
      loading={loading}
      theme={theme}
      toggleTheme={toggleTheme}
      onBack={onBack}
    />
  );
}
