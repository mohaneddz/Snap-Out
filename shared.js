const SnapOut = (() => {
  function parseWebUrl(value) {
    try {
      const url = new URL(value);
      return ['http:', 'https:'].includes(url.protocol) ? url : null;
    } catch {
      return null;
    }
  }

  function normalizeDomain(value) {
    if (typeof value !== 'string') return null;
    const input = value.trim().toLowerCase();
    if (!input || /\s/.test(input)) return null;
    const url = parseWebUrl(input.includes('://') ? input : `https://${input}`);
    if (!url || url.username || url.password) return null;
    const domain = url.hostname.replace(/^www\./, '').replace(/\.$/, '');
    if (domain.length > 253 || (!domain.includes('.') && domain !== 'localhost')) return null;
    if (!domain.split('.').every(label => label.length > 0 && label.length <= 63 && /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label))) return null;
    return domain;
  }

  function matchesDomain(hostname, domain) {
    const host = hostname.toLowerCase().replace(/\.$/, '');
    return host === domain || host.endsWith(`.${domain}`);
  }

  function domainRegex(domain) {
    const escaped = domain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return `^https?://([a-z0-9-]+\\.)*${escaped}(:[0-9]+)?([/?#].*)?$`;
  }

  return { parseWebUrl, normalizeDomain, matchesDomain, domainRegex };
})();

if (typeof module !== 'undefined') module.exports = SnapOut;
