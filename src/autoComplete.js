import * as constant from "./const.js";

export async function storeAutoCompleteCandidates(candidate) {
  const oldCandidates = await fetchAutoCompleteCandidates();
  const newCandidates = appendCandidates(oldCandidates, candidate);
  chrome.storage.local.set({ suggestCandidates: newCandidates });
}

export async function findAutoCompleteCandidate(word) {
  const candidates = await fetchAutoCompleteCandidates();
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

async function fetchAutoCompleteCandidates() {
  const { suggestCandidates } = await chrome.storage.local.get({
    suggestCandidates: [],
  });
  return suggestCandidates;
}

function appendCandidates(candidates, candidate) {
  const _candidates = Array.from(new Set([candidate, ...candidates]));
  if (_candidates.length > constant.MAX_SUGGEST_CANDIDATES) {
    _candidates.splice(
      -1 * (_candidates.length - constant.MAX_SUGGEST_CANDIDATES),
    );
  }
  return _candidates;
}
