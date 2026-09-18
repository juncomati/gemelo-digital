import { confidenceLabel, confidenceTone, formatPercent } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";

export function ConfidenceIndicator({ value }: { value: number }) {
  const label = confidenceLabel(value);
  const tone = confidenceTone(value);
  return (
    <span className="inline-flex items-center gap-2" title="La confianza combina calidad, cantidad, consistencia y actualidad de las evidencias disponibles.">
      <Badge tone={tone}>
        Confianza {label} · {formatPercent(value)}
      </Badge>
    </span>
  );
}
