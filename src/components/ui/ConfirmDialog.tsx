import { useEffect, useId, useRef } from "react";
import { Button } from "@/components/ui/Button";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
  requireComment = false,
  comment,
  onCommentChange,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  requireComment?: boolean;
  comment?: string;
  onCommentChange?: (value: string) => void;
}) {
  const titleId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const disabled = requireComment && !(comment?.trim());

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/40 p-4"
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="card-surface w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id={titleId} className="text-xl font-semibold text-text-900">
          {title}
        </h2>
        <p className="mt-2 text-sm text-text-600">{description}</p>
        {requireComment ? (
          <label className="mt-4 block text-sm font-medium text-text-900">
            Comentario
            <textarea
              className="mt-1 w-full rounded-lg border border-border-200 p-3 text-sm"
              rows={3}
              value={comment}
              onChange={(e) => onCommentChange?.(e.target.value)}
            />
          </label>
        ) : null}
        <div className="mt-6 flex justify-end gap-3">
          <Button ref={cancelRef} variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={onConfirm} disabled={disabled}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
