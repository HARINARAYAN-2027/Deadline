// src/hooks/useGemini.js
import { useState } from 'react';
import { generateAutonomousPlan } from '../services/gemini';
import { useTasks } from './useTasks';

export const useGemini = () => {
  const { ingestAiPayload, refreshTasks } = useTasks();
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [error, setError] = useState(null);
  const [lastIngest, setLastIngest] = useState(null);

  const normalizePayload = (payload) => {
    if (payload && typeof payload === 'object' && 'payload' in payload) {
      return payload.payload;
    }
    return payload;
  };

  const triggerAiAnalysis = async (userCrisisInputText) => {
    if (!userCrisisInputText.trim()) return { success: false, message: 'EMPTY_INPUT' };

    setAiLoading(true);
    setError(null);

    try {
      const result = await generateAutonomousPlan(userCrisisInputText);

      if (!result.success) {
        setError(result);
        return result;
      }

      const payload = normalizePayload(result.payload);
      setAiResponse(payload);

      const ingestPromise = ingestAiPayload(payload)
        .then((ingestResult) => {
          setLastIngest(ingestResult);
          if (ingestResult.success) {
            refreshTasks();
          }
          return ingestResult;
        })
        .catch((err) => ({ success: false, error: String(err?.message || err || 'Workspace sync failed.') }));

      setAiLoading(false);

      return {
        ...result,
        payload,
        ingestPromise,
      };
    } catch (err) {
      const message = err.message || 'An unexpected error occurred during AI parsing loop.';
      setError(message);
      return { success: false, message };
    } finally {
      setAiLoading(false);
    }
  };

  return { aiLoading, aiResponse, error, lastIngest, triggerAiAnalysis };
};
