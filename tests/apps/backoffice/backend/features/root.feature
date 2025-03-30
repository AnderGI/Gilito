Feature: Root status

  Scenario: Check the root GET endpoint
    Given I send a GET request to "/"
    Then the response status code should be 200
