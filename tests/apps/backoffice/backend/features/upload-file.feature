Feature: Update File Resource (without file upload)

  Scenario: Valid UUID, minimal PUT
    Given I send a PUT request to "/file/da51740e-b82b-4d2d-8e3a-c2bf41d50b63"
    Then the response status code should be 202

  Scenario: Invalid UUID format
    Given I send a PUT request to "/file/njbhgxfxgfgkkckfgg"
    Then the response status code should be 400
