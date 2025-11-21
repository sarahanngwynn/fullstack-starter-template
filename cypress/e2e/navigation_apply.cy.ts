describe('Navigation to Apply Page', () => {
    it('should navigate from Home → Apply page', () => {
      cy.visit('http://localhost:4200/');
  
      cy.contains('Ready to Apply?').should('be.visible');
  
      cy.contains('Apply Here')
        .should('be.visible')
        .click();
  
      cy.url().should('include', '/apply');
      cy.contains(/Enrollment Application/i).should('be.visible');

    });
  });