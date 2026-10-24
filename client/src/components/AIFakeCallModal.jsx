import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Volume2, User, Mic } from 'lucide-react';
import { speakText } from '../utils/speech.js';

export const AIFakeCallModal = ({ isOpen, onClose }) => {
  const [callerName, setCallerName] = useState('Mom');
  const [callState, setCallState] = useState('ringing'); // 'ringing', 'connected', 'ended'
  const [callDuration, setCallDuration] = useState(0);
  const audioContextRef = useRef(null);
  const ringOscillatorRef = useRef(null);
  const ringIntervalRef = useRef(null);

  // Play realistic phone ring using Web Audio API Oscillator
  const startRingtone = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const playBeep = () => {
        if (!audioContextRef.current) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(480, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
      };

      playBeep();
      ringIntervalRef.current = setInterval(playBeep, 2500);
    } catch (e) {
      console.warn('Audio ringtone fallback:', e);
    }
  };

  const stopRingtone = () => {
    if (ringIntervalRef.current) clearInterval(ringIntervalRef.current);
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCallState('ringing');
      setCallDuration(0);
      startRingtone();
    } else {
      stopRingtone();
    }
    return () => stopRingtone();
  }, [isOpen]);

  // Handle Answer Call
  const handleAnswer = () => {
    stopRingtone();
    setCallState('connected');
    speakText(`Hey Priya, where are you right now? Dad and I are waiting in the car outside the gate. Come out right now, we need to leave immediately!`);
  };

  const handleUserReply = (userSpokenText, callerFollowup) => {
    speakText(callerFollowup);
  };

  const handleEndCall = () => {
    stopRingtone();
    window.speechSynthesis?.cancel();
    setCallState('ended');
    setTimeout(() => {
      onClose();
    }, 600);
  };

  // Call duration counter
  useEffect(() => {
    let interval;
    if (callState === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-black rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col items-center justify-between min-h-[520px]">
        
        {/* Caller Header */}
        <div className="text-center mt-6 w-full">
          <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-rose-500/50 mx-auto flex items-center justify-center mb-3 shadow-xl relative">
            <User className="w-12 h-12 text-slate-300" />
            {callState === 'ringing' && (
              <span className="absolute inset-0 rounded-full border-2 border-rose-500 animate-ping"></span>
            )}
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">{callerName}</h2>
          <p className="text-xs text-rose-400 font-medium mt-1">
            {callState === 'ringing' && 'Incoming Call...'}
            {callState === 'connected' && `Call in progress • ${formatSeconds(callDuration)}`}
            {callState === 'ended' && 'Call Ended'}
          </p>
        </div>

        {/* Mid section during active call */}
        {callState === 'connected' && (
          <div className="w-full bg-slate-900/90 rounded-2xl p-3 border border-slate-800 my-4 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
              <Volume2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Tap a scripted excuse to prompt caller:</span>
            </div>
            <button
              onClick={() => handleUserReply(
                "Yes Mom, I'm walking to the car right now!",
                "Okay hurry up, we are parked right in front with the hazards on."
              )}
              className="w-full text-left p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-200 transition"
            >
              "Yes Mom, I'm walking to the car right now!"
            </button>
            <button
              onClick={() => handleUserReply(
                "I'm at the gate in 30 seconds, see you right now.",
                "Alright, we can see the gate lights, walk straight out."
              )}
              className="w-full text-left p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-200 transition"
            >
              "I'm at the gate in 30 seconds, see you right now."
            </button>
          </div>
        )}

        {/* Caller selection if still ringing */}
        {callState === 'ringing' && (
          <div className="flex gap-2 text-xs">
            {['Mom', 'Dad', 'Hostel Warden', 'Brother'].map(name => (
              <button
                key={name}
                onClick={() => setCallerName(name)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] ${
                  callerName === name ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        )}

        {/* Action Call Buttons */}
        <div className="w-full flex items-center justify-around mt-8 mb-4">
          {callState === 'ringing' ? (
            <>
              {/* Decline Button */}
              <button
                onClick={handleEndCall}
                className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center text-white shadow-lg active:scale-90 transition"
              >
                <PhoneOff className="w-7 h-7" />
              </button>

              {/* Accept Button */}
              <button
                onClick={handleAnswer}
                className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-900/60 animate-bounce active:scale-90 transition"
              >
                <Phone className="w-7 h-7" />
              </button>
            </>
          ) : (
            <button
              onClick={handleEndCall}
              className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center text-white shadow-xl shadow-red-900/50 active:scale-95 transition"
            >
              <PhoneOff className="w-8 h-8" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
