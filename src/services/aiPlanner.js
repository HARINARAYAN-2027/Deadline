// src/services/aiPlanner.js
import { processCrisisTelemetry as directCall } from './gemini';

export const processCrisisTelemetry = async (userCrisisText) => {
  return await directCall(userCrisisText);
};
