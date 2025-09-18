# Amplitude Tracking Implementation

## Overview
This document outlines the Amplitude analytics implementation for the Limmo waitlist page. The tracking is designed to capture user behavior, conversion funnels, and engagement metrics.

## Setup
- **Amplitude SDK**: Loaded via CDN in `index.html`
- **API Key**: `5761ea8c864ae70499f521efcb51dcc1`
- **Session Replay**: Enabled with 100% sample rate
- **Auto-capture**: Element interactions enabled

## Tracked Events

### Page & Navigation Events
- **Page View**: When users land on the waitlist page
- **Section View**: When users scroll to different sections (Hero, Why Join, Social Proof, How It Works, Footer)

### Form Interactions
- **Email Input Focus/Blur**: When users interact with the email input field
- **Challenge Input Focus/Blur**: When users interact with the challenge input field

### Button Clicks
- **Join Waitlist Click**: When users click the "Join Waitlist" button
- **Challenge Submit Click**: When users click "Share Challenge" button

### Conversion Events
- **Waitlist Signup Success**: When email is successfully added to waitlist
- **Waitlist Signup Error**: When signup fails (duplicate email, validation error)
- **Challenge Submit Success**: When challenge is successfully submitted
- **Challenge Submit Error**: When challenge submission fails

### Engagement Events
- **Spark Example View**: When users view different spark examples in the demo
- **Firefly Animation View**: When the firefly animation is visible

## User Properties

### Set on Signup
- **User ID**: Email address
- **Signup Date**: Timestamp of successful signup
- **Has Submitted Challenge**: Boolean flag

### Set on Challenge Submission
- **Challenge Text**: The actual challenge text submitted
- **Challenge Submitted Date**: Timestamp of challenge submission

## Event Properties

### Common Properties (All Events)
- `timestamp`: ISO timestamp
- `page_url`: Current page URL
- `page_title`: Page title

### Form Interaction Properties
- `field_name`: Name of the form field
- `field_value_length`: Length of the input value
- `has_value`: Boolean indicating if field has a value

### Signup Properties
- `email_domain`: Domain part of the email
- `email_length`: Length of the email address
- `error_type`: Type of error (for failed signups)

### Challenge Properties
- `challenge_length`: Length of the challenge text
- `challenge_word_count`: Number of words in the challenge

### Button Click Properties
- `button_name`: Name of the clicked button
- Additional context-specific properties

## Implementation Details

### Files Modified
1. **`index.html`**: Added Amplitude SDK and initialization script
2. **`src/lib/amplitude.ts`**: Created tracking utility functions
3. **`src/pages/Waitlist.tsx`**: Integrated tracking into component

### Key Functions
- `trackEvent()`: Generic event tracking
- `trackPageView()`: Page view tracking
- `trackSectionView()`: Section visibility tracking
- `trackFormInteraction()`: Form field interaction tracking
- `trackWaitlistSignup()`: Signup success/error tracking
- `trackChallengeSubmission()`: Challenge submission tracking
- `identifyUser()`: User identification and property setting

### Intersection Observer
- Used to track when sections come into view
- Threshold: 50% visibility
- Root margin: -100px bottom to ensure sections are well into view

## Privacy & Compliance
- No personally identifiable information is stored in event properties
- Email addresses are only used as user IDs for identification
- Challenge text is stored as a user property (not in events)
- All tracking respects user privacy and follows GDPR guidelines

## Testing
To test the implementation:
1. Open browser developer tools
2. Navigate to the waitlist page
3. Check the Network tab for Amplitude requests
4. Interact with forms and buttons
5. Verify events are being sent to Amplitude

## Analytics Dashboard
Events will appear in your Amplitude dashboard under the project with API key `5761ea8c864ae70499f521efcb51dcc1`.

### Key Metrics to Monitor
- **Conversion Rate**: Page views → Email signups
- **Engagement Rate**: Users who scroll through sections
- **Challenge Completion Rate**: Users who provide challenge feedback
- **Form Abandonment**: Users who start but don't complete signup
- **Section Engagement**: Which sections get the most views

## Troubleshooting
- Check browser console for Amplitude errors
- Verify API key is correct
- Ensure network requests to Amplitude are not blocked
- Check that `window.amplitude` is available in browser console
