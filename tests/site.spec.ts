import { expect, test, type Page } from '@playwright/test';

const representativePost = '/posts/install-vagrant-libvirt-ubuntu';

function canonicalPath(url: string) {
  const parsed = new URL(url);
  const path = parsed.pathname.replace(/\/$/, '') || '/';
  return `${path}${parsed.search}`;
}

function expectedNavPath(path: string) {
  if (path.startsWith('/posts')) return '/posts';
  if (path.startsWith('/projects')) return '/projects';
  if (path.startsWith('/resume')) return '/resume';
  return '/';
}

async function openStablePage(
  page: Page,
  path: string,
  options: {
    colorScheme?: 'light' | 'dark';
    height: number;
    width: number;
  },
) {
  await page.setViewportSize({ width: options.width, height: options.height });
  await page.emulateMedia({
    colorScheme: options.colorScheme ?? 'light',
    reducedMotion: 'reduce',
  });

  const response = await page.goto(path, { waitUntil: 'networkidle' });
  expect(response?.ok(), `${path} should render successfully`).toBe(true);
  await page.evaluate(() => document.fonts.ready);
}

async function normalizeHomeLists(page: Page) {
  await page
    .locator('section[aria-labelledby="notes-heading"] .ruled-list li')
    .evaluateAll((rows) => {
      const titles = [
        'A short engineering note',
        'A deliberately longer title that exercises list spacing',
        'Three more from 2026',
      ];

      rows.forEach((row, index) => {
        const link = row.querySelector('a');
        const metadata = row.querySelector('time, .tag');
        if (link)
          link.textContent = titles[index] ?? `Archived note ${index + 1}`;
        if (metadata)
          metadata.textContent = index === rows.length - 1 ? 'archive' : '2026';
      });
    });

  await page
    .locator('section[aria-labelledby="projects-heading"] .ruled-list li')
    .evaluateAll((rows) => {
      const titles = [
        'Compact automation utility',
        'A project with a representative longer name',
        'Reusable infrastructure configuration',
      ];

      rows.forEach((row, index) => {
        const link = row.querySelector('a');
        const metadata = row.querySelector('.tag');
        if (link) link.textContent = titles[index] ?? `Project ${index + 1}`;
        if (metadata) metadata.textContent = '2026';
      });
    });
}

test.describe('real content contracts', () => {
  test('all discoverable public routes render with metadata and responsive containment', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    const origin = new URL(test.info().project.use.baseURL as string).origin;
    const pending = ['/'];
    const visited = new Set<string>();

    while (pending.length > 0) {
      const path = pending.shift()!;
      if (visited.has(path)) continue;
      visited.add(path);

      const response = await page.goto(path, { waitUntil: 'networkidle' });
      expect(
        response?.ok(),
        `${path} should return a successful response`,
      ).toBe(true);
      await expect(
        page.locator('h1'),
        `${path} should have exactly one h1`,
      ).toHaveCount(1);
      await expect(page).toHaveTitle(/\S+ \| sheets\.ch$/);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        'content',
        /\S+/,
      );

      const overflow = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(
        overflow.scrollWidth,
        `${path} should not overflow the mobile viewport`,
      ).toBeLessThanOrEqual(overflow.clientWidth);

      const currentNav = page.locator(
        'nav[aria-label="Site"] a[aria-current="page"]',
      );
      await expect(currentNav).toHaveCount(1);
      await expect(currentNav).toHaveAttribute('href', expectedNavPath(path));

      const links = await page
        .locator('a[href]')
        .evaluateAll((anchors) =>
          anchors.map((anchor) => (anchor as HTMLAnchorElement).href),
        );

      for (const href of links) {
        const url = new URL(href);
        if (
          url.origin !== origin ||
          url.hash ||
          url.pathname.startsWith('/cdn-cgi/')
        )
          continue;
        const discoveredPath = canonicalPath(url.href);
        if (!visited.has(discoveredPath) && !pending.includes(discoveredPath)) {
          pending.push(discoveredPath);
        }
      }
    }

    expect(
      visited.size,
      'the crawl should cover the site templates and all posts',
    ).toBeGreaterThan(8);
  });

  test('the notes archive remains newest first', async ({ page }) => {
    await page.goto('/posts');
    const dates = await page
      .locator('.note-list time')
      .evaluateAll((nodes) =>
        nodes.map((node) => Date.parse(node.getAttribute('datetime') ?? '')),
      );

    expect(dates.length).toBeGreaterThan(1);
    expect(dates.every(Number.isFinite)).toBe(true);
    expect(dates).toEqual([...dates].sort((a, b) => b - a));
  });

  test('the article header and table of contents track reading position', async ({
    page,
  }) => {
    await openStablePage(page, representativePost, {
      width: 1440,
      height: 900,
    });

    const header = page.locator('.site-header');
    const identity = header.locator('.site-header__name');
    const pageTitle = header.locator('.site-header__page-title');
    const toc = page.getByRole('complementary', { name: 'Table of contents' });

    await expect(toc).toBeVisible();
    await expect(identity).toHaveCSS('opacity', '1');
    await expect(pageTitle).toHaveCSS('opacity', '0');

    const target = toc.locator('[data-toc-link]').nth(1);
    const targetSlug = await target.getAttribute('data-heading-slug');
    await target.click();

    await expect(page).toHaveURL(new RegExp(`#${targetSlug}$`));
    await expect(header).toHaveClass(/site-header--scrolled/);
    await expect(pageTitle).toHaveCSS('opacity', '1');
    await expect(target).toHaveClass(/active/);
  });

  test('the article table of contents collapses on narrow screens', async ({
    page,
  }) => {
    await openStablePage(page, representativePost, {
      width: 1024,
      height: 768,
    });
    await expect(
      page.getByRole('complementary', { name: 'Table of contents' }),
    ).toBeHidden();
  });
});

test.describe('focused visual regression', () => {
  test('home • desktop • light', async ({ page }) => {
    await openStablePage(page, '/', { width: 1280, height: 900 });
    await normalizeHomeLists(page);
    await expect(page).toHaveScreenshot('home-desktop-light.png');
  });

  test('home • mobile • light', async ({ page }) => {
    await openStablePage(page, '/', { width: 390, height: 844 });
    await normalizeHomeLists(page);
    await expect(page).toHaveScreenshot('home-mobile-light.png');
  });

  test('resume • mobile • light', async ({ page }) => {
    await openStablePage(page, '/resume', { width: 390, height: 844 });
    await expect(page).toHaveScreenshot('resume-mobile-light.png');
  });

  test('article • desktop • light', async ({ page }) => {
    await openStablePage(page, representativePost, {
      width: 1440,
      height: 900,
    });
    await expect(page).toHaveScreenshot('article-desktop-light.png');
  });

  test('article • scrolled • light', async ({ page }) => {
    await openStablePage(page, representativePost, {
      width: 1440,
      height: 900,
    });
    await page.locator('[data-toc-link]').nth(1).click();
    await expect(page.locator('.site-header')).toHaveClass(
      /site-header--scrolled/,
    );
    await expect(page).toHaveScreenshot('article-scrolled-light.png');
  });

  test('article • mobile • light', async ({ page }) => {
    await openStablePage(page, representativePost, { width: 390, height: 844 });
    await expect(page).toHaveScreenshot('article-mobile-light.png');
  });

  test('article • desktop • dark', async ({ page }) => {
    await openStablePage(page, representativePost, {
      colorScheme: 'dark',
      width: 1440,
      height: 900,
    });
    await expect(page).toHaveScreenshot('article-desktop-dark.png');
  });
});
