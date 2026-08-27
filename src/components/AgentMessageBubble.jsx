import { useState } from "react";
import { ChevronDown, ChevronRight, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

const STATUS_META = {
  pending: { icon: Loader2, spin: true, text: "Pendiente", cls: "text-muted-foreground" },
  running: { icon: Loader2, spin: true, text: "Ejecutando", cls: "text-primary" },
  in_progress: { icon: Loader2, spin: true, text: "En proceso", cls: "text-primary" },
  completed: { icon: CheckCircle2, spin: false, text: "Listo", cls: "text-success" },
  success: { icon: CheckCircle2, spin: false, text: "Listo", cls: "text-success" },
  failed: { icon: AlertCircle, spin: false, text: "Error", cls: "text-destructive" },
  error: { icon: AlertCircle, spin: false, text: "Error", cls: "text-destructive" }
};

function FunctionDisplay({ toolCall }) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_META[toolCall.status] || STATUS_META.pending;
  const StatusIcon = status.icon;

  let parsedArgs = toolCall.arguments_string;
  try { parsedArgs = JSON.parse(toolCall.arguments_string); } catch (e) {}
  let parsedResults = toolCall.results;
  if (typeof parsedResults === "string") {
    try { parsedResults = JSON.parse(parsedResults); } catch (e) {}
  }
  const failed = toolCall.status === "failed" || toolCall.status === "error" ||
    (parsedResults && typeof parsedResults === "object" && parsedResults.success === false) ||
    (typeof parsedResults === "string" && /error|failed/i.test(parsedResults));

  const proj = toolCall.display_projection || {};
  const hideDetails = proj.hide_details && proj.details_redacted;
  const label = failed ? (proj.error_label || status.text) : (toolCall.status === "pending" || toolCall.status === "running" || toolCall.status === "in_progress" ? (proj.active_label || status.text) : (proj.label || status.text));

  return (
    <div className="mt-2 rounded-xl border border-white/8 bg-card/40 overflow-hidden">
      <button
        onClick={() => !hideDetails && setExpanded((v) => !v)}
        className={`w-full flex items-center gap-2 px-3 py-2 text-xs ${hideDetails ? "cursor-default" : "hover:bg-accent/40"} transition-colors`}
      >
        {hideDetails ? <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" /> : expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        <StatusIcon className={`w-3.5 h-3.5 ${status.spin ? "animate-spin" : ""} ${failed ? "text-destructive" : status.cls}`} />
        <span className="font-medium">{toolCall.name}</span>
        <span className={`text-muted-foreground ${failed ? "text-destructive" : ""}`}>· {label}</span>
      </button>
      {expanded && !hideDetails && (
        <div className="px-3 pb-3 space-y-2 text-xs">
          {parsedArgs !== undefined && (
            <div>
              <p className="text-muted-foreground mb-1">Parámetros:</p>
              <pre className="rounded-lg bg-background/60 p-2 overflow-x-auto text-foreground/80">{JSON.stringify(parsedArgs, null, 2)}</pre>
            </div>
          )}
          {parsedResults !== undefined && (
            <div>
              <p className="text-muted-foreground mb-1">Resultado:</p>
              <pre className="rounded-lg bg-background/60 p-2 overflow-x-auto text-foreground/80">{JSON.stringify(parsedResults, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AgentMessageBubble({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
        isUser
          ? "bg-gradient-to-br from-primary to-glow-cyan text-primary-foreground"
          : "bg-card/70 border border-white/8"
      }`}>
        {message.content && (
          isUser
            ? <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            : <ReactMarkdown className="text-sm prose prose-sm prose-invert max-w-none leading-relaxed [&>p]:my-0">{message.content}</ReactMarkdown>
        )}
        {message.tool_calls?.map((tc, idx) => <FunctionDisplay key={idx} toolCall={tc} />)}
      </div>
    </div>
  );
}