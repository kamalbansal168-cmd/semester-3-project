async function test() {
  try {
    // Provide minimal browser stubs so module top-level evaluation succeeds
    global.window = {};
    global.document = {
      addEventListener: () => {},
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => []
    };
    global.localStorage = {
      getItem: () => null,
      setItem: () => {}
    };
    global.location = { protocol: 'http:', host: 'localhost:3000', pathname: '/', search: '', hash: '' };
    global.window.location = global.location;
    await import('../js/app.js');
    console.log('✓ SUCCESS: app.js parsed and imported without any syntax or runtime errors!');
  } catch (err) {
    console.error('✗ ERROR importing app.js:', err);
    process.exit(1);
  }
}
test();
