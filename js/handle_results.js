
const unescapeMap = Object.freeze({
  '&amp;' : '&',
  '&lt;'  : '<',
  '&gt;'  : '>',
  '&quot;': '"',
  '&#39;' : "'",
  '&#x2F;': '/',
  '&#x60;': '`',
  '&#x3D;': '='
});
const unescapeHtml = (string) => String(string)
    .replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;|&#x60;|&#x3D;/g, (s) => unescapeMap[s]);


const handleResults = (data, query) => {
  const result = document.getElementById("result");
  result.innerHTML = "";

  let searchParams = new URLSearchParams();

  let a = document.getElementById("stackoverflow-query")
  searchParams.set('q', '[vespa] ' + unescapeHtml(query));
  a.href = 'https://stackoverflow.com/search?' + searchParams.toString();
  a.innerHTML = "[vespa] " + query;

  a = document.getElementById("gh-issues-query")
  searchParams.set('q', 'is:issue ' + unescapeHtml(query));
  a.href = 'https://github.com/vespa-engine/vespa/issues?' + searchParams.toString();
  a.innerHTML = "is:issue " + query;

  // Dirty hack from https://stackoverflow.com/questions/51541986/a-way-to-open-up-slack-search-ui-in-a-browser-from-a-url
  a = document.getElementById("slack-query")
  const slackQuery = "in:#troubleshooting in:#general " + unescapeHtml(query);
  const slackJSON = JSON.stringify({
    d:encodeURIComponent(slackQuery),
    r:encodeURIComponent(slackQuery)});
  a.href = 'https://app.slack.com/client/T01RFPFNAHX/search/search-' + btoa(slackJSON);
  a.innerHTML = slackQuery;

  const hits = data;
  if (hits && hits.length > 0) {
    const unorderedList = document.createElement("ul");
    unorderedList.className = "search-result-list";
    result.appendChild(unorderedList);

    const baseURL = {
      open: "http://docs.vespa.ai",
      cloud: "https://cloud.vespa.ai",
      blog: "https://blog.vespa.ai",
      vespaai: "https://vespa.ai",
      vespaapps: "https://github.com/vespa-engine/sample-apps/tree/master",
      pyvespa: "https://pyvespa.readthedocs.io/en/latest",
    };

    const sourceName = {
      open: "Documentation",
      cloud: "Cloud",
      blog: "Blog",
      vespaai: "Vespa.ai",
      vespaapps: "Vespa Sample Apps",
      pyvespa: "pyvespa",
    };

    const highlightWeight = 10;


    hits.forEach(
      ({
        fields: {
          namespace,
          path,
          content,
          title,
          summaryfeatures,
        },
      }) => {
        const modifiedURL = baseURL[namespace] + path;

        const modifiedContent =
          typeof content == "undefined"
            ? ""
            : content
              .replace(/<sep \/>/g, " ... ")
              .replace(/<hi>/g, "<mark>")
              .replace(/<\/hi>/g, "</mark>");

        const modifiedTitle =
          typeof title == "undefined"
            ? "No title"
            : title
              .replace(/<hi>/g, "<mark>")
              .replace(/<\/hi>/g, "</mark>");

        const listItem = document.createElement("li");
        listItem.className = "search-result-item";

        const header = document.createElement("h4");
        header.innerHTML = `<a href="${modifiedURL}">${modifiedTitle}</a>`;

        const paragraph = document.createElement("p");
        paragraph.innerHTML = modifiedContent;
        const paragraphBreak = document.createElement("br");
        paragraph.appendChild(paragraphBreak);
        const paragraphSmall = document.createElement("small");
        paragraphSmall.className = "search-result-link";
        paragraphSmall.innerHTML = `${sourceName[namespace]}: ${path}`;
        paragraph.appendChild(paragraphSmall);

        listItem.appendChild(header);
        listItem.appendChild(paragraph);

        unorderedList.appendChild(listItem);
      }
    );
  } else {
    document.getElementById("hits").innerHTML = "No hits found!";
  }
};

export default handleResults;
