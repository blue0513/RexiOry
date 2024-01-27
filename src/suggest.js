export async function fetchSearchSuggestions(searchWord) {
  if (searchWord === "") {
    return [];
  }

  const query = encodeURIComponent(searchWord);
  const url = `https://suggestqueries.google.com/complete/search?output=toolbar&hl=en&q=${query}`;
  const response = await fetch(url);
  const data = await response.text();

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(data, "text/xml");
  const suggestions = xmlDoc.getElementsByTagName("suggestion");

  const suggestionList = [];
  for (let i = 0; i < suggestions.length; i++) {
    const text = suggestions[i].getAttribute("data");
    suggestionList.push({
      title: text,
      url: `https://www.google.com/search?q=${encodeURIComponent(text)}`,
    });
  }

  return (
    suggestionList.map((item) => {
      return {
        title: item.title,
        url: item.url,
      };
    }) ?? []
  );
}
