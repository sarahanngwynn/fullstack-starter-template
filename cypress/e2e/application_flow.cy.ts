describe('Full Enrollment Application Flow (up to payment)', () => {
    it('fills steps 1–4 and lands on the payment page', () => {
      cy.visit('http://localhost:4200/apply');
  
      cy.contains('Parent Details').should('be.visible');
  
      cy.get('input').eq(0).type('Sarah');
      cy.get('input').eq(1).type('Gwynn');
      cy.get('input').eq(2).type('sarah.parent@example.com');
      cy.get('input').eq(3).type('8015551234');
  
      cy.wait(600);
      cy.contains('Next').click();
  
      cy.contains('Child Details').should('be.visible');
  
      cy.get('input').eq(0).type('Olivia Gwynn');
  
      cy.wait(600);
      cy.contains('Next').click();

      cy.contains('Location').should('be.visible');
  
      cy.wait(600);
      cy.contains('Next').click();
 
      cy.contains('Program').should('be.visible');
  

      cy.wait(600);
      cy.contains('Next').click();
  
      cy.contains('Payment').should('be.visible');
      cy.contains('Name on Card').should('be.visible');
  
      cy.pause();
    });
  });
  
  