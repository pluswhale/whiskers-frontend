describe('Wheel spec', () => {
  it('Renders wheel canvas', () => {
    cy.visit('/');

    cy.get('canvas');
  })

  it('Free spins get reduced', () => {
    cy.visit('/');
    cy.get('*[class*="_app__extra_spins__free_spin__score_p"]')
      .invoke('text')
      .then(prevValue => {
        if(Number(prevValue) > 0) {
          cy.get('*[class*="_app__spin_button"]').first().click()
  
          cy.get('*[class*="_app__extra_spins__free_spin__score_p"]')
            .invoke('text')
            .should(currValue => {
              expect(Number(currValue)).to.eq(Number(prevValue)-1)
            })
        }
      });
    cy.get('canvas');
  })

  it('Spin button gets disabled when there are no free spins', () => {
    cy.visit('/');
    cy.get('*[class*="_app__extra_spins__free_spin__score_p"]')
      .invoke('text')
      .then(spinsValue => {
        if(Number(spinsValue) == 0) {
          cy.get('*[class*="_app__spin_button"').first().should('have.property', '*[class*="_disable"]')
        }
      })
  })
})