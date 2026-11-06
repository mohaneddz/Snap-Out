const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeDomain, matchesDomain, domainRegex, parseWebUrl } = require('../shared.js');

test('normalizes a domain or URL without losing the host boundary', () => {
  assert.equal(normalizeDomain('  HTTPS://WWW.YouTube.com/watch?v=1  '), 'youtube.com');
  assert.equal(normalizeDomain('example.com:8080/path'), 'example.com');
  assert.equal(normalizeDomain('localhost'), 'localhost');
  assert.equal(normalizeDomain('https://user:pass@example.com'), null);
  assert.equal(normalizeDomain('not a domain'), null);
  assert.equal(normalizeDomain('chrome://settings'), null);
});

test('matches the exact host and subdomains, not lookalike hosts', () => {
  assert.equal(matchesDomain('youtube.com', 'youtube.com'), true);
  assert.equal(matchesDomain('music.youtube.com', 'youtube.com'), true);
  assert.equal(matchesDomain('youtube.com.evil.test', 'youtube.com'), false);
  assert.equal(matchesDomain('notyoutube.com', 'youtube.com'), false);
});

test('request rule covers HTTP(S) navigation but not unrelated hosts', () => {
  const rule = new RegExp(domainRegex('youtube.com'));
  assert.equal(rule.test('https://www.youtube.com/watch?v=1'), true);
  assert.equal(rule.test('http://youtube.com:8080/'), true);
  assert.equal(rule.test('https://youtube.com.evil.test/'), false);
  assert.equal(rule.test('https://example.test/?next=youtube.com'), false);
  assert.equal(rule.test('ftp://youtube.com/'), false);
});

test('only web URLs can be resumed', () => {
  assert.equal(parseWebUrl('https://example.com/a')?.hostname, 'example.com');
  assert.equal(parseWebUrl('javascript:alert(1)'), null);
  assert.equal(parseWebUrl('chrome://extensions'), null);
});
