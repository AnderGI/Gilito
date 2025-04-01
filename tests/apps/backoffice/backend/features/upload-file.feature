Feature: Upload File

  Scenario: Happy Path.
    Given I send a PUT request to "/file/da51740e-b82b-4d2d-8e3a-c2bf41d50b63" with a fake file of type "text/plain"
    Then the response status code should be 202

  Scenario: Corner case. Invalid UUID.
    Given I send a PUT request to "/file/njbhgxfxgfgkkckfgg" with a fake file of type "text/plain"
    Then the response status code should be 400

  Scenario: Corner Case.
    Given I send a PUT request to "/file/da51740e-b82b-4d2d-8e3a-c2bf41d50b63" with a fake file of type "application/json"
    Then the response status code should be 400
