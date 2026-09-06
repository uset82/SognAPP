import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { triggerEmergencyAlertHaptic } from './haptics';

const ALERT_LOOP_MS = 8000;

let sound: Audio.Sound | null = null;
let stopTimer: ReturnType<typeof setTimeout> | null = null;

const clearStopTimer = () => {
  if (stopTimer) {
    clearTimeout(stopTimer);
    stopTimer = null;
  }
};

export const stopEmergencyAlert = async (): Promise<void> => {
  clearStopTimer();
  if (!sound) {
    return;
  }

  const current = sound;
  sound = null;
  try {
    await current.stopAsync();
  } catch {
    // Already stopped.
  }
  try {
    await current.unloadAsync();
  } catch {
    // Already unloaded.
  }
};

export const playEmergencyAlert = async (): Promise<void> => {
  await stopEmergencyAlert();

  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    });

    triggerEmergencyAlertHaptic();

    const created = await Audio.Sound.createAsync(
      require('../../assets/sounds/sogn-alert.wav'),
      {
        shouldPlay: true,
        isLooping: true,
        volume: 1,
      }
    );
    sound = created.sound;

    stopTimer = setTimeout(() => {
      stopEmergencyAlert().catch(() => undefined);
    }, ALERT_LOOP_MS);
  } catch {
    await stopEmergencyAlert();
  }
};
