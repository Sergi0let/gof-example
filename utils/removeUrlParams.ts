// v1, old approach if you have a relative path, etc

function removeUrlParam(key: string, currentUrl: string): string | boolean {
  if (!key || !currentUrl) return false;

  const [domen, params] = currentUrl.split("?");

  if (!params) return false;

  const filtered = params
    .split("&")
    .filter((param) => param.split("=")[0] !== key);

  return filtered.length ? `${domen}?${filtered.join("&")}` : domen;
}

console.log(
  removeUrlParam(
    "sort",
    "https://example.com/products?category=electronics&sort=asc&page=2",
  ),
  "\n",
  removeUrlParam(
    "page",
    "https://example.com/products?category=electronics&sort=asc&page=2",
  ),
);

// v2, new approach URL API
function removeUrlParamV2(key: string, currentUrl: string): string | boolean {
  if (!key || !currentUrl) return false;
  try {
    const url = new URL(currentUrl);

    if (!url.searchParams.has(key)) return false;

    url.searchParams.delete(key);

    return url.toString();
  } catch {
    return false;
  }
}

console.log(
  removeUrlParamV2(
    "code",
    "http://example.com:4000/old/path?redirect=/new&code=301",
  ),
  "\n",
  removeUrlParamV2(
    "redirect",
    "http://example.com:4000/old/path?redirect=/new&code=301",
  ),
);

// test

const testUrls = [
  "https://example.com/products?category=electronics&sort=asc&page=2",
  "http://shop.example.org:8080/item",
  "http://localhost:3000/api/users?role=admin&active=true",
  "https://api.site.com/v1/data?filter[name]=john&filter[age]=25",
  "http://test-site.net/page?utm_source=google&utm_medium=cpc&utm_campaign=spring",
  "https://docs.example.com/guide#section-3.1?debug=false",
  "http://example.com:4000/old/path?redirect=/new&code=301",
  "https://sub2.example.org:8443/secure?token=abc123&expires=2025-12-31",
  "ftp://files.example.com/download?file=report.pdf&format=pdf",
];
