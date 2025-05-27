describe('🍔 Страница конструктора бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' });

    cy.clearCookies();
    cy.window().then((win) => win.localStorage.removeItem('refreshToken'));

    cy.visit('/');
  });

  it('должен добавить булку и начинку в конструктор', () => {
    cy.fixture('ingredients.json').then((raw: any) => {
      const items = raw.data as any[];
      const bun = items.find((i) => i.type === 'bun');
      const main = items.find((i) => i.type === 'main');

      cy.get('main').within(() => {
        const ingredients = cy.get('section').first();
        const constructor = cy
          .get('section')
          .contains('Оформить заказ')
          .parent()
          .parent();

        constructor.within(() => {
          cy.contains(`${bun.name} (верх)`).should('not.exist');
          cy.contains(`${bun.name} (низ)`).should('not.exist');
        });
        ingredients.within(() => {
          cy.contains(bun.name)
            .parent()
            .find('button')
            .contains('Добавить')
            .click();
        });
        constructor.within(() => {
          cy.contains(`${bun.name} (верх)`).should('exist');
          cy.contains(`${bun.name} (низ)`).should('exist');
        });

        constructor.within(() => {
          cy.contains(main.name).should('not.exist');
        });
        ingredients.within(() => {
          cy.contains(main.name)
            .parent()
            .find('button')
            .contains('Добавить')
            .click();
        });
        constructor.within(() => {
          cy.contains(main.name).should('exist');
        });
      });
    });
  });

  it('должен открыть и закрыть модалку ингредиента', () => {
    cy.fixture('ingredients.json').then((raw: any) => {
      const items = raw.data as any[];
      const sauce = items.find((i) => i.type === 'sauce');

      cy.contains(sauce.name).click();
      cy.get('#modals').within(() => {
        const modal = cy.get('div').first();
        modal.should('be.visible');
        modal.within(() => {
          cy.contains('Детали ингредиента').should('exist');
          cy.contains(sauce.name).should('exist');
          cy.get('svg').first().click({ multiple: true, force: true });
        });
      });

      cy.contains('Детали ингредиента').should('not.exist');
    });
  });

  it('должен создать заказ и очистить конструктор', () => {
    cy.intercept('POST', '**/orders', { fixture: 'orderResponse.json' });

    cy.visit('/');

    cy.fixture('ingredients.json').then((raw: any) => {
      const items = raw.data as any[];
      const bun = items.find((i) => i.type === 'bun');
      const main = items.find((i) => i.type === 'main');

      cy.contains(bun.name)
        .parent()
        .find('button')
        .contains('Добавить')
        .click();
      cy.contains(main.name)
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Оформить заказ').click();

      cy.get('button').should('be.visible');
      cy.fixture('orderResponse.json').then((orderRes: any) => {
        const expected = orderRes.order.number.toString();
        cy.contains(expected).should('contain', expected);
        cy.contains('Выберите булки').should('exist');
        cy.contains('Выберите начинку').should('exist');
      });

      cy.get('#modals').within(() => {
        const modal = cy.get('div').first();
        modal.should('be.visible');
        modal.within(() => {
          cy.get('svg').first().click({ multiple: true, force: true });
        });
      });
    });
  });
});
