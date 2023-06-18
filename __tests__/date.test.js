import { chromium } from 'playwright';

describe('Your Svelte Component', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await chromium.launch();
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:5173'); // テスト対象のURLに置き換えてください
  });

  afterEach(async () => {
    await page.close();
  });

  it('renders the component and selects dates', async () => {
    // テスト対象のセレクターを適切に置き換えてください
    const yearSelect = await page.$('#year-select');
    const monthSelect = await page.$('#month-select');
    const daySelect = await page.$('#day-select');

    // 年を選択
    await yearSelect.selectOption({ label: '2022' });
    // 月を選択
    await monthSelect.selectOption({ label: '6' });
    // 日を選択
    await daySelect.selectOption({ label: '15' });

    // 選択された日が正しいことを検証
    const selectedYear = await page.$eval('#year-select', (el) => el.value);
    const selectedMonth = await page.$eval('#month-select', (el) => el.value);
    const selectedDay = await page.$eval('#day-select', (el) => el.value);

    expect(selectedYear).toBe('2022');
    expect(selectedMonth).toBe('6');
    expect(selectedDay).toBe('15');
  });
});
