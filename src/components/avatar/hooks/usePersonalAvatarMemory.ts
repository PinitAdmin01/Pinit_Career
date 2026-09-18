// hooks/usePersonalAvatarMemory.ts
// 🧠 PERSONAL AVATAR MEMORY & PERSONA SYSTEM
// ✅ User profile storage
// ✅ Conversation history
// ✅ Personality traits
// ✅ Relationship memory
// ✅ Emotional context

import { useRef, useState, useCallback } from 'react';

export const MEMORY_TYPES = {
  PERSONAL_INFO: 'personal_info',
  PREFERENCES: 'preferences',
  CONVERSATION: 'conversation',
  RELATIONSHIPS: 'relationships',
  EMOTIONAL_HISTORY: 'emotional_history',
  AVATAR_TRAITS: 'avatar_traits',
  USER_PATTERNS: 'user_patterns',
} as const;

export type MemoryType = typeof MEMORY_TYPES[keyof typeof MEMORY_TYPES];

export const DEFAULT_PERSONA = {
  name: 'PersonaAI',
  personality: {
    warmth: 0.7,
    humor: 0.6,
    professionalism: 0.8,
    empathy: 0.8,
    curiosity: 0.7,
    patience: 0.8,
  },
  appearance: {
    style: 'friendly',
    formality: 'casual',
    expressiveness: 0.9,
  },
  traits: [
    'attentive',
    'supportive',
    'engaging',
    'thoughtful',
    'responsive',
  ],
};

export interface MemoryRecord {
  id: string;
  type: string;
  data: any;
  metadata: Record<string, any>;
  timestamp: number;
  importance: number;
}

export interface ConversationTurn {
  userMessage: string;
  avatarResponse: string;
  timestamp: number;
  emotionalContext?: string;
  userTone?: string;
  responseStrategy?: string;
  effectiveness?: number;
}

