import { AlertTriangleIcon } from "lucide-react";

const ToolError = ({ title, message }: { title: string; message?: string }) => (
  <div className="flex gap-2 rounded-md border border-ruby-6 bg-ruby-2 p-3 text-ruby-9 text-sm">
    <AlertTriangleIcon className="size-4.5 shrink-0" />
    <div className="flex flex-col gap-1">
      <p className="font-medium">{title}</p>
      {message && <p className="text-ruby-11 text-xs">{message}</p>}
    </div>
  </div>
);

export default ToolError;
