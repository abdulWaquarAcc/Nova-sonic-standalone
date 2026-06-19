# Architecture

## End-to-End Flow

```
Browser (Mic) → Socket.IO → Express Server → AWS Bedrock → Nova 2 Sonic
                                ↕                              ↕
                          Tool Execution              Audio + Text Response
                          (KB, Weather, etc.)
                                ↕
Browser (Speaker) ← Socket.IO ← Express Server ← AWS Bedrock ← Nova 2 Sonic
```

## How It Works

1. **User clicks mic** → Browser captures audio at 16kHz PCM via AudioWorklet
2. **Audio streams** → Socket.IO sends chunks to Express server in real-time
3. **Server forwards** → Bidirectional streaming to Nova 2 Sonic via Bedrock SDK
4. **Model processes** → Nova Sonic handles STT + LLM + TTS in one model
5. **Response streams back** → Server receives audio (24kHz) + text transcripts
6. **Browser plays** → AudioWorklet plays audio, chat UI shows transcripts

## Tool Calling Flow

1. Model decides it needs external data → emits `toolUse` event
2. Server executes tool async (doesn't block audio stream)
3. Result sent back via `toolResult` event
4. Model incorporates result into its spoken response

## Key Components

| Component | File | Role |
|-----------|------|------|
| Server | `src/server.ts` | Socket.IO + session management |
| Bedrock Client | `src/client.ts` | Bidirectional streaming, event queue, tool dispatch |
| Tools | `src/tools/` | DateTime, Weather, Wikipedia, KB, Reasoning, etc. |
| Guardrails | `src/lib/GuardrailsService.ts` | Input filtering, PII detection, rate limiting |
| Frontend | `public/src/main.js` | Mic capture, audio playback, chat UI, waveform |
| Audio Player | `public/src/lib/play/AudioPlayer.js` | Web Audio API playback with buffering |

## Session Lifecycle

```
Connect → initializeConnection → promptStart → systemPrompt → audioStart → [streaming] → stopAudio → disconnect
```

Sessions auto-renew at 7 minutes (Nova Sonic has an 8-minute limit).

## Knowledge Base

Currently uses local JSON search (`customer-preset/kb/hr-buddy/index.json`).  
Bedrock Knowledge Base integration is pre-built but commented out — enable by uncommenting in `src/tools/index.ts`.
