'use client';

declare global {
  interface Window {
    mixpanel?: any;
    va?: any;
  }
}

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  // Mixpanel
  if (typeof window !== 'undefined' && window.mixpanel) {
    window.mixpanel.track(eventName, properties);
  }

  // Vercel Analytics
  if (typeof window !== 'undefined' && window.va) {
    window.va('event', { name: eventName, data: properties });
  }

  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', eventName, properties);
  }
}

export function trackStressDetected(level: number, emotion: string) {
  trackEvent('stress_detected', {
    level,
    emotion,
    timestamp: Date.now()
  });
}

export function trackSessionStart(mode: string) {
  trackEvent('session_start', {
    mode,
    timestamp: Date.now()
  });
}

export function trackSessionEnd(score: number, duration: number) {
  trackEvent('session_end', {
    score,
    duration,
    timestamp: Date.now()
  });
}

export function trackCodeExecution(language: string, executionTime: number) {
  trackEvent('code_execution', {
    language,
    executionTime,
    timestamp: Date.now()
  });
}

export function trackAuthFlag(reason: string) {
  trackEvent('auth_flag', {
    reason,
    timestamp: Date.now()
  });
}

export function trackUpgradeClick() {
  trackEvent('upgrade_click', {
    timestamp: Date.now()
  });
}

export function initAnalytics() {
  if (typeof window === 'undefined') return;

  // Mixpanel init
  const mixpanelToken = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  if (mixpanelToken && !window.mixpanel) {
    const script = document.createElement('script');
    script.src = 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js';
    script.onload = () => {
      window.mixpanel?.init(mixpanelToken);
    };
    document.head.appendChild(script);
  }

  // Vercel Analytics init
  if (!window.va) {
    const script = document.createElement('script');
    script.src = '/_vercel/insights/script.js';
    script.defer = true;
    document.head.appendChild(script);
  }
}
