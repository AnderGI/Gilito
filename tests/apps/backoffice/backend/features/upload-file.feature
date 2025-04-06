Feature: Update File Resource (without file upload)

Feature: Upload File

  Scenario: HAppy Path.
    Given I upload "01-demo.txt" via curl to "/file/3562701c-9c37-4781-a599-09a728df6f65" with mime type "text/plain"
    Then the curl response status should be 202

  Scenario: Invalid file extension. API only supports .txt file extensions
    Given I upload "01-demo.json" via curl to "/file/da51740e-b82b-4d2d-8e3a-c2bf41d50b63" with mime type "application/json"
    Then the curl response status should be 400
