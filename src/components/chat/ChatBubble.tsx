import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import { ChatMessage } from '../../types/chat';

export const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <View
      style={[styles.row, isUser ? styles.rowUser : styles.rowAssistant]}
      accessibilityRole="text"
      accessibilityLabel={`${isUser ? 'You' : 'Assistant'}: ${message.text}`}
    >
      <View style={[styles.bubble, isUser ? styles.user : styles.assistant]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.assistantText]}>{message.text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    marginHorizontal: 16,
    marginBottom: 10,
  },
  rowUser: {
    alignItems: 'flex-end',
  },
  rowAssistant: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '88%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  user: {
    backgroundColor: Colors.safetyGreen,
  },
  assistant: {
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: Colors.hairlineRing,
  },
  text: {
    ...Typography.body,
  },
  userText: {
    color: Colors.textOnColor,
    fontWeight: '600',
  },
  assistantText: {
    color: Colors.textPrimary,
  },
});
