// Cache for domains and terms
export const cache = {
  domains: null,
  terms: {},
  timestamp: 0,
};

// Cache duration: 5 minutes
export const CACHE_DURATION = 5 * 60 * 1000;

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// Shared fetch functions
export async function fetchDomains() {
  // Check cache first
  if (cache.domains && Date.now() - cache.timestamp < CACHE_DURATION) {
    return cache.domains;
  }

  const res = await fetch(`${BACKEND_URL}/domains`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const domains = await res.json();
  
  // Update cache
  cache.domains = domains;
  cache.timestamp = Date.now();
  return domains;
}

export async function fetchTerms(domainId) {
  // Check terms cache
  if (cache.terms[domainId] && Date.now() - cache.terms[domainId].timestamp < CACHE_DURATION) {
    return cache.terms[domainId].data;
  }

  const res = await fetch(`${BACKEND_URL}/domains/${domainId}/terms`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const terms = await res.json();
  
  // Update terms cache
  cache.terms[domainId] = {
    data: terms,
    timestamp: Date.now()
  };
  return terms;
}