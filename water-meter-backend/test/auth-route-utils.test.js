import test from 'node:test';
import assert from 'node:assert/strict';
import { isSamePage, resolveTargetUrl } from '../../js/utils/route-utils.mjs';

test('resolveTargetUrl builds a correct URL for the current route depth', () => {
  assert.equal(resolveTargetUrl('login.html', 'http://localhost:3000/index.html'), 'http://localhost:3000/login.html');
  assert.equal(resolveTargetUrl('index.html', 'http://localhost:3000/pages/warehouse/inventory.html'), 'http://localhost:3000/index.html');
});

test('isSamePage prevents reload loops when a query string changes', () => {
  assert.equal(isSamePage('login.html', 'http://localhost:3000/login.html?error=security_alert'), true);
  assert.equal(isSamePage('index.html', 'http://localhost:3000/index.html?tab=overview'), true);
  assert.equal(isSamePage('login.html', 'http://localhost:3000/index.html'), false);
});
