import { expect } from "chai";
import { t } from '@shared/i18n';

describe('Localisation test', () => {

  // before(async () => {
  //   await initI18n('fr');
  // });

  it('should display correct login screen text in French and english', async () => {

    const title = $(`(//*[@resource-id='org.wikipedia.alpha:id/view_card_header_title'])[1]`);
    const okBtn = $(`//*[@resource-id="android:id/button1"]`);
    const search = $(`//*[@resource-id="org.wikipedia.alpha:id/search_container"]`);
    await okBtn.waitForDisplayed();
    await okBtn.click();
    await title.waitForDisplayed();
    const actualText = await title.getText();
    console.log(`UI text is: ${actualText}`);
    expect(actualText).to.equal(t('login.title')); // In the news // Dans l’actualité // في الأخبار
    await search.setValue(t('login.title'));
  });
});
