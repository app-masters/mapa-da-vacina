describe('Mapa da Vacina Admin Places check', () => {
    it('SHould login to admin successfully', () => {
      cy.visit('/auth', {timeout:1200000})
      cy.location('pathname').should('include','/auth')
      // cy.get('#firebase-cypress', {timeout:10000});
      cy.get('#ui-sign-in-phone-number-input').type('3288888-8888')
      cy.wait(10000)
      cy.get('.firebaseui-id-submit').click({force:true});
  


      // cy.login('3288888-8888', '123456')
    })
    
  });

