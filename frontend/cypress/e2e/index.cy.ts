describe('Landing Page', () => {
    beforeEach(() => {
      window.localStorage.setItem('userOnboarded', "true");
      window.localStorage.setItem('testsplashShown', "true");
      cy.visit('/');
    });
  
    it('should display the correct title', () => {
      cy.get('h2').should('contain', 'Your Polygon Copilot');
    });
  
    it('should not display the settings button or the credits info', () => {
      cy.get('#settings-button').should('not.exist');
      cy.get('#credits-info').should('not.exist');
    });
  
    it('should display the new chat button but should not create a new chat', () => {
      cy.get('#new-chat').click();
      cy.get('#chat-input').should('not.exist');
    });
  
    it('search bar should be enabled even without the connecting wallet', () => {
      cy.get('#search-input').should('be.enabled');
    });
  
    it('should display the connect wallet button', () => {
      cy.get('#connect-wallet').should('exist');
    });
  
    it('should be able to switch personas', () => {
        cy.get('#Beginner').click();
        cy.get('#Beginner').should('exist');
        cy.get('#Advanced').not('exist');
        cy.get('#Degen').not('exist');

        cy.get('#Advanced').click();
        cy.get('#Advanced').should('exist');
        cy.get('#Beginner').not('exist');
        cy.get('#Degen').not('exist');

        cy.get('#Degen').click();
        cy.get('#Degen').should('exist');
        cy.get('#Beginner').not('exist');
        cy.get('#Advanced').not('exist');

    });
  
    it('should be able to switch to Degen Persona and click on the sample prompt', () => {
      cy.get('#Degen').click().should('exist');
      cy.get('#learn1').click();
      cy.get('#search-input').should('have.value', "What's up with zkevm ser?");
    });
  
    it('should be able to type prompt but not send and trigger wallet connect modal', () => {
      cy.get('#search-input').type("What's up with zkevm ser?{enter}");
      cy.get('#signup-modal').should('exist');
    });

    it('should not display the credits & settings tab',() => {
        cy.get('#settings-button').should('not.exist');
        cy.get('#credits-info').should('not.exist');
    })
  
    it('should be able open connect wallet', () => {
      cy.get('#connect-wallet').click();
    });
  });