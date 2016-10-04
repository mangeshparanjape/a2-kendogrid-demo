import { GridpocPage } from './app.po';

describe('gridpoc App', function() {
  let page: GridpocPage;

  beforeEach(() => {
    page = new GridpocPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
