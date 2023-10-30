import * as constant from "./const.js";

export async function storeSuggestCandidates(candidate) {
  const oldCandidates = await fetchSuggestCandidates();
  const newCandidates = appendSuggestion(oldCandidates, candidate);
  chrome.storage.local.set({ suggestCandidates: newCandidates });
}

export async function findSuggestCandidate(word) {
  const candidates = await fetchSuggestCandidates();
  const suggest = candidates.find((c) => {
    if (c.startsWith(word)) {
      return c;
    }
  });
  return suggest;
}

//////////////////
// Private Methods
//////////////////

async function fetchSuggestCandidates() {
  const { suggestCandidates } = await chrome.storage.local.get({
    suggestCandidates: [],
  });
  return suggestCandidates;
}

function appendSuggestion(candidates, candidate) {
  const _candidates = Array.from(new Set([candidate, ...candidates]));
  if (_candidates.length > constant.MAX_SUGGEST_CANDIDATES) {
    _candidates.splice(
      -1 * (_candidates.length - constant.MAX_SUGGEST_CANDIDATES),
    );
  }
  return _candidates;
}
