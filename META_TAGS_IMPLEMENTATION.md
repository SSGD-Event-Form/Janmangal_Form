# Dynamic Meta Tags Implementation

## Overview
This implementation provides dynamic Open Graph (OG) meta tags that change based on the current route/page. The meta tags are automatically updated when users navigate between different sections of the application.

## Features

### 1. Dynamic OG Title Updates
- **Home Page (`/`)**: `જનમંગલ મહોત્સવ ૨૦૨૬ - તા. ૦૨-૦૧-૨૦૨૬ થી ૦૮-૦૧-૨૦૨૬ (ઉતારા વ્યવસ્થા ફોર્મ)`
- **Utara Forms (`/gu`, `/en`)**: `જનમંગલ મહોત્સવ ૨૦૨૬ - તા. ૦૨-૦૧-૨૦૨૬ થી ૦૮-૦૧-૨૦૨૬ (ઉતારા વ્યવસ્થા ફોર્મ)`
- **Swayam Sevak Form (`/swayamsevak-form`)**: `જનમંગલ મહોત્સવ ૨૦૨૬ - સ્વયંસેવક ફોર્મ`

### 2. Dynamic OG Description Updates
- **Home Page**: `શ્રી સ્વામિનારાયણ સંસ્કારધામ ગુરૂકુલ - ધ્રાંગધ્રા | તા. ૦૨-૦૧-૨૦૨૬ થી ૦૮-૦૧-૨૦૨૬ (ઉતારા વ્યવસ્થા ફોર્મ)`
- **Utara Forms**: `શ્રી સ્વામિનારાયણ સંસ્કારધામ ગુરૂકુલ - ધ્રાંગધ્રા | તા. ૦૨-૦૧-૨૦૨૬ થી ૦૮-૦૧-૨૦૨૬ (ઉતારા વ્યવસ્થા ફોર્મ)`
- **Swayam Sevak Form**: `શ્રી સ્વામિનારાયણ સંસ્કારધામ ગુરૂકુલ - ધ્રાંગધ્રા | સ્વયંસેવક ફોર્મ`

### 3. Navigation Links
- Added links to the Swayam Sevak form from both Gujarati and English forms
- Links appear in the seva (service) section when users select "Yes" for volunteering

## Implementation Details

### Files Modified/Created

1. **`src/hooks/useMetaTags.js`** (New)
   - Custom React hook that manages dynamic meta tag updates
   - Uses `useLocation` from React Router to detect route changes
   - Updates both `og:title` and `og:description` meta tags
   - Updates the page title dynamically

2. **`src/App.jsx`** (Modified)
   - Added import for `useMetaTags` hook
   - Added the hook call to enable dynamic meta tag updates
   - Added test route for demonstration

3. **`src/pages/GUForm.jsx`** (Modified)
   - Added navigation link to Swayam Sevak form in the seva section
   - Link appears when user selects "હા" (Yes) for seva

4. **`src/pages/ENForm.jsx`** (Modified)
   - Added navigation link to Swayam Sevak form in the seva section
   - Link appears when user selects "Yes" for seva

5. **`index.html`** (Modified)
   - Updated default `og:title` to be more generic
   - Meta tags are now dynamically updated by React

6. **`src/components/MetaTagTest.jsx`** (New)
   - Test component to demonstrate the functionality
   - Accessible at `/test-meta` route

## How It Works

1. **Route Detection**: The `useMetaTags` hook uses `useLocation` to detect when the route changes
2. **Meta Tag Selection**: Based on the current path, it selects appropriate title and description
3. **DOM Manipulation**: It finds existing meta tags or creates new ones and updates their content
4. **Page Title Update**: Also updates the document title for better SEO

## Testing

To test the implementation:

1. Start the development server: `npm run dev`
2. Navigate to `/test-meta` to see the test interface
3. Use the navigation buttons to switch between routes
4. Check the browser's developer tools to see meta tag updates
5. Use social media debugging tools to verify OG tags

## Social Media Sharing

When users share links to different sections:
- **Utara links** will show accommodation-related titles
- **Swayam Sevak links** will show seva-related titles
- **Home page links** will show general festival information

## Browser Compatibility

This implementation works in all modern browsers and uses standard DOM APIs for meta tag manipulation.

## SEO Benefits

- Better social media sharing with context-specific titles
- Improved search engine understanding of different sections
- Dynamic page titles for better user experience
- Proper Open Graph tags for social media platforms 