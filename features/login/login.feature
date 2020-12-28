Feature: Login

As a yser I should be able to login to the Teachreads if i provide correct email and password
Otherwise I should be shown an error message

Scenario: As a user I can login
    Given I am on the "login" page
    And I enter "wfigura@op.pl" as my "email"
    And I enter "a" as my "password"
    When I click the "login-btn" button
    Then I should be on the "techreads" page

Scenario: As a user I can see an error message if i will fail the login
    Given I am on the "login" page
    And I enter "empty@op.pl" as my "email"
    And I enter "empty" as my "password"
    When I click the "login-btn" button
    Then I should be on the "login" page again

    Feature Description