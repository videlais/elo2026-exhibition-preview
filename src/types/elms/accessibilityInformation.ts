// Start of ELMS AccessibilityInformation block
export type ELMSContentTiming =
  | 'fleeting content'
  | 'rapidly moving content'
  | (string & {});

export type ELMSTextFormat =
  | 'italics'
  | 'light fonts'
  | 'moving text'
  | 'other inaccessible text'
  | 'rasterized text'
  | 'sans-serif fonts'
  | 'serif fonts'
  | 'script fonts'
  | 'short reading time'
  | 'small fonts'
  | (string & {});

export type ELMSColorAndContrast =
  | 'color impacts navigation'
  | 'color impacts content'
  | 'low contrast (occasional)'
  | 'low contrast (frequent)'
  | 'low contrast (throughout)'
  | 'visual noise'
  | (string & {});

export type ELMSVisualImpact =
  | 'sudden visual transition(s)'
  | 'flashing lights hazard'
  | 'blinking lights hazard'
  | (string & {});

export type ELMSAuditory =
  | 'sudden sounds'
  | 'inconsistent volume'
  | 'high-pitch sounds'
  | 'low-pitch sounds'
  | (string & {});

export type ELMSTouch =
  | 'capacitive touchscreen'
  | 'cursor click'
  | 'cursor movement'
  | 'text input'
  | 'physical buttons (mouse)'
  | 'physical buttons (other)'
  | 'joystick(s)'
  | 'directional input'
  | 'physical dial(s)'
  | 'physical switch(es)'
  | 'cursor drag'
  | 'persistent grip'
  | 'other'
  | (string & {});

export type ELMSHapticFeedback =
  | 'adaptive input'
  | 'mobile device (vibration)'
  | 'controller (vibration)'
  | 'haptic gloves'
  | 'full-body haptics'
  | (string & {});

export type ELMSRepetitiveMotion =
  | 'frequent repetitive key presses'
  | 'frequent repetitive gestures'
  | 'other repetitive motion'
  | (string & {});

export type ELMSMovementAndGesture =
  | 'eye movement'
  | 'head tracking'
  | 'spatial peripheral manipulation'
  | 'interoception'
  | 'proprioception'
  | 'facial recognition'
  | 'fine motor control'
  | (string & {});

export interface ELMSAccessibilityInformation {
  contentTiming?: ELMSContentTiming[];
  textFormat?: ELMSTextFormat[];
  colorAndContrast?: ELMSColorAndContrast[];
  visualImpact?: ELMSVisualImpact[];
  auditory?: ELMSAuditory[];
  touch?: ELMSTouch[];
  hapticFeedback?: ELMSHapticFeedback[];
  repetitiveMotion?: ELMSRepetitiveMotion[];
  movementAndGesture?: ELMSMovementAndGesture[];
}
