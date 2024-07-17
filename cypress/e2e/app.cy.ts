import cypress from "cypress";

describe('App spec', () => {
  it('Renders available on mobile page', () => {
    cy.viewport(1440, 600);

    cy.visit('/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      }
    });

    cy.contains('This game is available only on mobile').should('be.visible');
  })

  it('Login request test', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('hostBackendUrl')}/login/${Cypress.env('userId')}`
    }).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq('Login successful');
    })
  })
})