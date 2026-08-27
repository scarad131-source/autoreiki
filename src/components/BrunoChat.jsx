import { useState, useEffect, useRef } from "react";
import { X, Send, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import AgentMessageBubble from "@/components/AgentMessageBubble";

export default function BrunoChat({ open, onClose }) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const convs = await base44.agents.listConversations({ agent_name: "meditation_guide" });
        let conv;
        if (convs && convs.length) {
          conv = convs[0];
        } else {
          conv = await base44.agents.createConversation({
            agent_name: "meditation_guide",
            metadata: { name: "Bruno" }
          });
        }
        setConversation(conv);
        setMessages(conv.messages || []);
      } catch (e) {
        try {
          const conv = await base44.agents.createConversation({
            agent_name: "meditation_guide",
            metadata: { name: "Bruno" }
          });
          setConversation(conv);
          setMessages(conv.messages || []);
        } catch (e2) {}
      } finally {
        setLoading(false);
      }
    })();
  }, [open]);

  useEffect(() => {
    if (!conversation) return;
    const unsubscribe = base44.agents.subscribeToConversation(conversation.id, (data) => {
      setMessages(data.messages || []);
      setSending(false);
    });
    return () => unsubscribe();
  }, [conversation]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!open) return null;

  const send = async () => {
    const text = input.trim();
    if (!text || !conversation || sending) return;
    setInput("");
    setSending(true);
    try {
      const updated = await base44.agents.addMessage(conversation, { role: "user", content: text });
      setConversation(updated);
    } catch (e) {
      setSending(false);
    }
  };

  const assistantBusy = sending || messages.some(
    (m) => m.role === "assistant" && m.tool_calls?.some((tc) =>
      ["pending", "running", "in_progress"].includes(tc.status))
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto sm:bg-transparent sm:backdrop-blur-none" onClick={onClose} />
      <div className="relative pointer-events-auto mt-[calc(4.5rem+env(safe-area-inset-top))] mr-3 mb-3 flex flex-col w-[min(380px,calc(100vw-1.5rem))] h-[min(72vh,640px)] rounded-3xl border border-glow-cyan/30 bg-card/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden">
        {/* Encabezado */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-gradient-to-r from-accent/40 to-card/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full flex items-center justify-center relative"
              style={{
                background: "radial-gradient(circle at 32% 28%, hsl(276 86% 36%), hsl(268 100% 24%))",
                boxShadow: "0 0 12px hsl(180 100% 50% / 0.5)"
              }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-display text-base font-semibold leading-none">Bruno</p>
              <p className="text-[11px] text-success mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success" /> En línea
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto space-y-3 p-3">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-7 h-7 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground mt-8 px-4">
              <Sparkles className="w-6 h-6 text-primary mx-auto mb-3" />
              Toca para empezar a chatear con Bruno.
            </div>
          ) : (
            messages.map((m, idx) => <AgentMessageBubble key={idx} message={m} />)
          )}
          {assistantBusy && (
            <div className="flex justify-start">
              <div className="bg-card/70 border border-white/8 rounded-2xl px-4 py-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "120ms" }} />
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "240ms" }} />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Entrada */}
        <div className="p-3 pt-1.5">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-background/60 pl-4 pr-1.5 py-1.5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Escribe a Bruno..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
              disabled={loading || assistantBusy}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading || assistantBusy}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-glow-cyan text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-transform active:scale-95"
              aria-label="Enviar"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}