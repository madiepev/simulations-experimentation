# GitHub Pages Deployment Guide

This document provides instructions for deploying the Fine-Tuning AI Models interactive exercise to GitHub Pages.

## Quick Deployment

The exercise is already configured for GitHub Pages deployment. Follow these steps:

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **Deploy from a branch**
5. Choose **main** branch and **/ (root)** folder
6. Click **Save**

### 2. Access Your Exercise

Once deployed, your exercise will be available at:
```
https://[username].github.io/[repository-name]/docs/
```

For this repository:
```
https://madiepev.github.io/simulations-experimentation/docs/
```

## Alternative: Custom Domain

If you want to use a custom domain:

1. Add a `CNAME` file to the `docs/` folder with your domain name
2. Configure your domain's DNS settings
3. Update the GitHub Pages settings to use your custom domain

## File Structure for GitHub Pages

```
repository-root/
├── docs/                 # GitHub Pages source directory
│   ├── index.html       # Main exercise file
│   ├── styles.css       # Styling
│   └── script.js        # Interactive functionality
├── _config.yml          # Jekyll configuration
└── README.md           # Repository documentation
```

## Testing Locally

Before deploying, you can test the exercise locally:

1. Navigate to the `docs/` folder
2. Start a local server:
   ```bash
   python -m http.server 8000
   ```
3. Open `http://localhost:8000` in your browser

## Troubleshooting

### Exercise Not Loading
- Ensure all files are in the `docs/` folder
- Check that GitHub Pages is enabled and set to the correct branch
- Wait a few minutes for deployment to complete

### Styling Issues
- Verify that `styles.css` is in the same directory as `index.html`
- Check the browser console for any 404 errors

### Interactive Features Not Working
- Ensure `script.js` is loading properly
- Check browser console for JavaScript errors
- Verify that Font Awesome icons are loading from the CDN

## Updates and Maintenance

To update the exercise:

1. Make changes to files in the `docs/` folder
2. Commit and push to the main branch
3. GitHub Pages will automatically redeploy within a few minutes

## Performance Optimization

The exercise is already optimized for GitHub Pages:
- ✅ Pure HTML, CSS, and JavaScript (no build process required)
- ✅ Responsive design for all device sizes
- ✅ Optimized images and fonts from CDN
- ✅ Minimal dependencies for fast loading

## Analytics (Optional)

To track usage analytics:

1. Set up Google Analytics
2. Add your tracking ID to `_config.yml`:
   ```yaml
   google_analytics: G-XXXXXXXXXX
   ```

## Security Considerations

- ✅ No server-side code or databases
- ✅ All data processing happens in the browser
- ✅ No sensitive information stored or transmitted
- ✅ HTTPS enabled by default on GitHub Pages
