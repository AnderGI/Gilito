Feature: Upload FIle

  Scenario: Happy Path.
    Given I send a PUT request to "/file/da51740e-b82b-4d2d-8e3a-c2bf41d50b63" with file in "/home/andergi/ander/repositories/Gilito/tests/uploads/01-demo.txt"
    Then the response status code should be 202

  Scenario: Corner case. Invalid UUID.
    Given I send a PUT request to "/file/njbhgxfxgfgkkckfgg" with file in "/home/andergi/ander/repositories/Gilito/tests/uploads/01-demo.txt"
    Then the response status code should be 400
  
  Scenario: Corner Case.
    Given I send a PUT request to "/file/da51740e-b82b-4d2d-8e3a-c2bf41d50b63" with file in "/home/andergi/ander/repositories/Gilito/tests/uploads/01-demo.json"
    Then the response status code should be 400