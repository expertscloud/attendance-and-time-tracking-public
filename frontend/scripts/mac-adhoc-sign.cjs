const { execFileSync } = require('node:child_process');
const path = require('node:path');

// macOS refuses to associate an unsigned bundle with Location Services: the
// app cannot be listed (or shows without a name) in System Settings → Privacy
// & Security → Location Services, so users can never grant it location access
// and navigator.geolocation stays blocked forever. An ad-hoc signature binds
// Info.plist (bundle id com.tickly.app, name Tickly) into the code signature,
// which is enough for locationd to show a named "Tickly" row users can enable.
//
// Note: an ad-hoc signature has no stable identity across builds, so the
// Location Services toggle resets after every app update. A Developer ID
// certificate (CSC_LINK) fixes that permanently — when one is configured this
// hook steps aside and electron-builder's own signing (which runs after
// afterPack) takes over. Requires removing "identity": null from build.mac.
exports.default = async function adHocSignMacApp(context) {
  if (context.electronPlatformName !== 'darwin') return;
  if (process.env.CSC_LINK || process.env.CSC_NAME) return;

  const appPath = path.join(context.appOutDir, `${context.packager.appInfo.productFilename}.app`);
  console.log(`  • ad-hoc signing ${appPath} (no signing certificate configured)`);
  execFileSync('codesign', ['--force', '--deep', '--sign', '-', appPath], { stdio: 'inherit' });
};
