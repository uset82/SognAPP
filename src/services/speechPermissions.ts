import { Platform } from 'react-native';
import { Audio } from 'expo-av';
import { openDeviceSettings } from './notificationService';

export type SpeechPermissionState = 'granted' | 'denied' | 'restricted' | 'undetermined';

export const MIC_PERMISSION_COPY =
  'SOGN SAFE can listen to your question so you do not need to type during an emergency.';

export const SPEECH_PERMISSION_COPY =
  'Speech recognition turns your spoken question into text. Text chat still works if you deny this.';

export const requestSpeechPermissions = async (): Promise<SpeechPermissionState> => {
  if (Platform.OS === 'web') {
    return 'granted';
  }

  try {
    const loaded = require('expo-speech-recognition') as {
      ExpoSpeechRecognitionModule?: {
        requestPermissionsAsync: () => Promise<{ granted: boolean; restricted?: boolean; canAskAgain?: boolean }>;
      };
    };
    const native = loaded.ExpoSpeechRecognitionModule;
    if (native) {
      const result = await native.requestPermissionsAsync();
      if (result.granted) {
        return 'granted';
      }
      if (result.restricted) {
        return 'restricted';
      }
      return result.canAskAgain === false ? 'restricted' : 'denied';
    }
  } catch {
    // Expo Go or missing native module.
  }

  try {
    const result = await Audio.requestPermissionsAsync();
    if (result.granted) {
      return 'granted';
    }
    if (result.canAskAgain === false) {
      return 'restricted';
    }
    return 'denied';
  } catch {
    return 'denied';
  }
};

export const openSpeechSettings = (): void => {
  openDeviceSettings();
};
