const fs = require('fs');
const path = require('path');

// 1. Read environment variables from .env
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.error('Error: .env file not found. Please ensure it is in the root directory.');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const parts = trimmed.split('=');
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim();
    env[key] = val;
  });
  return env;
}

const env = loadEnv();
const FIGMA_TOKEN = env.FIGMA_PERSONAL_ACCESS_TOKEN;
const FIGMA_FILE_KEY = env.FIGMA_FILE_KEY;

if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
  console.error('Error: FIGMA_PERSONAL_ACCESS_TOKEN or FIGMA_FILE_KEY is missing in .env file.');
  process.exit(1);
}

// Helper to convert Figma RGB float color to HEX
function figmaColorToHex(c) {
  if (!c) return null;
  const r = Math.round(c.r * 255).toString(16).padStart(2, '0');
  const g = Math.round(c.g * 255).toString(16).padStart(2, '0');
  const b = Math.round(c.b * 255).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

// 2. Fetch the Figma File
async function syncFigma() {
  console.log('🔄 Fetching latest design from Figma API...');
  const url = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}`;
  
  try {
    const res = await fetch(url, {
      headers: {
        'X-Figma-Token': FIGMA_TOKEN
      }
    });
    
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(`Figma API error (Status ${res.status}): ${errData.err || res.statusText}`);
    }
    
    const fileData = await res.json();
    console.log(`✅ Successfully downloaded: "${fileData.name}"`);
    console.log(`   Last modified: ${fileData.lastModified}`);
    
    // Save raw file
    const outputPath = path.join(__dirname, '..', 'figma_all.json');
    fs.writeFileSync(outputPath, JSON.stringify(fileData, null, 2), 'utf8');
    console.log(`📁 Saved raw Figma tree to: figma_all.json`);
    
    // Initialize default theme tokens
    const theme = {
      colors: {
        primary: '#1a80ff',
        primaryHover: '#5aaaff',
        ctaDark: '#023e8a',
        link: '#5aaaff',
        textDark: '#111827',
        textGray: '#6b7280',
        textBlack: '#000000',
        textMuted: '#9ca3af',
        white: '#ffffff',
        footerBg: '#f9f8f6',
        inputBg: '#ffffff',
        inputDisabledBg: '#f8f9fa',
        inputBorder: '#e2e8f0',
        inputFocusBorder: '#5aaaff',
        border: '#e2e8f0',
        ghostHoverBg: '#f3f4f6',
        secondaryBg: '#e8f2ff',
        secondaryHoverBg: '#d4e9ff',
        secondaryText: '#5aaaff',
        avatarBg: '#e8eaf0',
        avatarIcon: '#9da3b4',
        errorText: '#ef4444',
        tabActiveBorder: '#1a80ff',
      }
    };
    
    // 3. Traverse the node tree to find custom styles
    console.log('🔍 Analyzing Figma layers to extract design tokens...');
    const extractedColors = {};
    
    function traverse(node) {
      if (!node) return;
      
      // Analyze Node details to extract style parameters
      const name = node.name ? node.name.toLowerCase() : '';
      
      // Look for Primary / Brand colors (fills)
      if (name.includes('primary_button') || name.includes('primary button') || name.includes('btn-primary')) {
        const fills = node.fills || [];
        const solidFill = fills.find(f => f.type === 'SOLID');
        if (solidFill && solidFill.color) {
          const hex = figmaColorToHex(solidFill.color);
          if (hex) extractedColors.ctaDark = hex;
        }
      }
      
      // Look for custom primary brand fills
      if (name === 'primary' || name === 'brand') {
        const fills = node.fills || [];
        const solidFill = fills.find(f => f.type === 'SOLID');
        if (solidFill && solidFill.color) {
          const hex = figmaColorToHex(solidFill.color);
          if (hex) extractedColors.primary = hex;
        }
      }
      
      // Look for standard body text colors
      if (node.type === 'TEXT') {
        const textContent = node.characters ? node.characters.toLowerCase() : '';
        const fills = node.fills || [];
        const solidFill = fills.find(f => f.type === 'SOLID');
        
        if (solidFill && solidFill.color) {
          const hex = figmaColorToHex(solidFill.color);
          if (hex) {
            if (textContent.includes('번호') || textContent.includes('비밀번호') || name.includes('dark')) {
              extractedColors.textDark = hex;
            } else if (textContent.includes('숫자만') || name.includes('muted')) {
              extractedColors.textMuted = hex;
            } else if (name.includes('gray') || name.includes('gnb') || name.includes('nav')) {
              extractedColors.textGray = hex;
            }
          }
        }
      }
      
      // Look for border/stroke colors from headers or inputs
      if (name.includes('header') || name.includes('input') || name.includes('border')) {
        const strokes = node.strokes || [];
        const solidStroke = strokes.find(s => s.type === 'SOLID');
        if (solidStroke && solidStroke.color) {
          const hex = figmaColorToHex(solidStroke.color);
          if (hex) {
            extractedColors.border = hex;
            extractedColors.inputBorder = hex;
          }
        }
      }
      
      // Recurse children
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(traverse);
      }
    }
    
    // Start traversal from document
    traverse(fileData.document);
    
    // Apply extracted colors to our theme
    let syncCount = 0;
    Object.entries(extractedColors).forEach(([key, value]) => {
      if (theme.colors[key] && theme.colors[key] !== value) {
        console.log(`✨ Style Sync: ${key} color updated from ${theme.colors[key]} to ${value}`);
        theme.colors[key] = value;
        syncCount++;
      }
    });
    
    if (syncCount === 0) {
      console.log('ℹ️ All local design tokens are already fully aligned with Figma styles.');
    } else {
      console.log(`✅ Synced ${syncCount} design variables successfully.`);
    }
    
    // Calculate related colors dynamically if primary was updated
    if (extractedColors.primary) {
      theme.colors.primaryHover = extractedColors.primary + 'cc'; // add opacity fallback
      theme.colors.inputFocusBorder = extractedColors.primary;
      theme.colors.tabActiveBorder = extractedColors.primary;
      theme.colors.secondaryText = extractedColors.primary;
    }
    
    // 4. Generate the theme.ts file
    const themeTsPath = path.join(__dirname, '..', 'src', 'styles', 'theme.ts');
    
    const themeContent = `export const colors = {
  primary: '${theme.colors.primary}',
  primaryHover: '${theme.colors.primaryHover}',
  ctaDark: '${theme.colors.ctaDark}',
  link: '${theme.colors.link}',
  textDark: '${theme.colors.textDark}',
  textGray: '${theme.colors.textGray}',
  textBlack: '${theme.colors.textBlack}',
  textMuted: '${theme.colors.textMuted}',
  white: '${theme.colors.white}',
  footerBg: '${theme.colors.footerBg}',
  inputBg: '${theme.colors.inputBg}',
  inputDisabledBg: '${theme.colors.inputDisabledBg}',
  inputBorder: '${theme.colors.inputBorder}',
  inputFocusBorder: '${theme.colors.inputFocusBorder}',
  border: '${theme.colors.border}',
  ghostHoverBg: '${theme.colors.ghostHoverBg}',
  secondaryBg: '${theme.colors.secondaryBg}',
  secondaryHoverBg: '${theme.colors.secondaryHoverBg}',
  secondaryText: '${theme.colors.secondaryText}',
  avatarBg: '${theme.colors.avatarBg}',
  avatarIcon: '${theme.colors.avatarIcon}',
  errorText: '${theme.colors.errorText}',
  tabActiveBorder: '${theme.colors.tabActiveBorder}',
};

export const fonts = {
  family: "'Noto Sans KR', sans-serif",
  size: {
    xs: '13px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
  },
  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

export const layout = {
  headerHeight: '72px',
  contentWidth: '1200px',
  formWidth: '360px',
  inputHeight: '52px',
  buttonHeight: '52px',
  borderRadius: '8px',
};

export const shadows = {
  inputFocus: '0 0 0 3px rgba(90, 170, 255, 0.15)',
};
`;

    fs.writeFileSync(themeTsPath, themeContent, 'utf8');
    console.log(`🚀 Theme file successfully generated: src/styles/theme.ts`);
    
  } catch (error) {
    console.error('❌ Figma Synchronization Failed:', error.message);
    process.exit(1);
  }
}

syncFigma();
