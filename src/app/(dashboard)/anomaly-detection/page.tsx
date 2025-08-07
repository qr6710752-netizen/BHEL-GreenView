import { PageHeader } from "@/components/page-header";
import { AnomalyDetectionForm } from "@/components/anomaly/anomaly-detection-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb } from "lucide-react";

export default function AnomalyDetectionPage() {
  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <PageHeader title="AI Anomaly Detection" />

      <Alert className="mt-6 bg-primary/5 border-primary/20">
        <Lightbulb className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">How it works</AlertTitle>
        <AlertDescription className="text-primary/80">
          Paste time-series data (e.g., daily energy usage in kWh) into the text area below. Our AI model will analyze the data for significant deviations from the expected pattern and provide a summary of any detected anomalies.
        </AlertDescription>
      </Alert>

      <div className="mt-6">
        <AnomalyDetectionForm />
      </div>
    </main>
  );
}
