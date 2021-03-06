

describe('Conversation Spec', function() {
  beforeEach(() => {
    cy.app('clean') // have a look at cypress/app_commands/clean.rb
  })

  it('run previous conversations', function() {
    cy.appScenario('start_conversation_from_agent')
    openMessenger(($body)=>{
      expect($body.html()).to.contain('Start a conversation')
      cy.appEval("App.last.app_users.size").then((res)=>{
        expect(res).to.equal(1)
      })
      cy.wrap($body).contains('a few seconds ago')
      cy.wrap($body).xpath("/html/body/div/div/div/div[2]/div/div[1]/div[2]/div")
      .click().then(()=>{
        expect($body.html()).to.contain('foobar')
        cy.wrap($body)
        .xpath("/html/body/div/div/div/div[2]/div/div/div/div[2]/div/div/textarea")
        .type("oeoe \n")
        cy.wrap($body).contains('oeoe')
      })
    })
  })

  it('start_conversation', function() {
    cy.appScenario('basic')
    openMessenger(($body, appKey)=>{
      expect($body.html()).to.contain('Start a conversation')
  
      cy.wrap($body)
      .xpath("/html/body/div/div/div/div[2]/div/div[1]/div/div/div[2]/a[1]")
      .click()
      .then(()=>{

        cy.wrap($body)
        .xpath("/html/body/div/div/div/div[2]/div/div/div/div[2]/div/div/textarea")
        .should('be.enabled').then(()=>{
          cy.wrap($body)
          .xpath("/html/body/div/div/div/div[2]/div/div/div/div[2]/div/div/textarea")
          .type("oeoe \n")
          cy.wrap($body).contains('oeoe')
          cy.app('start_conversation' , {text: '11111', app_key: appKey, rules: []})
          cy.wrap($body).contains('was assigned to this conversation')
          cy.wrap($body).contains('11111')
        })
      })
    })
  })

  function openMessenger(cb){

    cy.appEval("App.last").then((results) => {
      const appKey = results.key
      cy.visit(`/tester/${appKey}`)
      .then(()=>{
        cy.get('iframe:first')
        .then(function ($iframe) {
          const $body = $iframe.contents().find('body')
          cy.wrap($body).find("#chaskiq-prime").click()
        })

        cy.get('iframe:first')
        .then(function ($iframe) {
          const $body = $iframe.contents().find('body')
          cb($body, appKey )
        })
      });
    })
  }


  /*it('example of missing scenario failure', function() {
    cy.visit('/')
    cy.appScenario('basic')
    // cy.appScenario('missing') // uncomment these if you want to see what happens
  })

  it('example of missing app failure', function() {
    cy.visit('/')
    cy.appScenario('basic')
    // cy.app('run_me') // uncomment these if you want to see what happens
  })*/
})