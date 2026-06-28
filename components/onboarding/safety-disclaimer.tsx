import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SafetyDisclaimer() {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="size-4" />
      <AlertTitle>Important</AlertTitle>
      <AlertDescription>
        Cette application n&apos;est pas un professionnel de santé et ne remplace pas un
        avis médical. En cas de douleur aiguë, de vertiges, de douleur thoracique, de
        fatigue anormale ou de comportement alimentaire préoccupant, consulte un
        professionnel de santé.
      </AlertDescription>
    </Alert>
  );
}
