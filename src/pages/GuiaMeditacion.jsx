import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Send, Sparkles, Play } from "lucide-react";
import { base44 } from "@/api/base44Client";
import AgentMessageBubble from "@/components/AgentMessageBubble";

export default function GuiaMeditacion() {
  const navigate = useNavigate();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const convs = await base44.agents.listConversations({ agent_name: "meditation_guide" });
        let conv;
        if (convs && convs.length) {
          conv = convs[0];
        } else {
          conv = await base44.agents.createConversation({
            agent_name: "meditation_guide",
            metadata: { name: "Guía de meditación" }
          });
        }
        setConversation(conv);
        setMessages(conv.messages || []);
      } catch (e) {
        try {
          const conv = await base44.agents.createConversation({
            agent_name: "meditation_guide",
            metadata: { name: "Guía de meditación" }
          });
          setConversation(conv);
          setMessages(conv.messages || []);
        } catch (e2) {}
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
    <div className="flex flex-col h-[calc(100svh-7rem)]">
      <div className="flex items-center justify-between -ml-1 mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-card border border-white/5 flex items-center justify-center hover:border-primary/30 transition-colors"
            aria-label="Atrás"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-display text-base font-semibold leading-none">Guía de meditación</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Recomendaciones de audio personalizadas</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate("/configurar")}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
        >
          <Play className="w-3.5 h-3.5" />
          Iniciar sesión
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 -mr-1">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-7 h-7 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground mt-10 px-6">
            <Sparkles className="w-6 h-6 text-primary mx-auto mb-3" />
            Cuéntame cómo te sientes y cuánto tiempo tienes, y te recomendaré el ambiente sonoro ideal.
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

      <div className="pt-3">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-card/80 pl-4 pr-1.5 py-1.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Escribe cómo te sientes..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
            disabled={loading || assistantBusy}
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading || assistantBusy}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-glow-cyan text-primary-foreground neon-glow disabled:opacity-40 disabled:cursor-not-allowed transition-transform active:scale-95"
            aria-label="Enviar"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}