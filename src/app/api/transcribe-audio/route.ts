/**
 * Audio Transcription API Endpoint
 * 
 * Converts audio files to text using OpenAI's Whisper API
 * Then processes the transcribed text through the CV chat agent
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication (optional - can be made required)
    const session = await getServerSession(authOptions);
    
    const formData = await request.formData();
    const audioFile = formData.get('audio');
    
    if (!audioFile || !(audioFile instanceof File)) {
      return NextResponse.json(
        { error: 'No audio file provided or invalid file format' },
        { status: 400 }
      );
    }
    const cvDataJson = formData.get('cvData') as string | null;
    const conversationHistoryJson = formData.get('conversationHistory') as string | null;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    console.log('[Transcribe Audio] Processing audio file:', {
      name: audioFile.name,
      type: audioFile.type,
      size: audioFile.size,
    });

    // Validate file size (max 25MB for Whisper API)
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (audioFile.size > maxSize) {
      return NextResponse.json(
        { error: 'Audio file is too large. Maximum size is 25MB.' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/webm',
      'audio/ogg',
      'audio/m4a',
      'audio/x-m4a',
      'audio/mp4',
    ];
    
    const isValidType = allowedTypes.includes(audioFile.type) || 
                        /\.(mp3|wav|webm|ogg|m4a|mp4)$/i.test(audioFile.name);

    if (!isValidType) {
      return NextResponse.json(
        { error: 'Unsupported audio format. Please use MP3, WAV, WebM, OGG, or M4A.' },
        { status: 400 }
      );
    }

    // OpenAI SDK accepts File objects directly
    // audioFile is already a File instance at this point
    const fileToTranscribe = audioFile;

    console.log('[Transcribe Audio] Calling OpenAI Whisper API...');

    // Transcribe audio using Whisper API
    // The SDK accepts File objects directly
    // When response_format is 'text', it returns a string
    const transcription = await openai.audio.transcriptions.create({
      file: fileToTranscribe as any, // OpenAI SDK type compatibility
      model: 'whisper-1',
      language: 'en', // Can be made configurable
      response_format: 'text',
    });

    // When response_format is 'text', transcription is a string
    const transcribedText = typeof transcription === 'string' 
      ? transcription 
      : (transcription as any).text || '';

    console.log('[Transcribe Audio] Transcription completed:', {
      length: transcribedText.length,
      preview: transcribedText.substring(0, 100),
    });

    if (!transcribedText || transcribedText.trim().length === 0) {
      return NextResponse.json(
        { error: 'No speech detected in the audio file.' },
        { status: 400 }
      );
    }

    // Parse CV data and conversation history if provided
    let cvData = null;
    let conversationHistory: Array<{ role: string; content: string }> = [];

    try {
      if (cvDataJson) {
        cvData = JSON.parse(cvDataJson);
      }
      if (conversationHistoryJson) {
        conversationHistory = JSON.parse(conversationHistoryJson);
      }
    } catch (parseError) {
      console.warn('[Transcribe Audio] Failed to parse CV data or conversation history:', parseError);
    }

    // Process the transcribed text through CV chat agent
    console.log('[Transcribe Audio] Processing transcription through CV chat agent...');

    const cvChatResponse = await fetch(`${request.nextUrl.origin}/api/cv-chat-agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: transcribedText,
        cvData: cvData || {},
        conversationHistory: conversationHistory,
      }),
    });

    if (!cvChatResponse.ok) {
      console.error('[Transcribe Audio] CV chat agent error:', cvChatResponse.statusText);
      // Return transcription even if CV processing fails
      return NextResponse.json({
        transcription: transcribedText,
        cvUpdates: {},
        response: `I transcribed your audio: "${transcribedText.substring(0, 200)}${transcribedText.length > 200 ? '...' : ''}"\n\nHowever, I encountered an issue processing it. Please try sending the text directly.`,
        error: 'CV processing failed',
      });
    }

    const cvChatResult = await cvChatResponse.json();

    return NextResponse.json({
      transcription: transcribedText,
      cvUpdates: cvChatResult.cvUpdates || {},
      response: cvChatResult.response || `I heard you say: "${transcribedText.substring(0, 200)}${transcribedText.length > 200 ? '...' : ''}"`,
      artifactType: cvChatResult.artifactType || 'cv',
      jobs: cvChatResult.jobs || [],
    });

  } catch (error) {
    console.error('[Transcribe Audio] Error:', error);
    
    if (error instanceof Error) {
      // Handle specific OpenAI errors
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again in a moment.' },
          { status: 429 }
        );
      }
      if (error.message.includes('invalid')) {
        return NextResponse.json(
          { error: 'Invalid audio file format. Please ensure the file is a valid audio recording.' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: 'Failed to transcribe audio', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

