import React, { useState, useEffect, useRef } from 'react';
import supabase from '../../supabase';
import HeaderShop from './HeaderShop';
import SideMenu from './SideMenu';

const SpeechToText = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [speechRate, setSpeechRate] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);
  
  const recognitionRef = useRef<any>(null);
  const synth = window.speechSynthesis;

  // Supported languages for speech recognition
  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'es-ES', name: 'Spanish (Spain)' },
    { code: 'fr-FR', name: 'French (France)' },
    { code: 'de-DE', name: 'German (Germany)' },
    { code: 'it-IT', name: 'Italian (Italy)' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)' },
    { code: 'ja-JP', name: 'Japanese (Japan)' },
    { code: 'ko-KR', name: 'Korean (Korea)' },
    { code: 'zh-CN', name: 'Chinese (China)' },
  ];

  useEffect(() => {
    // Check browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in your browser. Try Chrome or Edge.');
    }

    // Load available voices for text-to-speech
    loadVoices();
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synth.speaking) {
        synth.cancel();
      }
    };
  }, []);

  const loadVoices = () => {
    // Load voices with delay for Chrome
    setTimeout(() => {
      const voices = synth.getVoices();
      setAvailableVoices(voices);
      
      // Try to find a default voice matching selected language
      const defaultVoice = voices.find(voice => voice.lang === selectedLanguage);
      if (defaultVoice) {
        setSelectedVoice(defaultVoice.name);
      }
    }, 100);
  };

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition not supported');
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.lang = selectedLanguage;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.continuous = true;

    recognitionRef.current.onstart = () => {
      setIsRecording(true);
      setError(null);
    };

    recognitionRef.current.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart + ' ';
        } else {
          interimTranscript += transcriptPart;
        }
      }

      setTranscript(prev => {
        const baseText = prev.endsWith(' ') ? prev.slice(0, -1) : prev;
        return baseText + (baseText ? ' ' : '') + finalTranscript + interimTranscript;
      });
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        setError('No speech detected. Please try again.');
      } else if (event.error === 'audio-capture') {
        setError('No microphone found. Please check your microphone.');
      } else if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone access.');
      } else {
        setError(`Error: ${event.error}`);
      }
      setIsRecording(false);
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
    };

    try {
      recognitionRef.current.start();
    } catch (err) {
      setError('Failed to start recording');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setError(null);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      alert('Transcript copied to clipboard!');
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const speakText = () => {
    if (!transcript.trim()) {
      setError('No text to speak');
      return;
    }

    if (synth.speaking) {
      synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(transcript);
    utterance.lang = selectedLanguage;
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;

    if (selectedVoice) {
      const voice = availableVoices.find(v => v.name === selectedVoice);
      if (voice) {
        utterance.voice = voice;
      }
    }

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setError('Failed to speak text');
    };

    synth.speak(utterance);
  };

  const saveTranscript = async () => {
    if (!transcript.trim()) {
      setError('No transcript to save');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('speech_transcripts')
        .insert([
          {
            transcript,
            language: selectedLanguage,
            created_at: new Date().toISOString(),
          }
        ]);

      if (error) throw error;
      
      alert('Transcript saved successfully!');
    } catch (err: any) {
      console.error('Error saving transcript:', err);
      setError(err.message || 'Failed to save transcript');
    } finally {
      setLoading(false);
    }
  };

  // Style for the recording indicator
  const recordingIndicatorStyle = {
    position: 'fixed' as const,
    bottom: '20px',
    right: '20px',
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '6px',
    fontWeight: '600' as const,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    animation: 'pulse 2s infinite',
    zIndex: 1000,
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <HeaderShop onMenuClick={() => setMenuOpen(true)} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ 
          fontSize: '36px', 
          fontWeight: 'bold', 
          color: '#0369a1',
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          Speech to Text Converter
        </h1>
        
        <div style={{ 
          width: '80%', 
          margin: '0 auto',
          marginBottom: '40px'
        }}>
          {/* Language Selection */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#0369a1',
              marginBottom: '12px'
            }}>
              Select Language
            </h2>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '16px',
                backgroundColor: 'white',
                color: '#374151'
              }}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Text-to-Speech Settings */}
          <div style={{ 
            backgroundColor: 'white', 
            padding: '24px', 
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#0369a1',
              marginBottom: '16px'
            }}>
              Text-to-Speech Settings
            </h2>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#374151' }}>
                Voice:
              </label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="">Default Voice</option>
                {availableVoices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#374151' }}>
                  Speed: {speechRate.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    background: '#e5e7eb',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#374151' }}>
                  Pitch: {speechPitch.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechPitch}
                  onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    background: '#e5e7eb',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Recording Controls */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '32px'
          }}>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              style={{
                padding: '12px 32px',
                border: 'none',
                background: isRecording ? '#ef4444' : '#10b981',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                borderRadius: '6px',
                transition: 'all 0.2s',
                minWidth: '160px'
              }}
              onMouseEnter={(e) => {
                if (isRecording) {
                  (e.target as HTMLElement).style.backgroundColor = '#dc2626';
                } else {
                  (e.target as HTMLElement).style.backgroundColor = '#059669';
                }
              }}
              onMouseLeave={(e) => {
                if (isRecording) {
                  (e.target as HTMLElement).style.backgroundColor = '#ef4444';
                } else {
                  (e.target as HTMLElement).style.backgroundColor = '#10b981';
                }
              }}
            >
              {isRecording ? '⏹️ Stop Recording' : '🎤 Start Recording'}
            </button>

            <button
              onClick={clearTranscript}
              style={{
                padding: '12px 32px',
                border: 'none',
                background: '#6b7280',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                borderRadius: '6px',
                transition: 'all 0.2s',
                minWidth: '160px'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#4b5563';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#6b7280';
              }}
            >
              🗑️ Clear Text
            </button>

            <button
              onClick={speakText}
              style={{
                padding: '12px 32px',
                border: 'none',
                background: '#3b82f6',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                borderRadius: '6px',
                transition: 'all 0.2s',
                minWidth: '160px'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#3b82f6';
              }}
            >
              🔊 Speak Text
            </button>
          </div>

          {/* Transcript Display */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#0369a1'
              }}>
                Transcript
              </h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={copyToClipboard}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    background: '#8b5cf6',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = '#7c3aed';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = '#8b5cf6';
                  }}
                >
                  📋 Copy
                </button>

                <button
                  onClick={saveTranscript}
                  disabled={loading}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    background: loading ? '#9ca3af' : '#10b981',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    borderRadius: '4px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      (e.target as HTMLElement).style.backgroundColor = '#059669';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      (e.target as HTMLElement).style.backgroundColor = '#10b981';
                    }
                  }}
                >
                  {loading ? 'Saving...' : '💾 Save'}
                </button>
              </div>
            </div>

            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Transcript will appear here when you start recording..."
              style={{
                width: '100%',
                minHeight: '200px',
                padding: '16px',
                border: '2px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '16px',
                backgroundColor: 'white',
                color: '#374151',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Status/Error Display */}
          {error && (
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#fee2e2',
              borderLeft: '4px solid #ef4444',
              borderRadius: '4px',
              marginBottom: '24px'
            }}>
              <p style={{ 
                color: '#dc2626', 
                fontSize: '16px',
                margin: 0
              }}>
                {error}
              </p>
            </div>
          )}

          {/* Instructions */}
          <div style={{ 
            backgroundColor: '#e0f2fe', 
            padding: '20px', 
            borderRadius: '6px',
            border: '1px solid #bae6fd'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#0369a1',
              marginBottom: '12px'
            }}>
              How to Use:
            </h3>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0,
              margin: 0,
              color: '#374151'
            }}>
              <li style={{ marginBottom: '8px' }}>1. Select your language from the dropdown</li>
              <li style={{ marginBottom: '8px' }}>2. Click "Start Recording" to begin speech recognition</li>
              <li style={{ marginBottom: '8px' }}>3. Speak clearly into your microphone</li>
              <li style={{ marginBottom: '8px' }}>4. Click "Stop Recording" when finished</li>
              <li style={{ marginBottom: '8px' }}>5. Use "Speak Text" to hear the transcript read aloud</li>
              <li style={{ marginBottom: '8px' }}>6. Copy or save your transcript as needed</li>
            </ul>
          </div>

          {/* Recording Status */}
          {isRecording && (
            <div style={recordingIndicatorStyle}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: 'white',
                borderRadius: '50%',
                animation: 'pulse 1s infinite'
              }} />
              Recording...
            </div>
          )}
        </div>
      </main>

      {/* Add CSS animation */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default SpeechToText;