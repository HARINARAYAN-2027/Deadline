// src/pages/AIPlanner/AIPlanner.jsx
import React, { useMemo, useState } from 'react';
import { Send, Trash2, RotateCcw, Bot, AlertTriangle } from 'lucide-react';
import { useGemini } from '../../hooks/useGemini';
import VoiceRecorder from '../../components/VoiceRecorder';

const AIPlanner = () => {
  const { aiLoading, triggerAiAnalysis } = useGemini();
  const [lastPrompt, setLastPrompt] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      type: 'text',
      text: 'SYSTEM INITIALIZED: LIFESAVER PROTOCOL ACTIVATED. Tell me your exact unorganized mess, and I will structure your day.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');

  const nowLabel = useMemo(() => {
    const now = new Date();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
    const date = now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${date} · ${time} (${tz})`;
  }, []);

  const handleVoiceTranscript = (transcript) => {
    setInput((prev) => {
      const next = prev ? `${prev.trim()} ${transcript}`.trim() : transcript;
      return next;
    });
  };

  const handleClear = () => {
    setMessages([
      {
        id: 1,
        sender: 'ai',
        type: 'text',
        text: 'SYSTEM RESET: New session armed. Tell me what is blocking you and I will generate an autonomous plan.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInput('');
    setLastPrompt('');
  };

  const handleRetry = async () => {
    if (!lastPrompt.trim() || aiLoading) return;
    await runPlanner(lastPrompt);
  };

  const renderErrorMessage = (msg) => {
    const details = msg.details || {};
    const status = details.status ?? null;
    const model = details.model ?? null;
    const rawMessage = msg.rawMessage || msg.message || 'Unknown error';
    const help =
      rawMessage?.includes('API Key') || /unauthorized|permission|403|401/i.test(rawMessage)
        ? 'Check VITE_GEMINI_API_KEY in .env and restart dev server.'
        : /overloaded|high demand|503|429|capacity/i.test(rawMessage)
          ? 'Gemini is busy. Wait 20–30 seconds and retry.'
          : 'Try again or shorten the prompt.';

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <div className="text-[10px] font-black uppercase tracking-widest text-rose-400">Core Error</div>
        </div>

        <div className="glass-card border border-rose-500/30 rounded-lg p-3 text-xs text-gray-100 whitespace-pre-line leading-relaxed">
          {rawMessage}
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
          <div className="glass-card rounded-lg p-2 text-gray-300">
            Status: <span className="text-gray-100">{status ?? '—'}</span>
          </div>
          <div className="glass-card rounded-lg p-2 text-gray-300">
            Model: <span className="text-gray-100">{model ?? '—'}</span>
          </div>
        </div>

        <div className="text-[11px] text-gray-300 font-semibold">{help}</div>

        <button
          type="button"
          onClick={handleRetry}
          disabled={aiLoading || !lastPrompt}
          className="w-full glass-card hover:bg-white/5 disabled:opacity-50 font-bold text-[11px] py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4 text-purple-400" />
          <span>Retry Last Prompt</span>
        </button>
      </div>
    );
  };

  const renderPlanMessage = (payload, ingestResult, modelUsed) => {
    const metrics = ingestResult?.metrics || {};
    const productivityScore =
      metrics.productivityScore ??
      (payload?.productivityScore === undefined || payload?.productivityScore === null
        ? null
        : Number(payload.productivityScore));
    const riskPercentage =
      metrics.riskPercentage ??
      (payload?.riskPercentage === undefined || payload?.riskPercentage === null
        ? null
        : Number(payload.riskPercentage));

    const hasMetrics = productivityScore !== null && riskPercentage !== null;
    const todayTasks = Array.isArray(payload?.todayTasks) ? payload.todayTasks : [];
    const upcomingDeadlines = Array.isArray(payload?.upcomingDeadlines) ? payload.upcomingDeadlines : [];
    const insights = Array.isArray(payload?.aiInsights) ? payload.aiInsights : [];
    const tasksAdded = ingestResult?.tasksAdded ?? 0;

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="text-[10px] font-black uppercase tracking-widest text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
            Workspace Sync {modelUsed ? `· ${modelUsed}` : ''}
          </div>
          <div className="text-[10px] text-gray-500 font-bold">{tasksAdded} pushed</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="glass-card rounded-xl p-3">
            <div className="text-[9px] font-black uppercase tracking-widest text-gray-400">Productivity</div>
            <div className="text-lg font-black text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text mt-1">
              {hasMetrics ? `${productivityScore}%` : '—'}
            </div>
          </div>
          <div className="glass-card rounded-xl p-3">
            <div className="text-[9px] font-black uppercase tracking-widest text-gray-400">Risk</div>
            <div className="text-lg font-black text-transparent bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text mt-1">{hasMetrics ? `${riskPercentage}%` : '—'}</div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Today Tasks</div>
          {todayTasks.length === 0 ? (
            <div className="text-xs text-gray-400 font-semibold">No tasks detected for today.</div>
          ) : (
            <div className="space-y-2">
              {todayTasks.slice(0, 6).map((item, idx) => {
                const name = typeof item === 'string' ? item : item.task || item.name || 'Untitled task';
                const time = typeof item === 'string' ? null : item.time || item.scheduledTime || null;
                const priority = typeof item === 'string' ? null : item.priority || null;
                return (
                  <div
                    key={`${name}-${idx}`}
                    className="glass-card rounded-lg px-3 py-2 flex items-center justify-between gap-3 hover:bg-white/5 transition-all"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-gray-200 truncate">{name}</div>
                      {time ? <div className="text-[10px] text-gray-500 font-semibold mt-0.5">{time}</div> : null}
                    </div>
                    {priority ? (
                      <div className="shrink-0 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-400">
                        {priority}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Upcoming Deadlines</div>
          {upcomingDeadlines.length === 0 ? (
            <div className="text-xs text-gray-400 font-semibold">No deadlines detected.</div>
          ) : (
            <div className="space-y-2">
              {upcomingDeadlines.slice(0, 4).map((item, idx) => {
                const title = typeof item === 'string' ? item : item.title || item.name || 'Untitled deadline';
                const when =
                  typeof item === 'string'
                    ? null
                    : [item.date, item.month, item.time].filter(Boolean).join(' ') || item.deadline || null;
                const priority = typeof item === 'string' ? null : item.priority || null;
                return (
                  <div
                    key={`${title}-${idx}`}
                    className="glass-card rounded-lg px-3 py-2 flex items-center justify-between gap-3 hover:bg-white/5 transition-all"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-gray-200 truncate">{title}</div>
                      {when ? <div className="text-[10px] text-gray-500 font-semibold mt-0.5">{when}</div> : null}
                    </div>
                    {priority ? (
                      <div className="shrink-0 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-rose-500/30 bg-gradient-to-r from-rose-500/10 to-orange-500/10 text-rose-400">
                        {priority}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {insights.length ? (
          <div className="glass-card rounded-lg p-3">
            <div className="text-[10px] font-black uppercase tracking-widest text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">Insight</div>
            <div className="text-xs text-gray-200 font-semibold mt-1 whitespace-pre-line leading-relaxed">
              {insights[0]}
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  const runPlanner = async (text, options = {}) => {
    if (!text.trim() || aiLoading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      type: 'text',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (!options.systemTriggered) {
      setMessages((prev) => [...prev, userMessage]);
      setInput('');
    }
    setLastPrompt(text);

    const result = await triggerAiAnalysis(text);

    if (result.success) {
      const { payload, ingestResult, modelUsed } = result;
      const chatText = payload?.chatResponse || 'Here is the plan and timeline I created for you.';
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          type: 'text',
          text: chatText,
          time: 'Just Now',
        },
        {
          id: Date.now() + 2,
          sender: 'ai',
          type: 'plan',
          payload,
          ingestResult,
          modelUsed,
          time: 'Just Now',
        },
      ]);
    } else {
      const errMsg = result.message;
      const details = result.details || null;
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          type: 'error',
          message: errMsg || 'Unable to reach Gemini API.',
          rawMessage: errMsg || 'Unable to reach Gemini API.',
          details,
          time: 'Just Now',
        },
      ]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    await runPlanner(input);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col justify-between glass-card rounded-3xl overflow-hidden">
      <div className="glass-card px-6 py-4 border-b border-purple-500/20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center shrink-0 overflow-hidden">
            <img src="/logo.png" alt="AI Planner" className="w-6 h-6 object-contain" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text truncate">Autonomous AI Planner</h3>
            <p className="text-[10px] text-gray-400 truncate">Context: {nowLabel}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleRetry}
            disabled={aiLoading || !lastPrompt}
            className="glass-card px-3 py-2 rounded-lg hover:bg-white/10 disabled:opacity-50 font-bold text-[11px] flex items-center gap-2 transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4 text-purple-400" />
            <span>Retry</span>
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={aiLoading}
            className="glass-card px-3 py-2 rounded-lg hover:bg-rose-500/10 hover:border-rose-500/30 disabled:opacity-50 font-bold text-[11px] flex items-center gap-2 transition-all duration-200"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-transparent to-purple-500/5">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender !== 'user' ? (
              <div className="mr-3 mt-1 w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center overflow-hidden shrink-0">
                <img src="/logo.png" alt="AI" className="w-5 h-5 object-contain" />
              </div>
            ) : null}

            <div
              className={`max-w-xl rounded-2xl px-4 py-3 text-sm transition-all duration-200 ${
                msg.sender === 'user'
                  ? 'btn-premium text-white'
                  : 'glass-card text-gray-200'
              }`}
            >
              {msg.type === 'plan' ? (
                renderPlanMessage(msg.payload, msg.ingestResult, msg.modelUsed)
              ) : msg.type === 'error' ? (
                renderErrorMessage(msg)
              ) : (
                <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
              )}
            </div>
          </div>
        ))}
        {aiLoading && (
          <div className="flex items-center gap-3 text-xs text-purple-300 font-bold animate-pulse">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center overflow-hidden shrink-0">
              <img src="/logo.png" alt="AI" className="w-5 h-5 object-contain" />
            </div>
            <div className="flex-1 glass-card rounded-2xl px-4 py-3">
              <div className="flex items-center justify-between">
                <div>Parsing telemetry and syncing workspace state...</div>
                <Bot className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 glass-card border-t border-purple-500/20 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Dump your timeline chaos or query parameters here..."
          className="flex-1 glass-card rounded-lg px-4 py-2 text-xs text-gray-200 focus:outline-none focus:border-purple-500/50 focus:bg-white/5 transition-all"
        />
        <VoiceRecorder onTranscript={handleVoiceTranscript} disabled={aiLoading} />
        <button
          type="submit"
          disabled={aiLoading || !input.trim()}
          className="btn-premium disabled:opacity-50 text-white p-2.5 rounded-lg transition-all duration-200"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default AIPlanner;
