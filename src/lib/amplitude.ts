// Amplitude tracking utilities for Limmo waitlist

declare global {
  interface Window {
    amplitude: {
      track: (eventName: string, eventProperties?: Record<string, any>) => void;
      identify: (userId: string, userProperties?: Record<string, any>) => void;
      setUserId: (userId: string) => void;
      setUserProperties: (userProperties: Record<string, any>) => void;
    };
  }
}

// Event names for consistent tracking
export const AMPLITUDE_EVENTS = {
  // Page events
  PAGE_VIEW: 'Page View',
  SECTION_VIEW: 'Section View',
  
  // Form interactions
  EMAIL_INPUT_FOCUS: 'Email Input Focus',
  EMAIL_INPUT_BLUR: 'Email Input Blur',
  CHALLENGE_INPUT_FOCUS: 'Challenge Input Focus',
  CHALLENGE_INPUT_BLUR: 'Challenge Input Blur',
  
  // Button clicks
  JOIN_WAITLIST_CLICK: 'Join Waitlist Click',
  CHALLENGE_SUBMIT_CLICK: 'Challenge Submit Click',
  
  // Success/Error events
  WAITLIST_SIGNUP_SUCCESS: 'Waitlist Signup Success',
  WAITLIST_SIGNUP_ERROR: 'Waitlist Signup Error',
  CHALLENGE_SUBMIT_SUCCESS: 'Challenge Submit Success',
  CHALLENGE_SUBMIT_ERROR: 'Challenge Submit Error',
  
  // Engagement events
  SPARK_EXAMPLE_VIEW: 'Spark Example View',
  FIREFLY_ANIMATION_VIEW: 'Firefly Animation View',
} as const;

// Section names for tracking
export const SECTIONS = {
  HERO: 'Hero Section',
  WHY_JOIN: 'Why Join Limmo',
  SOCIAL_PROOF: 'Social Proof',
  HOW_IT_WORKS: 'How It Works',
  FOOTER: 'Footer',
} as const;

// Check if Amplitude is available
export const isAmplitudeAvailable = (): boolean => {
  return typeof window !== 'undefined' && window.amplitude && typeof window.amplitude.track === 'function';
};

// Track an event with Amplitude
export const trackEvent = (eventName: string, eventProperties?: Record<string, any>) => {
  if (!isAmplitudeAvailable()) {
    console.warn('Amplitude not available, skipping event:', eventName);
    return;
  }

  try {
    window.amplitude.track(eventName, {
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      page_title: document.title,
      ...eventProperties,
    });
  } catch (error) {
    console.error('Error tracking Amplitude event:', error);
  }
};

// Identify a user with Amplitude
export const identifyUser = (userId: string, userProperties?: Record<string, any>) => {
  if (!isAmplitudeAvailable()) {
    console.warn('Amplitude not available, skipping user identification');
    return;
  }

  try {
    window.amplitude.setUserId(userId);
    if (userProperties) {
      window.amplitude.setUserProperties(userProperties);
    }
  } catch (error) {
    console.error('Error identifying user with Amplitude:', error);
  }
};

// Track page view
export const trackPageView = (pageName: string = 'Waitlist Page') => {
  trackEvent(AMPLITUDE_EVENTS.PAGE_VIEW, {
    page_name: pageName,
    referrer: document.referrer,
    user_agent: navigator.userAgent,
  });
};

// Track section view
export const trackSectionView = (sectionName: string) => {
  trackEvent(AMPLITUDE_EVENTS.SECTION_VIEW, {
    section_name: sectionName,
  });
};

// Track form interaction
export const trackFormInteraction = (action: string, fieldName: string, value?: string) => {
  trackEvent(action, {
    field_name: fieldName,
    field_value_length: value?.length || 0,
    has_value: !!value,
  });
};

// Track waitlist signup
export const trackWaitlistSignup = (email: string, success: boolean, errorType?: string) => {
  const eventName = success ? AMPLITUDE_EVENTS.WAITLIST_SIGNUP_SUCCESS : AMPLITUDE_EVENTS.WAITLIST_SIGNUP_ERROR;
  
  trackEvent(eventName, {
    email_domain: email.split('@')[1],
    email_length: email.length,
    error_type: errorType,
  });

  if (success) {
    identifyUser(email, {
      signup_date: new Date().toISOString(),
      has_submitted_challenge: false,
    });
  }
};

// Track challenge submission
export const trackChallengeSubmission = (email: string, challenge: string, success: boolean) => {
  const eventName = success ? AMPLITUDE_EVENTS.CHALLENGE_SUBMIT_SUCCESS : AMPLITUDE_EVENTS.CHALLENGE_SUBMIT_ERROR;
  
  trackEvent(eventName, {
    challenge_length: challenge.length,
    challenge_word_count: challenge.split(' ').length,
  });

  if (success) {
    identifyUser(email, {
      has_submitted_challenge: true,
      challenge_text: challenge,
      challenge_submitted_date: new Date().toISOString(),
    });
  }
};

// Track button clicks
export const trackButtonClick = (buttonName: string, context?: Record<string, any>) => {
  trackEvent('Button Click', {
    button_name: buttonName,
    ...context,
  });
};

// Track spark example views
export const trackSparkExampleView = (exampleIndex: number, quote: string) => {
  trackEvent(AMPLITUDE_EVENTS.SPARK_EXAMPLE_VIEW, {
    example_index: exampleIndex,
    quote_length: quote.length,
    quote_word_count: quote.split(' ').length,
  });
};
