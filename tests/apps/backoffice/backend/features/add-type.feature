Feature: Add types

Feature: Add types for different files that would be uploaded

  Scenario: Happy Path.
    Given I send a PUT request to "/types/0272a729-c24c-4c1f-a3fb-ffd0e8de1ef7" with body:
    """
    {
      "type":"dummy type"
    }
    """
    Then the response status code should be 202


  Scenario: Corner Case. No valid UUID as path param.
    Given I send a PUT request to "/types/VHVGVGCGCG" with body:
    """
    {
      "type":"dummy type"
    }
    """
    Then the response status code should be 400

  Scenario: Corner Case. No valid request body schema. Not valid key.
    Given I send a PUT request to "/types/0272a729-c24c-4c1f-a3fb-ffd0e8de1ef7" with body:
    """
    {
      "tipo": "dummy type"
    }
    """
    Then the response status code should be 400



  Scenario: Corner Case. No valid request body schema. Not valid value.
    Given I send a PUT request to "/types/0272a729-c24c-4c1f-a3fb-ffd0e8de1ef7" with body:
    """
    {
      "type": true
    }
    """
    Then the response status code should be 400

  Scenario: Corner Case. No valid request body schema. Neither key nor value are valid.
    Given I send a PUT request to "/types/0272a729-c24c-4c1f-a3fb-ffd0e8de1ef7" with body:
    """
    {
      "tipo": true
    }
    """
    Then the response status code should be 400