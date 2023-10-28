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
  let _candidates = structuredClone(candidates);
  _candidates.unshift(candidate);
  _candidates.reverse().slice(constant.MAX_SUGGEST_CANDIDATES).reverse();
  return _candidates;
}
