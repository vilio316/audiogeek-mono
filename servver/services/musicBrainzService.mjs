export async function fetchWeekly() {
  const url = "https://whosampled.com/Burna-Boy/Last-Last";
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Audiogeek Scraper Scraper(Personal)",
      "Content-Signal": "search=yes,ai-train=no",
    },
  });

  console.log(response);
}
