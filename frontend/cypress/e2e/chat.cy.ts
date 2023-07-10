describe('Chat Page', () => {
    beforeEach(() => {
        window.localStorage.setItem('userOnboarded', "true");
        window.localStorage.setItem('testsplashShown', "true");
        cy.visit('/chats');
    });

    it('should render the page', () => {
        cy.get('#chat-page').should('exist');
    })
});