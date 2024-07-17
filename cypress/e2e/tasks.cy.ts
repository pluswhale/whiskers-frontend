describe('Tasks spec', () => {
  it('Visits tasks page', () => {
    cy.visit('/');

    cy.contains('Tasks').click();

    cy.url().should('include', '/tasks');
  })

  it('Renders invitation tasks', () => {
    cy.visit('/tasks');

    cy.contains('Invite').should('be.visible');
  })
})