export function usePersonalAvatarMemory(userId?: string) {
  const memoryRef = useRef<Map<string, MemoryRecord[]>>(new Map());
  const conversationHistoryRef = useRef<ConversationTurn[]>([]);
  const personaRef = useRef({ ...DEFAULT_PERSONA });
  const relationshipStateRef = useRef<{
    trustLevel: number;
    connectionStrength: number;
    interactionCount: number;
    lastPositiveInteraction: number | null;
    sharedInterests: string[];
  }>({
    trustLevel: 0.5,
    connectionStrength: 0.3,
    interactionCount: 0,
    lastPositiveInteraction: null,
    sharedInterests: [],
  });

  const [memoryStats, setMemoryStats] = useState<{
    totalMemories: number;
    conversationLength: number;
    lastUpdate: Date | null;
  }>({
    totalMemories: 0,
    conversationLength: 0,
    lastUpdate: null,
  });

  // Initialize or load existing persona
  const initializePersona = useCallback((customPersona = {}) => {
    const newPersona = {
      ...DEFAULT_PERSONA,
      ...customPersona,
      userId,
      createdAt: new Date(),
    };

    personaRef.current = newPersona;
    return newPersona;
  }, [userId]);

  // Store memory
  const storeMemory = useCallback((type: string, data: any, metadata: Record<string, any> = {}) => {
    const memory: MemoryRecord = {
      id: Math.random().toString(36),
      type,
      data,
      metadata,
      timestamp: Date.now(),
      importance: metadata.importance || 0.5,
    };

    if (!memoryRef.current.has(type)) {
      memoryRef.current.set(type, []);
    }

    memoryRef.current.get(type)!.push(memory);

    setMemoryStats({
      totalMemories: Array.from(memoryRef.current.values()).reduce((a, b) => a + b.length, 0),
      conversationLength: conversationHistoryRef.current.length,
      lastUpdate: new Date(),
    });

    return memory;
  }, []);

  // Store user personal info
  const storePersonalInfo = useCallback((info: Record<string, any>) => {
    return storeMemory(MEMORY_TYPES.PERSONAL_INFO, {
      name: info.name,
      age: info.age,
      occupation: info.occupation,
      interests: info.interests,
      goals: info.goals,
      preferences: info.preferences,
    }, { importance: 0.9 });
  }, [storeMemory]);

  // Build relationship context
  const updateRelationshipState = useCallback((context: any) => {
    if (!context) return;

    const rel = relationshipStateRef.current;
    rel.interactionCount += 1;

    if (context.emotion === 'happy' || context.emotion === 'satisfied') {
      rel.trustLevel = Math.min(1, rel.trustLevel + 0.05);
      rel.lastPositiveInteraction = Date.now();
    }

    if (context.engagement > 0.7) {
      rel.connectionStrength = Math.min(1, rel.connectionStrength + 0.03);
    }

    if (context.sharedInterest) {
      if (!rel.sharedInterests.includes(context.sharedInterest)) {
        rel.sharedInterests.push(context.sharedInterest);
      }
    }
  }, []);

  // Store conversation
  const storeConversation = useCallback((userMessage: string, avatarResponse: string, context: Record<string, any> = {}) => {
    const conversation: ConversationTurn = {
      userMessage,
      avatarResponse,
      timestamp: Date.now(),
      emotionalContext: context.emotion,
      userTone: context.tone,
      responseStrategy: context.strategy,
      effectiveness: context.effectiveness || 0.5,
    };

    conversationHistoryRef.current.push(conversation);
    storeMemory(MEMORY_TYPES.CONVERSATION, conversation);
    updateRelationshipState(context);

    return conversation;
  }, [storeMemory, updateRelationshipState]);

  // Store user preferences
  const storePreferences = useCallback((preferences: Record<string, any>) => {
    return storeMemory(MEMORY_TYPES.PREFERENCES, preferences, { importance: 0.7 });
  }, [storeMemory]);

  // Get relevant memories for response
  const getRelevantMemories = useCallback((query: string, limit = 5) => {
    const allMemories: MemoryRecord[] = [];

    for (const [, memories] of memoryRef.current) {
      allMemories.push(...memories);
    }

    allMemories.sort((a, b) => {
      const recencyScore = Math.exp(-(Date.now() - a.timestamp) / (1000 * 60 * 60 * 24));
      const importanceScore = a.importance;
      const queryMatch = String(a.data).toLowerCase().includes(query.toLowerCase()) ? 1 : 0;

      return (importanceScore * 0.4 + recencyScore * 0.3 + queryMatch * 0.3) - 
             (b.importance * 0.4 + Math.exp(-(Date.now() - b.timestamp) / (1000 * 60 * 60 * 24)) * 0.3);
    });

    return allMemories.slice(0, limit);
  }, []);

  // Get conversation context
  const getConversationContext = useCallback((depth = 5) => {
    return conversationHistoryRef.current.slice(-depth);
  }, []);

  // Generate response with memory
  const generateMemoryAwareResponse = useCallback((userInput: string, context: Record<string, any> = {}) => {
    const relevantMemories = getRelevantMemories(userInput, 3);
    const conversationContext = getConversationContext(5);
    const persona = personaRef.current;
    const relationship = relationshipStateRef.current;

    return {
      relevantMemories,
      conversationContext,
      persona,
      relationship,
      userInput,
      ...context,
    };
  }, [getRelevantMemories, getConversationContext]);

  const getPersona = useCallback(() => personaRef.current, []);

  const updatePersonaTraits = useCallback((traits: Record<string, any>) => {
    personaRef.current = {
      ...personaRef.current,
      ...traits,
    };
  }, []);

  const getRelationshipState = useCallback(() => ({
    ...relationshipStateRef.current,
  }), []);

  const exportMemory = useCallback(() => {
    return {
      userId,
      persona: personaRef.current,
      memories: Array.from(memoryRef.current.entries()).filter(([type]) => type !== 'conversation'),
      conversationHistory: [],
      relationshipState: relationshipStateRef.current,
      exportDate: new Date(),
    };
  }, [userId]);

  const importMemory = useCallback((importData: any) => {
    if (importData.userId !== userId) {
      console.warn('⚠️ Memory from different user, caution advised');
    }

    if (importData.persona) {
      personaRef.current = importData.persona;
    }

    if (importData.memories) {
      importData.memories.forEach(([type, memories]: [string, MemoryRecord[]]) => {
        if (type !== 'conversation') {
          memoryRef.current.set(type, memories);
        }
      });
    }

    if (importData.conversationHistory) {
      conversationHistoryRef.current = [];
    }

    if (importData.relationshipState) {
      Object.assign(relationshipStateRef.current, importData.relationshipState);
    }

    setMemoryStats({
      totalMemories: Array.from(memoryRef.current.values()).reduce((a, b) => a + b.length, 0),
      conversationLength: 0,
      lastUpdate: new Date(),
    });
  }, [userId]);

  const clearMemory = useCallback((type: string | null = null) => {
    if (type) {
      memoryRef.current.delete(type);
    } else {
      memoryRef.current.clear();
      conversationHistoryRef.current = [];
      relationshipStateRef.current = {
        trustLevel: 0.5,
        connectionStrength: 0.3,
        interactionCount: 0,
        lastPositiveInteraction: null,
        sharedInterests: [],
      };
    }

    setMemoryStats({
      totalMemories: Array.from(memoryRef.current.values()).reduce((a, b) => a + b.length, 0),
      conversationLength: conversationHistoryRef.current.length,
      lastUpdate: new Date(),
    });
  }, []);

  return {
    storeMemory,
    storePersonalInfo,
    storeConversation,
    storePreferences,
    getRelevantMemories,
    getConversationContext,
    generateMemoryAwareResponse,
    initializePersona,
    getPersona,
    updatePersonaTraits,
    getRelationshipState,
    updateRelationshipState,
    exportMemory,
    importMemory,
    clearMemory,
    memoryStats,
    conversationHistory: conversationHistoryRef.current,
    memoryRef,
    personaRef,
  };
}
