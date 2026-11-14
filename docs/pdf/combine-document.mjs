export async function combineDocument(options) {
  const { include, exclude, title, subtitle } = options;
  const origin = location.origin;
  const withSlash = (pathname) => (pathname.endsWith("/") ? pathname : `${pathname}/`);

  const pathnames = [];
  const groups = new Map();
  for (const link of document.querySelectorAll(".sidebar-content a[href]")) {
    const pathname = withSlash(new URL(link.href).pathname);
    const included = pathname.startsWith(include) && !(exclude && pathname.startsWith(exclude));
    if (included && !pathnames.includes(pathname)) {
      pathnames.push(pathname);
      const summary = link.closest("details")?.querySelector("summary");
      groups.set(pathname, summary ? summary.textContent.trim() : "");
    }
  }

  const pages = [];
  for (const pathname of pathnames) {
    const response = await fetch(pathname);
    const parsed = new DOMParser().parseFromString(await response.text(), "text/html");
    const content = parsed.querySelector(".sl-markdown-content");
    if (!content) continue;
    const heading = parsed.querySelector("h1");
    const pageTitle = heading ? heading.textContent.trim() : parsed.title;
    const group = groups.get(pathname);
    pages.push({
      pathname,
      title: pageTitle === "Overview" && group ? `${group} overview` : pageTitle,
      content: document.importNode(content, true),
    });
  }

  const sectionIds = new Map(pages.map((page, index) => [page.pathname, `pdf-page-${index}`]));

  const cover = document.createElement("section");
  cover.className = "pdf-cover";
  const coverTitle = document.createElement("h1");
  coverTitle.textContent = title;
  const coverSubtitle = document.createElement("p");
  coverSubtitle.textContent = subtitle;
  const contents = document.createElement("ol");
  for (const page of pages) {
    const item = document.createElement("li");
    const anchor = document.createElement("a");
    anchor.href = `#${sectionIds.get(page.pathname)}`;
    anchor.textContent = page.title;
    item.append(anchor);
    contents.append(item);
  }
  cover.append(coverTitle, coverSubtitle, contents);

  const root = document.createElement("main");
  root.className = "pdf-document";
  root.append(cover);

  for (const page of pages) {
    const sectionId = sectionIds.get(page.pathname);
    const section = document.createElement("section");
    section.className = "pdf-page";
    section.id = sectionId;
    const heading = document.createElement("h1");
    heading.textContent = page.title;
    page.content.classList.add("sl-markdown-content");

    for (const element of page.content.querySelectorAll("[id]")) {
      element.id = `${sectionId}--${element.id}`;
    }
    for (const anchor of page.content.querySelectorAll("a[href]")) {
      const href = anchor.getAttribute("href");
      if (href.startsWith("#")) {
        anchor.setAttribute("href", `#${sectionId}--${href.slice(1)}`);
        continue;
      }
      const url = new URL(href, origin + page.pathname);
      const target = url.origin === origin ? sectionIds.get(withSlash(url.pathname)) : undefined;
      if (target) {
        anchor.setAttribute("href", `#${target}${url.hash ? `--${url.hash.slice(1)}` : ""}`);
      }
    }
    for (const details of page.content.querySelectorAll("details")) details.open = true;
    for (const image of page.content.querySelectorAll("img")) image.loading = "eager";

    section.append(heading, page.content);
    root.append(section);
  }

  const style = document.createElement("style");
  style.textContent = `
    .pdf-document { max-width: none; margin: 0; padding: 0; }
    .pdf-cover { break-after: page; padding-top: 30mm; }
    .pdf-cover h1 { font-size: 1.8rem; margin-bottom: 0.5rem; }
    .pdf-cover ol { margin-top: 2rem; line-height: 1.9; }
    .pdf-page { break-before: page; }
    .pdf-page > h1 { font-size: 2rem; margin: 0 0 1.5rem; }
    .pdf-page img, .pdf-page svg { max-width: 100%; max-height: 165mm; width: auto; height: auto; }
    .pdf-page figure, .pdf-page img, .pdf-page pre, .pdf-page tr { break-inside: avoid; }
    .sl-anchor-link, .copy, button { display: none !important; }
  `;
  document.title = title;
  document.documentElement.dataset.theme = "light";
  document.head.append(style);
  document.body.replaceChildren(root);

  await Promise.all(
    [...document.images].map((image) =>
      image.complete
        ? Promise.resolve()
        : new Promise((resolve) => {
            image.onload = resolve;
            image.onerror = resolve;
          }),
    ),
  );
}
