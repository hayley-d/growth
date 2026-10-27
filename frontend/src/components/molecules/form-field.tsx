import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";

type FormFieldProperties = {
  id: string;
  label: string;
  type?: string;
  value: string;
  error?: string;
  onBlur: () => void;
  onChange: (value: string) => void;
};

export function FormField({
  id,
  label,
  type = "text",
  value,
  error,
  onBlur,
  onChange,
}: FormFieldProperties) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
